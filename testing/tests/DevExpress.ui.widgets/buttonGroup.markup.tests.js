import $ from 'jquery';
import 'ui/button';
import 'ui/button_group';
import 'common.css!';

const BUTTON_GROUP_CLASS = 'dx-buttongroup',
    BUTTON_GROUP_WRAPPER_CLASS = BUTTON_GROUP_CLASS + '-wrapper',
    BUTTON_CLASS = 'dx-button',
    BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + '-item',
    BUTTON_GROUP_FIRST_ITEM_CLASS = BUTTON_GROUP_CLASS + '-first-item',
    BUTTON_GROUP_LAST_ITEM_CLASS = BUTTON_GROUP_CLASS + '-last-item',
    BUTTON_GROUP_ITEM_HAS_WIDTH = BUTTON_GROUP_ITEM_CLASS + '-has-width',
    SHAPE_STANDARD_CLASS = 'dx-shape-standard';

QUnit.testStart(() => {
    const markup = `
        <div id="buttonGroup"></div>
        <div id="widget"></div>
    `;
    $('#qunit-fixture').html(markup);
});

QUnit.module('default', {
    beforeEach() {
        this.$buttonGroup = $('#buttonGroup').dxButtonGroup({
            items: [
                {
                    text: 'left'
                },
                {
                    icon: 'center icon',
                    type: 'normal'
                }
            ]
        });

        this.buttonGroup = this.$buttonGroup.dxButtonGroup('instance');
    }
}, () => {
    QUnit.test('default options', function(assert) {
        const buttonGroup = $('#widget').dxButtonGroup().dxButtonGroup('instance');
        const getOptionValue = (name) => buttonGroup.option(name);

        assert.strictEqual(getOptionValue('hoverStateEnabled'), true, 'hoverStateEnabled');
        assert.strictEqual(getOptionValue('focusStateEnabled'), true, 'focusStateEnabled');
        assert.strictEqual(getOptionValue('selectionMode'), 'single', 'selectionMode');
        assert.deepEqual(getOptionValue('selectedItems'), [], 'selectedItems');
        assert.deepEqual(getOptionValue('selectedItemKeys'), [], 'selectedItemKeys');
        assert.strictEqual(getOptionValue('keyExpr'), 'text', 'keyExpr');
        assert.deepEqual(getOptionValue('items'), [], 'items');
        assert.strictEqual(getOptionValue('itemTemplate'), 'item', 'itemTemplate');
        assert.strictEqual(getOptionValue('onSelectionChanged'), null, 'onSelectionChanged');
        assert.strictEqual(getOptionValue('stylingMode'), 'contained', 'stylingMode');
    });

    QUnit.test('render markup', function(assert) {
        assert.equal(this.$buttonGroup.attr('role'), 'group', 'aria role');
        assert.ok(this.$buttonGroup.hasClass(BUTTON_GROUP_CLASS), 'button group class');

        const $wrapper = $(this.$buttonGroup).children();
        assert.equal($wrapper.length, 1, 'button group wrapper elements count');
        assert.ok($wrapper.eq(0).hasClass(BUTTON_GROUP_WRAPPER_CLASS), 'css class for button collection');

        const $buttons = $(`.${BUTTON_GROUP_WRAPPER_CLASS} .${BUTTON_GROUP_ITEM_CLASS}.${BUTTON_CLASS}`);
        assert.ok($buttons.eq(0).hasClass(BUTTON_GROUP_FIRST_ITEM_CLASS), 'first item has css class when item is first');
        assert.ok($buttons.eq(0).hasClass(SHAPE_STANDARD_CLASS), 'first item has the shape standard CSS class');
        assert.ok($buttons.eq(1).hasClass(SHAPE_STANDARD_CLASS), 'second item has the shape standard CSS class');
        assert.notOk($buttons.eq(0).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), 'first item has no css class when width of ButtonGroup is undefined');
        assert.notOk($buttons.eq(1).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH), 'second item has no css class when width of ButtonGroup is undefined');
        assert.equal($buttons.length, 2, 'buttons count');
    });

    QUnit.test('render with default key', function(assert) {
        const $buttonGroup = $('#widget').dxButtonGroup({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
        });

        const buttons = $buttonGroup.find(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));
        assert.equal(buttons[0].option('text'), 'item 1', 'text of first button');
        assert.equal(buttons[1].option('text'), 'item 2', 'text of second button');
    });

    QUnit.test('check button\'s options', function(assert) {
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));
        assert.equal(buttons[0].option('text'), 'left', 'text of first button');
        assert.equal(buttons[1].option('icon'), 'center icon', 'icon of second button');
        assert.equal(buttons[1].option('type'), 'normal', 'type of second button');
    });

    QUnit.test('focused state is disabled by default for all buttons', function(assert) {
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));

        assert.equal(buttons[0].option('focusStateEnabled'), false, 'first button');
        assert.equal(buttons[1].option('focusStateEnabled'), false, 'second button');
    });

    QUnit.test('the active state is disabled by default for all buttons', function(assert) {
        const buttons = $(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));

        assert.equal(buttons[0].option('activeStateEnabled'), false, 'first button');
        assert.equal(buttons[1].option('activeStateEnabled'), false, 'second button');
    });

    QUnit.test('default options of buttons collection', function(assert) {
        const buttonGroup = $('#widget').dxButtonGroup({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            accessKey: 'test key',
            selectedItemKeys: ['item 1'],
            tabIndex: 25
        }).dxButtonGroup('instance');

        const buttonCollection = buttonGroup._buttonsCollection;

        assert.equal(buttonCollection.option('items').length, 2, 'items of data source count');
        assert.equal(buttonCollection.option('accessKey'), 'test key', 'accessKey option');
        assert.equal(buttonCollection.option('tabIndex'), 25, 'tabIndex option');
        assert.equal(buttonCollection.option('selectedItemKeys'), 'item 1', 'selectedItemKeys option');
        assert.equal(buttonCollection.option('keyExpr'), 'text', 'keyExpr option');
        assert.ok(buttonCollection.option('itemTemplate'), 'itemTemplate option');
        assert.ok(buttonCollection.option('focusStateEnabled'), 'focusStateEnabled option');
        assert.notOk(buttonCollection.option('scrollingEnabled'), 'scrollingEnabled option');
        assert.equal(buttonCollection.option('noDataText'), '', 'noDataText option');
    });

    QUnit.test('default item template', function(assert) {
        const $buttonGroup = $('#widget').dxButtonGroup({
            items: [{
                text: 'item 1',
                type: 'normal',
                icon: 'plus',
                disabled: true,
                visible: false,
                hint: 'Custom hint'
            }]
        });

        const $button = $buttonGroup.find(`.${BUTTON_GROUP_ITEM_CLASS}`).first();
        const button = $button.dxButton('instance');

        assert.equal(button.option('text'), 'item 1', 'text');
        assert.equal(button.option('type'), 'normal', 'type');
        assert.equal(button.option('icon'), 'plus', 'icon');
        assert.equal(button.option('disabled'), true, 'disabled');
        assert.equal(button.option('visible'), false, 'visible');
        assert.equal(button.option('hint'), 'Custom hint', 'hint');
    });

    QUnit.test('use item template', function(assert) {
        const $buttonGroup = $('#widget').dxButtonGroup({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            itemTemplate: (itemData, itemIndex, itemElement) => {
                itemElement.append($(`<span class="custom-template">${itemData.text + '_' + itemIndex}</span>`));
            }
        });

        const $templates = $buttonGroup.find(`.${BUTTON_GROUP_ITEM_CLASS} .custom-template`);
        assert.equal($templates.eq(0).text(), 'item 1_0', 'text of first template');
        assert.equal($templates.eq(1).text(), 'item 2_1', 'text of second template');
    });

    QUnit.test('add css class when the width is defined', function(assert) {
        const $buttonGroup = $('#widget').dxButtonGroup({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            width: 500
        });

        const $buttons = $buttonGroup.find(`.${BUTTON_GROUP_ITEM_CLASS}`);

        assert.ok($buttons.eq(0).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH));
        assert.ok($buttons.eq(1).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH));
    });

    QUnit.test('add css class to item with a template when the width is defined', function(assert) {
        const $buttonGroup = $('#widget').dxButtonGroup({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            itemTemplate: () => '<div/>',
            width: 500
        });

        const $buttons = $buttonGroup.find(`.${BUTTON_GROUP_ITEM_CLASS}`);

        assert.ok($buttons.eq(0).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH));
        assert.ok($buttons.eq(1).hasClass(BUTTON_GROUP_ITEM_HAS_WIDTH));
    });

    QUnit.test('stylingMode', function(assert) {
        const $buttonGroup = $('#widget').dxButtonGroup({
            items: [{ text: 'item 1' }, { text: 'item 2' }],
            stylingMode: 'text'
        });

        const buttons = $buttonGroup.find(`.${BUTTON_CLASS}`).map((_, $button) => $($button).dxButton('instance'));

        assert.equal(buttons[0].option('stylingMode'), 'text', 'first button');
        assert.equal(buttons[1].option('stylingMode'), 'text', 'first button');
    });

    QUnit.test('add css class for a last item', function(assert) {
        const $buttonGroup = $('#widget').dxButtonGroup({
            items: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }]
        });

        const $lastButton = $buttonGroup.find(`.${BUTTON_CLASS}`).last();
        assert.ok($lastButton.hasClass(BUTTON_GROUP_LAST_ITEM_CLASS));
    });
});
