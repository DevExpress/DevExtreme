import $ from 'jquery';
import Tabs from 'ui/tabs';
import windowUtils from 'core/utils/window';
import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';
import {
    TABS_CLASS,
    TABS_WRAPPER_CLASS,
    TABS_ITEM_TEXT_SPAN_CLASS,
    TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS
} from '__internal/ui/tabs/tabs';
QUnit.testStart(() => {
    const markup =
        '<div id="tabs"></div>\
        <div id="widget"></div>\
        <div id="widthRootStyle"></div>';

    $('#qunit-fixture').html(markup);
    $('#widthRootStyle').css('width', '300px');
});

QUnit.module('Tabs markup', {
    beforeEach: function() {
        this.init = (items) => {
            this.$element = $('#tabs').dxTabs({ items });
        };
    },
}, () => {
    QUnit.test('tabs should have correct class', function(assert) {
        this.init(['1', '2', '3']);

        assert.ok(this.$element.hasClass(TABS_CLASS), 'tabs has correct class');
    });

    [[{ text: '1' }], ['1']].forEach(items => {
        QUnit.test(`Tabs item should have a correct span elements when items are ${JSON.stringify(items)}`, function(assert) {
            this.init(items);

            const $tabsTextSpan = this.$element.find(`.${TABS_ITEM_TEXT_SPAN_CLASS}`);
            assert.strictEqual($tabsTextSpan.length, 1, 'tab has correct span elements');

            const $tabsTextSpanPseudo = this.$element.find(`.${TABS_ITEM_TEXT_SPAN_PSEUDO_CLASS}`);
            assert.strictEqual($tabsTextSpanPseudo.length, 1, 'tab has correct pseudo span elements');
        });
    });

    QUnit.test('tabs should have wrapper with correct class', function(assert) {
        this.init(['1', '2', '3']);

        assert.strictEqual(this.$element.find(`.${TABS_WRAPPER_CLASS}`).length, 1, 'tabs has wrapper');
    });

    QUnit.test('items rendering', function(assert) {
        this.init([
            { text: '0', icon: 'custom' },
            { text: '1', icon: 'http://1.png' },
            { text: '2' }
        ]);

        const tabsInstance = this.$element.dxTabs('instance');
        const tabElements = tabsInstance._itemElements();

        assert.equal(tabsInstance.option('selectedIndex'), -1);

        assert.strictEqual(this.$element.text().trim(), '001122');

        assert.equal(tabElements.find('.dx-icon-custom').length, 1);

        const icon = tabElements.find('img');
        assert.equal(icon.length, 1);
        assert.equal(icon.attr('src'), 'http://1.png');
    });
});

QUnit.module('Badges', () => {
    QUnit.test('item badge render', function(assert) {
        const $element = $('#widget').dxTabs({
            items: [
                { text: 'user', badge: 1 },
                { text: 'analytics' }
            ],
            width: 400
        });

        assert.ok($element.find('.dx-tab:eq(0) .dx-badge').length, 'badge on the first item exists');
        assert.ok(!$element.find('.dx-tab:eq(1) .dx-badge').length, 'badge on the second item is not exist');
    });
});

QUnit.module('Widget sizing render', () => {
    QUnit.test('constructor', function(assert) {
        const $element = $('#widget').dxTabs({
            items: [
                { text: 'user' },
                { text: 'analytics' },
                { text: 'customers' },
                { text: 'search' },
                { text: 'favorites' }
            ], width: 400
        });
        const instance = $element.dxTabs('instance');

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual($element[0].style.width, 400 + 'px', 'outer width of the element must be equal to custom width');
    });

    QUnit.test('root with custom width', function(assert) {
        const $element = $('#widthRootStyle').dxTabs({
            items: [
                { text: 'user' },
                { text: 'analytics' },
                { text: 'customers' },
                { text: 'search' },
                { text: 'favorites' }
            ]
        });
        const instance = $element.dxTabs('instance');

        assert.strictEqual(instance.option('width'), undefined);
        assert.strictEqual($element[0].style.width, 300 + 'px', 'outer width of the element must be equal to custom width');
    });
});

let helper;
QUnit.module('Aria accessibility', {
    beforeEach: function() {
        this.items = [{ text: 'Item_1' }, { text: 'Item_2' }, { text: 'Item_3' }];
        helper = new ariaAccessibilityTestHelper({
            createWidget: ($element, options) => new Tabs($element, $.extend({
                focusStateEnabled: true
            }, options))
        });
    },
    afterEach: function() {
        helper.$widget.remove();
    }
}, () => {
    ['items', 'dataSource'].forEach((sourceName) => {
        [true, false].forEach((repaintChangesOnly) => {
            QUnit.test(`3 items, repaintChangesOnly: ${repaintChangesOnly}, use: ${sourceName}`, function() {
                helper.createWidget({ [`${sourceName}`]: this.items, repaintChangesOnly });

                helper.checkAttributes(helper.$widget, { role: 'tablist', tabindex: '0' }, 'widget');
                helper.checkItemsAttributes([], { attributes: ['aria-selected'], role: 'tab' });
            });

            QUnit.test(`[item1], add new item2, repaintChangesOnly: ${repaintChangesOnly}, use: ${sourceName}`, function(assert) {
                helper.createWidget({ [`${sourceName}`]: [{ text: 'Item_1' }], repaintChangesOnly });

                helper.checkAttributes(helper.$widget, { role: 'tablist', tabindex: '0' }, 'widget');
                helper.checkItemsAttributes([], { attributes: ['aria-selected'], role: 'tab' });

                if(!windowUtils.hasWindow()) {
                    assert.ok(true, 'no window');
                    return;
                }

                helper.widget.option(sourceName, [{ text: 'Item_1' }, { text: 'Item_2' }]);

                assert.strictEqual(helper.getItems().length, 2, 'items count');
                helper.checkAttributes(helper.$widget, { role: 'tablist', tabindex: '0' }, 'widget');
                helper.checkItemsAttributes([], { attributes: ['aria-selected'], role: 'tab' });
            });

            QUnit.test(`3 items, reorder item3 <--> item2, repaintChangesOnly: ${repaintChangesOnly}, use: ${sourceName}`, function(assert) {
                helper.createWidget({ [`${sourceName}`]: this.items, repaintChangesOnly });

                helper.checkAttributes(helper.$widget, { role: 'tablist', tabindex: '0' }, 'widget');
                helper.checkItemsAttributes([], { attributes: ['aria-selected'], role: 'tab' });

                helper.widget.option(sourceName, [{ text: 'Item_1' }, { text: 'Item_3' }, { text: 'Item_2' }]);
                assert.strictEqual(helper.getItems().length, 3, 'items count');
                helper.checkAttributes(helper.$widget, { role: 'tablist', tabindex: '0' }, 'widget');
                helper.checkItemsAttributes([], { attributes: ['aria-selected'], role: 'tab' });
            });

            QUnit.test(`3 items, selectedIndex: 1, repaintChangesOnly: ${repaintChangesOnly}, use: ${sourceName}`, function() {
                helper.createWidget({ [`${sourceName}`]: this.items, selectedIndex: 1, repaintChangesOnly });

                helper.checkAttributes(helper.$widget, { role: 'tablist', tabindex: '0' }, 'widget');
                helper.checkItemsAttributes([1], { attributes: ['aria-selected'], role: 'tab' });
            });

            QUnit.test(`3 items, selectedIndex: 1, set focusedElement: items[1] -> clean focusedElement, repaintChangesOnly: ${repaintChangesOnly}, use: ${sourceName}`, function() {
                helper.createWidget({ [`${sourceName}`]: this.items, selectedIndex: 1, repaintChangesOnly });

                helper.widget.option('focusedElement', helper.getItems().eq(1));
                helper.checkAttributes(helper.$widget, { role: 'tablist', 'aria-activedescendant': helper.widget.getFocusedItemId(), tabindex: '0' }, 'widget');
                helper.checkItemsAttributes([1], { focusedItemIndex: 1, attributes: ['aria-selected'], role: 'tab' });

                helper.widget.option('focusedElement', null);
                helper.checkAttributes(helper.$widget, { role: 'tablist', tabindex: '0' }, 'widget');
                helper.checkItemsAttributes([1], { attributes: ['aria-selected'], role: 'tab' });
            });
        });
    });
});

QUnit.module('Default template', {
    beforeEach: function() {
        this.prepareItemTest = (data) => {
            const tabs = new Tabs($('<div>'), {
                items: [data]
            });

            return tabs.itemElements().eq(0).find('.dx-item-content');
        };
    },
}, () => {
    QUnit.test('template should be rendered correctly with text', function(assert) {
        const $content = this.prepareItemTest('custom');

        assert.strictEqual($content.text(), 'customcustom');
    });

    QUnit.test('template should be rendered correctly with boolean', function(assert) {
        const $content = this.prepareItemTest(true);

        assert.strictEqual($content.text().trim(), 'truetrue');
    });

    QUnit.test('template should be rendered correctly with number', function(assert) {
        const $content = this.prepareItemTest(1);

        assert.strictEqual($content.text().trim(), '11');
    });

    QUnit.test('template should be rendered correctly with object that contains the "text" property', function(assert) {
        const $content = this.prepareItemTest({ text: 'custom' });

        assert.strictEqual($content.text().trim(), 'customcustom');
    });

    QUnit.test('template should be rendered correctly with html', function(assert) {
        const $content = this.prepareItemTest({ html: '<span>test</span>' });

        const $span = $content.is('span') ? $content : $content.children();
        assert.ok($span.length);
        assert.equal($span.text(), 'test');
    });

    QUnit.test('template should be rendered correctly with htmlstring', function(assert) {
        const $content = this.prepareItemTest('<span>test</span>');

        assert.strictEqual($content.text(), '<span>test</span><span>test</span>');
    });

    QUnit.test('template should be rendered correctly with html & text', function(assert) {
        const $content = this.prepareItemTest({ text: 'text', html: '<span>test</span>' });

        const $span = $content.is('span') ? $content : $content.children();

        assert.ok($span.length);
        assert.equal($content.text(), 'test');
    });

    QUnit.test('template should be rendered correctly with tab text wrapper for data with text field', function(assert) {
        const $content = this.prepareItemTest({ text: 'test' });

        assert.strictEqual($content.text(), 'testtest');
    });

    QUnit.test('template should be rendered correctly with tab text wrapper for string data', function(assert) {
        const $content = this.prepareItemTest('test');

        assert.strictEqual($content.text(), 'testtest');
    });

    QUnit.test('template should be rendered correctly with icon', function(assert) {
        const $content = this.prepareItemTest({ icon: 'test' });
        assert.equal($content.find('.dx-icon-test').length, 1);
    });

    QUnit.test('template should be rendered correctly with icon path', function(assert) {
        const $content = this.prepareItemTest({ icon: 'test.jpg' });

        assert.equal($content.find('.dx-icon').attr('src'), 'test.jpg');
    });

    QUnit.test('template should be rendered correctly with external icon', function(assert) {
        const $content = this.prepareItemTest({ icon: 'fa fa-icon' });

        assert.equal($content.find('.fa.fa-icon').length, 1);
    });
});
