System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/menu', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxMenu, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxoAnimationModule, DxoHideModule, DxoFromModule, DxoPositionModule, DxoAtModule, DxoBoundaryOffsetModule, DxoCollisionModule, DxoMyModule, DxoOffsetModule, DxoToModule, DxoShowModule, DxiItemModule, DxoShowFirstSubmenuModeModule, DxoDelayModule, DxoShowSubmenuModeModule;
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
            DxMenu = module.default;
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
            DxiItemModule = module.DxiItemModule;
            DxoShowFirstSubmenuModeModule = module.DxoShowFirstSubmenuModeModule;
            DxoDelayModule = module.DxoDelayModule;
            DxoShowSubmenuModeModule = module.DxoShowSubmenuModeModule;
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
             * The Menu UI component is a panel with clickable items. A click on an item opens a drop-down menu, which can contain several submenus.

             */
            class DxMenuComponent extends DxComponent {
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
                 * Specifies whether adaptive rendering is enabled. This property is in effect only if the orientation is &apos;horizontal&apos;.
                
                 */
                get adaptivityEnabled() {
                    return this._getOption('adaptivityEnabled');
                }
                set adaptivityEnabled(value) {
                    this._setOption('adaptivityEnabled', value);
                }
                /**
                 * Configures UI component visibility animations. This object contains two fields: show and hide.
                
                 */
                get animation() {
                    return this._getOption('animation');
                }
                set animation(value) {
                    this._setOption('animation', value);
                }
                /**
                 * Specifies the name of the CSS class to be applied to the root menu level and all submenus.
                
                 */
                get cssClass() {
                    return this._getOption('cssClass');
                }
                set cssClass(value) {
                    this._setOption('cssClass', value);
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
                 * Specifies the name of the data source item field whose value defines whether or not the corresponding UI component item is disabled.
                
                 */
                get disabledExpr() {
                    return this._getOption('disabledExpr');
                }
                set disabledExpr(value) {
                    this._setOption('disabledExpr', value);
                }
                /**
                 * Specifies the data field whose values should be displayed.
                
                 */
                get displayExpr() {
                    return this._getOption('displayExpr');
                }
                set displayExpr(value) {
                    this._setOption('displayExpr', value);
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
                 * Specifies whether or not the submenu is hidden when the mouse pointer leaves it.
                
                 */
                get hideSubmenuOnMouseLeave() {
                    return this._getOption('hideSubmenuOnMouseLeave');
                }
                set hideSubmenuOnMouseLeave(value) {
                    this._setOption('hideSubmenuOnMouseLeave', value);
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
                 * Holds an array of menu items.
                
                 */
                get items() {
                    return this._getOption('items');
                }
                set items(value) {
                    this._setOption('items', value);
                }
                /**
                 * Specifies which data field contains nested items.
                
                 */
                get itemsExpr() {
                    return this._getOption('itemsExpr');
                }
                set itemsExpr(value) {
                    this._setOption('itemsExpr', value);
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
                 * Specifies whether the menu has horizontal or vertical orientation.
                
                 */
                get orientation() {
                    return this._getOption('orientation');
                }
                set orientation(value) {
                    this._setOption('orientation', value);
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
                 * Specifies whether an item is selected if a user clicks it.
                
                 */
                get selectByClick() {
                    return this._getOption('selectByClick');
                }
                set selectByClick(value) {
                    this._setOption('selectByClick', value);
                }
                /**
                 * Specifies the name of the data source item field whose value defines whether or not the corresponding UI component items is selected.
                
                 */
                get selectedExpr() {
                    return this._getOption('selectedExpr');
                }
                set selectedExpr(value) {
                    this._setOption('selectedExpr', value);
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
                 * Specifies the selection mode supported by the menu.
                
                 */
                get selectionMode() {
                    return this._getOption('selectionMode');
                }
                set selectionMode(value) {
                    this._setOption('selectionMode', value);
                }
                /**
                 * Specifies properties for showing and hiding the first level submenu.
                
                 */
                get showFirstSubmenuMode() {
                    return this._getOption('showFirstSubmenuMode');
                }
                set showFirstSubmenuMode(value) {
                    this._setOption('showFirstSubmenuMode', value);
                }
                /**
                 * Specifies properties of submenu showing and hiding.
                
                 */
                get showSubmenuMode() {
                    return this._getOption('showSubmenuMode');
                }
                set showSubmenuMode(value) {
                    this._setOption('showSubmenuMode', value);
                }
                /**
                 * Specifies the direction at which the submenus are displayed.
                
                 */
                get submenuDirection() {
                    return this._getOption('submenuDirection');
                }
                set submenuDirection(value) {
                    this._setOption('submenuDirection', value);
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
                
                 * A function that is executed after a submenu is hidden.
                
                
                 */
                onSubmenuHidden;
                /**
                
                 * A function that is executed before a submenu is hidden.
                
                
                 */
                onSubmenuHiding;
                /**
                
                 * A function that is executed before a submenu is displayed.
                
                
                 */
                onSubmenuShowing;
                /**
                
                 * A function that is executed after a submenu is displayed.
                
                
                 */
                onSubmenuShown;
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
                adaptivityEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                animationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cssClassChange;
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
                disabledExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                displayExprChange;
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
                hideSubmenuOnMouseLeaveChange;
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
                itemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemsExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                orientationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectByClickChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectionModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showFirstSubmenuModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showSubmenuModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                submenuDirectionChange;
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
                        { subscribe: 'itemRendered', emit: 'onItemRendered' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { subscribe: 'submenuHidden', emit: 'onSubmenuHidden' },
                        { subscribe: 'submenuHiding', emit: 'onSubmenuHiding' },
                        { subscribe: 'submenuShowing', emit: 'onSubmenuShowing' },
                        { subscribe: 'submenuShown', emit: 'onSubmenuShown' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'adaptivityEnabledChange' },
                        { emit: 'animationChange' },
                        { emit: 'cssClassChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'disabledExprChange' },
                        { emit: 'displayExprChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hideSubmenuOnMouseLeaveChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemsExprChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'orientationChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'selectByClickChange' },
                        { emit: 'selectedExprChange' },
                        { emit: 'selectedItemChange' },
                        { emit: 'selectionModeChange' },
                        { emit: 'showFirstSubmenuModeChange' },
                        { emit: 'showSubmenuModeChange' },
                        { emit: 'submenuDirectionChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxMenu(element, options);
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMenuComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxMenuComponent, selector: "dx-menu", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", adaptivityEnabled: "adaptivityEnabled", animation: "animation", cssClass: "cssClass", dataSource: "dataSource", disabled: "disabled", disabledExpr: "disabledExpr", displayExpr: "displayExpr", elementAttr: "elementAttr", focusStateEnabled: "focusStateEnabled", height: "height", hideSubmenuOnMouseLeave: "hideSubmenuOnMouseLeave", hint: "hint", hoverStateEnabled: "hoverStateEnabled", items: "items", itemsExpr: "itemsExpr", itemTemplate: "itemTemplate", orientation: "orientation", rtlEnabled: "rtlEnabled", selectByClick: "selectByClick", selectedExpr: "selectedExpr", selectedItem: "selectedItem", selectionMode: "selectionMode", showFirstSubmenuMode: "showFirstSubmenuMode", showSubmenuMode: "showSubmenuMode", submenuDirection: "submenuDirection", tabIndex: "tabIndex", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onItemContextMenu: "onItemContextMenu", onItemRendered: "onItemRendered", onOptionChanged: "onOptionChanged", onSelectionChanged: "onSelectionChanged", onSubmenuHidden: "onSubmenuHidden", onSubmenuHiding: "onSubmenuHiding", onSubmenuShowing: "onSubmenuShowing", onSubmenuShown: "onSubmenuShown", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", adaptivityEnabledChange: "adaptivityEnabledChange", animationChange: "animationChange", cssClassChange: "cssClassChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", disabledExprChange: "disabledExprChange", displayExprChange: "displayExprChange", elementAttrChange: "elementAttrChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hideSubmenuOnMouseLeaveChange: "hideSubmenuOnMouseLeaveChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", itemsChange: "itemsChange", itemsExprChange: "itemsExprChange", itemTemplateChange: "itemTemplateChange", orientationChange: "orientationChange", rtlEnabledChange: "rtlEnabledChange", selectByClickChange: "selectByClickChange", selectedExprChange: "selectedExprChange", selectedItemChange: "selectedItemChange", selectionModeChange: "selectionModeChange", showFirstSubmenuModeChange: "showFirstSubmenuModeChange", showSubmenuModeChange: "showSubmenuModeChange", submenuDirectionChange: "submenuDirectionChange", tabIndexChange: "tabIndexChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxMenuComponent", DxMenuComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMenuComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-menu',
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
                        }], adaptivityEnabled: [{
                            type: Input
                        }], animation: [{
                            type: Input
                        }], cssClass: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], disabledExpr: [{
                            type: Input
                        }], displayExpr: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hideSubmenuOnMouseLeave: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemsExpr: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], orientation: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], selectByClick: [{
                            type: Input
                        }], selectedExpr: [{
                            type: Input
                        }], selectedItem: [{
                            type: Input
                        }], selectionMode: [{
                            type: Input
                        }], showFirstSubmenuMode: [{
                            type: Input
                        }], showSubmenuMode: [{
                            type: Input
                        }], submenuDirection: [{
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
                        }], onItemRendered: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], onSubmenuHidden: [{
                            type: Output
                        }], onSubmenuHiding: [{
                            type: Output
                        }], onSubmenuShowing: [{
                            type: Output
                        }], onSubmenuShown: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], adaptivityEnabledChange: [{
                            type: Output
                        }], animationChange: [{
                            type: Output
                        }], cssClassChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], disabledExprChange: [{
                            type: Output
                        }], displayExprChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hideSubmenuOnMouseLeaveChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemsExprChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], orientationChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], selectByClickChange: [{
                            type: Output
                        }], selectedExprChange: [{
                            type: Output
                        }], selectedItemChange: [{
                            type: Output
                        }], selectionModeChange: [{
                            type: Output
                        }], showFirstSubmenuModeChange: [{
                            type: Output
                        }], showSubmenuModeChange: [{
                            type: Output
                        }], submenuDirectionChange: [{
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
            class DxMenuModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxMenuModule, declarations: [DxMenuComponent], imports: [DxoAnimationModule,
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
                        DxiItemModule,
                        DxoShowFirstSubmenuModeModule,
                        DxoDelayModule,
                        DxoShowSubmenuModeModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxMenuComponent, DxoAnimationModule,
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
                        DxiItemModule,
                        DxoShowFirstSubmenuModeModule,
                        DxoDelayModule,
                        DxoShowSubmenuModeModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMenuModule, imports: [DxoAnimationModule,
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
                        DxiItemModule,
                        DxoShowFirstSubmenuModeModule,
                        DxoDelayModule,
                        DxoShowSubmenuModeModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAnimationModule,
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
                        DxiItemModule,
                        DxoShowFirstSubmenuModeModule,
                        DxoDelayModule,
                        DxoShowSubmenuModeModule,
                        DxTemplateModule] });
            } exports("DxMenuModule", DxMenuModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxMenuModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
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
                                    DxiItemModule,
                                    DxoShowFirstSubmenuModeModule,
                                    DxoDelayModule,
                                    DxoShowSubmenuModeModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxMenuComponent
                                ],
                                exports: [
                                    DxMenuComponent,
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
                                    DxiItemModule,
                                    DxoShowFirstSubmenuModeModule,
                                    DxoDelayModule,
                                    DxoShowSubmenuModeModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
