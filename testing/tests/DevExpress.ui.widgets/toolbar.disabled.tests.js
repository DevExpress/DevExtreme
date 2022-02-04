import 'ui/action_sheet';
import 'ui/drop_down_menu';

import $ from 'jquery';
import 'ui/toolbar';
import 'ui/toolbar/ui.toolbar.base';

import eventsEngine from 'events/core/events_engine';
import devices from 'core/devices';

import 'ui/button_group';
import 'ui/text_box';

import 'generic_light.css!';
import 'ui/button';
import 'ui/drop_down_button';
import 'ui/tabs';
import 'ui/autocomplete';
import 'ui/date_box';
import 'ui/menu';


const DROP_DOWN_MENU_CLASS = 'dx-dropdownmenu';

['never', 'always'].forEach((locateInMenu) => {
    QUnit.module(`Disabled state, locateInMenu: ${locateInMenu}`, {
        before: function() {
            this.$fixture = $('#qunit-fixture');
        },
        beforeEach: function() {
            this.createInstance = (options) => {
                this.$element = $('<div></div>');
                this.$element.appendTo(this.$fixture);

                this.toolbar = this.$element.dxToolbar(options).dxToolbar('instance');
            };
        },
        afterEach: function() {
            this.$element.remove();
            delete this.$element;
        }
    }, () => {
        const itemClickHandler = sinon.spy();
        const buttonClickHandler = sinon.spy();

        const getDropDownMenu = (toolbar) => {
            const $dropDownMenu = $(toolbar.element()).find(`.${DROP_DOWN_MENU_CLASS}`).eq(0);

            if($dropDownMenu.length) {
                return $dropDownMenu.dxDropDownMenu('instance');
            }
        };

        const openDropDownMenuIfExist = (toolbar) => {
            const dropDownMenu = getDropDownMenu(toolbar);
            if(dropDownMenu) {
                dropDownMenu.open();
            }
        };

        const getExpectedDisabledState = (toolbarDisabled, itemDisabled, itemOptionsDisabled) => {
            return [
                { toolbarDisabled: true, itemDisabled: true, itemOptionsDisabled: true, expectedDisabled: { toolbar: true, item: true, itemDisabled: true, itemOptionsDisabled: true } },
                { toolbarDisabled: true, itemDisabled: true, itemOptionsDisabled: false, expectedDisabled: { toolbar: true, item: true, itemDisabled: true, itemOptionsDisabled: false } },
                { toolbarDisabled: true, itemDisabled: true, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: true, item: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                { toolbarDisabled: true, itemDisabled: true, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: true, item: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                { toolbarDisabled: true, itemDisabled: false, itemOptionsDisabled: true, expectedDisabled: { toolbar: true, item: true, itemDisabled: false, itemOptionsDisabled: true } },
                { toolbarDisabled: true, itemDisabled: false, itemOptionsDisabled: false, expectedDisabled: { toolbar: true, item: true, itemDisabled: false, itemOptionsDisabled: false } },
                { toolbarDisabled: true, itemDisabled: false, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: true, item: true, itemDisabled: false, itemOptionsDisabled: undefined } },
                { toolbarDisabled: true, itemDisabled: false, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: true, item: true, itemDisabled: false, itemOptionsDisabled: undefined } },
                { toolbarDisabled: true, itemDisabled: undefined, itemOptionsDisabled: true, expectedDisabled: { toolbar: true, item: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                { toolbarDisabled: true, itemDisabled: undefined, itemOptionsDisabled: false, expectedDisabled: { toolbar: true, item: true, itemDisabled: undefined, itemOptionsDisabled: false } },
                { toolbarDisabled: true, itemDisabled: undefined, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: true, item: true, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: true, itemDisabled: undefined, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: true, item: true, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: true, itemDisabled: 'not declared', itemOptionsDisabled: true, expectedDisabled: { toolbar: true, item: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                { toolbarDisabled: true, itemDisabled: 'not declared', itemOptionsDisabled: false, expectedDisabled: { toolbar: true, item: true, itemDisabled: undefined, itemOptionsDisabled: false } },
                { toolbarDisabled: true, itemDisabled: 'not declared', itemOptionsDisabled: undefined, expectedDisabled: { toolbar: true, item: true, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: true, itemDisabled: 'not declared', itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: true, item: true, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: false, itemDisabled: true, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, item: true, itemDisabled: true, itemOptionsDisabled: true } },
                { toolbarDisabled: false, itemDisabled: true, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, item: false, itemDisabled: true, itemOptionsDisabled: false } },
                { toolbarDisabled: false, itemDisabled: true, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, item: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                { toolbarDisabled: false, itemDisabled: true, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: false, item: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                { toolbarDisabled: false, itemDisabled: false, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, item: true, itemDisabled: false, itemOptionsDisabled: true } },
                { toolbarDisabled: false, itemDisabled: false, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, item: false, itemDisabled: false, itemOptionsDisabled: false } },
                { toolbarDisabled: false, itemDisabled: false, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, item: false, itemDisabled: false, itemOptionsDisabled: undefined } },
                { toolbarDisabled: false, itemDisabled: false, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: false, item: false, itemDisabled: false, itemOptionsDisabled: undefined } },
                { toolbarDisabled: false, itemDisabled: undefined, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, item: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                { toolbarDisabled: false, itemDisabled: undefined, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: false } },
                { toolbarDisabled: false, itemDisabled: undefined, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: false, itemDisabled: undefined, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: false, itemDisabled: 'not declared', itemOptionsDisabled: true, expectedDisabled: { toolbar: false, item: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                { toolbarDisabled: false, itemDisabled: 'not declared', itemOptionsDisabled: false, expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: false } },
                { toolbarDisabled: false, itemDisabled: 'not declared', itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: false, itemDisabled: 'not declared', itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: undefined, itemDisabled: true, itemOptionsDisabled: true, expectedDisabled: { toolbar: undefined, item: true, itemDisabled: true, itemOptionsDisabled: true } },
                { toolbarDisabled: undefined, itemDisabled: true, itemOptionsDisabled: false, expectedDisabled: { toolbar: undefined, item: false, itemDisabled: true, itemOptionsDisabled: false } },
                { toolbarDisabled: undefined, itemDisabled: true, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: undefined, item: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                { toolbarDisabled: undefined, itemDisabled: true, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: undefined, item: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                { toolbarDisabled: undefined, itemDisabled: false, itemOptionsDisabled: true, expectedDisabled: { toolbar: undefined, item: true, itemDisabled: false, itemOptionsDisabled: true } },
                { toolbarDisabled: undefined, itemDisabled: false, itemOptionsDisabled: false, expectedDisabled: { toolbar: undefined, item: false, itemDisabled: false, itemOptionsDisabled: false } },
                { toolbarDisabled: undefined, itemDisabled: false, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: undefined, item: undefined, itemDisabled: false, itemOptionsDisabled: undefined } },
                { toolbarDisabled: undefined, itemDisabled: false, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: undefined, item: false, itemDisabled: false, itemOptionsDisabled: undefined } },
                { toolbarDisabled: undefined, itemDisabled: undefined, itemOptionsDisabled: true, expectedDisabled: { toolbar: undefined, item: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                { toolbarDisabled: undefined, itemDisabled: undefined, itemOptionsDisabled: false, expectedDisabled: { toolbar: undefined, item: false, itemDisabled: undefined, itemOptionsDisabled: false } },
                { toolbarDisabled: undefined, itemDisabled: undefined, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: undefined, item: undefined, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: undefined, itemDisabled: undefined, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: undefined, item: false, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: undefined, itemDisabled: 'not declared', itemOptionsDisabled: true, expectedDisabled: { toolbar: undefined, item: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                { toolbarDisabled: undefined, itemDisabled: 'not declared', itemOptionsDisabled: false, expectedDisabled: { toolbar: undefined, item: false, itemDisabled: undefined, itemOptionsDisabled: false } },
                { toolbarDisabled: undefined, itemDisabled: 'not declared', itemOptionsDisabled: undefined, expectedDisabled: { toolbar: undefined, item: undefined, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: undefined, itemDisabled: 'not declared', itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: undefined, item: false, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: 'not declared', itemDisabled: true, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, item: true, itemDisabled: true, itemOptionsDisabled: true } },
                { toolbarDisabled: 'not declared', itemDisabled: true, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, item: false, itemDisabled: true, itemOptionsDisabled: false } },
                { toolbarDisabled: 'not declared', itemDisabled: true, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, item: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                { toolbarDisabled: 'not declared', itemDisabled: true, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: false, item: true, itemDisabled: true, itemOptionsDisabled: undefined } },
                { toolbarDisabled: 'not declared', itemDisabled: false, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, item: true, itemDisabled: false, itemOptionsDisabled: true } },
                { toolbarDisabled: 'not declared', itemDisabled: false, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, item: false, itemDisabled: false, itemOptionsDisabled: false } },
                { toolbarDisabled: 'not declared', itemDisabled: false, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, item: undefined, itemDisabled: false, itemOptionsDisabled: undefined } },
                { toolbarDisabled: 'not declared', itemDisabled: false, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: false, item: false, itemDisabled: false, itemOptionsDisabled: undefined } },
                { toolbarDisabled: 'not declared', itemDisabled: undefined, itemOptionsDisabled: true, expectedDisabled: { toolbar: false, item: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                { toolbarDisabled: 'not declared', itemDisabled: undefined, itemOptionsDisabled: false, expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: false } },
                { toolbarDisabled: 'not declared', itemDisabled: undefined, itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, item: undefined, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: 'not declared', itemDisabled: undefined, itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: 'not declared', itemDisabled: 'not declared', itemOptionsDisabled: true, expectedDisabled: { toolbar: false, item: true, itemDisabled: undefined, itemOptionsDisabled: true } },
                { toolbarDisabled: 'not declared', itemDisabled: 'not declared', itemOptionsDisabled: false, expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: false } },
                { toolbarDisabled: 'not declared', itemDisabled: 'not declared', itemOptionsDisabled: undefined, expectedDisabled: { toolbar: false, item: undefined, itemDisabled: undefined, itemOptionsDisabled: undefined } },
                { toolbarDisabled: 'not declared', itemDisabled: 'not declared', itemOptionsDisabled: 'not declared', expectedDisabled: { toolbar: false, item: false, itemDisabled: undefined, itemOptionsDisabled: undefined } }
            ].filter((config) => (config.toolbarDisabled === toolbarDisabled && config.itemDisabled === itemDisabled && config.itemOptionsDisabled === itemOptionsDisabled))[0].expectedDisabled;
        };

        const checkClickHandlers = ($item, toolbarDisabled, isItemDisabled, itemDisabled) => {
            eventsEngine.trigger($item, 'dxclick');

            QUnit.assert.strictEqual(itemClickHandler.callCount, itemDisabled || toolbarDisabled ? 0 : 1, `onItemClick ${itemClickHandler.callCount}`);
            QUnit.assert.strictEqual(buttonClickHandler.callCount, isItemDisabled || itemDisabled || toolbarDisabled ? 0 : 1, `onButtonClick ${buttonClickHandler.callCount}`);

            itemClickHandler.reset();
            buttonClickHandler.reset();
        };

        const checkFocusableElementTabIndex = (toolbar, widgetName, expectedDisabled, focusableElementSelector) => {
            const expectedFocusableElementTabIndex = expectedDisabled.item || (['dxButton', 'dxCheckBox', 'dxMenu', 'dxTabs'].indexOf(widgetName) !== -1 && devices.real().deviceType !== 'desktop')
                ? -1
                : 0;

            QUnit.assert.strictEqual(getItemElement(toolbar, focusableElementSelector).get(0).tabIndex, expectedFocusableElementTabIndex, `${widgetName}.tabIndex`);
        };

        const checkDisabledState = (toolbar, widgetName, toolbarDisabled, itemDisabled, itemOptionsDisabled, focusableElementSelector) => {
            const expectedDisabled = getExpectedDisabledState(toolbarDisabled, itemDisabled, itemOptionsDisabled);

            QUnit.assert.strictEqual(toolbar.option('disabled'), expectedDisabled.toolbar, 'toolbar.disabled');
            QUnit.assert.strictEqual($(toolbar.element()).hasClass('dx-state-disabled'), !!expectedDisabled.toolbar, 'toolbar disabled class');

            const itemElementSelector = focusableElementSelector.split(' ')[0];
            const $item = getItemElement(toolbar, itemElementSelector);

            const $itemElement = $item.parent().parent();
            QUnit.assert.strictEqual($itemElement.hasClass('dx-state-disabled'), !!expectedDisabled.itemDisabled, 'toolbar item disabled class');
            QUnit.assert.strictEqual(toolbar.option('items')[0].disabled, expectedDisabled.itemDisabled, 'item.disabled');

            const itemDisabledOption = toolbar.option('items')[0].options && toolbar.option('items')[0].options.disabled;
            QUnit.assert.strictEqual(itemDisabledOption, expectedDisabled.itemOptionsDisabled, 'item.options.disabled');

            QUnit.assert.strictEqual($item.hasClass('dx-state-disabled'), !!expectedDisabled.item, `${widgetName} disabled class`);
            checkFocusableElementTabIndex(toolbar, widgetName, expectedDisabled, focusableElementSelector);

            if(widgetName === 'dxButton') {
                checkClickHandlers($item, expectedDisabled.toolbar, expectedDisabled.item, expectedDisabled.itemDisabled);
            }
        };

        const getItemElement = (toolbar, itemElementSelector) => {
            return locateInMenu === 'never' ? $(toolbar.element()).find(itemElementSelector) : $(getDropDownMenu(toolbar)._popup._$content).find(itemElementSelector);
        };

        [
            { widget: 'dxButton', focusableElementSelector: '.dx-button:not(.dx-dropdownmenu-button)' },
            { widget: 'dxAutocomplete', focusableElementSelector: '.dx-autocomplete .dx-texteditor-input' },
            { widget: 'dxCheckBox', focusableElementSelector: '.dx-checkbox' },
            { widget: 'dxDateBox', focusableElementSelector: '.dx-datebox .dx-texteditor-input' },
            { widget: 'dxMenu', focusableElementSelector: '.dx-menu' },
            { widget: 'dxSelectBox', focusableElementSelector: '.dx-selectbox .dx-texteditor-input' },
            { widget: 'dxTabs', focusableElementSelector: '.dx-tabs' },
            { widget: 'dxTextBox', focusableElementSelector: '.dx-textbox .dx-texteditor-input' },
            { widget: 'dxButtonGroup', focusableElementSelector: '.dx-buttongroup' },
            { widget: 'dxDropDownButton', focusableElementSelector: '.dx-dropdownbutton .dx-buttongroup' }
        ].forEach(({ widget, focusableElementSelector }) => {
            [true, false, undefined, 'not declared'].forEach((isToolbarDisabled) => {
                [true, false, undefined, 'not declared'].forEach((isItemOptionsDisabled) => {
                    [true, false, undefined, 'not declared'].forEach((isItemDisabled) => {
                        const getInitialToolbarOptions = () => {
                            const initialToolbarOptions = {
                                onItemClick: itemClickHandler,
                                items: [{
                                    location: 'after',
                                    locateInMenu,
                                    widget,
                                    options: {
                                        onClick: buttonClickHandler
                                    }
                                }]
                            };

                            if(isToolbarDisabled !== 'not declared') {
                                initialToolbarOptions.disabled = isToolbarDisabled;
                            }
                            if(isItemDisabled !== 'not declared') {
                                initialToolbarOptions.items[0].disabled = isItemDisabled;
                            }
                            if(isItemOptionsDisabled !== 'not declared') {
                                initialToolbarOptions.items[0].options.disabled = isItemOptionsDisabled;
                            }

                            return initialToolbarOptions;
                        };


                        QUnit.test(`Disabled state for nested widgets, Toolbar.disabled=${isToolbarDisabled}, items[${widget}].disabled=${isItemDisabled}, items[${widget}].options.disabled=${isItemOptionsDisabled} -> change order: items[${widget}].options.disabled -> toolbar.disabled -> items[${widget}].disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            openDropDownMenuIfExist(this.toolbar);
                            checkDisabledState(this.toolbar, widget, isToolbarDisabled, isItemDisabled, isItemOptionsDisabled, focusableElementSelector);

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;

                            [true, false, undefined].forEach((newToolbarDisabledValue) => {
                                [true, false, undefined].forEach((newItemDisabledValue) => {
                                    [true, false, undefined].forEach((newItemOptionsDisabledValue) => {
                                        this.toolbar.option('items[0].options.disabled', newItemOptionsDisabledValue);
                                        currentItemOptionsDisabledState = newItemOptionsDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('disabled', newToolbarDisabledValue);
                                        currentToolbarDisabledState = newToolbarDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('items[0].disabled', newItemDisabledValue);
                                        currentItemDisabledState = newItemDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Disabled state for nested widgets, Toolbar.disabled=${isToolbarDisabled}, items[${widget}].disabled=${isItemDisabled}, items[${widget}].options.disabled=${isItemOptionsDisabled} -> change order: items[${widget}].options.disabled -> items[${widget}].disabled -> toolbar.disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            openDropDownMenuIfExist(this.toolbar);
                            checkDisabledState(this.toolbar, widget, isToolbarDisabled, isItemDisabled, isItemOptionsDisabled, focusableElementSelector);

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;
                            [true, false, undefined].forEach((newToolbarDisabledValue) => {
                                [true, false, undefined].forEach((newItemDisabledValue) => {
                                    [true, false, undefined].forEach((newItemOptionsDisabledValue) => {
                                        this.toolbar.option('items[0].options.disabled', newItemOptionsDisabledValue);
                                        currentItemOptionsDisabledState = newItemOptionsDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('items[0].disabled', newItemDisabledValue);
                                        currentItemDisabledState = newItemDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('disabled', newToolbarDisabledValue);
                                        currentToolbarDisabledState = newToolbarDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Disabled state for nested widgets, Toolbar.disabled=${isToolbarDisabled}, items[${widget}].disabled=${isItemDisabled}, items[${widget}].options.disabled=${isItemOptionsDisabled} -> change order: toolbar.disabled -> items[${widget}].options.disabled -> items[${widget}].disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            openDropDownMenuIfExist(this.toolbar);
                            checkDisabledState(this.toolbar, widget, isToolbarDisabled, isItemDisabled, isItemOptionsDisabled, focusableElementSelector);

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;
                            [true, false, undefined].forEach((newToolbarDisabledValue) => {
                                [true, false, undefined].forEach((newItemDisabledValue) => {
                                    [true, false, undefined].forEach((newItemOptionsDisabledValue) => {
                                        this.toolbar.option('disabled', newToolbarDisabledValue);
                                        currentToolbarDisabledState = newToolbarDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('items[0].options.disabled', newItemOptionsDisabledValue);
                                        currentItemOptionsDisabledState = newItemOptionsDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('items[0].disabled', newItemDisabledValue);
                                        currentItemDisabledState = newItemDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Disabled state for nested widgets, Toolbar.disabled=${isToolbarDisabled}, items[${widget}].disabled=${isItemDisabled}, items[${widget}].options.disabled=${isItemOptionsDisabled} -> change order: toolbar.disabled -> items[${widget}].disabled -> items[${widget}].options.disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            openDropDownMenuIfExist(this.toolbar);
                            checkDisabledState(this.toolbar, widget, isToolbarDisabled, isItemDisabled, isItemOptionsDisabled, focusableElementSelector);

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;
                            [true, false, undefined].forEach((newToolbarDisabledValue) => {
                                [true, false, undefined].forEach((newItemDisabledValue) => {
                                    [true, false, undefined].forEach((newItemOptionsDisabledValue) => {
                                        this.toolbar.option('disabled', newToolbarDisabledValue);
                                        currentToolbarDisabledState = newToolbarDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('items[0].options.disabled', newItemOptionsDisabledValue);
                                        currentItemOptionsDisabledState = newItemOptionsDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('items[0].disabled', newItemDisabledValue);
                                        currentItemDisabledState = newItemDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                    });
                                });
                            });
                        });

                        QUnit.test(`Disabled state for nested widgets, Toolbar.disabled=${isToolbarDisabled}, items[${widget}].disabled=${isItemDisabled}, items[${widget}].options.disabled=${isItemOptionsDisabled} -> change order: items[${widget}].disabled -> toolbar.disabled -> items[${widget}].options.disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            openDropDownMenuIfExist(this.toolbar);
                            checkDisabledState(this.toolbar, widget, isToolbarDisabled, isItemDisabled, isItemOptionsDisabled, focusableElementSelector);

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;
                            [true, false, undefined].forEach((newToolbarDisabledValue) => {
                                [true, false, undefined].forEach((newItemDisabledValue) => {
                                    [true, false, undefined].forEach((newItemOptionsDisabledValue) => {
                                        this.toolbar.option('items[0].disabled', newItemDisabledValue);
                                        currentItemDisabledState = newItemDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('disabled', newToolbarDisabledValue);
                                        currentToolbarDisabledState = newToolbarDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('items[0].options.disabled', newItemOptionsDisabledValue);
                                        currentItemOptionsDisabledState = newItemOptionsDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });

                        QUnit.test(`Disabled state for nested widgets, Toolbar.disabled=${isToolbarDisabled}, items[${widget}].disabled=${isItemDisabled}, items[${widget}].options.disabled=${isItemOptionsDisabled} -> change order: items[${widget}].disabled -> items[${widget}].options.disabled -> toolbar.disabled`, function() {
                            this.createInstance(getInitialToolbarOptions());

                            openDropDownMenuIfExist(this.toolbar);
                            checkDisabledState(this.toolbar, widget, isToolbarDisabled, isItemDisabled, isItemOptionsDisabled, focusableElementSelector);

                            let currentToolbarDisabledState = isToolbarDisabled;
                            let currentItemOptionsDisabledState = isItemOptionsDisabled;
                            let currentItemDisabledState = isItemDisabled;
                            [true, false, undefined].forEach((newToolbarDisabledValue) => {
                                [true, false, undefined].forEach((newItemDisabledValue) => {
                                    [true, false, undefined].forEach((newItemOptionsDisabledValue) => {
                                        this.toolbar.option('items[0].disabled', newItemDisabledValue);
                                        currentItemDisabledState = newItemDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('items[0].options.disabled', newItemOptionsDisabledValue);
                                        currentItemOptionsDisabledState = newItemOptionsDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);

                                        this.toolbar.option('disabled', newToolbarDisabledValue);
                                        currentToolbarDisabledState = newToolbarDisabledValue;
                                        openDropDownMenuIfExist(this.toolbar);
                                        checkDisabledState(this.toolbar, widget, currentToolbarDisabledState, currentItemDisabledState, currentItemOptionsDisabledState, focusableElementSelector);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
