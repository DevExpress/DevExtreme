System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/responsive_box', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxResponsiveBox, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiColComponent, DxiItemComponent, DxiRowComponent, DxiColModule, DxiItemModule, DxiLocationModule, DxiRowModule;
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
            DxResponsiveBox = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiColComponent = module.DxiColComponent;
            DxiItemComponent = module.DxiItemComponent;
            DxiRowComponent = module.DxiRowComponent;
            DxiColModule = module.DxiColModule;
            DxiItemModule = module.DxiItemModule;
            DxiLocationModule = module.DxiLocationModule;
            DxiRowModule = module.DxiRowModule;
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
             * The ResponsiveBox UI component allows you to create an application or a website with a layout adapted to different screen sizes.

             */
            class DxResponsiveBoxComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the collection of columns for the grid used to position layout elements.
                
                 */
                get cols() {
                    return this._getOption('cols');
                }
                set cols(value) {
                    this._setOption('cols', value);
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
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
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
                 * Specifies the collection of rows for the grid used to position layout elements.
                
                 */
                get rows() {
                    return this._getOption('rows');
                }
                set rows(value) {
                    this._setOption('rows', value);
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
                 * Specifies the function returning the size qualifier depending on the screen&apos;s width.
                
                 */
                get screenByWidth() {
                    return this._getOption('screenByWidth');
                }
                set screenByWidth(value) {
                    this._setOption('screenByWidth', value);
                }
                /**
                 * Specifies on which screens all layout elements should be arranged in a single column. Accepts a single or several size qualifiers separated by a space.
                
                 */
                get singleColumnScreen() {
                    return this._getOption('singleColumnScreen');
                }
                set singleColumnScreen(value) {
                    this._setOption('singleColumnScreen', value);
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
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                colsChange;
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
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
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
                rowsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                screenByWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                singleColumnScreenChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                get colsChildren() {
                    return this._getOption('cols');
                }
                set colsChildren(value) {
                    this.setChildren('cols', value);
                }
                get itemsChildren() {
                    return this._getOption('items');
                }
                set itemsChildren(value) {
                    this.setChildren('items', value);
                }
                get rowsChildren() {
                    return this._getOption('rows');
                }
                set rowsChildren(value) {
                    this.setChildren('rows', value);
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
                        { emit: 'colsChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'heightChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'itemHoldTimeoutChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'rowsChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'screenByWidthChange' },
                        { emit: 'singleColumnScreenChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxResponsiveBox(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('cols', changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('items', changes);
                    this.setupChanges('rows', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('cols');
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('items');
                    this._idh.doCheck('rows');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResponsiveBoxComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxResponsiveBoxComponent, selector: "dx-responsive-box", inputs: { cols: "cols", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", height: "height", hoverStateEnabled: "hoverStateEnabled", itemHoldTimeout: "itemHoldTimeout", items: "items", itemTemplate: "itemTemplate", rows: "rows", rtlEnabled: "rtlEnabled", screenByWidth: "screenByWidth", singleColumnScreen: "singleColumnScreen", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onItemContextMenu: "onItemContextMenu", onItemHold: "onItemHold", onItemRendered: "onItemRendered", onOptionChanged: "onOptionChanged", colsChange: "colsChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", heightChange: "heightChange", hoverStateEnabledChange: "hoverStateEnabledChange", itemHoldTimeoutChange: "itemHoldTimeoutChange", itemsChange: "itemsChange", itemTemplateChange: "itemTemplateChange", rowsChange: "rowsChange", rtlEnabledChange: "rtlEnabledChange", screenByWidthChange: "screenByWidthChange", singleColumnScreenChange: "singleColumnScreenChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "colsChildren", predicate: DxiColComponent }, { propertyName: "itemsChildren", predicate: DxiItemComponent }, { propertyName: "rowsChildren", predicate: DxiRowComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxResponsiveBoxComponent", DxResponsiveBoxComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResponsiveBoxComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-responsive-box',
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
                            }] }], propDecorators: { cols: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], itemHoldTimeout: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], rows: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], screenByWidth: [{
                            type: Input
                        }], singleColumnScreen: [{
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
                        }], colsChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], itemHoldTimeoutChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], rowsChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], screenByWidthChange: [{
                            type: Output
                        }], singleColumnScreenChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], colsChildren: [{
                            type: ContentChildren,
                            args: [DxiColComponent]
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }], rowsChildren: [{
                            type: ContentChildren,
                            args: [DxiRowComponent]
                        }] } });
            class DxResponsiveBoxModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResponsiveBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxResponsiveBoxModule, declarations: [DxResponsiveBoxComponent], imports: [DxiColModule,
                        DxiItemModule,
                        DxiLocationModule,
                        DxiRowModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxResponsiveBoxComponent, DxiColModule,
                        DxiItemModule,
                        DxiLocationModule,
                        DxiRowModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResponsiveBoxModule, imports: [DxiColModule,
                        DxiItemModule,
                        DxiLocationModule,
                        DxiRowModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiColModule,
                        DxiItemModule,
                        DxiLocationModule,
                        DxiRowModule,
                        DxTemplateModule] });
            } exports("DxResponsiveBoxModule", DxResponsiveBoxModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResponsiveBoxModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiColModule,
                                    DxiItemModule,
                                    DxiLocationModule,
                                    DxiRowModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxResponsiveBoxComponent
                                ],
                                exports: [
                                    DxResponsiveBoxComponent,
                                    DxiColModule,
                                    DxiItemModule,
                                    DxiLocationModule,
                                    DxiRowModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
