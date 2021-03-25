import $ from 'jquery';
import DropDownButton from 'ui/drop_down_button';
import browser from 'core/utils/browser';
import typeUtils from 'core/utils/type';
import eventsEngine from 'events/core/events_engine';
import keyboardMock from '../../helpers/keyboardMock.js';

import 'common.css!';

const DROP_DOWN_BUTTON_CONTENT = 'dx-dropdownbutton-content';
const DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS = 'dx-dropdownbutton-popup-wrapper';
const DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';
const BUTTON_GROUP_WRAPPER = 'dx-buttongroup-wrapper';
const LIST_GROUP_HEADER_CLASS = 'dx-list-group-header';

QUnit.testStart(() => {
    const markup =
        `<div id='container'>
            <div id='dropDownButton'></div>
            <div id='anotherDropDownButton'></div>
        </div>`;
    $('#qunit-fixture').html(markup);
});

const getPopup = (instance) => {
    return instance._popup;
};

const getList = (instance) => {
    return instance._list;
};

const getButtonGroup = (instance) => {
    return instance._buttonGroup;
};

const getActionButton = (instance) => {
    return instance.$element().find(`.${DROP_DOWN_BUTTON_ACTION_CLASS}`);
};

const getToggleButton = (instance) => {
    return instance.$element().find(`.${DROP_DOWN_BUTTON_TOGGLE_CLASS}`);
};

QUnit.module('button group integration', {}, () => {
    QUnit.test('height option should change buttonGroup wrapper height', function(assert) {
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            height: '300px'
        }).dxDropDownButton('instance');

        const buttonGroup = getButtonGroup(dropDownButton);
        const buttonGroupWrapper = buttonGroup.$element().find(`.${BUTTON_GROUP_WRAPPER}`);
        assert.strictEqual(buttonGroupWrapper.eq(0).height(), 300, 'height is right');

        $('#container').css('height', '900px');
        dropDownButton.option('height', '50%');

        const newButtonGroupWrapper = buttonGroup.$element().find(`.${BUTTON_GROUP_WRAPPER}`);
        assert.strictEqual(newButtonGroupWrapper.eq(0).height(), 450, 'height after option change in runtime is right');
    });
});

QUnit.module('popup integration', {
    beforeEach: function() {
        this.instance = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            splitButton: true,
            items: [{ text: 'Item 1' }, { text: 'Item 2' }]
        });
        this.popup = getPopup(this.instance);
    }
}, () => {
    QUnit.test('toggle button should toggle the widget', function(assert) {
        const instance = new DropDownButton('#dropDownButton', { splitButton: true });
        const $toggleButton = getToggleButton(instance);

        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.strictEqual(instance.option('dropDownOptions.visible'), true, 'the widget is opened');

        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.strictEqual(instance.option('dropDownOptions.visible'), false, 'the widget is closed');
    });

    QUnit.test('popup and list should not be rendered if deferRendering is true', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton');

        assert.strictEqual(getPopup(dropDownButton), undefined, 'popup should be lazy rendered');
        assert.strictEqual(getList(dropDownButton), undefined, 'list should be lazy rendered');
    });

    QUnit.test('dropDownOptions.deferRendering=false should not override deferRendering', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            deferRendering: true,
            dropDownOptions: {
                deferRendering: false
            }
        });

        const popup = getPopup(dropDownButton);
        assert.strictEqual(popup, undefined, 'popup has not been rendered');
    });

    QUnit.test('dropDownOptions.deferRendering=true should not override deferRendering', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            dropDownOptions: {
                deferRendering: true
            }
        });

        const popup = getPopup(dropDownButton);
        assert.strictEqual(popup.NAME, 'dxPopup', 'popup has been rendered');
    });

    QUnit.test('dropDownOptions.deferRendering optionChange should be ignored', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton');

        dropDownButton.option('dropDownOptions', { deferRendering: false });

        const popup = getPopup(dropDownButton);
        assert.strictEqual(popup, undefined, 'dropDownOptions.deferRendering is ignored');
    });

    QUnit.test('popup and list should be rendered on init when deferRendering is false', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', { deferRendering: false });
        const popup = getPopup(dropDownButton);

        assert.strictEqual(popup.NAME, 'dxPopup', 'popup has been rendered');
        assert.strictEqual(getList(dropDownButton).NAME, 'dxList', 'list has been rendered');
        assert.ok(popup.option('closeOnOutsideClick'), 'popup should be closed on outside click');
    });

    QUnit.test('dropDownOptions.visible=true should not open popup on init', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            dropDownOptions: {
                visible: true
            }
        });

        const popup = getPopup(dropDownButton);
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');
    });

    QUnit.test('popup should have special classes', function(assert) {
        assert.ok($(this.popup.content()).hasClass(DROP_DOWN_BUTTON_CONTENT), 'popup has a special class');
        assert.ok($(this.popup._wrapper()).hasClass(DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS), 'popup wrapper has a special class');
    });

    QUnit.test('popup content should have special class when custom template is used', function(assert) {
        const instance = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            dropDownContentTemplate: () => {
                return 'Custom Content';
            }
        });

        const $popupContent = $(getPopup(instance).content());
        assert.ok($popupContent.hasClass(DROP_DOWN_BUTTON_CONTENT), 'popup has special class');
    });

    QUnit.test('popup width should be equal to dropDownButton width', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            opened: true,
            items: ['1', '2', '3'],
            width: 500
        });

        const instance = $dropDownButton.dxDropDownButton('instance');
        const $popupContent = $(getPopup(instance).content());
        assert.equal($popupContent.outerWidth(), $dropDownButton.outerWidth(), 'width are equal on init');
        assert.equal($popupContent.outerWidth(), 500, 'width are equal on init');

        instance.option('width', 700);
        assert.equal($popupContent.outerWidth(), $dropDownButton.outerWidth(), 'width are equal after option change');
        assert.equal($popupContent.outerWidth(), 700, 'width are equal after option change');

        instance.option('width', '90%');
        $('#container').get(0).style.width = '900px';
        instance.option('opened', false);
        instance.option('opened', true);
        assert.equal($popupContent.outerWidth(), $dropDownButton.outerWidth(), 'width are equal after option change');
        assert.equal($popupContent.outerWidth(), 810, 'width are equal after option change');
    });

    QUnit.test('popup should be positioned correctly if rtlEnabled is true', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            opened: true,
            dropDownOptions: {
                width: 200,
                'position.collision': 'none'
            },
        });

        const instance = $dropDownButton.dxDropDownButton('instance');
        const dropDownButtonElementRect = $dropDownButton.get(0).getBoundingClientRect();
        const popupContentElementRect = getPopup(instance)._$content.get(0).getBoundingClientRect();

        assert.strictEqual(popupContentElementRect.left, dropDownButtonElementRect.left, 'popup position is correct, rtlEnabled = false');
    });

    QUnit.test('popup width should change if content is truncated', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            icon: 'square',
            opened: true,
            dropDownContentTemplate: function(data, $container) {
                $('<div>')
                    .addClass('custom-color-picker')
                    .appendTo($container);
            }
        });

        const colorPicker = $('.custom-color-picker');
        colorPicker.css('width:82px; padding:5px;');

        const instance = $dropDownButton.dxDropDownButton('instance');
        const $popupContent = $(getPopup(instance).content());
        assert.equal(`${$popupContent.outerWidth()}px`, colorPicker.css('width'), 'width is right');
    });

    QUnit.test('popup should have correct options after rendering', function(assert) {
        const options = {
            deferRendering: this.instance.option('deferRendering'),
            focusStateEnabled: false,
            dragEnabled: false,
            showTitle: false,
            animation: {
                show: { type: 'fade', duration: 0, from: 0, to: 1 },
                hide: { type: 'fade', duration: 400, from: 1, to: 0 }
            },
            height: 'auto',
            shading: false,
            position: {
                of: this.instance.$element(),
                collision: 'flipfit',
                my: 'top left',
                at: 'bottom left'
            }
        };

        for(const name in options) {
            assert.deepEqual(this.popup.option(name), options[name], 'option ' + name + ' is correct');
        }
    });

    QUnit.test('popup width should be recalculated when button dimension changed', function(assert) {
        const instance = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            opened: true
        });
        const repaintMock = sinon.spy(getPopup(instance), 'repaint');

        instance.option({
            icon: 'box',
            text: 'Test',
            showArrowIcon: false
        });

        assert.strictEqual(repaintMock.callCount, 3, 'popup has been repainted 3 times');
    });

    QUnit.test('dropDownOptions can be restored after repaint', function(assert) {
        const instance = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            dropDownOptions: {
                firstOption: 'Test'
            }
        });

        instance.option('dropDownOptions', {
            secondOption: 'Test 2'
        });

        instance.repaint();
        assert.strictEqual(getPopup(instance).option('firstOption'), 'Test', 'option has been stored after repaint');
        assert.strictEqual(getPopup(instance).option('secondOption'), 'Test 2', 'option has been stored after repaint');
    });

    QUnit.test('click on toggle button should not be outside', function(assert) {
        const $toggleButton = getToggleButton(this.instance);
        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.ok(this.instance.option('dropDownOptions.visible'), 'popup is visible');

        eventsEngine.trigger($toggleButton, 'dxpointerdown');
        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.notOk(this.instance.option('dropDownOptions.visible'), 'popup is hidden');
    });

    QUnit.test('click on other toggle button should be outside', function(assert) {
        const otherButton = new DropDownButton('#anotherDropDownButton', {
            text: 'Text',
            icon: 'box',
            splitButton: true
        });

        let $toggleButton = getToggleButton(this.instance);
        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.ok(this.instance.option('dropDownOptions.visible'), 'popup is visible');

        $toggleButton = getToggleButton(otherButton);
        eventsEngine.trigger($toggleButton, 'dxpointerdown');
        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.notOk(this.instance.option('dropDownOptions.visible'), 'popup is hidden');
    });
});

QUnit.module('list integration', {}, () => {
    QUnit.test('hoverStateEnabled should be transfered to the list', function(assert) {
        const instance = new DropDownButton('#dropDownButton', { hoverStateEnabled: false, deferRendering: false });
        const list = getList(instance);

        assert.strictEqual(list.option('hoverStateEnabled'), false, 'List has correct option');

        instance.option('hoverStateEnabled', true);

        assert.strictEqual(list.option('hoverStateEnabled'), true, 'List has changed option');
    });

    QUnit.test('it should be possible to render the widget list item without a text', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            items: [{ icon: 'box' }, { icon: 'user' }],
            keyExpr: 'icon',
            displayExpr: '',
            selectedItemKey: 'user'
        });

        const $listItemText = getList(dropDownButton).itemElements().eq(0).text();

        assert.strictEqual($listItemText, '', 'item text is empty');
    });

    QUnit.test('list should be displayed correctly without data expressions', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: ['Item 1'],
            deferRendering: false
        });
        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), 'Item 1', 'displayExpr works');
        assert.strictEqual(list.option('keyExpr'), 'this', 'keyExpr is \'this\'');
    });

    QUnit.test('data expressions should work with dropDownButton', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            keyExpr: 'key',
            displayExpr: 'name',
            deferRendering: false
        });

        const list = getList(dropDownButton);
        const $listItem = list.itemElements();

        assert.strictEqual($listItem.text(), 'Item 1', 'displayExpr works');
        assert.strictEqual(list.option('keyExpr'), 'key', 'keyExpr works');
        assert.strictEqual($listItem.find('.dx-icon-box').length, 1, 'item icon works');
    });

    QUnit.test('some options should be transfered to the list', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false,
            grouped: true,
            noDataText: 'No data',
            useSelectMode: false
        });

        const list = getList(dropDownButton);

        assert.strictEqual(list.option('grouped'), true, 'grouped option transfered');
        assert.strictEqual(list.option('noDataText'), 'No data', 'noDataText option transfered');
        assert.strictEqual(list.option('selectionMode'), 'none', 'selectionMode is none for useSelectMode: false');
    });

    QUnit.test('groupTemplate should be transfered to list', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false,
            grouped: true,
            groupTemplate: (data) => {
                return $('<div>').text(`${data.key}: ${data.name}`);
            }
        });
        const $element = dropDownButton.$element();

        let groupHeaders = $element.find(`.${LIST_GROUP_HEADER_CLASS}`);
        assert.equal(groupHeaders.eq(0).text(), '1: Item 1', 'groupTemplate is transfered to list on init');

        dropDownButton.option('groupTemplate', (data) => {
            return $('<div>').text(`Group #${data.key}`);
        });

        groupHeaders = $element.find(`.${LIST_GROUP_HEADER_CLASS}`);
        assert.equal(groupHeaders.eq(0).text(), 'Group #1', 'groupTemplate is transfered to list after option change');
    });

    QUnit.test('list should have single selection mode if useSelectMode: true', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false,
            useSelectMode: true
        });
        const list = getList(dropDownButton);

        assert.strictEqual(list.option('selectionMode'), 'single', 'selectionMode is single for useSelectMode: true');
    });

    QUnit.test('showItemDataTitle should be true for the list', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false
        });

        const list = getList(dropDownButton);

        assert.strictEqual(list.option('showItemDataTitle'), true, 'option is true');
    });

    QUnit.test('wrapItemText option', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: ['Text'],
            deferRendering: false,
            wrapItemText: true
        });

        const list = getList(dropDownButton);
        const $itemContainer = list._itemContainer();

        assert.ok($itemContainer.hasClass('dx-wrap-item-text'), 'class was added');
    });

    [true, false].forEach(wrapItemText => {
        QUnit.test('wrapItemText option should be synchronized with dxList wrapItemText option (T846124)', function(assert) {
            const dropDownButton = new DropDownButton('#dropDownButton', {
                deferRendering: false,
                wrapItemText
            });

            const list = getList(dropDownButton);
            assert.strictEqual(list.option('wrapItemText'), dropDownButton.option('wrapItemText'), `list option is correct when dropDownButton wrapItemText is ${wrapItemText} on init`);

            dropDownButton.option('wrapItemText', !wrapItemText);
            assert.strictEqual(list.option('wrapItemText'), dropDownButton.option('wrapItemText'), 'list option is correct after dropDownButton wrapItemText option value change');
        });
    });

    QUnit.test('list selection should depend on selectedItemKey option', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [{ key: 1, name: 'Item 1' }, { key: 2, name: 'Item 2' }],
            deferRendering: false,
            keyExpr: 'key',
            displayExpr: 'name',
            selectedItemKey: 2,
            useSelectMode: true
        });

        const list = getList(dropDownButton);
        assert.deepEqual(list.option('selectedItemKeys'), [2], 'selection is correct');

        dropDownButton.option('selectedItemKey', 1);
        assert.deepEqual(list.option('selectedItemKeys'), [1], 'selection is correct');
    });

    QUnit.test('list selection should by defined depend on useSelectMode option (T838962)', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [{ key: 1, name: 'Item 1' }, { key: 2, name: 'Item 2' }],
            deferRendering: false,
            keyExpr: 'key',
            displayExpr: 'name',
            selectedItemKey: 1,
            useSelectMode: false
        });
        const list = getList(dropDownButton);

        assert.deepEqual(list.option('selectedItemKeys'), [], 'selection is correct');

        dropDownButton.option('useSelectMode', true);
        assert.deepEqual(list.option('selectedItemKeys'), [1], 'selection is correct');

        dropDownButton.option('useSelectMode', false);
        assert.deepEqual(list.option('selectedItemKeys'), [], 'selection is correct');
    });

    QUnit.test('selection by click, key has been provided by dataSource', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ key: 1, name: 'Item 1' }, { key: 2, name: 'Item 2' }],
                    key: 'key'
                }
            },
            deferRendering: false,
            displayExpr: 'name',
            selectedItemKey: 2,
            useSelectMode: true
        });

        const list = getList(dropDownButton);
        assert.deepEqual(list.option('selectedItemKeys'), [2], 'selection is correct');

        dropDownButton.open();
        eventsEngine.trigger(list.itemElements().eq(0), 'dxclick');
        assert.deepEqual(dropDownButton.option('selectedItemKey'), 1, 'dropDownButton selected item key is correct');
        assert.deepEqual(list.option('selectedItemKeys'), [1], 'list selected item key is correct');
    });

    QUnit.test('selection by click, key has been provided by widget', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [{ key: 1, name: 'Item 1' }, { key: 2, name: 'Item 2' }],
            deferRendering: false,
            keyExpr: 'key',
            displayExpr: 'name',
            selectedItemKey: 2,
            useSelectMode: true
        });

        const list = getList(dropDownButton);
        assert.deepEqual(list.option('selectedItemKeys'), [2], 'selection is correct');

        dropDownButton.open();
        eventsEngine.trigger(list.itemElements().eq(0), 'dxclick');
        assert.deepEqual(dropDownButton.option('selectedItemKey'), 1, 'dropDownButton selected item key is correct');
        assert.deepEqual(list.option('selectedItemKeys'), [1], 'list selected item key is correct');
    });
});

QUnit.module('common use cases', {
    beforeEach: function() {
        this.itemClickHandler = sinon.spy();
        this.dropDownButton = new DropDownButton('#dropDownButton', {
            useSelectMode: false,
            deferRendering: false,
            keyExpr: 'id',
            displayExpr: 'name',
            onItemClick: this.itemClickHandler,
            items: [
                { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' },
                { id: 2, file: 'all.exe', name: 'Trial for all platforms', icon: 'user' }
            ],
            text: 'Download DevExtreme Trial',
            icon: 'group'
        });
        this.list = getList(this.dropDownButton);
        this.listItems = this.list.itemElements();
    }
}, () => {
    QUnit.test('it should be possible to set non-datasource action button', function(assert) {
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Download DevExtreme Trial', 'initial text is correct');

        eventsEngine.trigger(this.listItems.eq(0), 'dxclick');

        assert.strictEqual(this.itemClickHandler.callCount, 1, 'item clicked');
        assert.strictEqual(this.itemClickHandler.getCall(0).args[0].itemData.id, 1, 'vs.exe clicked');
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Download DevExtreme Trial', 'initial text was not changed');
        assert.notOk(getPopup(this.dropDownButton).option('visible'), 'popup is hidden');
    });

    QUnit.test('custom item should be redefined after selection if useSelectMode is true', function(assert) {
        this.dropDownButton.option({
            useSelectMode: true,
            opened: true
        });
        eventsEngine.trigger(this.list.itemElements().eq(0), 'dxclick');
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Trial for Visual Studio', 'action button has been changed');
    });

    QUnit.test('deferRendering should not do anything if popup has already been rendered', function(assert) {
        const $dropDownButton = getPopup(this.dropDownButton).$element();

        this.dropDownButton.option('deferRendering', true);
        assert.strictEqual($dropDownButton, getPopup(this.dropDownButton).$element(), 'popup does not render repeatedly');

        this.dropDownButton.option('deferRendering', false);
        assert.strictEqual($dropDownButton, getPopup(this.dropDownButton).$element(), 'popup does not render repeatedly');
    });

    QUnit.test('Widget should work correct if new selected item has key is 0', function(assert) {
        this.dropDownButton.option({
            items: [{ id: 0, name: 'Test 0' }, { id: 1, name: 'Test 1' }],
            selectedItemKey: 1,
            useSelectMode: true,
            opened: true
        });

        eventsEngine.trigger(this.list.itemElements().eq(0), 'dxclick');
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Test 0', 'action button text is correct');
    });

    QUnit.test('custom item should be redefined after selection if useSelectMode is changed to true at runtime', function(assert) {
        this.dropDownButton.option({
            useSelectMode: false,
            opened: true
        });

        eventsEngine.trigger(this.list.itemElements().eq(1), 'dxclick');
        assert.strictEqual(this.list.option('selectedItem'), undefined, 'list selectedItem is undefined after item click');

        this.dropDownButton.option({
            useSelectMode: true,
            opened: true
        });

        eventsEngine.trigger(this.list.itemElements().eq(0), 'dxclick');

        assert.deepEqual(this.dropDownButton.option('selectedItem'), { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' }, 'selectedItem is defined after item click');
        assert.deepEqual(this.list.option('selectedItem'), { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' }, 'list selectedITem is defined after item click');
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Trial for Visual Studio', 'action button has been changed');

        this.dropDownButton.option('useSelectMode', false);
        assert.deepEqual(this.dropDownButton.option('selectedItem'), undefined, 'selectedITem is undefined if useSelectMode is changed to false');
    });

    QUnit.test('prevent default behavior for the itemClick action', function(assert) {
        const clickHandler = sinon.stub().returns(false);
        this.dropDownButton.option('onItemClick', clickHandler);

        this.dropDownButton.toggle(true);
        eventsEngine.trigger(this.listItems.eq(0), 'dxclick');
        assert.strictEqual(clickHandler.callCount, 1, 'clickHandler called');
        assert.ok(getPopup(this.dropDownButton).option('visible'), 'default behavior has been prevented');
    });

    QUnit.test('the user can hide the toggle button', function(assert) {
        this.dropDownButton.option('splitButton', false);
        assert.strictEqual(getToggleButton(this.dropDownButton).length, 0, 'there is no toggle button');

        eventsEngine.trigger(getActionButton(this.dropDownButton), 'dxclick');
        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'action button opens the dropdown');

        this.dropDownButton.close();
        this.dropDownButton.option('splitButton', true);
        assert.strictEqual(getToggleButton(this.dropDownButton).length, 1, 'the toggle button is visible');

        eventsEngine.trigger(getActionButton(this.dropDownButton), 'dxclick');
        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'action button doesn\'t open the dropdown');
    });

    QUnit.test('click on item should raise onSelectionChanged (T848284)', function(assert) {
        const selectionChangeHandler = sinon.spy();

        this.dropDownButton.option({
            items: [{
                id: 1, name: 'a'
            }, {
                id: 2, name: 'b'
            }],
            useSelectMode: true,
            onSelectionChanged: selectionChangeHandler
        });

        const firstListItems = getList(this.dropDownButton).itemElements();
        eventsEngine.trigger(firstListItems[0], 'dxclick');

        this.dropDownButton.option('items', [{ id: 1, name: 'test' }]);
        this.dropDownButton.option('selectedItemKey', 1);

        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'test', 'actionButton text is correct');
        assert.strictEqual(selectionChangeHandler.callCount, 2, 'onSelectionChange is raised');
    });

    QUnit.test('click on item should raise selectionChanged - subscription by "on" method', function(assert) {
        const selectionChangeHandler = sinon.spy();
        const items = [{
            id: 1, name: 'a'
        }, {
            id: 2, name: 'b'
        }];

        this.dropDownButton.option({
            items,
            useSelectMode: true
        });

        this.dropDownButton.on('selectionChanged', selectionChangeHandler);

        const firstListItems = getList(this.dropDownButton).itemElements();
        eventsEngine.trigger(firstListItems[0], 'dxclick');

        assert.strictEqual(selectionChangeHandler.callCount, 1, 'selectionChanged is raised');
    });

    QUnit.test('click on item should change selectedItem option', function(assert) {
        const items = [{
            id: 1, name: 'a'
        }, {
            id: 2, name: 'b'
        }];

        this.dropDownButton.option({
            items,
            useSelectMode: true
        });

        const firstListItems = getList(this.dropDownButton).itemElements();
        eventsEngine.trigger(firstListItems[0], 'dxclick');

        assert.strictEqual(this.dropDownButton.option('selectedItem'), items[0], 'selectedItem is correct');
    });
});

QUnit.module('public methods', {
    beforeEach: function() {
        this.dropDownButton = new DropDownButton('#dropDownButton', {
            items: ['Item 1', 'Item 2', 'Item 3'],
            deferRendering: false
        });
    }
}, () => {
    QUnit.test('toggle method', function(assert) {
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');

        this.dropDownButton.toggle(true);
        assert.strictEqual(popup.option('visible'), true, 'popup is opened');

        this.dropDownButton.toggle(true);
        assert.strictEqual(popup.option('visible'), true, 'popup is still opened');

        this.dropDownButton.toggle(false);
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');

        this.dropDownButton.toggle();
        assert.strictEqual(popup.option('visible'), true, 'popup visibility is inverted');

        const togglePromise = this.dropDownButton.toggle();
        assert.strictEqual(popup.option('visible'), false, 'popup visibility is inverted');
        assert.ok(typeUtils.isPromise(togglePromise), 'toggle should return promise');
    });

    QUnit.test('open method', function(assert) {
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');

        const openPromise = this.dropDownButton.open();
        assert.strictEqual(popup.option('visible'), true, 'popup is opened');
        assert.ok(typeUtils.isPromise(openPromise), 'open should return promise');
    });

    QUnit.test('close method', function(assert) {
        this.dropDownButton.option('opened', true);
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option('visible'), true, 'popup is opened');

        const closePromise = this.dropDownButton.close();
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');
        assert.ok(typeUtils.isPromise(closePromise), 'close should return promise');
    });

    QUnit.test('opened option', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            opened: true
        });

        assert.ok(getPopup(dropDownButton).option('visible'), 'popup is opened');

        dropDownButton.option('opened', false);
        assert.notOk(getPopup(dropDownButton).option('visible'), 'popup is closed');
    });

    QUnit.test('optionChange should be called when popup opens manually', function(assert) {
        const optionChangedHandler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
            onOptionChanged: optionChangedHandler
        });
        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, 'dxclick');
        assert.ok(getPopup(dropDownButton).option('visible'), 'popup is opened');
        assert.strictEqual(optionChangedHandler.callCount, 1, 'optionChanged was called');
        assert.strictEqual(optionChangedHandler.getCall(0).args[0].name, 'opened', 'option name is correct');
        assert.strictEqual(optionChangedHandler.getCall(0).args[0].value, true, 'option value is correct');

        eventsEngine.trigger($actionButton, 'dxclick');
        assert.notOk(getPopup(dropDownButton).option('visible'), 'popup is closed');
        assert.strictEqual(optionChangedHandler.callCount, 2, 'optionChanged was called');
        assert.strictEqual(optionChangedHandler.getCall(1).args[0].name, 'opened', 'option name is correct');
        assert.strictEqual(optionChangedHandler.getCall(1).args[0].value, false, 'option value is correct');
    });
});

QUnit.module('items changing', {
    beforeEach: function() {
        this.dropDownButton = new DropDownButton('#dropDownButton', {
            items: [
                { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' },
                { id: 2, file: 'all.exe', name: 'Trial for all platforms', icon: 'user' }
            ],
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'name'
        });
    }
}, () => {
    QUnit.test('showing and hiding the toggle button should not lead to datasource loading when there is no list', function(assert) {
        const loadHandler = sinon.stub().returns([{ id: 1, name: 'Item 1' }]);
        const byKeyHandler = sinon.stub().withArgs(1).returns([{ id: 1, name: 'Item 1' }]).returns([]);

        this.dropDownButton.option({
            dataSource: {
                load: loadHandler,
                byKey: byKeyHandler
            },
            deferRendering: false,
            selectedItemKey: 1
        });

        const loadCount = loadHandler.callCount;
        const byKeyCount = byKeyHandler.callCount;

        this.dropDownButton.option('splitButton', true);
        this.dropDownButton.option('splitButton', false);

        assert.strictEqual(byKeyHandler.callCount, byKeyCount, 'byKey was not called');
        assert.strictEqual(loadHandler.callCount, loadCount, 'load was not called');
    });

    QUnit.test('items changing with useSelectMode: false should not lead to datasource loading', function(assert) {
        const data = [{
            id: 1,
            name: 'Item 1'
        }, {
            id: 2,
            name: 'Item 2'
        }, {
            id: 3,
            name: 'Item 3'
        }];

        const loadHandler = sinon.stub().returns(data);
        const byKeyHandler = sinon.spy((key) => {
            return [ data[key - 1] ];
        });

        this.dropDownButton.option({
            dataSource: {
                load: loadHandler,
                byKey: byKeyHandler
            },
            useSelectMode: false,
            deferRendering: false,
            keyExpr: 'id',
            displayExpr: 'name',
            selectedItemKey: 1,
            opened: true
        });

        const loadCount = loadHandler.callCount;
        const byKeyCount = byKeyHandler.callCount;
        const $items = getList(this.dropDownButton).itemElements();

        eventsEngine.trigger($items.eq(0), 'dxclick');
        this.dropDownButton.option('opened', true);
        eventsEngine.trigger($items.eq(1), 'dxclick');
        this.dropDownButton.option('opened', true);
        eventsEngine.trigger($items.eq(2), 'dxclick');

        assert.strictEqual(byKeyHandler.callCount, byKeyCount, 'byKey was not called after items clicks');
        assert.strictEqual(loadHandler.callCount, loadCount, 'load was not called after items clicks');

        this.dropDownButton.option('selectedItemKey', 1);
        this.dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(byKeyHandler.callCount, byKeyCount, 'byKey was not called');
        assert.strictEqual(loadHandler.callCount, loadCount, 'load was not called');
    });
});

QUnit.module('deferred datasource', {
    beforeEach: function() {
        this.items = [
            { id: 1, name: 'Left', icon: 'alignleft' },
            { id: 4, name: 'Right', icon: 'alignright' },
            { id: 2, name: 'Center', icon: 'aligncenter' },
            { id: 3, name: 'Justify', icon: 'alignjustify' }
        ];
        this.clock = sinon.useFakeTimers();
        this.dataSourceConfig = {
            load: () => {
                const d = $.Deferred();
                setTimeout(() => {
                    d.resolve(this.items.slice());
                }, 500);
                return d.promise();
            },
            byKey: (key) => {
                const d = $.Deferred();
                setTimeout(() => {
                    const item = $.grep(this.items, (item) => {
                        return item.id === key;
                    });
                    d.resolve(item);
                }, 200);

                return d.promise();
            }
        };
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('displayExpr should work with deferred datasource', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            displayExpr: 'name',
            dataSource: this.dataSourceConfig,
        });

        dropDownButton.open();
        this.clock.tick(500);

        const list = getList(dropDownButton);
        const $item = list.itemElements().eq(0);

        assert.strictEqual($item.text(), 'Left', 'text is correct');
    });

    QUnit.test('select an item via api', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'text',
            items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }]
        });
        dropDownButton.option('selectedItemKey', 2);
        this.clock.tick();
        assert.strictEqual(getList(dropDownButton).option('selectedItemKeys')[0], 2, 'selectedItemKeys is correct');
    });
});

QUnit.module('events', {}, () => {
    QUnit.test('onItemClick event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            onItemClick: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 5, 'event has 5 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
        assert.strictEqual(e.itemData, 1, 'itemData is correct');
        assert.strictEqual($(e.itemElement).get(0), $item.get(0), 'itemElement is correct');
    });

    QUnit.test('itemClick event - subscription using "on" method', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3]
        });

        dropDownButton.on('itemClick', handler);

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 5, 'event has 5 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
        assert.strictEqual(e.itemData, 1, 'itemData is correct');
        assert.strictEqual($(e.itemElement).get(0), $item.get(0), 'itemElement is correct');
    });

    QUnit.test('itemClick event change - subscription by "on" method', function(assert) {
        const handler = sinon.spy();

        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3]
        });

        dropDownButton.open();
        dropDownButton.on('itemClick', handler);

        const $item = getList(dropDownButton).itemElements().eq(0);
        eventsEngine.trigger($item, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('onButtonClick event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2,
            onButtonClick: handler
        });

        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 4, 'event has 4 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
        assert.strictEqual(e.selectedItem, 2, 'itemData is correct');
    });

    QUnit.test('onButtonClick option change', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            selectedItemKey: 2
        });

        dropDownButton.option('onButtonClick', handler);
        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, 'dxclick');

        const e = handler.lastCall.args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
    });

    QUnit.test('onButtonClick should be called even if splitButton is false', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            splitButton: false,
            onButtonClick: handler
        });

        const $actionButton = getActionButton(dropDownButton);
        eventsEngine.trigger($actionButton, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('buttonClick - subscription using "on" method', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            splitButton: false
        });

        dropDownButton.on('buttonClick', handler);

        const $actionButton = getActionButton(dropDownButton);
        eventsEngine.trigger($actionButton, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('onContentReady should be fired after widget rendering and take into account Popup rendering', function(assert) {
        const contentReadyHandler = sinon.spy();

        const dropDownButton = new DropDownButton('#dropDownButton', {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            deferRendering: true,
            onContentReady: contentReadyHandler
        });

        assert.strictEqual(contentReadyHandler.callCount, 1, 'Widget is ready');
        dropDownButton.open();
        assert.strictEqual(contentReadyHandler.callCount, 3, 'Popup is ready, then List is ready');
    });

    QUnit.test('onContentReady should be fired after widget rendering when subscription uses "on" method', function(assert) {
        const contentReadyHandler = sinon.spy();

        const dropDownButton = new DropDownButton('#dropDownButton', {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            deferRendering: true
        });

        dropDownButton.on('contentReady', contentReadyHandler);
        dropDownButton.open();
        assert.strictEqual(contentReadyHandler.callCount, 2, 'Popup is ready, then List is ready');

        dropDownButton.option('dataSource', [1, 2, 3]);
        assert.strictEqual(contentReadyHandler.callCount, 3, 'List is ready after updating Popup content');
    });

    QUnit.test('onContentReady should be fired after widget with custom content template rendering', function(assert) {
        const contentReadyHandler = sinon.spy();
        const firstTemplateHandler = sinon.stub().returns('Template 1');
        const secondTemplateHandler = sinon.stub().returns('Template 2');

        const dropDownButton = new DropDownButton('#dropDownButton', {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            dropDownContentTemplate: firstTemplateHandler,
            deferRendering: false,
            onContentReady: contentReadyHandler,
            opened: true
        });

        assert.strictEqual(contentReadyHandler.callCount, 1, 'event is fired');

        dropDownButton.option('dropDownContentTemplate', secondTemplateHandler);
        assert.strictEqual(contentReadyHandler.callCount, 2, 'event is fired after template change');
    });

    QUnit.test('onContentReady should be fired after widget with custom content template rendering - subscription uses "on" method', function(assert) {
        const contentReadyHandler = sinon.spy();
        const firstTemplateHandler = sinon.stub().returns('Template 1');
        const secondTemplateHandler = sinon.stub().returns('Template 2');

        const dropDownButton = new DropDownButton('#dropDownButton', {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            dropDownContentTemplate: firstTemplateHandler,
            deferRendering: true
        });

        dropDownButton.on('contentReady', contentReadyHandler);
        dropDownButton.open();
        assert.strictEqual(contentReadyHandler.callCount, 1, 'event is fired');

        dropDownButton.option('dropDownContentTemplate', secondTemplateHandler);
        assert.strictEqual(contentReadyHandler.callCount, 2, 'event is fired after template change');
    });

    QUnit.test('onSelectionChanged event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            selectedItemKey: 2,
            onSelectionChanged: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 4, 'event has 4 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.previousItem, 2, 'previousItem is correct');
        assert.strictEqual(e.item, 1, 'item is correct');
    });

    QUnit.test('onSelectionChanged event with data expressions', function(assert) {
        const handler = sinon.spy();
        const items = [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }];
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: items,
            keyExpr: 'id',
            displayExpr: 'text',
            selectedItemKey: 2,
            onSelectionChanged: handler
        });

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);

        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.strictEqual(handler.callCount, 1, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 4, 'event has 4 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.deepEqual(e.previousItem, items[1], 'previousItem is correct');
        assert.deepEqual(e.item, items[0], 'item is correct');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        this.$element = $('#dropDownButton');
        this.dropDownButton = new DropDownButton(this.$element, {
            focusStateEnabled: true,
            splitButton: true,
            deferRendering: false,
            items: [
                { name: 'Item 1', id: 1 },
                { name: 'Item 2', id: 2 },
                { name: 'Item 3', id: 3 }
            ],
            displayExpr: 'name',
            keyExpr: 'id'
        });
        this.$actionButton = getActionButton(this.dropDownButton);
        this.$toggleButton = getToggleButton(this.dropDownButton);
        this.keyboard = keyboardMock(getButtonGroup(this.dropDownButton).element());
        this.keyboard.press('right'); // TODO: Remove after T730639 fix
    }
}, () => {
    QUnit.test('focusStateEnabled option should be transfered to list and buttonGroup', function(assert) {
        assert.ok(getList(this.dropDownButton).option('focusStateEnabled'), 'list got option on init');
        assert.ok(getButtonGroup(this.dropDownButton).option('focusStateEnabled'), 'buttonGroup got option on init');

        this.dropDownButton.option('focusStateEnabled', false);
        assert.notOk(getList(this.dropDownButton).option('focusStateEnabled'), 'list got option on change');
        assert.notOk(getButtonGroup(this.dropDownButton).option('focusStateEnabled'), 'buttonGroup got option on change');
    });

    QUnit.testInActiveWindow('arrow right and left should select a button', function(assert) {
        this.keyboard.press('right');
        assert.ok(this.$toggleButton.hasClass('dx-state-focused'), 'toggle button is focused');
        assert.notOk(this.$actionButton.hasClass('dx-state-focused'), 'action button lose focus');

        this.keyboard.press('left');
        assert.notOk(this.$toggleButton.hasClass('dx-state-focused'), 'action button lose');
        assert.ok(this.$actionButton.hasClass('dx-state-focused'), 'toggle button is focused');
    });

    QUnit.testInActiveWindow('action button should be clicked on enter or space', function(assert) {
        const handler = sinon.spy();
        this.dropDownButton.option('onButtonClick', handler);

        this.keyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'action button pressed');

        this.keyboard.press('space');
        assert.strictEqual(handler.callCount, 2, 'action button pressed twice');
    });

    QUnit.testInActiveWindow('enter/space press should raise itemClick event when list item is focused', function(assert) {
        const handler = sinon.spy();
        this.dropDownButton.option('onItemClick', handler);

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());

        listKeyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'itemClick has been raised');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(handler.callCount, 2, 'itemClick has been raised');
    });

    QUnit.testInActiveWindow('enter/space press should raise itemClick event when list item is focused - subscription by "on" method', function(assert) {
        const handler = sinon.spy();

        this.dropDownButton.on('itemClick', handler);

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());

        listKeyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'itemClick has been raised');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(handler.callCount, 2, 'itemClick has been raised');
    });

    QUnit.test('enter/space press should raise selectionChanged event when list item is focused', function(assert) {
        const handler = sinon.spy();

        this.dropDownButton.option('onSelectionChanged', handler);

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());

        listKeyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'selectionChanged is raised');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(handler.callCount, 2, 'selectionChanged has been raised');
    });

    QUnit.test('enter/space press should change selectedItem option when list item is focused', function(assert) {
        const items = this.dropDownButton.option('items');

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());

        listKeyboard.press('enter');

        assert.strictEqual(this.dropDownButton.option('selectedItem'), items[0], 'selectedItem is correct');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(this.dropDownButton.option('selectedItem'), items[1], 'selectedItem is correct');
    });

    QUnit.test('enter/space press should raise selectionChanged event when list item is focused - subscription using "on" method', function(assert) {
        const handler = sinon.spy();

        this.dropDownButton.on('selectionChanged', handler);

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());

        listKeyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'onSelectionChanged is raised');

        listKeyboard
            .press('down')
            .press('space');
        assert.strictEqual(handler.callCount, 2, 'selectionChanged has been raised');
    });

    QUnit.testInActiveWindow('enter/space press should rise buttonClick event when action button is focused - subscription using "on" method', function(assert) {
        const handler = sinon.spy();
        this.dropDownButton.on('buttonClick', handler);

        this.keyboard.press('enter');
        assert.strictEqual(handler.callCount, 1, 'buttonClick event has been raised after enter press');

        this.keyboard.press('space');
        assert.strictEqual(handler.callCount, 2, 'buttonClick event has been raised after space press');
    });

    QUnit.testInActiveWindow('toggle button should be clicked on enter or space', function(assert) {
        this.keyboard.press('right').press('enter');

        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'popup is opened');
        assert.ok(this.$toggleButton.hasClass('dx-state-focused'), 'toggle button is focused');

        this.keyboard.press('space');
        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
        assert.ok(this.$toggleButton.hasClass('dx-state-focused'), 'toggle button is focused');
    });

    QUnit.testInActiveWindow('list should get first focused item when down arrow pressed after opening', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const $firstItem = getList(this.dropDownButton).itemElements().first();

        assert.ok($firstItem.hasClass('dx-state-focused'), 'first list item is focused');
    });

    QUnit.testInActiveWindow('list should get first focused item when up arrow pressed after opening', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('up');

        const $firstItem = getList(this.dropDownButton).itemElements().first();

        assert.ok($firstItem.hasClass('dx-state-focused'), 'first list item is focused');
    });

    QUnit.testInActiveWindow('esc on list should close the popup', function(assert) {
        if(browser.msie && parseInt(browser.version) <= 11) {
            assert.ok(true, 'test is ignored in IE11 because it failes on farm');
            return;
        }

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());
        listKeyboard.press('esc');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');

        // TODO: it is better to focus toggle button when splitButtons is true but it is a complex fix
        assert.ok(this.$actionButton.hasClass('dx-state-focused'), 'action button is focused');
    });

    QUnit.testInActiveWindow('esc on button group should close the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('enter')
            .press('esc');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
        assert.ok(this.$toggleButton.hasClass('dx-state-focused'), 'toggle button is focused');
    });

    QUnit.testInActiveWindow('left on list should close the popup', function(assert) {
        if(browser.msie && parseInt(browser.version) <= 11) {
            assert.ok(true, 'test is ignored in IE11 because it failes on farm');
            return;
        }

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());
        listKeyboard.press('left');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');

        // TODO: it is better to focus toggle button when splitButtons is true but it is a complex fix
        assert.ok(this.$actionButton.hasClass('dx-state-focused'), 'action button is focused');
    });

    QUnit.testInActiveWindow('right on list should close the popup', function(assert) {
        if(browser.msie && parseInt(browser.version) <= 11) {
            assert.ok(true, 'test is ignored in IE11 because it failes on farm');
            return;
        }

        this.keyboard
            .press('right')
            .press('enter')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());
        listKeyboard.press('right');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');

        // TODO: it is better to focus toggle button when splitButtons is true but it is a complex fix
        assert.ok(this.$actionButton.hasClass('dx-state-focused'), 'action button is focused');
    });

    QUnit.testInActiveWindow('down arrow on toggle button should open the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('down');

        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'popup is opened');
    });

    QUnit.testInActiveWindow('selection of the item should return focus to the button group', function(assert) {
        if(browser.msie && parseInt(browser.version) <= 11) {
            assert.ok(true, 'test is ignored in IE11 because it failes on farm');
            return;
        }

        this.keyboard
            .press('right')
            .press('down')
            .press('down');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());
        listKeyboard.press('enter');

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
        assert.ok(this.$toggleButton.hasClass('dx-state-focused'), 'toggle button is focused');
    });

    QUnit.testInActiveWindow('tab on button should close the popup', function(assert) {
        this.keyboard
            .press('right')
            .press('down');

        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'popup is opened');

        this.keyboard.press('tab');
        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
    });

    QUnit.testInActiveWindow('tab on list should close the popup', function(assert) {
        if(browser.msie && parseInt(browser.version) <= 11) {
            assert.ok(true, 'test is ignored in IE11 because it failes on farm');
            return;
        }

        this.keyboard
            .press('right')
            .press('down')
            .press('down');

        assert.ok(this.dropDownButton.option('dropDownOptions.visible'), 'popup is opened');

        const listKeyboard = keyboardMock(getList(this.dropDownButton).element());
        const event = listKeyboard.press('tab').event;

        assert.notOk(this.dropDownButton.option('dropDownOptions.visible'), 'popup is closed');
        assert.ok(getButtonGroup(this.dropDownButton).$element().hasClass('dx-state-focused'), 'button group was focused');
        assert.strictEqual(event.isDefaultPrevented(), false, 'event was not prevented and native focus move next');
    });
});

QUnit.module('custom content template', {}, () => {
    QUnit.test('dropDownContentTemplate option can be used', function(assert) {
        const templateHandler = sinon.stub().returns('Template 1');
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            dropDownContentTemplate: templateHandler,
            deferRendering: false
        });

        const popupContent = getPopup(dropDownButton).content();
        assert.strictEqual(templateHandler.callCount, 1, 'templateHandler was called');
        assert.deepEqual(templateHandler.getCall(0).args[0], [1, 2, 3], 'data is correct');
        assert.strictEqual(templateHandler.getCall(0).args[1], popupContent, 'container is correct');
        assert.strictEqual($(popupContent).text(), 'Template 1', 'template was rendered');

        const templateHandler2 = sinon.stub().returns('Template 2');
        dropDownButton.option('dropDownContentTemplate', templateHandler2);
        assert.strictEqual(templateHandler.callCount, 1, 'templateHandler was called');
        assert.strictEqual($(popupContent).text(), 'Template 2', 'template was rendered');
    });

    QUnit.test('datasource should be passed to contentTemplae when items are not specified', function(assert) {
        const templateHandler = sinon.stub().returns('Template 1');
        const dropDownButton = new DropDownButton('#dropDownButton', {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            dropDownContentTemplate: templateHandler,
            deferRendering: false
        });

        assert.deepEqual(templateHandler.getCall(0).args[0], dropDownButton.getDataSource(), 'data is correct');
    });

    QUnit.test('itemTemplate option', function(assert) {
        const items = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' }
        ];

        const dropDownButton = new DropDownButton('#dropDownButton', {
            items,
            deferRendering: false,
            itemTemplate: function(itemData) {
                return $('<div>')
                    .text(`${ itemData.id }: ${ itemData.name }`);
            }
        });

        const $listItems = getList(dropDownButton).itemElements();
        assert.strictEqual($listItems.eq(0).text(), '1: A', 'itemTemlate has changed item text');
    });
});
