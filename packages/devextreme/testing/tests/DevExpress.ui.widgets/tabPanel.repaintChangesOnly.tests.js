import $ from 'jquery';
import fx from 'common/core/animation/fx';
import 'ui/tab_panel';

QUnit.module('repaintChangesOnly', {
    beforeEach() {
        this.clock = sinon.useFakeTimers();
        this.origAnimate = fx.animate;
        fx.animate = (_, options) => {
            setTimeout(() => options.complete(), 1);
        };

        this.itemRenderedSpy = sinon.spy();
        this.titleRenderedSpy = sinon.spy();
        this.itemDeletedSpy = sinon.spy();

        this.createTabPanel = (options) => {
            options.repaintChangesOnly = true;
            options.itemTemplate = (itemData) => `<div id='id_${itemData.content}'>${itemData.content}</div>`;
            options.itemTitleTemplate = (itemData) => `<div id='id_${itemData.text}'>${itemData.text}</div>`;

            this.$tabPanel = $('<div>');
            this.tabPanel = this.$tabPanel.dxTabPanel(options).dxTabPanel('instance');

            this.tabPanel.option('onItemRendered', this.itemRenderedSpy);
            this.tabPanel.option('onTitleRendered', this.titleRenderedSpy);
            this.tabPanel.option('onItemDeleted', this.itemDeletedSpy);
        };

        this.containsElement = (id) => {
            try {
                return this.$tabPanel.find('#id_' + id)[0].textContent;
            } catch(e) {}
        };
        this.checkNotContainsElements = (assert, idList) => {
            idList.forEach((id) => { assert.notOk(this.containsElement(id), `doesn't contain '${id}'`); });
        };
        this.checkContainsElements = (assert, idList) => {
            idList.forEach((id) => { assert.ok(this.containsElement(id), `contains '${id}'`); });
        };
        this.checkTitleRendered = (assert, expectedCalls) => {
            assert.equal(this.titleRenderedSpy.callCount, expectedCalls.length, 'titleRenderedSpy.callCount');
            const calls = this.titleRenderedSpy.getCalls();
            for(let i = 0; i < expectedCalls.length && i < calls.length; i++) {
                assert.deepEqual(calls[i].args[0].itemData, expectedCalls[i], `titleRenderedSpy.calls[${i}].itemData`);
            }
        };
        this.checkItemRendered = (assert, expectedCalls) => {
            assert.equal(this.itemRenderedSpy.callCount, expectedCalls.length, 'itemRenderedSpy.callCount');
            const calls = this.itemRenderedSpy.getCalls();
            for(let i = 0; i < expectedCalls.length && i < calls.length; i++) {
                assert.deepEqual(calls[i].args[0].itemData, expectedCalls[i].data, `itemRenderedSpy.call[${i}].itemData`);
                assert.equal(calls[i].args[0].itemIndex, expectedCalls[i].index, `itemRenderedSpy.call[${i}].itemIndex`);
            }
        };
        this.checkItemDeleted = (assert, expectedCalls) => {
            assert.equal(this.itemDeletedSpy.callCount, expectedCalls.length, 'itemDeletedSpy.callCount');
            const calls = this.itemDeletedSpy.getCalls();
            for(let i = 0; i < expectedCalls.length && i < calls.length; i++) {
                assert.deepEqual(calls[i].args[0].itemData, expectedCalls[i], `itemDeletedSpy.call[${i}].itemData`);
            }
        };
        this.checkContainsEmptyMessage = (assert, expected) => {
            assert.equal(this.$tabPanel.find('.dx-empty-message').length, expected ? 1 : 0, 'EmptyMessage elements count');
        };
    },
    afterEach() {
        fx.animate = this.origAnimate;
        this.clock.restore();
    }

}, () => {
    ['items', 'dataSource'].forEach(dataSourcePropertyName => {
        const testContext = `, option(${dataSourcePropertyName})`;

        // T731713, T744678
        QUnit.test('[] -> [{1}]' + testContext, function(assert) {
            this.createTabPanel({ items: [] });

            const item1_ = { text: '1a', content: '1a_' };
            this.tabPanel.option(dataSourcePropertyName, [item1_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1_]);
            this.checkItemRendered(assert, [{ data: item1_, index: 0 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1_.text, item1_.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}] -> []' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1] });

            this.tabPanel.option(dataSourcePropertyName, []);
            this.clock.tick(1);

            this.checkTitleRendered(assert, []);
            this.checkItemRendered(assert, []);
            this.checkItemDeleted(assert, [item1]);

            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, true);
        });

        // T731713
        QUnit.test('[] -> [{1}, {2}]', function(assert) {
            this.createTabPanel({ items: [] });

            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.tabPanel.option('items', [item1, item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1, item2]);
            this.checkItemRendered(assert, [{ data: item1, index: 0 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text]);
            this.checkNotContainsElements(assert, [item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        // T731713
        QUnit.test('[{1}] -> [{1}, {2}] -> {selectedIndex: 1}', function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1] });

            const item2 = { text: '2a', content: '2a_' };
            this.tabPanel.option('items', [item1, item2]);
            this.clock.tick(1);

            this.tabPanel.option('selectedIndex', 1);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item2]);
            this.checkItemRendered(assert, [{ data: item2, index: 1 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}] -> [{0}, {1}] -> {selectedIndex: 0}', function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1] });

            const item0 = { text: '0a', content: '0a_' };
            this.tabPanel.option('items', [item0, item1]);
            this.clock.tick(1);

            assert.equal(this.tabPanel.option('selectedIndex'), 1, 'selectedIndex after insert');

            this.tabPanel.option('selectedIndex', 0);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item0]);
            this.checkItemRendered(assert, [{ data: item0, index: 0 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item0.text, item0.content, item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        // T731713
        QUnit.test('[{1}] -> [{1}, {2}] -> {selectedIndex:1} -> [{1}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1] });

            this.tabPanel.option(dataSourcePropertyName, [item1, item2]);
            this.clock.tick(1);

            this.tabPanel.option('selectedIndex', 1);
            this.clock.tick(1);

            this.tabPanel.option(dataSourcePropertyName, [item2]);
            this.clock.tick(1);

            assert.equal(this.tabPanel.option('selectedIndex'), 0, 'selectedIndex is updated');
            assert.equal(this.tabPanel.option('selectedItem'), item2, 'selectedItem is correct');
            this.checkTitleRendered(assert, [item2]);
            this.checkItemRendered(assert, [{ data: item2, index: 1 }]);
            this.checkItemDeleted(assert, [item1]);

            this.checkContainsElements(assert, [item2.text, item2.content]);
            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        // T731713
        QUnit.test('[{1}, {2}, {3}] -> {selectedIndex:1} -> [{2}, {3}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            const item3 = { text: '3a', content: '3a_' };
            this.createTabPanel({ items: [item1, item2, item3] });

            this.tabPanel.option('selectedIndex', 1);
            this.clock.tick(1);

            this.tabPanel.option(dataSourcePropertyName, [item2, item3]);
            this.clock.tick(1);

            assert.equal(this.tabPanel.option('selectedIndex'), 0, 'selectedIndex is updated');
            assert.equal(this.tabPanel.option('selectedItem'), item2, 'selectedItem is correct');
            this.checkTitleRendered(assert, []);
            this.checkItemRendered(assert, [{ data: item2, index: 1 }]);
            this.checkItemDeleted(assert, [item1]);

            this.checkContainsElements(assert, [item2.text, item3.text, item2.content]);
            this.checkNotContainsElements(assert, [item1.text, item1.content, item3.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}] -> [{1}, {2}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1] });

            const item2 = { text: '2a', content: '2a_' };
            this.tabPanel.option(dataSourcePropertyName, [item1, item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item2]);
            this.checkItemRendered(assert, []);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item2.text, item1.content]);
            this.checkNotContainsElements(assert, [item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        // T732347
        QUnit.test('[{1}] -> [{1}, {2}] deferRendering=false' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1], deferRendering: false });

            const item2 = { text: '2a', content: '2a_' };
            this.tabPanel.option(dataSourcePropertyName, [item1, item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item2]);
            this.checkItemRendered(assert, [{ data: item2, index: 1 }]);

            this.checkContainsElements(assert, [item1.text, item2.text, item1.content, item2.content]);
            assert.strictEqual(this.$tabPanel.find('.dx-multiview-item').eq(0).hasClass('dx-multiview-item-hidden'), false, 'first multiview item is visible');
            assert.strictEqual(this.$tabPanel.find('.dx-multiview-item').eq(1).hasClass('dx-multiview-item-hidden'), true, 'second multiview item is hidden');
        });

        QUnit.test('[{1, text: 1a, content: 1a_}] -> [{1, text: 1a, content: 1a_upd}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1] });

            const item1_ = { text: '1a', content: '1a_upd' };
            this.tabPanel.option(dataSourcePropertyName, [item1_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1_]);
            this.checkItemRendered(assert, [{ data: item1_, index: 0 }]);
            this.checkItemDeleted(assert, [item1]);

            this.checkContainsElements(assert, [item1_.text, item1_.content]);
            this.checkNotContainsElements(assert, [item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1, text: 1a, content: 1a_}] -> [{1, text: 1aupd, content: 1a_}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1] });

            const item1_ = { text: '1aupd', content: '1a_' };
            this.tabPanel.option(dataSourcePropertyName, [item1_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1_]);
            this.checkItemRendered(assert, [{ data: item1_, index: 0 }]);
            this.checkItemDeleted(assert, [item1]);

            this.checkContainsElements(assert, [item1_.text, item1_.content]);
            this.checkNotContainsElements(assert, [item1.text]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1, text: 1a, content: 1a_}] -> [{1, text: 1aupd, content: 1a_upd}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1] });

            const item1_ = { text: '1aupd', content: '1a_upd' };
            this.tabPanel.option(dataSourcePropertyName, [item1_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1_]);
            this.checkItemRendered(assert, [{ data: item1_, index: 0 }]);
            this.checkItemDeleted(assert, [item1]);

            this.checkContainsElements(assert, [item1_.text, item1_.content]);
            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.skip('[{1, text: 1a, content: 1a_}, {2}] -> [{1, text: 1aupd, content: 1a_}, {2}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2] });

            const item1_ = { text: '1aupd', content: '1a_' };
            this.tabPanel.option(dataSourcePropertyName, [item1_, item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1_]);
            this.checkItemRendered(assert, [{ data: item1_, index: 0 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1_.text, item1_.content, item2.text]);
            this.checkNotContainsElements(assert, ['1a', item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1, text: 1a, content: 1a_}, {2}] -> [{1, text: 1aupd, content: 1a_}, {2}] via items[0]' + testContext, function(assert) {
            if(dataSourcePropertyName === 'dataSource') {
                assert.ok(true, 'Not supported for dataSource');
                return;
            }

            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2] });

            item1.text = '1aupd';
            this.tabPanel.option(dataSourcePropertyName + '[0]', item1);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1]);
            this.checkItemRendered(assert, [{ data: item1, index: 0 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text]);
            this.checkNotContainsElements(assert, ['1a', item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1, text: 1a, content: 1a_}, {2, selected}] -> [{1, text: 1aupd, content: 1a_}, {2, selected}] via items[0]' + testContext, function(assert) {
            if(dataSourcePropertyName === 'dataSource') {
                assert.ok(true, 'Not supported for dataSource');
                return;
            }

            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2], selectedIndex: 1 });

            item1.text = '1aupd';
            this.tabPanel.option(dataSourcePropertyName + '[0]', item1);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item2.text, item2.content]);
            this.checkNotContainsElements(assert, ['1a', item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1, text: 1a, content: 1a_}, {2}] -> [{1, text: 1aupd, content: 1a_}, {2}] via items[0].text' + testContext, function(assert) {
            if(dataSourcePropertyName === 'dataSource') {
                assert.ok(true, 'Not supported for dataSource');
                return;
            }
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2] });

            this.tabPanel.option(dataSourcePropertyName + '[0].text', '1aupd');
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1]);
            this.checkItemRendered(assert, [{ data: item1, index: 0 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text]);
            this.checkNotContainsElements(assert, ['1a', item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2, text: 2a, content: 2a_}] -> [{1}, {2, text: 2aupd, content: 2a_}] via items[1]' + testContext, function(assert) {
            if(dataSourcePropertyName === 'dataSource') {
                assert.ok(true, 'Not supported for dataSource');
                return;
            }

            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2] });

            item2.text = '2aupd';
            this.tabPanel.option(dataSourcePropertyName + '[1]', item2);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item2]);
            this.checkItemRendered(assert, []);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text]);
            this.checkNotContainsElements(assert, ['2a', item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2, text: 2a, content: 2a_, selected}] -> [{1}, {2, text: 2aupd, content: 2a_, selected}] via items[1]' + testContext, function(assert) {
            if(dataSourcePropertyName === 'dataSource') {
                assert.ok(true, 'Not supported for dataSource');
                return;
            }

            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2], selectedIndex: 1 });

            item2.text = '2aupd';
            this.tabPanel.option(dataSourcePropertyName + '[1]', item2);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item2]);
            this.checkItemRendered(assert, [{ data: item2, index: 1 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item2.text, item2.content]);
            this.checkNotContainsElements(assert, ['2a', item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}] -> [{2}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            this.createTabPanel({ items: [item1] });

            const item2_ = { text: '2a', content: '2a_' };
            this.tabPanel.option(dataSourcePropertyName, [item2_]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item2_]);
            this.checkItemRendered(assert, [{ data: item2_, index: 0 }]);
            this.checkItemDeleted(assert, [item1]);

            this.checkContainsElements(assert, [item2_.text, item2_.content]);
            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2}] -> [{1}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2] });

            this.tabPanel.option(dataSourcePropertyName, [item1]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, []);
            this.checkItemRendered(assert, []);
            this.checkItemDeleted(assert, [item2]);

            this.checkContainsElements(assert, [item1.text, item1.content]);
            this.checkNotContainsElements(assert, [item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2}] -> [selectedIndex: 1]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2] });

            this.tabPanel.option('selectedIndex', 1);
            this.clock.tick(1);

            this.checkTitleRendered(assert, []);
            this.checkItemRendered(assert, [{ data: item2, index: 1 }]);
            this.checkItemDeleted(assert, []);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2}] -> [{1, visible:false}, {2}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2] });

            const item1_ = { text: '1a', content: '1a_', visible: false };
            this.tabPanel.option(dataSourcePropertyName, [item1_, item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, [item1_]);
            this.checkItemRendered(assert, [{ data: item2, index: 1 }, { data: item1_, index: 0 }]);
            this.checkItemDeleted(assert, [item1]);

            this.checkContainsElements(assert, [item1.text, item1.content, item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2}] -> [{2}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2] });

            this.tabPanel.option(dataSourcePropertyName, [item2]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, []);
            this.checkItemRendered(assert, [{ data: item2, index: 0 }]);
            this.checkItemDeleted(assert, [item1]);

            this.checkContainsElements(assert, [item2.text, item2.content]);
            this.checkNotContainsElements(assert, [item1.text, item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2, selected}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };

            this.createTabPanel({ items: [item1, item2], selectedIndex: 1 });
            this.clock.tick(1);

            this.checkContainsElements(assert, [item1.text, item2.text, item2.content]);
            this.checkNotContainsElements(assert, [item1.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2, selected}] -> [{1}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            this.createTabPanel({ items: [item1, item2], selectedIndex: 1 });

            this.tabPanel.option(dataSourcePropertyName, [item1]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, []);
            this.checkItemRendered(assert, [{ data: item1, index: 0 }]);
            this.checkItemDeleted(assert, [item2]);

            this.checkContainsElements(assert, [item1.text, item1.content]);
            this.checkNotContainsElements(assert, [item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2, selected}, {3}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            const item3 = { text: '3a', content: '3a_' };

            this.createTabPanel({ items: [item1, item2, item3], selectedIndex: 1 });
            this.clock.tick(1);

            this.checkContainsElements(assert, [item1.text, item2.text, item2.content, item3.text]);
            this.checkNotContainsElements(assert, [item1.content, item3.content]);
            this.checkContainsEmptyMessage(assert, false);
        });

        QUnit.test('[{1}, {2, selected}, {3}] -> [{1}, {3}]' + testContext, function(assert) {
            const item1 = { text: '1a', content: '1a_' };
            const item2 = { text: '2a', content: '2a_' };
            const item3 = { text: '3a', content: '3a_' };
            this.createTabPanel({ items: [item1, item2, item3], selectedIndex: 1 });

            this.tabPanel.option(dataSourcePropertyName, [item1, item3]);
            this.clock.tick(1);

            this.checkTitleRendered(assert, []);
            this.checkItemRendered(assert, [{ data: item3, index: 1 }]);
            this.checkItemDeleted(assert, [item2]);

            this.checkContainsElements(assert, [item1.text, item3.text, item3.content]);
            this.checkNotContainsElements(assert, [item1.content, item2.text, item2.content]);
            this.checkContainsEmptyMessage(assert, false);
        });
    });
});
