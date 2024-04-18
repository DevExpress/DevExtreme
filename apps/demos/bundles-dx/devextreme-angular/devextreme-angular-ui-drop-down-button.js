System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/drop_down_button', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxDropDownButton, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxoDropDownOptionsModule, DxoAnimationModule, DxoHideModule, DxoFromModule, DxoPositionModule, DxoAtModule, DxoBoundaryOffsetModule, DxoCollisionModule, DxoMyModule, DxoOffsetModule, DxoToModule, DxoShowModule, DxiToolbarItemModule, DxiItemModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxDropDownButton = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiItemComponent = module.DxiItemComponent;
            DxoDropDownOptionsModule = module.DxoDropDownOptionsModule;
            DxoAnimationModule = module.DxoAnimationModule;
            DxoHideModule = module.DxoHideModule;
            DxoFromModule = module.DxoFromModule;
            DxoPositionModule = module.DxoPositionModule;
            DxoAtModule = module.DxoAtModule;
            DxoBoundaryOffsetModule = module.DxoBoundaryOffsetModule;
            DxoCollisionModule = module.DxoCollisionModule;
            DxoMyModule = module.DxoMyModule;
            DxoOffsetModule = module.DxoOffsetModule;
            DxoToModule = module.DxoToModule;
            DxoShowModule = module.DxoShowModule;
            DxiToolbarItemModule = module.DxiToolbarItemModule;
            DxiItemModule = module.DxiItemModule;
        }, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            /**
             * The DropDownButton is a button that opens a drop-down menu.

             */
            class DxDropDownButtonComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the shortcut key that sets focus on the UI component.
                
                 */
                get accessKey() {
                    return this._getOption('accessKey');
                }
                set accessKey(value) {
                    this._setOption('accessKey', value);
                }
                /**
                 * Specifies whether the UI component changes its visual state as a result of user interaction.
                
                 */
                get activeStateEnabled() {
                    return this._getOption('activeStateEnabled');
                }
                set activeStateEnabled(value) {
                    this._setOption('activeStateEnabled', value);
                }
                /**
                 * Provides data for the drop-down menu.
                
                 */
                get dataSource() {
                    return this._getOption('dataSource');
                }
                set dataSource(value) {
                    this._setOption('dataSource', value);
                }
                /**
                 * Specifies whether to wait until the drop-down menu is opened the first time to render its content. Specifies whether to render the view&apos;s content when it is displayed. If false, the content is rendered immediately.
                
                 */
                get deferRendering() {
                    return this._getOption('deferRendering');
                }
                set deferRendering(value) {
                    this._setOption('deferRendering', value);
                }
                /**
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
                }
                /**
                 * Specifies the data field whose values should be displayed in the drop-down menu.
                
                 */
                get displayExpr() {
                    return this._getOption('displayExpr');
                }
                set displayExpr(value) {
                    this._setOption('displayExpr', value);
                }
                /**
                 * Specifies custom content for the drop-down field.
                
                 */
                get dropDownContentTemplate() {
                    return this._getOption('dropDownContentTemplate');
                }
                set dropDownContentTemplate(value) {
                    this._setOption('dropDownContentTemplate', value);
                }
                /**
                 * Configures the drop-down field.
                
                 */
                get dropDownOptions() {
                    return this._getOption('dropDownOptions');
                }
                set dropDownOptions(value) {
                    this._setOption('dropDownOptions', value);
                }
                /**
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies whether users can use keyboard to focus the UI component.
                
                 */
                get focusStateEnabled() {
                    return this._getOption('focusStateEnabled');
                }
                set focusStateEnabled(value) {
                    this._setOption('focusStateEnabled', value);
                }
                /**
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Specifies text for a hint that appears when a user pauses on the UI component.
                
                 */
                get hint() {
                    return this._getOption('hint');
                }
                set hint(value) {
                    this._setOption('hint', value);
                }
                /**
                 * Specifies whether the UI component changes its state when a user hovers the mouse pointer over it.
                
                 */
                get hoverStateEnabled() {
                    return this._getOption('hoverStateEnabled');
                }
                set hoverStateEnabled(value) {
                    this._setOption('hoverStateEnabled', value);
                }
                /**
                 * Specifies the button&apos;s icon.
                
                 */
                get icon() {
                    return this._getOption('icon');
                }
                set icon(value) {
                    this._setOption('icon', value);
                }
                /**
                 * Provides drop-down menu items.
                
                 */
                get items() {
                    return this._getOption('items');
                }
                set items(value) {
                    this._setOption('items', value);
                }
                /**
                 * Specifies a custom template for drop-down menu items.
                
                 */
                get itemTemplate() {
                    return this._getOption('itemTemplate');
                }
                set itemTemplate(value) {
                    this._setOption('itemTemplate', value);
                }
                /**
                 * Specifies which data field provides keys used to distinguish between the selected drop-down menu items.
                
                 */
                get keyExpr() {
                    return this._getOption('keyExpr');
                }
                set keyExpr(value) {
                    this._setOption('keyExpr', value);
                }
                /**
                 * Specifies the text or HTML markup displayed in the drop-down menu when it does not contain any items.
                
                 */
                get noDataText() {
                    return this._getOption('noDataText');
                }
                set noDataText(value) {
                    this._setOption('noDataText', value);
                }
                /**
                 * Specifies whether the drop-down menu is opened.
                
                 */
                get opened() {
                    return this._getOption('opened');
                }
                set opened(value) {
                    this._setOption('opened', value);
                }
                /**
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * Contains the selected item&apos;s data. Available when useSelectMode is true.
                
                 */
                get selectedItem() {
                    return this._getOption('selectedItem');
                }
                set selectedItem(value) {
                    this._setOption('selectedItem', value);
                }
                /**
                 * Contains the selected item&apos;s key and allows you to specify the initially selected item. Applies when useSelectMode is true.
                
                 */
                get selectedItemKey() {
                    return this._getOption('selectedItemKey');
                }
                set selectedItemKey(value) {
                    this._setOption('selectedItemKey', value);
                }
                /**
                 * Specifies whether the arrow icon should be displayed.
                
                 */
                get showArrowIcon() {
                    return this._getOption('showArrowIcon');
                }
                set showArrowIcon(value) {
                    this._setOption('showArrowIcon', value);
                }
                /**
                 * Specifies whether to split the button in two: one executes an action, the other opens and closes the drop-down menu.
                
                 */
                get splitButton() {
                    return this._getOption('splitButton');
                }
                set splitButton(value) {
                    this._setOption('splitButton', value);
                }
                /**
                 * Specifies how the button is styled.
                
                 */
                get stylingMode() {
                    return this._getOption('stylingMode');
                }
                set stylingMode(value) {
                    this._setOption('stylingMode', value);
                }
                /**
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * Specifies a custom template for the base button in DropDownButton.
                
                 */
                get template() {
                    return this._getOption('template');
                }
                set template(value) {
                    this._setOption('template', value);
                }
                /**
                 * Specifies the button&apos;s text. Applies only if useSelectMode is false.
                
                 */
                get text() {
                    return this._getOption('text');
                }
                set text(value) {
                    this._setOption('text', value);
                }
                /**
                 * Specifies the drop-down button type.
                
                 */
                get type() {
                    return this._getOption('type');
                }
                set type(value) {
                    this._setOption('type', value);
                }
                /**
                 * Specifies whether the widget uses item&apos;s text a title attribute.
                
                 */
                get useItemTextAsTitle() {
                    return this._getOption('useItemTextAsTitle');
                }
                set useItemTextAsTitle(value) {
                    this._setOption('useItemTextAsTitle', value);
                }
                /**
                 * Specifies whether the UI component stores the selected drop-down menu item.
                
                 */
                get useSelectMode() {
                    return this._getOption('useSelectMode');
                }
                set useSelectMode(value) {
                    this._setOption('useSelectMode', value);
                }
                /**
                 * Specifies whether the UI component is visible.
                
                 */
                get visible() {
                    return this._getOption('visible');
                }
                set visible(value) {
                    this._setOption('visible', value);
                }
                /**
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                 * Specifies whether text that exceeds the drop-down list width should be wrapped.
                
                 */
                get wrapItemText() {
                    return this._getOption('wrapItemText');
                }
                set wrapItemText(value) {
                    this._setOption('wrapItemText', value);
                }
                /**
                
                 * A function that is executed when the button is clicked or tapped. If splitButton is true, this function is executed for the action button only.
                
                
                 */
                onButtonClick;
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed when a drop-down menu item is clicked.
                
                
                 */
                onItemClick;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when an item is selected or selection is canceled. In effect when useSelectMode is true.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                activeStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                deferRenderingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                displayExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dropDownContentTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dropDownOptionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                iconChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                keyExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                noDataTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                openedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showArrowIconChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                splitButtonChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                stylingModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                templateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                textChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                typeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useItemTextAsTitleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useSelectModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                wrapItemTextChange;
                get itemsChildren() {
                    return this._getOption('items');
                }
                set itemsChildren(value) {
                    this.setChildren('items', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'buttonClick', emit: 'onButtonClick' },
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemClick', emit: 'onItemClick' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'deferRenderingChange' },
                        { emit: 'disabledChange' },
                        { emit: 'displayExprChange' },
                        { emit: 'dropDownContentTemplateChange' },
                        { emit: 'dropDownOptionsChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'iconChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'keyExprChange' },
                        { emit: 'noDataTextChange' },
                        { emit: 'openedChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'selectedItemChange' },
                        { emit: 'selectedItemKeyChange' },
                        { emit: 'showArrowIconChange' },
                        { emit: 'splitButtonChange' },
                        { emit: 'stylingModeChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'templateChange' },
                        { emit: 'textChange' },
                        { emit: 'typeChange' },
                        { emit: 'useItemTextAsTitleChange' },
                        { emit: 'useSelectModeChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'wrapItemTextChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxDropDownButton(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('items', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('items');
                    this._watcherHelper.checkWatchers();
                    super.ngDoCheck();
                    super.clearChangedOptions();
                }
                _setOption(name, value) {
                    let isSetup = this._idh.setupSingle(name, value);
                    let isChanged = this._idh.getChanges(name, value) !== null;
                    if (isSetup || isChanged) {
                        super._setOption(name, value);
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownButtonComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxDropDownButtonComponent, selector: "dx-drop-down-button", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", dataSource: "dataSource", deferRendering: "deferRendering", disabled: "disabled", displayExpr: "displayExpr", dropDownContentTemplate: "dropDownContentTemplate", dropDownOptions: "dropDownOptions", elementAttr: "elementAttr", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", icon: "icon", items: "items", itemTemplate: "itemTemplate", keyExpr: "keyExpr", noDataText: "noDataText", opened: "opened", rtlEnabled: "rtlEnabled", selectedItem: "selectedItem", selectedItemKey: "selectedItemKey", showArrowIcon: "showArrowIcon", splitButton: "splitButton", stylingMode: "stylingMode", tabIndex: "tabIndex", template: "template", text: "text", type: "type", useItemTextAsTitle: "useItemTextAsTitle", useSelectMode: "useSelectMode", visible: "visible", width: "width", wrapItemText: "wrapItemText" }, outputs: { onButtonClick: "onButtonClick", onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onOptionChanged: "onOptionChanged", onSelectionChanged: "onSelectionChanged", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", dataSourceChange: "dataSourceChange", deferRenderingChange: "deferRenderingChange", disabledChange: "disabledChange", displayExprChange: "displayExprChange", dropDownContentTemplateChange: "dropDownContentTemplateChange", dropDownOptionsChange: "dropDownOptionsChange", elementAttrChange: "elementAttrChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", iconChange: "iconChange", itemsChange: "itemsChange", itemTemplateChange: "itemTemplateChange", keyExprChange: "keyExprChange", noDataTextChange: "noDataTextChange", openedChange: "openedChange", rtlEnabledChange: "rtlEnabledChange", selectedItemChange: "selectedItemChange", selectedItemKeyChange: "selectedItemKeyChange", showArrowIconChange: "showArrowIconChange", splitButtonChange: "splitButtonChange", stylingModeChange: "stylingModeChange", tabIndexChange: "tabIndexChange", templateChange: "templateChange", textChange: "textChange", typeChange: "typeChange", useItemTextAsTitleChange: "useItemTextAsTitleChange", useSelectModeChange: "useSelectModeChange", visibleChange: "visibleChange", widthChange: "widthChange", wrapItemTextChange: "wrapItemTextChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxDropDownButtonComponent", DxDropDownButtonComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownButtonComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-drop-down-button',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { accessKey: [{
                            type: Input
                        }], activeStateEnabled: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], deferRendering: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], displayExpr: [{
                            type: Input
                        }], dropDownContentTemplate: [{
                            type: Input
                        }], dropDownOptions: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], icon: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], keyExpr: [{
                            type: Input
                        }], noDataText: [{
                            type: Input
                        }], opened: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], selectedItem: [{
                            type: Input
                        }], selectedItemKey: [{
                            type: Input
                        }], showArrowIcon: [{
                            type: Input
                        }], splitButton: [{
                            type: Input
                        }], stylingMode: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], template: [{
                            type: Input
                        }], text: [{
                            type: Input
                        }], type: [{
                            type: Input
                        }], useItemTextAsTitle: [{
                            type: Input
                        }], useSelectMode: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], wrapItemText: [{
                            type: Input
                        }], onButtonClick: [{
                            type: Output
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemClick: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], deferRenderingChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], displayExprChange: [{
                            type: Output
                        }], dropDownContentTemplateChange: [{
                            type: Output
                        }], dropDownOptionsChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], iconChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], keyExprChange: [{
                            type: Output
                        }], noDataTextChange: [{
                            type: Output
                        }], openedChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], selectedItemChange: [{
                            type: Output
                        }], selectedItemKeyChange: [{
                            type: Output
                        }], showArrowIconChange: [{
                            type: Output
                        }], splitButtonChange: [{
                            type: Output
                        }], stylingModeChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], templateChange: [{
                            type: Output
                        }], textChange: [{
                            type: Output
                        }], typeChange: [{
                            type: Output
                        }], useItemTextAsTitleChange: [{
                            type: Output
                        }], useSelectModeChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], wrapItemTextChange: [{
                            type: Output
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }] } });
            class DxDropDownButtonModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownButtonModule, declarations: [DxDropDownButtonComponent], imports: [DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxDropDownButtonComponent, DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownButtonModule, imports: [DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxTemplateModule] });
            } exports("DxDropDownButtonModule", DxDropDownButtonModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownButtonModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoDropDownOptionsModule,
                                    DxoAnimationModule,
                                    DxoHideModule,
                                    DxoFromModule,
                                    DxoPositionModule,
                                    DxoAtModule,
                                    DxoBoundaryOffsetModule,
                                    DxoCollisionModule,
                                    DxoMyModule,
                                    DxoOffsetModule,
                                    DxoToModule,
                                    DxoShowModule,
                                    DxiToolbarItemModule,
                                    DxiItemModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxDropDownButtonComponent
                                ],
                                exports: [
                                    DxDropDownButtonComponent,
                                    DxoDropDownOptionsModule,
                                    DxoAnimationModule,
                                    DxoHideModule,
                                    DxoFromModule,
                                    DxoPositionModule,
                                    DxoAtModule,
                                    DxoBoundaryOffsetModule,
                                    DxoCollisionModule,
                                    DxoMyModule,
                                    DxoOffsetModule,
                                    DxoToModule,
                                    DxoShowModule,
                                    DxiToolbarItemModule,
                                    DxiItemModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
