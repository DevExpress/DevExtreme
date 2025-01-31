import $ from 'jquery';

import Splitter from 'ui/splitter';


QUnit.testStart(function() {
    const markup =
        '<div id="splitter"></div>\
        <div id="splitterWithNestedSplitter">\
            <div data-options="dxTemplate: { name: \'testTemplate\'}">\
                Nested_Splitter_Pane_1\
            </div>\
        </div>\
        ';

    $('#qunit-fixture').html(markup);
});

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const HORIZONTAL_ORIENTATION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_ORIENTATION_CLASS = 'dx-splitter-vertical';
const RESIZE_HANDLE_CLASS = 'dx-resize-handle';

const moduleConfig = {
    beforeEach: function() {
        const init = (options = {}) => {
            this.$element = $('#splitter').dxSplitter(options);
            this.instance = this.$element.dxSplitter('instance');
        };

        init();

        this.reinit = (options) => {
            this.instance.dispose();

            init(options);
        };

        this.getItems = () => {
            return this.$element.find(`.${SPLITTER_ITEM_CLASS}`);
        };
        this.getNestedSplitter = () => {
            return this.$element.find(`.${SPLITTER_CLASS}`);
        };
        this.getResizeHandles = () => {
            return this.$element.find(`.${RESIZE_HANDLE_CLASS}`);
        };
    }
};

QUnit.module('Render', moduleConfig, () => {
    QUnit.test('with panes declared using string values', function(assert) {
        this.reinit({ dataSource: ['Pane_1', 'Pane_2', 'Pane_3'] });

        assert.strictEqual(this.getItems().length, 3);
    });

    QUnit.test('with single pane', function(assert) {
        this.reinit({ dataSource: [{ template: () => $('<div>').text('Pane 1') }] });

        assert.strictEqual(this.getItems().length, 1);
    });

    QUnit.test('with two panes', function(assert) {
        this.reinit({
            items: [{ text: 'Pane_1' }, { text: 'Pane_2' }]
        });

        const $items = this.getItems();

        assert.strictEqual(this.getItems().length, 2, 'splitter rendered with two panes');

        assert.strictEqual($items.eq(0).text(), 'Pane_1', 'first pane was rendered');
        assert.strictEqual($items.eq(1).text(), 'Pane_2', 'second pane was rendered');
    });

    QUnit.test('with nested splitter', function(assert) {
        this.reinit({
            items: [{ splitter: { direction: 'row' } }]
        });

        const $nestedSplitter = this.getNestedSplitter();
        assert.strictEqual($nestedSplitter.length, 1, 'nested splitter was rendered');

        const nestedSplitterInstance = $nestedSplitter.dxSplitter('instance');
        assert.strictEqual(nestedSplitterInstance instanceof Splitter, true, 'nested splitter was created');
    });

    QUnit.test('with nested splitter that has item declared via template', function(assert) {
        const $splitter = $('#splitterWithNestedSplitter').dxSplitter({
            items: [
                {
                    splitter: {
                        items: [{ template: 'testTemplate' }]
                    }
                }
            ]
        });

        assert.strictEqual($.trim($splitter.text()), 'Nested_Splitter_Pane_1', 'nested splitter item with template was rendered');
    });

    QUnit.test('with nested splitter that has two panes inside using itemTemplate ', function(assert) {
        this.reinit({
            items: [
                {
                    splitter: {
                        items: [{ paneIndex: () => '1' }, { paneIndex: () => '2' }]
                    }
                }
            ],
            itemTemplate: (item) => { return `Pane_${item.paneIndex()}`; }
        });

        assert.strictEqual($.trim(this.$element.text()), 'Pane_1Pane_2', 'nested items were rendered correctly');
    });

    QUnit.test('items in nested splitter with two panes usind parent itemTemplate option', function(assert) {
        this.reinit({
            items: [
                {
                    splitter: {
                        items: [{ paneIndex: () => '1' }, { paneIndex: () => '2' }]
                    }
                }
            ],
            itemTemplate: (item) => { return `Pane_${item.paneIndex()}`; }
        });

        assert.strictEqual($.trim(this.$element.text()), 'Pane_1Pane_2', 'nested items were rendered correctly');
    });

    QUnit.test('itemTemplate option in a nested splitter is more prioritized than itemTemplate in parent splitter', function(assert) {
        this.reinit({
            items: [
                {
                    splitter: {
                        itemTemplate: (item) => `NestedPane_${item.paneIndex()}`,
                        items: [{ paneIndex: () => '1' }, { paneIndex: () => '2' }]
                    }
                }
            ],
            itemTemplate: (item) => `Pane_${item.paneIndex()}`
        });

        assert.strictEqual($.trim(this.$element.text()), 'NestedPane_1NestedPane_2', 'nested items were rendered correctly');
    });

    QUnit.test('item.template option in a nested splitter is more prioritized than itemTemplate', function(assert) {
        this.reinit({
            items: [
                {
                    splitter: {
                        itemTemplate: (item) => `NestedPane_${item.paneIndex()}`,
                        items: [{ paneIndex: () => '1', template: (item) => `TemplatedPane_${item.paneIndex()}` }, { paneIndex: () => '2' }]
                    }
                }
            ],
        });

        assert.strictEqual($.trim(this.$element.text()), 'TemplatedPane_1NestedPane_2', 'nested items were rendered correctly');
    });
});

QUnit.module('Classes', moduleConfig, () => {
    QUnit.test('root element should have dx-splitter class', function(assert) {
        assert.strictEqual(this.$element.hasClass(SPLITTER_CLASS), true);
    });

    QUnit.test('root element should have horizontal class by default', function(assert) {
        assert.strictEqual(this.$element.hasClass(VERTICAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(HORIZONTAL_ORIENTATION_CLASS), true);
    });

    QUnit.test('root element should have vertical class if orientation is vertical', function(assert) {
        this.reinit({ orientation: 'vertical' });

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(VERTICAL_ORIENTATION_CLASS), true);
    });

    QUnit.test('root element should have correct orientation class if orientation option change at runtime', function(assert) {
        this.instance.option('orientation', 'vertical');

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_ORIENTATION_CLASS), false);
        assert.strictEqual(this.$element.hasClass(VERTICAL_ORIENTATION_CLASS), true);

        this.instance.option('orientation', 'horizontal');

        assert.strictEqual(this.$element.hasClass(HORIZONTAL_ORIENTATION_CLASS), true);
        assert.strictEqual(this.$element.hasClass(VERTICAL_ORIENTATION_CLASS), false);
    });
});

QUnit.module('Aria attributes', moduleConfig, () => {
    QUnit.test('items should have the correct role attribute', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                splitter: {
                    dataSource: [{ text: 'Pane_2' }, { text: 'Pane_3' }]
                }
            }]
        });

        this.getItems().each((index, item) => {
            assert.strictEqual($(item).attr('role'), 'group', 'aria-role attribute value is correct');
        });
    });

    QUnit.test('last item should not have an id attribute', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                splitter: {
                    dataSource: [{ text: 'Pane_2' }, { text: 'Pane_3' }]
                }
            }]
        });

        assert.strictEqual(this.getItems().last().attr('id'), undefined, 'id attribute is not set for the last item');
    });

    QUnit.test('invisible item should not have an id attribute', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                text: 'Pane_2',
                visible: false,
            }, {
                text: 'Pane_3'
            }]
        });

        assert.strictEqual(this.getItems().eq(1).attr('id'), undefined, 'id attribute is not set for invisible item');
    });

    QUnit.test('resize handle should be rendered after changing visible option to true at runtime', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                text: 'Pane_2',
                visible: false,
            }, {
                text: 'Pane_3'
            }]
        });

        assert.strictEqual(this.getResizeHandles().length, 1, 'resize handles count');

        this.instance.option('items[1].visible', true);

        assert.strictEqual(this.getResizeHandles().length, 2, 'resize handles count');
    });

    QUnit.test('resize handle should be removed after changing visible option to false at runtime', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                text: 'Pane_2',
            }, {
                text: 'Pane_3'
            }]
        });

        assert.strictEqual(this.getResizeHandles().length, 2, 'resize handles count');

        this.instance.option('items[1].visible', false);

        assert.strictEqual(this.getResizeHandles().length, 1, 'resize handles count');
    });

    QUnit.test('item should have id attribute after changing visible option to true at runtime', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                text: 'Pane_2',
                visible: false,
            }, {
                text: 'Pane_3'
            }]
        });

        assert.strictEqual(this.getItems().eq(1).attr('id'), undefined, 'id attribute is not set for invisible item');

        this.instance.option('items[1].visible', true);

        assert.strictEqual(this.getItems().eq(1).attr('id'), this.getResizeHandles().eq(1).attr('aria-controls'), 'aria-controls of the resize handle are linked with id attribute of the pane');
    });

    QUnit.test('item should not have id attribute after changing visibile option to false at runtime', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                text: 'Pane_2',
            }, {
                text: 'Pane_3'
            }]
        });

        this.instance.option('items[1].visible', false);

        assert.strictEqual(this.getItems().eq(1).attr('id'), undefined, 'id attribute is not set for invisible item');
    });

    QUnit.test('item should not have id attribute after changing visibile option of the last item to true at runtime', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                text: 'Pane_2',
            }, {
                text: 'Pane_3',
                visible: false
            }]
        });

        this.instance.option('items[2].visible', true);

        assert.strictEqual(this.getItems().eq(2).attr('id'), undefined, 'id attribute is not set for invisible item');
    });

    QUnit.test('last visible item should have id attribute after changing visibile option of the last item to true at runtime', function(assert) {
        this.reinit({
            dataSource: [{
                text: 'Pane_1'
            }, {
                text: 'Pane_2',
            }, {
                text: 'Pane_3',
                visible: false
            }]
        });

        this.instance.option('items[2].visible', true);

        assert.strictEqual(this.getItems().eq(1).attr('id'), this.getResizeHandles().eq(1).attr('aria-controls'), 'aria-controls of the resize handle are linked with id attribute of the pane');
    });

    QUnit.test('aria-controls attribute value of the resizeHandle should be equal to the id attribute of the item', function(assert) {
        this.reinit({
            dataSource: [{ text: 'Pane_1' }, { text: 'Pane_2' }, { text: 'Pane_3' },]
        });

        const items = this.getItems();
        const resizeHandles = this.getResizeHandles();

        assert.strictEqual(items.eq(0).attr('id'), resizeHandles.eq(0).attr('aria-controls'));
        assert.strictEqual(items.eq(1).attr('id'), resizeHandles.eq(1).attr('aria-controls'));
    });
});

