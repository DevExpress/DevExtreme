import { getHeight, getOuterWidth, getWidth } from 'core/utils/size';
import $ from 'jquery';
import DropDownButton from 'ui/drop_down_button';
import windowUtils from 'core/utils/window';
import eventsEngine from 'common/core/events/core/events_engine';

import 'generic_light.css!';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';
const DROP_DOWN_BUTTON_HAS_ARROW_CLASS = 'dx-dropdownbutton-has-arrow';

QUnit.testStart(() => {
    const markup =
        `<div id='container'>
            <div id='dropDownButton'></div>
        </div>`;
    $('#qunit-fixture').html(markup);
});

const getButtonGroup = (instance) => {
    return instance._buttonGroup;
};

const getPopup = (instance) => {
    return instance._popup;
};

const getList = (instance) => {
    return instance._list;
};

const getActionButton = (instance) => {
    return instance.$element().find(`.${DROP_DOWN_BUTTON_ACTION_CLASS}`);
};

const getToggleButton = (instance) => {
    return instance.$element().find(`.${DROP_DOWN_BUTTON_TOGGLE_CLASS}`);
};

QUnit.module('common markup', {
    beforeEach: function() {
        this.instance = new DropDownButton($('#dropDownButton'), {});
    }
}, () => {
    QUnit.test('element should have dropDownButton and widget class', function(assert) {
        assert.ok(this.instance.$element().hasClass(DROP_DOWN_BUTTON_CLASS), 'dropdownbutton class is ok');
        assert.ok(this.instance.$element().hasClass('dx-widget'), 'widget class is ok');
    });

    QUnit.test('it should be possible to render the widget button without a text', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            items: [{ icon: 'box' }, { icon: 'user' }],
            keyExpr: 'icon',
            displayExpr: '',
            selectedItemKey: 'user'
        });

        const $actionButtonText = getActionButton(dropDownButton).text();

        assert.strictEqual($actionButtonText, '', 'action button text is empty');
    });

    QUnit.test('Widget should have no text after selectedItemKey is changed to null', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
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
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
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
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            text: 'Item 1',
            icon: 'box',
            width: 235
        });

        assert.strictEqual(dropDownButton.option('width'), 235, 'width is right');
        dropDownButton.option('width', 135);
        assert.strictEqual(dropDownButton.option('width'), 135, 'width was successfully changed');
    });

    QUnit.test('dropDownButton height should be equal to main button height when height depends on content', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            splitButton: true,
            icon: 'icon.png'
        });

        const actionButton = $dropDownButton.find('.dx-dropdownbutton-action');
        const toggleButton = $dropDownButton.find('.dx-dropdownbutton-toggle');

        $dropDownButton.find('img.dx-icon').css('height', '50px');
        let mainButtonHeight = getHeight(actionButton);
        let dropDownButtonHeight = getHeight(toggleButton);
        assert.strictEqual(dropDownButtonHeight, mainButtonHeight, 'heights are equal after main button content change');

        $dropDownButton.find('i.dx-icon').css('height', '100px');
        mainButtonHeight = getHeight(actionButton);
        dropDownButtonHeight = getHeight(toggleButton);
        assert.strictEqual(mainButtonHeight, dropDownButtonHeight, 'heights are equal after toggle button content change');
    });

    QUnit.test('stylingMode option should be transfered to buttonGroup', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            text: 'Item 1',
            icon: 'box',
            stylingMode: 'text'
        });

        assert.strictEqual(getButtonGroup(dropDownButton).option('stylingMode'), 'text', 'stylingMode was successfully transfered');

        dropDownButton.option('stylingMode', 'outlined');
        assert.strictEqual(getButtonGroup(dropDownButton).option('stylingMode'), 'outlined', 'stylingMode was successfully changed');
    });

    QUnit.test('widget should have specific class if it has an arrow part (T888866)', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            text: 'Item 1',
            icon: 'box',
            stylingMode: 'text'
        });

        const $dropDownButton = dropDownButton.$element();

        assert.ok($dropDownButton.hasClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS));
    });

    QUnit.test('widget should have specific class if it has no arrow part', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            text: 'Item 1',
            icon: 'box',
            stylingMode: 'text',
            showArrowIcon: false
        });

        const $dropDownButton = dropDownButton.$element();

        assert.notOk($dropDownButton.hasClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS));
    });

    QUnit.test('widget should have specific class if splitButton is true', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            text: 'Item 1',
            icon: 'box',
            stylingMode: 'text',
            showArrowIcon: false,
            splitButton: true
        });

        const $dropDownButton = dropDownButton.$element();

        assert.ok($dropDownButton.hasClass(DROP_DOWN_BUTTON_HAS_ARROW_CLASS));
    });
});

QUnit.module('button group integration', {}, () => {
    QUnit.test('element should have buttonGroup inside', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), { selectionMode: true, splitButton: true });
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
        const instance = new DropDownButton($('#dropDownButton'), { hoverStateEnabled: false, deferRendering: false });
        const buttonGroup = getButtonGroup(instance);

        assert.strictEqual(buttonGroup.option('hoverStateEnabled'), false, 'buttonGroup has correct option');
        instance.option('hoverStateEnabled', true);
        assert.strictEqual(buttonGroup.option('hoverStateEnabled'), true, 'buttonGroup has changed option');
    });

    QUnit.test('action and toggle button should have special class', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), { splitButton: true });

        assert.ok(instance.$element().find('.dx-button').eq(0).hasClass(DROP_DOWN_BUTTON_ACTION_CLASS));
        assert.ok(instance.$element().find('.dx-button').eq(1).hasClass(DROP_DOWN_BUTTON_TOGGLE_CLASS));
    });

    QUnit.test('a user can redefine buttonGroupOptions', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), {
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
        const instance = new DropDownButton($('#dropDownButton'), {});

        assert.strictEqual(instance.option('buttonGroupOptions.stylingMode'), 'outlined', 'option is correct');
    });

    QUnit.test('text and icon options should depend on selection', function(assert) {
        const instance = new DropDownButton($('#dropDownButton'), {
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

QUnit.module('common use cases', {
    beforeEach: function() {
        this.dropDownButton = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            keyExpr: 'id',
            displayExpr: 'name',
            items: [
                { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' },
                { id: 2, file: 'all.exe', name: 'Trial for all platforms', icon: 'user' }
            ],
            text: 'Download DevExtreme Trial',
            icon: 'group'
        });
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
    });

    QUnit.test('spindown secondary icon should be rendered when splitButton is false', function(assert) {
        this.dropDownButton.option('splitButton', false);

        const $icons = getActionButton(this.dropDownButton).find('.dx-icon');
        assert.strictEqual($icons.length, 2, '2 icons are rendered');
        assert.ok($icons.eq(0).hasClass('dx-icon-group'), 'first icon is correct');
        assert.ok($icons.eq(1).hasClass('dx-icon-spindown'), 'second icon is correct');
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

QUnit.module('data expressions', {
    beforeEach: function() {
        this.createWidget = function(config = {
            items: [
                { id: 1, file: 'vs.exe', name: 'Trial for Visual Studio', icon: 'box' },
                { id: 2, file: 'all.exe', name: 'Trial for all platforms', icon: 'user' }
            ],
            keyExpr: 'id',
            useSelectMode: true,
            deferRendering: false
        }) {
            return new DropDownButton($('#dropDownButton'), config);
        };
    }
}, () => {
    QUnit.test('displayExpr is required when items are objects', function(assert) {
        const dropDownButton = this.createWidget();

        dropDownButton.option('displayExpr', undefined);
        dropDownButton.option('selectedItemKey', 1);

        assert.strictEqual(getActionButton(dropDownButton).text(), '');
    });

    QUnit.test('displayExpr as function should work', function(assert) {
        const dropDownButton = this.createWidget();

        dropDownButton.option('displayExpr', (itemData) => {
            return (itemData && itemData.name + '!') || '';
        });

        dropDownButton.option('selectedItemKey', 2);
        assert.strictEqual(getActionButton(dropDownButton).text(), 'Trial for all platforms!', 'displayExpr works');
    });

    QUnit.test('null value should be displayed as an empty string', function(assert) {
        const dropDownButton = this.createWidget({
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: null
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '', 'value is correct');
    });

    QUnit.test('undefined value should be displayed as an empty string', function(assert) {
        const dropDownButton = this.createWidget({
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: undefined
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '', 'value is correct');
    });

    QUnit.test('primitive items can be used without data expressions', function(assert) {
        const dropDownButton = this.createWidget({
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: 'Item 1'
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), 'Item 1', 'value is correct');
    });

    QUnit.test('numbers can be used without data expressions', function(assert) {
        const dropDownButton = this.createWidget({
            items: [0, 1, 2],
            useSelectMode: true,
            selectedItemKey: 0
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '0', 'value is correct');
    });

    QUnit.test('booleans can be used without data expressions', function(assert) {
        const dropDownButton = this.createWidget({
            items: [true, false],
            useSelectMode: true,
            selectedItemKey: false
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), 'false', 'value is correct');
    });

    QUnit.test('widget should use dataSource key in case the "keyExpr" option is not defined', function(assert) {
        const dropDownButton = this.createWidget({
            dataSource: {
                store: {
                    type: 'array',
                    data: [{ id: '001', text: 'test 1' }, { id: '002', text: 'test 2' }],
                    key: 'id'
                }
            },
            useSelectMode: true,
            displayExpr: 'text',
            selectedItemKey: '001'
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), 'test 1', 'value is correct');
    });
});

QUnit.module('items changing', {
    beforeEach: function() {
        this.dropDownButton = new DropDownButton($('#dropDownButton'), {
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
    QUnit.test('select an item via api', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'text',
            items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }]
        });
        dropDownButton.option('selectedItemKey', 2);
        this.clock.tick(10);
        assert.strictEqual(getActionButton(dropDownButton).text(), 'Item 2', 'action button has been changed');
    });
});

QUnit.module('option change', {}, () => {
    QUnit.test('keyExpr option change', function(assert) {
        const items = [{
            name: 'A', id: 1
        }, {
            name: 'B', id: 2
        }];

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items,
            opened: true,
            keyExpr: 'name',
            selectedItemKey: 'B',
            useSelectMode: true,
            displayExpr: 'name'
        });

        dropDownButton.option('keyExpr', 'id');

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const listItems = getList(dropDownButton).itemElements();
        eventsEngine.trigger(listItems.eq(0), 'dxclick');
        assert.strictEqual(dropDownButton.option('text'), 'A', 'value is correct');
        assert.deepEqual(getList(dropDownButton).option('selectedItemKeys'), [1], 'value is correct');
    });

    QUnit.test('displayExpr option change', function(assert) {
        const items = [{
            name: 'A', id: 1
        }, {
            name: 'B', id: 2
        }];

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items,
            opened: true,
            keyExpr: 'name',
            selectedItemKey: 'B',
            useSelectMode: true,
            displayExpr: 'name'
        });

        dropDownButton.option('displayExpr', 'id');
        assert.strictEqual(dropDownButton.option('text'), '2', 'value is correct');

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const $items = getList(dropDownButton).itemElements();
        assert.strictEqual($items.eq(0).text(), '1', 'value is correct');
    });

    QUnit.test('focusStateEnabled option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'));

        dropDownButton.option('focusStateEnabled', false);

        assert.strictEqual(dropDownButton.$element().attr('tabindex'), undefined, 'element is not focusable');
    });

    QUnit.test('tabIndex option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'));

        dropDownButton.option('tabIndex', 3);

        assert.strictEqual(dropDownButton.$element().attr('tabindex'), undefined, 'tabIndex is correct');
    });

    QUnit.test('dropDownButton has no tabIndex attribute', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'));
        const tabIndexAttribute = dropDownButton.$element().attr('tabIndex');

        assert.strictEqual(tabIndexAttribute, undefined);
    });

    QUnit.test('buttonGroup tabIndex attribute equals 0', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'));
        const $buttonGroup = getButtonGroup(dropDownButton).$element();
        const tabIndexAttribute = $buttonGroup.attr('tabIndex');

        assert.strictEqual(tabIndexAttribute, '0');
    });

    QUnit.test('tabIndex option change sets buttonGroup tabIndex attribute', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'));
        const $buttonGroup = getButtonGroup(dropDownButton).$element();

        dropDownButton.option('tabIndex', 1);
        const tabIndexAttribute = $buttonGroup.attr('tabIndex');

        assert.strictEqual(tabIndexAttribute, '1', 'buttonGroup tabIndex attribute changed');
    });

    QUnit.test('opened option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'));

        dropDownButton.option('opened', true);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const popup = getPopup(dropDownButton);
        assert.strictEqual(popup.option('visible'), true, 'popup is opened');

        dropDownButton.option('opened', false);
        assert.strictEqual(popup.option('visible'), false, 'popup is closed');
    });


    QUnit.test('visible option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'));

        dropDownButton.option('visible', false);

        assert.ok(dropDownButton.$element().hasClass('dx-state-invisible'), 'widget is invisible');
    });

    QUnit.test('selectedItemKey option change should raise selectionChanged event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
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
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2
        });

        dropDownButton.on('selectionChanged', handler);
        dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(handler.callCount, 1, 'selectionChanged has been raised');
    });

    QUnit.test('selectedItemKey option change should change selectedItem option', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2
        });

        dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(dropDownButton.option('selectedItem'), 3, 'selectedItem is correct');
    });

    QUnit.test('dropDownOptions runtime change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            width: 100,
            deferRendering: false
        });

        dropDownButton.option('dropDownOptions', { width: 50 });

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const popup = getPopup(dropDownButton);
        assert.strictEqual(popup.option('width'), 50, 'option has been changed');
    });

    QUnit.test('dropDownOptions.visible option change should be ignored', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), { deferRendering: false });

        dropDownButton.option('dropDownOptions.visible', true);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const popup = getPopup(dropDownButton);
        assert.strictEqual(popup.option('visible'), false, 'popup is still closed');
    });

    QUnit.test('dropDownOptions.visible option change should not open/close popup', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), { deferRendering: false });

        dropDownButton.option('dropDownOptions', { visible: true });

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        let popup = getPopup(dropDownButton);
        assert.strictEqual(popup.option('visible'), false, 'popup is still closed');

        dropDownButton.open();
        dropDownButton.option('dropDownOptions', { visible: false });

        popup = getPopup(dropDownButton);
        assert.strictEqual(popup.option('visible'), true, 'popup is still opened');
    });

    QUnit.test('elementAttr runtime change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            elementAttr: {
                class: 'first'
            }
        });

        dropDownButton.option('elementAttr', { class: 'second' });

        const $element = dropDownButton.$element();

        assert.ok($element.hasClass('second'), 'option has been changed');
    });

    QUnit.test('icon option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            icon: 'save'
        });

        dropDownButton.option('icon', 'box');

        const $icon = dropDownButton.$element().find('.dx-icon').eq(0);

        assert.ok($icon.hasClass('dx-icon-box'), 'option has been changed');
    });

    QUnit.test('deferRendering option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: ['Item 1']
        });

        dropDownButton.option('deferRendering', false);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const $listItems = getList(dropDownButton).itemElements();
        assert.strictEqual($listItems.eq(0).text(), 'Item 1', 'deferRendering has been changed true -> false');
    });

    QUnit.test('dropDownContentTemplate option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            deferRendering: false
        });

        const templateFunction = () => {
            return 'Custom template';
        };

        dropDownButton.option('dropDownContentTemplate', templateFunction);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const popupContent = getPopup(dropDownButton).$content();
        assert.strictEqual(popupContent.text(), 'Custom template', 'option has been changed');
    });

    QUnit.test('items option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            deferRendering: false
        });

        dropDownButton.option('items', [4, 5, 6]);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const $firstItem = getList(dropDownButton).itemElements().eq(0);

        assert.strictEqual($firstItem.text(), '4', 'option has been changed');
    });

    QUnit.test('splitButton option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'));

        dropDownButton.option('splitButton', true);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        assert.strictEqual(getToggleButton(dropDownButton).length, 1, 'toggle button is rendered');

        dropDownButton.option('splitButton', false);
        assert.strictEqual(getToggleButton(dropDownButton).length, 0, 'there is no toggle button');
    });

    QUnit.test('dataSource option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            dataSource: [1, 2, 3],
            deferRendering: false
        });

        dropDownButton.option('dataSource', [4, 5, 6]);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const $firstItem = getList(dropDownButton).itemElements().eq(0);

        assert.strictEqual($firstItem.text(), '4', 'option has been changed');
    });

    QUnit.test('height option change', function(assert) {
        $('#container').css('height', '900px');

        const dropDownButton = $('#dropDownButton').dxDropDownButton({
            height: '300px'
        }).dxDropDownButton('instance');

        dropDownButton.option('height', '50%');

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const buttonGroup = getButtonGroup(dropDownButton);
        const $buttonGroupElement = buttonGroup.$element();

        assert.strictEqual(getHeight($buttonGroupElement), 450, 'height has been transfered to buttonGroup');
        assert.strictEqual(getHeight(dropDownButton.$element()), 450, 'height is correct after option change');
    });

    QUnit.test('itemTemplate option change', function(assert) {
        const items = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' }
        ];

        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items,
            deferRendering: false,
            itemTemplate: function(itemData) {
                return $('<div>')
                    .text(`${ itemData.id }: ${ itemData.name }`);
            }
        });

        dropDownButton.option('itemTemplate', function(itemData) {
            return $('<div>')
                .text(`#${ itemData.id }`);
        });

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const $listItems = getList(dropDownButton).itemElements();
        assert.strictEqual($listItems.eq(0).text(), '#1', 'itemTemlate has changed item text after option change');
    });


    QUnit.test('some options should be transfered to the list', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [{ key: 1, name: 'Item 1', icon: 'box' }],
            deferRendering: false,
            grouped: true,
            noDataText: 'No data',
            useSelectMode: false
        });

        dropDownButton.option({
            grouped: false,
            noDataText: 'nothing',
            useSelectMode: true
        });

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const list = getList(dropDownButton);

        assert.strictEqual(list.option('grouped'), false, 'grouped option transfered');
        assert.strictEqual(list.option('noDataText'), 'nothing', 'noDataText option transfered');
        assert.strictEqual(list.option('selectionMode'), 'single', 'selectionMode is single for useSelectMode: true');
    });

    QUnit.test('rtlEnabled option change', function(assert) {
        const $dropDownButton = $('#dropDownButton').dxDropDownButton({
            opened: true,
            dropDownOptions: {
                width: 200,
                'position.collision': 'none'
            },
        });

        const instance = $dropDownButton.dxDropDownButton('instance');

        instance.option('rtlEnabled', true);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const dropDownButtonElementRect = $dropDownButton.get(0).getBoundingClientRect();
        const popupContentElementRect = getPopup(instance).$overlayContent().get(0).getBoundingClientRect();

        assert.strictEqual(popupContentElementRect.right, dropDownButtonElementRect.right, 'popup position is correct, rtlEnabled = true');
    });

    QUnit.test('showArrowIcon option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            icon: 'group',
            deferRendering: false,
            splitButton: false,
            showArrowIcon: false
        });

        dropDownButton.option('showArrowIcon', true);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const $icons = getActionButton(dropDownButton).find('.dx-icon');

        assert.strictEqual($icons.length, 2, '2 icons are rendered');
        assert.ok($icons.eq(0).hasClass('dx-icon-group'), 'first icon is correct');
        assert.ok($icons.eq(1).hasClass('dx-icon-spindown'), 'second icon is correct');
    });

    QUnit.test('text option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            text: 'A'
        });

        dropDownButton.option('text', 'B');

        assert.strictEqual(getActionButton(dropDownButton).text(), 'B', 'option has been changed');
    });

    QUnit.test('width option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            width: 235
        });

        dropDownButton.option('width', 135);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const buttonGroup = getButtonGroup(dropDownButton);
        const $buttonGroupElement = buttonGroup.$element();

        assert.strictEqual(getOuterWidth(dropDownButton.$element()), 135, 'width is correct after option change');
        assert.strictEqual(getWidth($buttonGroupElement), 135, 'option has been transfered to buttonGroup');
    });

    QUnit.test('wrapItemText option change', function(assert) {
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            deferRendering: false,
            wrapItemText: true
        });

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        dropDownButton.option('wrapItemText', false);

        const list = getList(dropDownButton);
        const $itemContainer = list._itemContainer();

        assert.notOk($itemContainer.hasClass('dx-wrap-item-text'), 'class was removed');
    });

    QUnit.test('onContentReady option change', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            selectedItemKey: 2
        });

        dropDownButton.option('onContentReady', handler);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        dropDownButton.open();
        assert.strictEqual(handler.callCount, 2, 'popup and list are rendered');
    });

    QUnit.test('onItemClick option change', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3]
        });

        dropDownButton.option('onItemClick', handler);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        dropDownButton.open();
        const $item = getList(dropDownButton).itemElements().eq(0);
        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.ok(handler.calledOnce, 'handler was called');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.event.type, 'dxclick', 'event is correct');
        assert.strictEqual(e.itemData, 1, 'itemData is correct');
        assert.strictEqual($(e.itemElement).get(0), $item.get(0), 'itemElement is correct');
    });

    QUnit.test('onSelectionChanged option runtime change', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'), {
            items: [1, 2, 3],
            selectedItemKey: 2
        });

        dropDownButton.option('onSelectionChanged', handler);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        dropDownButton.open();

        const $item = getList(dropDownButton).itemElements().eq(0);
        eventsEngine.trigger($item, 'dxclick');
        const e = handler.getCall(0).args[0];

        assert.ok(handler.calledOnce, 'handler was called');
        assert.strictEqual(Object.keys(e).length, 4, 'event has 4 properties');
        assert.strictEqual(e.component, dropDownButton, 'component is correct');
        assert.strictEqual(e.element, dropDownButton.element(), 'element is correct');
        assert.strictEqual(e.previousItem, 2, 'previousItem is correct');
        assert.strictEqual(e.item, 1, 'item is correct');
    });

    QUnit.test('onOptionChanged option runtime change', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton($('#dropDownButton'));

        dropDownButton.option('onOptionChanged', handler);

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'no window');
            return;
        }

        const e = handler.lastCall.args[0];

        assert.ok(handler.calledOnce, 'handler was called');
        assert.strictEqual(e.name, 'onOptionChanged', 'changed option name is correct');
        assert.strictEqual(e.value, handler, 'changed option new value is correct');
    });
});
