import $ from 'jquery';
import DropDownButton from 'ui/drop_down_button';
import typeUtils from 'core/utils/type';
import eventsEngine from 'events/core/events_engine';
import keyboardMock from '../../helpers/keyboardMock.js';
import browser from 'core/utils/browser';

import 'common.css!';
import 'generic_light.css!';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const DROP_DOWN_BUTTON_CONTENT = 'dx-dropdownbutton-content';
const DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS = 'dx-dropdownbutton-popup-wrapper';
const DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';
const BUTTON_GROUP_WRAPPER = 'dx-buttongroup-wrapper';
const BUTTON_TEXT = 'dx-button-text';
const LIST_GROUP_HEADER_CLASS = 'dx-list-group-header';

QUnit.testStart(() => {
    const markup =
        `<div id='container'>
            <div id='dropDownButton'></div>
            <div id='dropDownButton2'></div>
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

QUnit.module('markup', {
    beforeEach: function() {
        this.instance = new DropDownButton('#dropDownButton', {});
    }
}, () => {
    QUnit.test('element should have dropDownButton and widget class', function(assert) {
        assert.ok(this.instance.$element().hasClass(DROP_DOWN_BUTTON_CLASS), 'dropdownbutton class is ok');
        assert.ok(this.instance.$element().hasClass('dx-widget'), 'widget class is ok');
    });

    QUnit.test('popup and list should not be rendered if deferRendering is true', function(assert) {
        assert.strictEqual(getPopup(this.instance), undefined, 'popup should be lazy rendered');
        assert.strictEqual(getList(this.instance), undefined, 'list should be lazy rendered');
    });

    QUnit.test('popup and list should be rendered on init when deferRendering is false', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', { deferRendering: false });
        const popup = getPopup(dropDownButton);

        assert.strictEqual(popup.NAME, 'dxPopup', 'popup has been rendered');
        assert.strictEqual(getList(dropDownButton).NAME, 'dxList', 'list has been rendered');
        assert.ok(popup.option('closeOnOutsideClick'), 'popup should be closed on outside click');
    });

    QUnit.test('it should be possible to render the widget without a text', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            deferRendering: false,
            items: [{ icon: 'box' }, { icon: 'user' }],
            keyExpr: 'icon',
            displayExpr: '',
            selectedItemKey: 'user'
        });

        const $actionButtonText = getActionButton(dropDownButton).text();
        const $listItemText = getList(dropDownButton).itemElements().eq(0).text();

        assert.strictEqual($actionButtonText, '', 'action button text is empty');
        assert.strictEqual($listItemText, '', 'item text is empty');
    });

    QUnit.test('Widget should have no text after selectedItemKey is changed to null', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [{ id: 1, text: 'Test' }],
            keyExpr: 'id',
            displayExpr: 'text',
            selectedItemKey: 1,
            useSelectMode: true
        });

        let $actionButtonText = getActionButton(dropDownButton).text();
        assert.strictEqual($actionButtonText, 'Test', 'action button text is not empty');

        dropDownButton.option('selectedItemKey', null);
        $actionButtonText = getActionButton(dropDownButton).text();
        assert.strictEqual($actionButtonText, '', 'action button text is empty');
    });

    QUnit.test('Widget should have no text after Items is changed to empty array', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [{ id: 1, text: 'Test' }],
            keyExpr: 'id',
            displayExpr: 'text',
            selectedItemKey: 1,
            useSelectMode: true
        });

        let $actionButtonText = getActionButton(dropDownButton).text();
        assert.strictEqual($actionButtonText, 'Test', 'action button text is not empty');

        dropDownButton.option('items', []);
        $actionButtonText = getActionButton(dropDownButton).text();
        assert.strictEqual($actionButtonText, '', 'action button text is empty');
    });

    QUnit.test('width option should change dropDownButton width', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            text: 'Item 1',
            icon: 'box',
            width: 235
        });

        assert.strictEqual(dropDownButton.option('width'), 235, 'width is right');
        dropDownButton.option('width', 135);
        assert.strictEqual(dropDownButton.option('width'), 135, 'width was successfully changed');
    });

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

    QUnit.test('dropDownButton height should be equal to main button height when height depends on content', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            splitButton: true,
            icon: 'icon.png'
        });

        const actionButton = $dropDownButton.find('.dx-dropdownbutton-action');
        const toggleButton = $dropDownButton.find('.dx-dropdownbutton-toggle');

        $dropDownButton.find('img.dx-icon').css('height', '50px');
        let mainButtonHeight = actionButton.height();
        let dropDownButtonHeight = toggleButton.height();
        assert.strictEqual(dropDownButtonHeight, mainButtonHeight, 'heights are equal after main button content change');

        $dropDownButton.find('i.dx-icon').css('height', '100px');
        mainButtonHeight = actionButton.height();
        dropDownButtonHeight = toggleButton.height();
        assert.strictEqual(mainButtonHeight, dropDownButtonHeight, 'heights are equal after toggle button content change');
    });

    QUnit.test('stylingMode option should be transfered to buttonGroup', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            text: 'Item 1',
            icon: 'box',
            stylingMode: 'text'
        });

        assert.strictEqual(getButtonGroup(dropDownButton).option('stylingMode'), 'text', 'stylingMode was successfully transfered');

        dropDownButton.option('stylingMode', 'outlined');
        assert.strictEqual(getButtonGroup(dropDownButton).option('stylingMode'), 'outlined', 'stylingMode was successfully changed');
    });
});

QUnit.module('button group integration', {}, () => {
    QUnit.test('element should have buttonGroup inside', function(assert) {
        const instance = new DropDownButton('#dropDownButton', { selectionMode: true, splitButton: true });
        const buttonGroup = getButtonGroup(instance);
        assert.strictEqual(buttonGroup.NAME, 'dxButtonGroup', 'buttonGroup rendered');
        assert.strictEqual(buttonGroup.option('selectionMode'), 'none', 'selection should be disabled');
        assert.strictEqual(buttonGroup.option('stylingMode'), 'outlined', 'styling mode should be outlined');

        const buttonGroupItems = buttonGroup.option('items');
        assert.strictEqual(buttonGroupItems.length, 2, '2 buttons are rendered');
        assert.strictEqual(buttonGroupItems[0].icon, undefined, 'empty icon is correct');
        assert.strictEqual(buttonGroupItems[1].icon, 'spindown', 'dropdown icon is correct');
    });

    QUnit.test('hoverStateEnabled should be transfered to the buttonGroup', function(assert) {
        const instance = new DropDownButton('#dropDownButton', { hoverStateEnabled: false, deferRendering: false });
        const buttonGroup = getButtonGroup(instance);
        const list = getList(instance);

        assert.strictEqual(buttonGroup.option('hoverStateEnabled'), false, 'buttonGroup has correct option');
        assert.strictEqual(list.option('hoverStateEnabled'), false, 'List has correct option');

        instance.option('hoverStateEnabled', true);
        assert.strictEqual(buttonGroup.option('hoverStateEnabled'), true, 'buttonGroup has changed option');
        assert.strictEqual(list.option('hoverStateEnabled'), true, 'List has changed option');
    });

    QUnit.test('toggle button should toggle the widget', function(assert) {
        const instance = new DropDownButton('#dropDownButton', { splitButton: true });
        const $toggleButton = getToggleButton(instance);

        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.strictEqual(instance.option('dropDownOptions.visible'), true, 'the widget is opened');

        eventsEngine.trigger($toggleButton, 'dxclick');
        assert.strictEqual(instance.option('dropDownOptions.visible'), false, 'the widget is closed');
    });

    QUnit.test('action and toggle button should have special class', function(assert) {
        const instance = new DropDownButton('#dropDownButton', { splitButton: true });

        assert.ok(instance.$element().find('.dx-button').eq(0).hasClass(DROP_DOWN_BUTTON_ACTION_CLASS));
        assert.ok(instance.$element().find('.dx-button').eq(1).hasClass(DROP_DOWN_BUTTON_TOGGLE_CLASS));
    });

    QUnit.test('a user can redefine buttonGroupOptions', function(assert) {
        const instance = new DropDownButton('#dropDownButton', {
            useSelectMode: false,
            buttonGroupOptions: {
                items: [{ text: 'Test' }],
                someOption: 'Test'
            }
        });

        const buttonGroup = getButtonGroup(instance);
        assert.strictEqual(buttonGroup.option('items[0].text'), 'Test', 'text of the first item is correct');
        assert.strictEqual(buttonGroup.option('items[0].icon'), undefined, 'icon of the first item is correct');
        assert.strictEqual(buttonGroup.option('items[1]'), undefined, 'second item is not exist');

        instance.option('buttonGroupOptions.items[0]', { text: 'Test 2' });
        assert.strictEqual(buttonGroup.option('items[0].text'), 'Test 2', 'text of the first item is correct');
    });

    QUnit.test('a user can read buttonGroupOptions', function(assert) {
        const instance = new DropDownButton('#dropDownButton', {});

        assert.strictEqual(instance.option('buttonGroupOptions.stylingMode'), 'outlined', 'option is correct');
    });

    QUnit.test('text and icon options should depend on selection', function(assert) {
        const instance = new DropDownButton('#dropDownButton', {
            text: 'Item 1',
            icon: 'box',
            keyExpr: 'id',
            displayExpr: 'text',
            items: [{ id: 1, text: 'User', icon: 'user' }, { id: 2, text: 'Group', icon: 'group' }],
            selectedItemKey: 1,
            useSelectMode: true
        });

        assert.strictEqual(instance.option('text'), 'User', 'text option is correct');
        assert.strictEqual(instance.option('icon'), 'user', 'icon option is correct');

        instance.option('selectedItemKey', 2);
        assert.strictEqual(instance.option('text'), 'Group', 'text option is correct');
        assert.strictEqual(instance.option('icon'), 'group', 'icon option is correct');
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
    QUnit.test('popup should have special classes', function(assert) {
        assert.ok($(this.popup.content()).hasClass(DROP_DOWN_BUTTON_CONTENT), 'popup has a special class');
        assert.ok($(this.popup._wrapper()).hasClass(DROP_DOWN_BUTTON_POPUP_WRAPPER_CLASS), 'popup wrapper has a special class');
    });

    QUnit.test('popup content should have special class when custom template is used', function(assert) {
        const instance = new DropDownButton('#dropDownButton2', {
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
        const $popupContent = $(getPopup(instance)._$content);
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

        let popupContentElementRect = getPopup(instance)._$content.get(0).getBoundingClientRect();
        assert.strictEqual(popupContentElementRect.left, dropDownButtonElementRect.left, 'popup position is correct, rtlEnabled = false');

        instance.option('rtlEnabled', true);
        popupContentElementRect = getPopup(instance)._$content.get(0).getBoundingClientRect();
        assert.strictEqual(popupContentElementRect.right, dropDownButtonElementRect.right, 'popup position is correct, rtlEnabled = true');
    });

    QUnit.test('popup width should change if content is truncated', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            icon: 'square',
            opened: true,
            dropDownContentTemplate: function(data, $container) {
                $('<div>')
                    .addClass('custom-color-picker')
                    .css({
                        width: 82,
                        padding: 5
                    })
                    .appendTo($container);
            }
        });

        const instance = $dropDownButton.dxDropDownButton('instance');
        const $popupContent = $(getPopup(instance).content());

        assert.equal($popupContent.outerWidth(), 84, 'width is right');
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
                at: 'bottom left',
                offset: {
                    y: -1
                }
            }
        };

        for(const name in options) {
            assert.deepEqual(this.popup.option(name), options[name], 'option ' + name + ' is correct');
        }
    });

    QUnit.test('popup width should be recalculated when button dimension changed', function(assert) {
        const instance = new DropDownButton('#dropDownButton2', {
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

    QUnit.test('a user can redefine dropdown options', function(assert) {
        const instance = new DropDownButton('#dropDownButton2', {
            deferRendering: false,
            dropDownOptions: {
                visible: true,
                someOption: 'Test'
            }
        });

        const popup = getPopup(instance);
        assert.strictEqual(popup.option('visible'), true, 'set an option');

        instance.option('dropDownOptions', {
            customOption: 'Test 2'
        });
        assert.strictEqual(popup.option('customOption'), 'Test 2', 'custom option is correct');
        assert.strictEqual(popup.option('visible'), true, 'visible was not rewrited');

        instance.repaint();
        assert.strictEqual(getPopup(instance).option('visible'), true, 'options have been stored after the repaint');
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
        const otherButton = new DropDownButton('#dropDownButton2', {
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

    QUnit.test('deferRendering option change', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: ['Item 1']
        });

        const list = getList(dropDownButton);
        assert.strictEqual(list, undefined, 'list has not been rendered');

        dropDownButton.option('deferRendering', false);
        const $listItems = getList(dropDownButton).itemElements();
        assert.strictEqual($listItems.eq(0).text(), 'Item 1', 'list has been rendered');
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

        let list = getList(dropDownButton);

        assert.strictEqual(list.option('grouped'), true, 'grouped option transfered');
        assert.strictEqual(list.option('noDataText'), 'No data', 'noDataText option transfered');
        assert.strictEqual(list.option('selectionMode'), 'none', 'selectionMode is none for useSelectMode: false');

        dropDownButton.option({
            grouped: false,
            noDataText: 'nothing',
            useSelectMode: true
        });

        list = getList(dropDownButton);

        assert.strictEqual(list.option('grouped'), false, 'grouped option transfered');
        assert.strictEqual(list.option('noDataText'), 'nothing', 'noDataText option transfered');
        assert.strictEqual(list.option('selectionMode'), 'single', 'selectionMode is single for useSelectMode: true');
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

        dropDownButton.option('wrapItemText', false);
        assert.notOk($itemContainer.hasClass('dx-wrap-item-text'), 'class was removed');
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

    [true, false].forEach(wrapItemText => {
        QUnit.test(`toggleButton should render inside of dropDownButton when width option is defined in generic themes when wrapItemText=${wrapItemText} (T847072)`, function(assert) {
            const dropDownButton = $('#dropDownButton').dxDropDownButton({
                items: [{
                    'id': 1,
                    'name': 'VeryVeryVeryVeryLongString',
                    'icon': 'alignright'
                }],
                displayExpr: 'name',
                keyExpr: 'id',
                stylingMode: 'text',
                useSelectMode: true,
                width: 120,
                splitButton: true,
                selectedItemKey: 1,
                wrapItemText
            }).dxDropDownButton('instance');

            const dropDownButtonElement = dropDownButton.$element().get(0);
            const toggleButtonElement = getToggleButton(dropDownButton).get(0);

            const dropDownButtonRightPosition = dropDownButtonElement.getBoundingClientRect(0).right;
            const toggleButtonRightPosition = toggleButtonElement.getBoundingClientRect(0).right;

            assert.strictEqual(dropDownButtonRightPosition, toggleButtonRightPosition, 'toggleButton position is correct');
        });
    });

    QUnit.test('dropDownButton content should be centered vertically (T847072)', function(assert) {
        if(browser.msie && browser.version <= 11) {
            assert.ok(true, 'IE has some problems with getBoundingClientRect');
            return;
        }

        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            items: [{
                'id': 1,
                'name': 'VeryVeryVeryVeryLongString',
                'icon': 'alignright'
            }],
            displayExpr: 'name',
            keyExpr: 'id',
            useSelectMode: true,
            width: 100,
            height: 100,
            splitButton: true,
            selectedItemKey: 1
        });

        const $buttonText = $dropDownButton.find(`.${BUTTON_TEXT}`);
        const dropDownButtonRect = $dropDownButton.get(0).getBoundingClientRect();
        const buttonTextRect = $buttonText.get(0).getBoundingClientRect();

        const dropDownButtonVerticalCenter = (dropDownButtonRect.top + dropDownButtonRect.bottom) / 2;
        const buttonTextVerticalCenter = (buttonTextRect.top + buttonTextRect.bottom) / 2;

        assert.roughEqual(buttonTextVerticalCenter, dropDownButtonVerticalCenter, 2, 'content is vertically centered');
    });

    QUnit.test('toggleButton should have static width (T847072)', function(assert) {
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            items: [{
                'id': 1,
                'name': 'I',
                'icon': 'alignright'
            }],
            displayExpr: 'name',
            keyExpr: 'id',
            useSelectMode: true,
            width: 100,
            splitButton: true,
            selectedItemKey: 1
        }).dxDropDownButton('instance');

        const toggleButtonElement = getToggleButton(dropDownButton);

        assert.strictEqual(toggleButtonElement.outerWidth(), 20, 'toggleButton has correct width in generic theme');
    });

    QUnit.test('toggle/action buttons should have correct height when height option is not defined (T847072)', function(assert) {
        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            items: [{
                'id': 1,
                'name': 'I',
                'icon': 'alignright'
            }],
            displayExpr: 'name',
            keyExpr: 'id',
            useSelectMode: true,
            width: 100,
            splitButton: true,
            selectedItemKey: 1
        }).dxDropDownButton('instance');

        const toggleButtonElement = getToggleButton(dropDownButton);
        const actionButtonElement = getActionButton(dropDownButton);

        assert.strictEqual(toggleButtonElement.outerHeight(), 36, 'toggleButton has correct height in generic theme');
        assert.strictEqual(actionButtonElement.outerHeight(), 36, 'actionButton has correct height in generic theme');
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
    QUnit.test('custom button is rendered', function(assert) {
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Download DevExtreme Trial', 'text is correct on init');
        assert.ok(getActionButton(this.dropDownButton).find('.dx-icon').hasClass('dx-icon-group'), 'icon is correct on init');

        this.dropDownButton.option({
            text: 'New text',
            icon: 'box'
        });

        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'New text', 'text is correct on change');
        assert.ok(getActionButton(this.dropDownButton).find('.dx-icon').hasClass('dx-icon-box'), 'icon is correct on change');
    });

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

    QUnit.test('spindown secondary icon should be rendered when splitButton is false', function(assert) {
        this.dropDownButton.option('splitButton', false);

        const $icons = getActionButton(this.dropDownButton).find('.dx-icon');
        assert.strictEqual($icons.length, 2, '2 icons are rendered');
        assert.ok($icons.eq(0).hasClass('dx-icon-group'), 'first icon is correct');
        assert.ok($icons.eq(1).hasClass('dx-icon-spindown'), 'second icon is correct');
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

    QUnit.test('spindown secondary icon should not be rendered when showArrowIcon is false', function(assert) {
        this.dropDownButton.option({
            splitButton: false,
            showArrowIcon: false
        });

        let $icons = getActionButton(this.dropDownButton).find('.dx-icon');
        assert.strictEqual($icons.length, 1, '1 icon is rendered');
        assert.ok($icons.eq(0).hasClass('dx-icon-group'), 'first icon is correct');

        this.dropDownButton.option('showArrowIcon', true);
        $icons = getActionButton(this.dropDownButton).find('.dx-icon');
        assert.strictEqual($icons.length, 2, '2 icons are rendered');
        assert.ok($icons.eq(0).hasClass('dx-icon-group'), 'first icon is correct');
        assert.ok($icons.eq(1).hasClass('dx-icon-spindown'), 'second icon is correct');
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
        this.dropDownButton.option('dropDownOptions.visible', true);
        const popup = getPopup(this.dropDownButton);
        assert.strictEqual(popup.option('visible'), true, 'popup is opened');

        const closePromise = this.dropDownButton.close();
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');
        assert.ok(typeUtils.isPromise(closePromise), 'close should return promise');
    });

    QUnit.test('opened option', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            opened: true
        });

        assert.ok(getPopup(dropDownButton).option('visible'), 'popup is opened');

        dropDownButton.option('opened', false);
        assert.notOk(getPopup(dropDownButton).option('visible'), 'popup is closed');
    });

    QUnit.test('optionChange should be called when popup opens manually', function(assert) {
        const optionChangedHandler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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

QUnit.module('data expressions', {
    beforeEach: function() {
        this.dropDownButton = new DropDownButton('#dropDownButton', {
            items: [
                { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' },
                { id: 2, file: 'all.exe', name: 'Trial for all platforms', icon: 'user' }
            ],
            keyExpr: 'id',
            useSelectMode: true,
            deferRendering: false
        });
    }
}, () => {
    QUnit.test('displayExpr is required when items are objects', function(assert) {
        this.dropDownButton.option('displayExpr', undefined);
        this.dropDownButton.option('selectedItemKey', 1);

        assert.strictEqual(getActionButton(this.dropDownButton).text(), '');
    });

    QUnit.test('displayExpr as function should work', function(assert) {
        this.dropDownButton.option('displayExpr', (itemData) => {
            return (itemData && itemData.name + '!') || '';
        });

        this.dropDownButton.option('selectedItemKey', 2);
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Trial for all platforms!', 'displayExpr works');
    });

    QUnit.test('null value should be displayed as an empty string', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: null
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '', 'value is correct');
    });

    QUnit.test('undefined value should be displayed as an empty string', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: undefined
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '', 'value is correct');
    });

    QUnit.test('primitive items can be used without data expressions', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: 'Item 1'
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), 'Item 1', 'value is correct');
    });

    QUnit.test('numbers can be used without data expressions', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [0, 1, 2],
            useSelectMode: true,
            selectedItemKey: 0
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '0', 'value is correct');
    });

    QUnit.test('booleans can be used without data expressions', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [true, false],
            useSelectMode: true,
            selectedItemKey: false
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), 'false', 'value is correct');
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
    QUnit.test('items option runtime change', function(assert) {
        this.dropDownButton.option({
            items: [{
                id: 10, name: 'changed'
            }],
            deferRendering: false
        });

        const $firstItem = getList(this.dropDownButton).itemElements().eq(0);

        assert.strictEqual($firstItem.text(), 'changed', 'items has been changed');
    });

    QUnit.test('changing of items should load new selected item', function(assert) {
        this.dropDownButton.option({
            selectedItemKey: 2
        });

        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Trial for all platforms', 'item was selected');

        this.dropDownButton.option('items', [{ id: 2, name: 'Item 2' }]);
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Item 2', 'changed item has been loaded by id');
    });

    QUnit.test('changing of dataSource should load new selected item', function(assert) {
        this.dropDownButton.option({
            selectedItemKey: 2
        });

        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Trial for all platforms', 'item was selected');

        this.dropDownButton.option('dataSource', [{ id: 2, name: 'Item 2' }]);
        assert.strictEqual(getActionButton(this.dropDownButton).text(), 'Item 2', 'changed item has been loaded by id');
    });

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
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            deferRendering: false,
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'text',
            items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }]
        });
        dropDownButton.option('selectedItemKey', 2);
        this.clock.tick();
        assert.strictEqual(getActionButton(dropDownButton).text(), 'Item 2', 'action button has been changed');
        assert.strictEqual(getList(dropDownButton).option('selectedItemKeys')[0], 2, 'selectedItemKeys is correct');
    });
});

QUnit.module('events', {}, () => {
    QUnit.test('onItemClick event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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

    QUnit.test('onItemClick event change', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [1, 2, 3]
        });

        dropDownButton.open();
        dropDownButton.option('onItemClick', handler);

        const $item = getList(dropDownButton).itemElements().eq(0);
        eventsEngine.trigger($item, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('keyExpr option change', function(assert) {
        const items = [{
            name: 'A', id: 1
        }, {
            name: 'B', id: 2
        }];

        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items,
            keyExpr: 'name',
            selectedItemKey: 'B',
            useSelectMode: true,
            displayExpr: 'name'
        });

        assert.strictEqual(dropDownButton.option('text'), 'B', 'value is correct');

        dropDownButton.option('keyExpr', 'id');
        dropDownButton.option('selectedItemKey', 'A');
        assert.strictEqual(dropDownButton.option('text'), '', 'text is empty because keyExpt has been changed');

        dropDownButton.option('selectedItemKey', 1);
        assert.strictEqual(dropDownButton.option('text'), 'A', 'value is correct');
    });

    QUnit.test('focusStateEnabled option change', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2');

        dropDownButton.option('focusStateEnabled', false);

        assert.strictEqual(dropDownButton.$element().attr('tabindex'), undefined, 'element is not focusable');
    });

    QUnit.test('itemClick event change - subscription by "on" method', function(assert) {
        const handler = sinon.spy();

        const dropDownButton = new DropDownButton('#dropDownButton2', {
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
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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

    QUnit.test('onButtonClick should be called even if splitButton is false', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [1, 2, 3],
            splitButton: false
        });

        dropDownButton.on('buttonClick', handler);

        const $actionButton = getActionButton(dropDownButton);
        eventsEngine.trigger($actionButton, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('onButtonClick event change', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2
        });

        dropDownButton.option('onButtonClick', handler);
        const $actionButton = getActionButton(dropDownButton);

        eventsEngine.trigger($actionButton, 'dxclick');

        assert.strictEqual(handler.callCount, 1, 'handler was called');
    });

    QUnit.test('selectedItemKey option change should raise selectionChanged event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2,
            onSelectionChanged: handler
        });

        dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(handler.callCount, 1, 'selectionChanged has been raised');
    });

    QUnit.test('selectedItemKey option change should raise selectionChanged event - subscription using "on" method', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2
        });

        dropDownButton.on('selectionChanged', handler);
        dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(handler.callCount, 1, 'selectionChanged has been raised');
    });

    QUnit.test('selectedItemKey option change should change selectedItem option', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2
        });

        dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(dropDownButton.option('selectedItem'), 3, 'selectedItem is correct');
    });

    QUnit.test('onContentReady should be fired after widget rendering and take into account Popup rendering', function(assert) {
        const contentReadyHandler = sinon.spy();

        const dropDownButton = new DropDownButton('#dropDownButton2', {
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

    QUnit.test('onContentReady should be fired after widget rendering', function(assert) {
        const contentReadyHandler = sinon.spy();

        const dropDownButton = new DropDownButton('#dropDownButton2', {
            dataSource: {
                load: sinon.stub().returns([1, 2, 3]),
                byKey: sinon.stub().returns(1)
            },
            opened: true,
            deferRendering: false,
            onContentReady: contentReadyHandler
        });

        assert.strictEqual(contentReadyHandler.callCount, 2, 'Popup is ready, then List is ready');

        dropDownButton.option('dataSource', ['first', 'second', 'third']);
        assert.strictEqual(contentReadyHandler.callCount, 3, 'List is ready after updating Popup content');
    });

    QUnit.test('onContentReady should be fired after widget rendering when subscription uses "on" method', function(assert) {
        const contentReadyHandler = sinon.spy();

        const dropDownButton = new DropDownButton('#dropDownButton2', {
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

        const dropDownButton = new DropDownButton('#dropDownButton2', {
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

        const dropDownButton = new DropDownButton('#dropDownButton2', {
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
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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

    QUnit.test('onSelectionChanged option runtime change', function(assert) {
        const firstHandler = sinon.spy();
        const secondHandler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items: [1, 2, 3],
            selectedItemKey: 2,
            onSelectionChanged: firstHandler
        });

        dropDownButton.open();

        const $firstItem = getList(dropDownButton).itemElements().eq(0);
        eventsEngine.trigger($firstItem, 'dxclick');
        assert.strictEqual(firstHandler.callCount, 1, 'first handler was called');

        dropDownButton.option('onSelectionChanged', secondHandler);

        const $secondItem = getList(dropDownButton).itemElements().eq(1);
        eventsEngine.trigger($secondItem, 'dxclick');
        assert.strictEqual(secondHandler.callCount, 1, 'second handler was called');
    });

    QUnit.test('onSelectionChanged event with data expressions', function(assert) {
        const handler = sinon.spy();
        const items = [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }];
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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
        const dropDownButton = new DropDownButton('#dropDownButton2', {
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

        const dropDownButton = new DropDownButton('#dropDownButton2', {
            items,
            deferRendering: false,
            itemTemplate: function(itemData) {
                return $('<div>')
                    .text(`${ itemData.id }: ${ itemData.name }`);
            }
        });

        let $listItems = getList(dropDownButton).itemElements();
        assert.strictEqual($listItems.eq(0).text(), '1: A', 'itemTemlate has changed item text');

        dropDownButton.option('itemTemplate', function(itemData) {
            return $('<div>')
                .text(`#${ itemData.id }`);
        });
        $listItems = getList(dropDownButton).itemElements();
        assert.strictEqual($listItems.eq(0).text(), '#1', 'itemTemlate has changed item text after option change');
    });
});
