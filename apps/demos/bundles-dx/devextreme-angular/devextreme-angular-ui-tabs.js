System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/tabs', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxTabs, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxiItemModule;
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
            DxTabs = module.default;
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
             * The Tabs component is a tab strip used to switch between pages or views. This UI component is included in the TabPanel UI component, but you can use Tabs separately as well.

             */
            class DxTabsComponent extends DxComponent {
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
                 * Binds the UI component to data.
                
                 */
                get dataSource() {
                    return this._getOption('dataSource');
                }
                set dataSource(value) {
                    this._setOption('dataSource', value);
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
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies whether the UI component can be focused using keyboard navigation.
                
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
                 * Specifies whether the UI component changes its state when a user pauses on it.
                
                 */
                get hoverStateEnabled() {
                    return this._getOption('hoverStateEnabled');
                }
                set hoverStateEnabled(value) {
                    this._setOption('hoverStateEnabled', value);
                }
                /**
                 * Specifies icon position relative to the text inside the tab.
                
                 */
                get iconPosition() {
                    return this._getOption('iconPosition');
                }
                set iconPosition(value) {
                    this._setOption('iconPosition', value);
                }
                /**
                 * The time period in milliseconds before the onItemHold event is raised.
                
                 */
                get itemHoldTimeout() {
                    return this._getOption('itemHoldTimeout');
                }
                set itemHoldTimeout(value) {
                    this._setOption('itemHoldTimeout', value);
                }
                /**
                 * An array of items displayed by the UI component.
                
                 */
                get items() {
                    return this._getOption('items');
                }
                set items(value) {
                    this._setOption('items', value);
                }
                /**
                 * Specifies a custom template for items.
                
                 */
                get itemTemplate() {
                    return this._getOption('itemTemplate');
                }
                set itemTemplate(value) {
                    this._setOption('itemTemplate', value);
                }
                /**
                 * Specifies the key property that provides key values to access data items. Each key value must be unique.
                
                 */
                get keyExpr() {
                    return this._getOption('keyExpr');
                }
                set keyExpr(value) {
                    this._setOption('keyExpr', value);
                }
                /**
                 * Specifies the text or HTML markup displayed by the UI component if the item collection is empty.
                
                 */
                get noDataText() {
                    return this._getOption('noDataText');
                }
                set noDataText(value) {
                    this._setOption('noDataText', value);
                }
                /**
                 * Specifies component orientation.
                
                 */
                get orientation() {
                    return this._getOption('orientation');
                }
                set orientation(value) {
                    this._setOption('orientation', value);
                }
                /**
                 * Specifies whether to repaint only those elements whose data changed.
                
                 */
                get repaintChangesOnly() {
                    return this._getOption('repaintChangesOnly');
                }
                set repaintChangesOnly(value) {
                    this._setOption('repaintChangesOnly', value);
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
                 * Specifies whether or not an end user can scroll tabs by swiping.
                
                 */
                get scrollByContent() {
                    return this._getOption('scrollByContent');
                }
                set scrollByContent(value) {
                    this._setOption('scrollByContent', value);
                }
                /**
                 * Specifies whether or not an end user can scroll tabs.
                
                 */
                get scrollingEnabled() {
                    return this._getOption('scrollingEnabled');
                }
                set scrollingEnabled(value) {
                    this._setOption('scrollingEnabled', value);
                }
                /**
                 * The index of the currently selected UI component item.
                
                 */
                get selectedIndex() {
                    return this._getOption('selectedIndex');
                }
                set selectedIndex(value) {
                    this._setOption('selectedIndex', value);
                }
                /**
                 * The selected item object.
                
                 */
                get selectedItem() {
                    return this._getOption('selectedItem');
                }
                set selectedItem(value) {
                    this._setOption('selectedItem', value);
                }
                /**
                 * Specifies an array of currently selected item keys.
                
                 */
                get selectedItemKeys() {
                    return this._getOption('selectedItemKeys');
                }
                set selectedItemKeys(value) {
                    this._setOption('selectedItemKeys', value);
                }
                /**
                 * An array of currently selected item objects.
                
                 */
                get selectedItems() {
                    return this._getOption('selectedItems');
                }
                set selectedItems(value) {
                    this._setOption('selectedItems', value);
                }
                /**
                 * Specifies whether the UI component enables an end user to select only a single item or multiple items.
                
                 */
                get selectionMode() {
                    return this._getOption('selectionMode');
                }
                set selectionMode(value) {
                    this._setOption('selectionMode', value);
                }
                /**
                 * Specifies whether navigation buttons should be available when tabs exceed the UI component&apos;s width.
                
                 */
                get showNavButtons() {
                    return this._getOption('showNavButtons');
                }
                set showNavButtons(value) {
                    this._setOption('showNavButtons', value);
                }
                /**
                 * Specifies the styling mode for the active tab.
                
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
                
                 * A function that is executed when a collection item is clicked or tapped.
                
                
                 */
                onItemClick;
                /**
                
                 * A function that is executed when a collection item is right-clicked or pressed.
                
                
                 */
                onItemContextMenu;
                /**
                
                 * A function that is executed when a collection item has been held for a specified period.
                
                
                 */
                onItemHold;
                /**
                
                 * A function that is executed after a collection item is rendered.
                
                
                 */
                onItemRendered;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when a collection item is selected or selection is canceled.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
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
                iconPositionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemHoldTimeoutChange;
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
                orientationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                repaintChangesOnlyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollByContentChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollingEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemKeysChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectionModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showNavButtonsChange;
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
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
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
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemClick', emit: 'onItemClick' },
                        { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
                        { subscribe: 'itemHold', emit: 'onItemHold' },
                        { subscribe: 'itemRendered', emit: 'onItemRendered' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'iconPositionChange' },
                        { emit: 'itemHoldTimeoutChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'keyExprChange' },
                        { emit: 'noDataTextChange' },
                        { emit: 'orientationChange' },
                        { emit: 'repaintChangesOnlyChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollByContentChange' },
                        { emit: 'scrollingEnabledChange' },
                        { emit: 'selectedIndexChange' },
                        { emit: 'selectedItemChange' },
                        { emit: 'selectedItemKeysChange' },
                        { emit: 'selectedItemsChange' },
                        { emit: 'selectionModeChange' },
                        { emit: 'showNavButtonsChange' },
                        { emit: 'stylingModeChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxTabs(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('items', changes);
                    this.setupChanges('selectedItemKeys', changes);
                    this.setupChanges('selectedItems', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('items');
                    this._idh.doCheck('selectedItemKeys');
                    this._idh.doCheck('selectedItems');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTabsComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxTabsComponent, selector: "dx-tabs", inputs: { accessKey: "accessKey", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", iconPosition: "iconPosition", itemHoldTimeout: "itemHoldTimeout", items: "items", itemTemplate: "itemTemplate", keyExpr: "keyExpr", noDataText: "noDataText", orientation: "orientation", repaintChangesOnly: "repaintChangesOnly", rtlEnabled: "rtlEnabled", scrollByContent: "scrollByContent", scrollingEnabled: "scrollingEnabled", selectedIndex: "selectedIndex", selectedItem: "selectedItem", selectedItemKeys: "selectedItemKeys", selectedItems: "selectedItems", selectionMode: "selectionMode", showNavButtons: "showNavButtons", stylingMode: "stylingMode", tabIndex: "tabIndex", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onItemContextMenu: "onItemContextMenu", onItemHold: "onItemHold", onItemRendered: "onItemRendered", onOptionChanged: "onOptionChanged", onSelectionChanged: "onSelectionChanged", accessKeyChange: "accessKeyChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", iconPositionChange: "iconPositionChange", itemHoldTimeoutChange: "itemHoldTimeoutChange", itemsChange: "itemsChange", itemTemplateChange: "itemTemplateChange", keyExprChange: "keyExprChange", noDataTextChange: "noDataTextChange", orientationChange: "orientationChange", repaintChangesOnlyChange: "repaintChangesOnlyChange", rtlEnabledChange: "rtlEnabledChange", scrollByContentChange: "scrollByContentChange", scrollingEnabledChange: "scrollingEnabledChange", selectedIndexChange: "selectedIndexChange", selectedItemChange: "selectedItemChange", selectedItemKeysChange: "selectedItemKeysChange", selectedItemsChange: "selectedItemsChange", selectionModeChange: "selectionModeChange", showNavButtonsChange: "showNavButtonsChange", stylingModeChange: "stylingModeChange", tabIndexChange: "tabIndexChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxTabsComponent", DxTabsComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTabsComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-tabs',
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
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
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
                        }], iconPosition: [{
                            type: Input
                        }], itemHoldTimeout: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], keyExpr: [{
                            type: Input
                        }], noDataText: [{
                            type: Input
                        }], orientation: [{
                            type: Input
                        }], repaintChangesOnly: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrollByContent: [{
                            type: Input
                        }], scrollingEnabled: [{
                            type: Input
                        }], selectedIndex: [{
                            type: Input
                        }], selectedItem: [{
                            type: Input
                        }], selectedItemKeys: [{
                            type: Input
                        }], selectedItems: [{
                            type: Input
                        }], selectionMode: [{
                            type: Input
                        }], showNavButtons: [{
                            type: Input
                        }], stylingMode: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemClick: [{
                            type: Output
                        }], onItemContextMenu: [{
                            type: Output
                        }], onItemHold: [{
                            type: Output
                        }], onItemRendered: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
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
                        }], iconPositionChange: [{
                            type: Output
                        }], itemHoldTimeoutChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], keyExprChange: [{
                            type: Output
                        }], noDataTextChange: [{
                            type: Output
                        }], orientationChange: [{
                            type: Output
                        }], repaintChangesOnlyChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollByContentChange: [{
                            type: Output
                        }], scrollingEnabledChange: [{
                            type: Output
                        }], selectedIndexChange: [{
                            type: Output
                        }], selectedItemChange: [{
                            type: Output
                        }], selectedItemKeysChange: [{
                            type: Output
                        }], selectedItemsChange: [{
                            type: Output
                        }], selectionModeChange: [{
                            type: Output
                        }], showNavButtonsChange: [{
                            type: Output
                        }], stylingModeChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }] } });
            class DxTabsModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTabsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxTabsModule, declarations: [DxTabsComponent], imports: [DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxTabsComponent, DxiItemModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTabsModule, imports: [DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiItemModule,
                        DxTemplateModule] });
            } exports("DxTabsModule", DxTabsModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxTabsModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiItemModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxTabsComponent
                                ],
                                exports: [
                                    DxTabsComponent,
                                    DxiItemModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
