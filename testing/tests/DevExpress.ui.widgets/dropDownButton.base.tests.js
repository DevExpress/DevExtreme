import $ from 'jquery';
import DropDownButton from 'ui/drop_down_button';

import 'common.css!';
import 'generic_light.css!';

const DROP_DOWN_BUTTON_CLASS = 'dx-dropdownbutton';
const DROP_DOWN_BUTTON_ACTION_CLASS = 'dx-dropdownbutton-action';
const DROP_DOWN_BUTTON_TOGGLE_CLASS = 'dx-dropdownbutton-toggle';

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

const getActionButton = (instance) => {
    return instance.$element().find(`.${DROP_DOWN_BUTTON_ACTION_CLASS}`);
};

QUnit.module('common markup', {
    beforeEach: function() {
        this.instance = new DropDownButton('#dropDownButton', {});
    }
}, () => {
    QUnit.test('element should have dropDownButton and widget class', function(assert) {
        assert.ok(this.instance.$element().hasClass(DROP_DOWN_BUTTON_CLASS), 'dropdownbutton class is ok');
        assert.ok(this.instance.$element().hasClass('dx-widget'), 'widget class is ok');
    });

    QUnit.test('it should be possible to render the widget button without a text', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
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
        const dropDownButton = new DropDownButton('#dropDownButton', {
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
        const dropDownButton = new DropDownButton('#dropDownButton', {
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
        const dropDownButton = new DropDownButton('#dropDownButton', {
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
        let mainButtonHeight = actionButton.height();
        let dropDownButtonHeight = toggleButton.height();
        assert.strictEqual(dropDownButtonHeight, mainButtonHeight, 'heights are equal after main button content change');

        $dropDownButton.find('i.dx-icon').css('height', '100px');
        mainButtonHeight = actionButton.height();
        dropDownButtonHeight = toggleButton.height();
        assert.strictEqual(mainButtonHeight, dropDownButtonHeight, 'heights are equal after toggle button content change');
    });

    QUnit.test('stylingMode option should be transfered to buttonGroup', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
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

        assert.strictEqual(buttonGroup.option('hoverStateEnabled'), false, 'buttonGroup has correct option');
        instance.option('hoverStateEnabled', true);
        assert.strictEqual(buttonGroup.option('hoverStateEnabled'), true, 'buttonGroup has changed option');
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

QUnit.module('common use cases', {
    beforeEach: function() {
        this.dropDownButton = new DropDownButton('#dropDownButton', {
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
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: null
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '', 'value is correct');
    });

    QUnit.test('undefined value should be displayed as an empty string', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: undefined
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '', 'value is correct');
    });

    QUnit.test('primitive items can be used without data expressions', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: ['Item 1', 'Item 2', 'Item 3'],
            useSelectMode: true,
            selectedItemKey: 'Item 1'
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), 'Item 1', 'value is correct');
    });

    QUnit.test('numbers can be used without data expressions', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [0, 1, 2],
            useSelectMode: true,
            selectedItemKey: 0
        });

        assert.strictEqual(getActionButton(dropDownButton).text(), '0', 'value is correct');
    });

    QUnit.test('booleans can be used without data expressions', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
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
        const dropDownButton = new DropDownButton('#dropDownButton', {
            deferRendering: false,
            useSelectMode: true,
            keyExpr: 'id',
            displayExpr: 'text',
            items: [{ id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }]
        });
        dropDownButton.option('selectedItemKey', 2);
        this.clock.tick();
        assert.strictEqual(getActionButton(dropDownButton).text(), 'Item 2', 'action button has been changed');
    });
});

QUnit.module('events', {}, () => {
    QUnit.test('keyExpr option change', function(assert) {
        const items = [{
            name: 'A', id: 1
        }, {
            name: 'B', id: 2
        }];

        const dropDownButton = new DropDownButton('#dropDownButton', {
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
        const dropDownButton = new DropDownButton('#dropDownButton');

        dropDownButton.option('focusStateEnabled', false);

        assert.strictEqual(dropDownButton.$element().attr('tabindex'), undefined, 'element is not focusable');
    });

    QUnit.test('selectedItemKey option change should raise selectionChanged event', function(assert) {
        const handler = sinon.spy();
        const dropDownButton = new DropDownButton('#dropDownButton', {
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
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2
        });

        dropDownButton.on('selectionChanged', handler);
        dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(handler.callCount, 1, 'selectionChanged has been raised');
    });

    QUnit.test('selectedItemKey option change should change selectedItem option', function(assert) {
        const dropDownButton = new DropDownButton('#dropDownButton', {
            items: [1, 2, 3],
            splitButton: true,
            selectedItemKey: 2
        });

        dropDownButton.option('selectedItemKey', 3);

        assert.strictEqual(dropDownButton.option('selectedItem'), 3, 'selectedItem is correct');
    });
});
