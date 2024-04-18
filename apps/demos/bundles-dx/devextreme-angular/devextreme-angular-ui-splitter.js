System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/splitter', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxSplitter, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxiItemModule, DxoSplitterModule;
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
            DxSplitter = module.default;
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
            DxoSplitterModule = module.DxoSplitterModule;
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
             * 

             */
            class DxSplitterComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * 
                
                 */
                get allowKeyboardNavigation() {
                    return this._getOption('allowKeyboardNavigation');
                }
                set allowKeyboardNavigation(value) {
                    this._setOption('allowKeyboardNavigation', value);
                }
                /**
                 * 
                
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
                 * 
                
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
                 * 
                
                 */
                get orientation() {
                    return this._getOption('orientation');
                }
                set orientation(value) {
                    this._setOption('orientation', value);
                }
                /**
                 * 
                
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
                 * 
                
                 */
                get separatorSize() {
                    return this._getOption('separatorSize');
                }
                set separatorSize(value) {
                    this._setOption('separatorSize', value);
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
                
                 * 
                
                
                 */
                onContentReady;
                /**
                
                 * 
                
                
                 */
                onDisposing;
                /**
                
                 * 
                
                
                 */
                onInitialized;
                /**
                
                 * 
                
                
                 */
                onItemClick;
                /**
                
                 * 
                
                
                 */
                onItemCollapsed;
                /**
                
                 * 
                
                
                 */
                onItemContextMenu;
                /**
                
                 * 
                
                
                 */
                onItemExpanded;
                /**
                
                 * 
                
                
                 */
                onItemRendered;
                /**
                
                 * 
                
                
                 */
                onOptionChanged;
                /**
                
                 * 
                
                
                 */
                onResize;
                /**
                
                 * 
                
                
                 */
                onResizeEnd;
                /**
                
                 * 
                
                
                 */
                onResizeStart;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowKeyboardNavigationChange;
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
                itemsChange;
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
                repaintChangesOnlyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                separatorSizeChange;
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
                        { subscribe: 'itemCollapsed', emit: 'onItemCollapsed' },
                        { subscribe: 'itemContextMenu', emit: 'onItemContextMenu' },
                        { subscribe: 'itemExpanded', emit: 'onItemExpanded' },
                        { subscribe: 'itemRendered', emit: 'onItemRendered' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'resize', emit: 'onResize' },
                        { subscribe: 'resizeEnd', emit: 'onResizeEnd' },
                        { subscribe: 'resizeStart', emit: 'onResizeStart' },
                        { emit: 'allowKeyboardNavigationChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'heightChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'orientationChange' },
                        { emit: 'repaintChangesOnlyChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'separatorSizeChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxSplitter(element, options);
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSplitterComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxSplitterComponent, selector: "dx-splitter", inputs: { allowKeyboardNavigation: "allowKeyboardNavigation", dataSource: "dataSource", disabled: "disabled", elementAttr: "elementAttr", height: "height", hoverStateEnabled: "hoverStateEnabled", items: "items", itemTemplate: "itemTemplate", orientation: "orientation", repaintChangesOnly: "repaintChangesOnly", rtlEnabled: "rtlEnabled", separatorSize: "separatorSize", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onItemCollapsed: "onItemCollapsed", onItemContextMenu: "onItemContextMenu", onItemExpanded: "onItemExpanded", onItemRendered: "onItemRendered", onOptionChanged: "onOptionChanged", onResize: "onResize", onResizeEnd: "onResizeEnd", onResizeStart: "onResizeStart", allowKeyboardNavigationChange: "allowKeyboardNavigationChange", dataSourceChange: "dataSourceChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", heightChange: "heightChange", hoverStateEnabledChange: "hoverStateEnabledChange", itemsChange: "itemsChange", itemTemplateChange: "itemTemplateChange", orientationChange: "orientationChange", repaintChangesOnlyChange: "repaintChangesOnlyChange", rtlEnabledChange: "rtlEnabledChange", separatorSizeChange: "separatorSizeChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxSplitterComponent", DxSplitterComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSplitterComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-splitter',
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
                            }] }], propDecorators: { allowKeyboardNavigation: [{
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
                        }], items: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], orientation: [{
                            type: Input
                        }], repaintChangesOnly: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], separatorSize: [{
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
                        }], onItemCollapsed: [{
                            type: Output
                        }], onItemContextMenu: [{
                            type: Output
                        }], onItemExpanded: [{
                            type: Output
                        }], onItemRendered: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onResize: [{
                            type: Output
                        }], onResizeEnd: [{
                            type: Output
                        }], onResizeStart: [{
                            type: Output
                        }], allowKeyboardNavigationChange: [{
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
                        }], itemsChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], orientationChange: [{
                            type: Output
                        }], repaintChangesOnlyChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], separatorSizeChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }] } });
            class DxSplitterModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSplitterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxSplitterModule, declarations: [DxSplitterComponent], imports: [DxiItemModule,
                        DxoSplitterModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxSplitterComponent, DxiItemModule,
                        DxoSplitterModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSplitterModule, imports: [DxiItemModule,
                        DxoSplitterModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiItemModule,
                        DxoSplitterModule,
                        DxTemplateModule] });
            } exports("DxSplitterModule", DxSplitterModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSplitterModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiItemModule,
                                    DxoSplitterModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxSplitterComponent
                                ],
                                exports: [
                                    DxSplitterComponent,
                                    DxiItemModule,
                                    DxoSplitterModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
