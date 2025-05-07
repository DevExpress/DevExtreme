import $ from 'jquery';
import 'ui/toolbar';
import 'ui/toolbar/ui.toolbar.base';

import eventsEngine from 'common/core/events/core/events_engine';

import 'ui/button_group';
import 'ui/text_box';

import 'generic_light.css!';
import 'ui/button';
import 'ui/drop_down_button';
import 'ui/tabs';
import 'ui/autocomplete';
import 'ui/date_box';
import 'ui/menu';

import devices from '__internal/core/m_devices';

import fx from 'common/core/animation/fx';

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.$fixture = $('#qunit-fixture');
        this.$element = $('<div></div>');
        this.$element.appendTo(this.$fixture);

        this.createInstance = (options) => {
            this.toolbar = this.$element.dxToolbar(options).dxToolbar('instance');
        };
    },
    afterEach: function() {
        fx.off = false;
        this.$element.dxToolbar('instance').dispose();
        this.$element.remove();
        delete this.$element;
    }
};

const getItemElement = (toolbar, itemElementSelector) => {
    const dropDownMenu = getDropDownMenu(toolbar);

    return dropDownMenu ? $(dropDownMenu._popup._$content).find(itemElementSelector) : $(toolbar.element()).find(itemElementSelector);
};

const getDropDownMenu = (toolbar) => {
    const dropDownMenu = toolbar._layoutStrategy._menu;

    if(dropDownMenu) {
        return dropDownMenu;
    }
};

const openDropDownMenuIfExist = (toolbar) => {
    const dropDownMenu = getDropDownMenu(toolbar);
    if(dropDownMenu) {
        dropDownMenu.option('opened', true);
    }
};

['never', 'always'].forEach((locateInMenu) => {
    if(devices.real().deviceType !== 'desktop') {
        // there is no specific for devices in these tests
        return;
    }

    [
        { widget: 'dxButton', focusableElementSelector: '.dx-button:not(.dx-dropdownmenu-button)' },
        { widget: 'dxTextBox', focusableElementSelector: '.dx-textbox .dx-texteditor-input' },
        { widget: 'dxSelectBox', focusableElementSelector: '.dx-selectbox .dx-texteditor-input' },
        { widget: 'dxDropDownButton', focusableElementSelector: '.dx-dropdownbutton .dx-buttongroup' },
        // { widget: 'dxAutocomplete', focusableElementSelector: '.dx-autocomplete .dx-texteditor-input' },
        // { widget: 'dxCheckBox', focusableElementSelector: '.dx-checkbox' },
        // { widget: 'dxDateBox', focusableElementSelector: '.dx-datebox .dx-texteditor-input' },
        // { widget: 'dxMenu', focusableElementSelector: '.dx-menu' },
        // { widget: 'dxTabs', focusableElementSelector: '.dx-tabs' },
        // { widget: 'dxButtonGroup', focusableElementSelector: '.dx-buttongroup' },
    ].forEach(({ widget, focusableElementSelector }) => {
        QUnit.module(`Disabled state: locateInMenu: ${locateInMenu}, widget: ${widget}`, moduleConfig, () => {
            const itemClickHandler = sinon.spy();
            const buttonClickHandler = sinon.spy();

            const getExpectedDisabledState = (toolbarDisabled, itemDisabled, itemOptionsDisabled) => {
                return [
                    { toolbarDisabled: true, itemDisabled: true, itemOptionsDisabled: true, expectedDisabled: { toolbar: true, itemDisabled: true, itemOptionsDisabled: true } },
                    { toolbarDisabled: true, itemDisabled: true, itemOptionsDisabled: false, expectedDisabled: { toolbar: true, itemDisabled: true, itemOptionsDisabled: false } },
                    { toolbarDisabled: true, itemDisabled: true, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                    { toolbarDisabled: true, itemDisabled: false, itemOptionsDisabled: true, expectedDisabled: { toolbar: true, itemDisabled: false, itemOptionsDisabled: true } },
                    { toolbarDisabled: true, itemDisabled: false, itemOptionsDisabled: false, expectedDisabled: { toolbar: true, itemDisabled: false, itemOptionsDisabled: false } },
                    { toolbarDisabled: true, itemDisabled: false, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: true, itemDisabled: false, itemOptionsDisabled: undefined } },
                    { toolbarDisabled: true, itemDisabled: undefined, itemOptionsDisabled: true, expectedDisabled: { toolbar: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                    { toolbarDisabled: true, itemDisabled: undefined, itemOptionsDisabled: false, expectedDisabled: { toolbar: true, itemDisabled: undefined, itemOptionsDisabled: false } },
                    { toolbarDisabled: true, itemDisabled: undefined, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: true, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                    { toolbarDisabled: false, itemDisabled: true, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, itemDisabled: true, itemOptionsDisabled: true } },
                    { toolbarDisabled: false, itemDisabled: true, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, itemDisabled: true, itemOptionsDisabled: false } },
                    { toolbarDisabled: false, itemDisabled: true, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, itemDisabled: true, itemOptionsDisabled: undefined } },
                    { toolbarDisabled: false, itemDisabled: false, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, itemDisabled: false, itemOptionsDisabled: true } },
                    { toolbarDisabled: false, itemDisabled: false, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, itemDisabled: false, itemOptionsDisabled: false } },
                    { toolbarDisabled: false, itemDisabled: false, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, itemDisabled: false, itemOptionsDisabled: undefined } },
                    { toolbarDisabled: false, itemDisabled: undefined, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, itemDisabled: undefined, itemOptionsDisabled: true } },
                    { toolbarDisabled: false, itemDisabled: undefined, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, itemDisabled: undefined, itemOptionsDisabled: false } },
                    { toolbarDisabled: false, itemDisabled: undefined, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                    { toolbarDisabled: undefined, itemDisabled: true, itemOptionsDisabled: true, expectedDisabled: { toolbar: undefined, itemDisabled: true, itemOptionsDisabled: true } },
                    { toolbarDisabled: undefined, itemDisabled: true, itemOptionsDisabled: false, expectedDisabled: { toolbar: undefined, itemDisabled: true, itemOptionsDisabled: false } },
                    { toolbarDisabled: undefined, itemDisabled: true, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: undefined, itemDisabled: true, itemOptionsDisabled: undefined } },
                    { toolbarDisabled: undefined, itemDisabled: false, itemOptionsDisabled: true, expectedDisabled: { toolbar: undefined, itemDisabled: false, itemOptionsDisabled: true } },
                    { toolbarDisabled: undefined, itemDisabled: false, itemOptionsDisabled: false, expectedDisabled: { toolbar: undefined, itemDisabled: false, itemOptionsDisabled: false } },
                    { toolbarDisabled: undefined, itemDisabled: false, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: undefined, itemDisabled: false, itemOptionsDisabled: undefined } },
                    { toolbarDisabled: undefined, itemDisabled: undefined, itemOptionsDisabled: true, expectedDisabled: { toolbar: undefined, itemDisabled: undefined, itemOptionsDisabled: true } },
                    { toolbarDisabled: undefined, itemDisabled: undefined, itemOptionsDisabled: false, expectedDisabled: { toolbar: undefined, itemDisabled: undefined, itemOptionsDisabled: false } },
                    { toolbarDisabled: undefined, itemDisabled: undefined, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: undefined, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                ].filter((config) => (config.toolbarDisabled === toolbarDisabled && config.itemDisabled === itemDisabled && config.itemOptionsDisabled === itemOptionsDisabled))[0].expectedDisabled;
            };

            const checkClickHandlers = ($item, toolbarDisabled, itemDisabled, itemOptionsDisabled) => {
                itemClickHandler.resetHistory();
                buttonClickHandler.resetHistory();

                eventsEngine.trigger($item, 'dxclick');

                QUnit.assert.strictEqual(itemClickHandler.callCount, itemDisabled || toolbarDisabled ? 0 : 1, `onItemClick ${itemClickHandler.callCount}`);
                QUnit.assert.strictEqual(buttonClickHandler.callCount, itemOptionsDisabled || itemDisabled || toolbarDisabled ? 0 : 1, `onButtonClick ${buttonClickHandler.callCount}`);
            };

            const checkFocusableElementTabIndex = (focusableElement, widgetName, expectedDisabled) => {
                const expectedFocusableElementTabIndex = expectedDisabled.itemOptionsDisabled || expectedDisabled.itemDisabled || expectedDisabled.toolbar
                    ? -1
                    : 0;

                QUnit.assert.strictEqual(focusableElement.tabIndex, expectedFocusableElementTabIndex, `${widgetName}.tabIndex`);
            };

            const checkDisabledState = (toolbar, widgetName, toolbarDisabled, itemDisabled, itemOptionsDisabled, focusableElementSelector) => {
                const $element = $(toolbar.element());
                const expectedDisabled = getExpectedDisabledState(toolbarDisabled, itemDisabled, itemOptionsDisabled);

                QUnit.assert.strictEqual(toolbar.option('disabled'), expectedDisabled.toolbar, 'toolbar.disabled');
                QUnit.assert.strictEqual($element.hasClass('dx-state-disabled'), !!expectedDisabled.toolbar, 'toolbar disabled class');

                const itemElementSelector = focusableElementSelector.split(' ')[0];
                const $item = getItemElement(toolbar, itemElementSelector);

                const $toolbarMenu = $element.find('.dx-dropdownmenu-button');
                if($toolbarMenu.length) {
                    QUnit.assert.strictEqual($toolbarMenu.hasClass('dx-state-disabled'), !!expectedDisabled.toolbar, 'menu button disabled class');
                }

                const $itemElement = $item.parent().parent();

                QUnit.assert.strictEqual($itemElement.hasClass('dx-state-disabled'), !!expectedDisabled.itemDisabled, 'toolbar item disabled class');
                QUnit.assert.strictEqual(toolbar.option('items')[0].disabled, expectedDisabled.itemDisabled, 'item.disabled');

                const itemDisabledOption = toolbar.option('items')[0].options && toolbar.option('items')[0].options.disabled;
                QUnit.assert.strictEqual(itemDisabledOption, expectedDisabled.itemOptionsDisabled, 'item.options.disabled');

                QUnit.assert.strictEqual($item.hasClass('dx-state-disabled'), !!expectedDisabled.itemOptionsDisabled, `${widgetName} disabled class`);
                checkFocusableElementTabIndex(getItemElement(toolbar, focusableElementSelector).get(0), widgetName, expectedDisabled);

                if(widgetName === 'dxButton') {
                    checkClickHandlers($item, expectedDisabled.toolbar, expectedDisabled.itemDisabled, expectedDisabled.itemOptionsDisabled);
                }
            };

            [true, false].forEach((isToolbarDisabled) => {
                [true, false].forEach((isItemOptionsDisabled) => {
                    [true, false].forEach((isItemDisabled) => {
                        const initialTestConfig = `Toolbar.disabled=${isToolbarDisabled}, items[].disabled=${isItemDisabled}, items[].options.disabled=${isItemOptionsDisabled}`;

                        const getInitialToolbarOptions = () => {
                            const initialToolbarOptions = {
                                items: [{
                                    location: 'after',
                                    locateInMenu,
                                    widget,
                                    options: {
                                    }
                                }]
                            };

                            if(widget === 'dxButton') {
                                initialToolbarOptions.onItemClick = itemClickHandler;
                                initialToolbarOptions.items[0].options.onClick = buttonClickHandler;
                            }

                            initialToolbarOptions.disabled = isToolbarDisabled;
                            initialToolbarOptions.items[0].disabled = isItemDisabled;
                            initialToolbarOptions.items[0].options.disabled = isItemOptionsDisabled;

                            return initialToolbarOptions;
                        };

                        QUnit.test(`Nested widgets, ${initialTestConfig}`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            openDropDownMenuIfExist(this.toolbar);
                            checkDisabledState(this.toolbar, widget, isToolbarDisabled, isItemDisabled, isItemOptionsDisabled, focusableElementSelector);
                        });

                        QUnit.test(`Nested widgets, ${initialTestConfig} -> change order: items[].options.disabled -> toolbar.disabled -> items[].disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;

                            [true, false, undefined].filter((value) => value !== isItemOptionsDisabled).forEach((newItemOptionsDisabled) => {
                                this.toolbar.option('items[0].options.disabled', newItemOptionsDisabled);
                                currentItemOptionsDisabledState = newItemOptionsDisabled;
                                openDropDownMenuIfExist(this.toolbar);
                                checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                [true, false, undefined].filter((value) => value !== isToolbarDisabled).forEach((newToolbarDisabled) => {
                                    this.toolbar.option('disabled', newToolbarDisabled);
                                    currentToolbarDisabledState = newToolbarDisabled;
                                    openDropDownMenuIfExist(this.toolbar);
                                    checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                    [true, false, undefined].forEach((newItemDisabled) => {
                                        this.toolbar.option('items[0].disabled', newItemDisabled);
                                        currentItemDisabledState = newItemDisabled;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Nested widgets, ${initialTestConfig} -> change order: items[].options.disabled -> items[].disabled -> toolbar.disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;

                            [true, false, undefined].filter((value) => value !== isItemOptionsDisabled).forEach((newItemOptionsDisabled) => {
                                this.toolbar.option('items[0].options.disabled', newItemOptionsDisabled);
                                currentItemOptionsDisabledState = newItemOptionsDisabled;

                                [true, false, undefined].filter((value) => value !== isItemDisabled).forEach((newItemDisabled) => {
                                    this.toolbar.option('items[0].disabled', newItemDisabled);
                                    currentItemDisabledState = newItemDisabled;
                                    openDropDownMenuIfExist(this.toolbar);
                                    checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                    [true, false, undefined].forEach((newToolbarDisabled) => {
                                        this.toolbar.option('disabled', newToolbarDisabled);
                                        currentToolbarDisabledState = newToolbarDisabled;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Nested widgets, ${initialTestConfig} -> change order: toolbar.disabled -> items[].options.disabled -> items[].disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;

                            [true, false, undefined].filter((value) => value !== isToolbarDisabled).forEach((newToolbarDisabled) => {
                                this.toolbar.option('disabled', newToolbarDisabled);
                                currentToolbarDisabledState = newToolbarDisabled;
                                openDropDownMenuIfExist(this.toolbar);
                                checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                [true, false, undefined].filter((value) => value !== isItemOptionsDisabled).forEach((newItemOptionsDisabled) => {
                                    this.toolbar.option('items[0].options.disabled', newItemOptionsDisabled);
                                    currentItemOptionsDisabledState = newItemOptionsDisabled;
                                    openDropDownMenuIfExist(this.toolbar);
                                    checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                    [true, false, undefined].forEach((newItemDisabled) => {
                                        this.toolbar.option('items[0].disabled', newItemDisabled);
                                        currentItemDisabledState = newItemDisabled;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Nested widgets, ${initialTestConfig} -> change order: toolbar.disabled -> items[].disabled -> items[].options.disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;

                            [true, false, undefined].filter((value) => value !== isToolbarDisabled).forEach((newToolbarDisabled) => {
                                this.toolbar.option('disabled', newToolbarDisabled);
                                currentToolbarDisabledState = newToolbarDisabled;

                                [true, false, undefined].filter((value) => value !== isItemOptionsDisabled).forEach((newItemOptionsDisabled) => {
                                    this.toolbar.option('items[0].options.disabled', newItemOptionsDisabled);
                                    currentItemOptionsDisabledState = newItemOptionsDisabled;
                                    openDropDownMenuIfExist(this.toolbar);
                                    checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                    [true, false, undefined].forEach((newItemDisabled) => {
                                        this.toolbar.option('items[0].disabled', newItemDisabled);
                                        currentItemDisabledState = newItemDisabled;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Nested widgets, ${initialTestConfig} -> change order: items[].disabled -> toolbar.disabled -> items[].options.disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;

                            [true, false, undefined].filter((value) => value !== isItemDisabled).forEach((newItemDisabled) => {
                                this.toolbar.option('items[0].disabled', newItemDisabled);
                                currentItemDisabledState = newItemDisabled;
                                openDropDownMenuIfExist(this.toolbar);
                                checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                [true, false, undefined].filter((value) => value !== isToolbarDisabled).forEach((newToolbarDisabled) => {
                                    this.toolbar.option('disabled', newToolbarDisabled);
                                    currentToolbarDisabledState = newToolbarDisabled;
                                    openDropDownMenuIfExist(this.toolbar);
                                    checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                    [true, false, undefined].forEach((newItemOptionsDisabled) => {
                                        this.toolbar.option('items[0].options.disabled', newItemOptionsDisabled);
                                        currentItemOptionsDisabledState = newItemOptionsDisabled;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Nested widgets, ${initialTestConfig} -> change order: items[].disabled -> items[].options.disabled -> toolbar.disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;

                            [true, false, undefined].filter((value) => value !== isItemDisabled).forEach((newItemDisabled) => {
                                this.toolbar.option('items[0].disabled', newItemDisabled);
                                currentItemDisabledState = newItemDisabled;

                                [true, false, undefined].filter((value) => value !== isItemOptionsDisabled).forEach((newItemOptionsDisabled) => {
                                    this.toolbar.option('items[0].options.disabled', newItemOptionsDisabled);
                                    currentItemOptionsDisabledState = newItemOptionsDisabled;
                                    openDropDownMenuIfExist(this.toolbar);
                                    checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                    [true, false, undefined].forEach((newToolbarDisabled) => {
                                        this.toolbar.option('disabled', newToolbarDisabled);
                                        currentToolbarDisabledState = newToolbarDisabled;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });
                    });
                });
            });


            QUnit.test(`Restore default ${widget} tabIndex value on change toolbar.items[i].disabled, locateInMenu: ${locateInMenu}`, function(assert) {
                const initialToolbarOptions = {
                    items: [{
                        location: 'before',
                        widget,
                        locateInMenu,
                        options: {
                            tabIndex: 2,
                        }
                    }]
                };

                this.createInstance(initialToolbarOptions);
                openDropDownMenuIfExist(this.toolbar);

                const $item = getItemElement(this.toolbar, focusableElementSelector);
                assert.strictEqual($item.attr('tabIndex'), '2', 'tabIndex');

                this.toolbar.option('items[0].disabled', true);

                assert.strictEqual($item.attr('tabIndex'), '-1', 'tabIndex');

                this.toolbar.option('items[0].disabled', false);

                assert.strictEqual($item.attr('tabIndex'), '2', 'tabIndex');
            });

            QUnit.test(`Restore default ${widget} tabIndex value on change toolbar.disabled, locateInMenu: ${locateInMenu}`, function(assert) {
                const initialToolbarOptions = {
                    items: [{
                        location: 'before',
                        widget,
                        locateInMenu,
                        options: {
                            tabIndex: 2,
                        }
                    }]
                };

                this.createInstance(initialToolbarOptions);
                openDropDownMenuIfExist(this.toolbar);

                const $item = getItemElement(this.toolbar, focusableElementSelector);
                assert.strictEqual($item.attr('tabIndex'), '2', 'tabIndex');

                this.toolbar.option('disabled', true);

                assert.strictEqual($item.attr('tabIndex'), '-1', 'tabIndex');

                this.toolbar.option('disabled', false);

                assert.strictEqual($item.attr('tabIndex'), '2', 'tabIndex');
            });

            QUnit.test(`Restore default ${widget} tabIndex value on change toolbar.disabled.items[i].options.disabled, locateInMenu: ${locateInMenu}`, function(assert) {
                const initialToolbarOptions = {
                    items: [{
                        location: 'before',
                        widget,
                        locateInMenu,
                        options: {
                            tabIndex: 2,
                        }
                    }]
                };

                this.createInstance(initialToolbarOptions);
                openDropDownMenuIfExist(this.toolbar);

                let $item = getItemElement(this.toolbar, focusableElementSelector);
                assert.strictEqual($item.attr('tabIndex'), '2', 'tabIndex');

                this.toolbar.option('items[0].options.disabled', true);
                $item = getItemElement(this.toolbar, focusableElementSelector);

                assert.strictEqual($item.attr('tabIndex'), '-1', 'tabIndex');

                this.toolbar.option('items[0].options.disabled', false);
                $item = getItemElement(this.toolbar, focusableElementSelector);

                assert.strictEqual($item.attr('tabIndex'), '2', 'tabIndex');
            });
        });
    });

    QUnit.module(`Editor state: locateInMenu: ${locateInMenu}`, moduleConfig, () => {
        QUnit.test('Changing toolbar.items[i].options.disabled does not save the current value in selectbox', function(assert) {
            const initialToolbarOptions = {
                items: [{
                    location: 'before',
                    widget: 'dxSelectBox',
                    cssClass: 'my-test-selectbox',
                    locateInMenu,
                    options: {
                        items: ['item1', 'item2'],
                        value: 'item1',
                    }
                }]
            };

            this.createInstance(initialToolbarOptions);
            openDropDownMenuIfExist(this.toolbar);

            let $selectBox = getItemElement(this.toolbar, '.dx-selectbox');
            const selectBox = $selectBox.dxSelectBox('instance');
            selectBox.option('value', 'item2');

            assert.equal(selectBox.option('value'), 'item2', 'selectbox state is right');

            this.toolbar.option('items[0].options.disabled', true);

            $selectBox = getItemElement(this.toolbar, '.dx-selectbox');
            const $selectBoxDisabledContainer = $selectBox.closest('.my-test-selectbox');
            assert.ok(!$selectBoxDisabledContainer.hasClass('dx-state-disabled'), 'button option changed');

            const selectBoxDisabled = $selectBox.dxSelectBox('instance');
            assert.equal(selectBoxDisabled.option('value'), 'item1', 'selectbox state saved');
        });

        QUnit.test('Changing toolbar.disable saves the current value in selectbox', function(assert) {
            const initialToolbarOptions = {
                items: [{
                    location: 'before',
                    widget: 'dxSelectBox',
                    cssClass: 'my-test-selectbox',
                    locateInMenu,
                    options: {
                        items: ['item1', 'item2'],
                        value: 'item1',
                    }
                }]
            };

            this.createInstance(initialToolbarOptions);
            openDropDownMenuIfExist(this.toolbar);

            let $selectBox = getItemElement(this.toolbar, '.dx-selectbox');
            const selectBox = $selectBox.dxSelectBox('instance');
            selectBox.option('value', 'item2');

            assert.equal(selectBox.option('value'), 'item2', 'selectbox state is right');

            this.toolbar.option('disabled', true);

            $selectBox = getItemElement(this.toolbar, '.dx-selectbox');
            const $selectBoxDisabledContainer = $selectBox.closest('.my-test-selectbox');
            assert.ok(!$selectBoxDisabledContainer.hasClass('dx-state-disabled'), 'button option changed');

            const selectBoxDisabled = $selectBox.dxSelectBox('instance');
            assert.equal(selectBoxDisabled.option('value'), 'item2', 'selectbox state saved');
        });

        QUnit.test('Changing toolbar.items[i].disabled saves the current value in selectbox', function(assert) {
            const initialToolbarOptions = {
                items: [{
                    location: 'before',
                    widget: 'dxSelectBox',
                    cssClass: 'my-test-selectbox',
                    locateInMenu,
                    options: {
                        items: ['item1', 'item2'],
                        value: 'item1',
                    }
                }]
            };

            this.createInstance(initialToolbarOptions);
            openDropDownMenuIfExist(this.toolbar);

            let $selectBox = getItemElement(this.toolbar, '.dx-selectbox');
            const selectBox = $selectBox.dxSelectBox('instance');
            selectBox.option('value', 'item2');

            assert.equal(selectBox.option('value'), 'item2', 'selectbox state is right');

            this.toolbar.option('items[0].disabled', true);

            $selectBox = getItemElement(this.toolbar, '.dx-selectbox');
            const $selectBoxDisabledContainer = $selectBox.closest('.my-test-selectbox');
            assert.ok($selectBoxDisabledContainer.hasClass('dx-state-disabled'), 'button option changed');

            const selectBoxDisabled = $selectBox.dxSelectBox('instance');
            assert.equal(selectBoxDisabled.option('value'), 'item2', 'selectbox state saved');
        });
    });
});

