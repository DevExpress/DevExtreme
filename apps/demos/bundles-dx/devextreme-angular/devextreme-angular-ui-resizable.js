System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/resizable', './devextreme-angular-core.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxResizable, DxComponent, DxTemplateHost, WatcherHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule;
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
            NgModule = module.NgModule;
        }, function (module) {
            DxResizable = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
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
             * The Resizable UI component enables its content to be resizable in the UI.

             */
            class DxResizableComponent extends DxComponent {
                instance = null;
                /**
                 * Specifies the area within which users can resize the UI component.
                
                 */
                get area() {
                    return this._getOption('area');
                }
                set area(value) {
                    this._setOption('area', value);
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
                 * Specifies which borders of the UI component element are used as a handle.
                
                 */
                get handles() {
                    return this._getOption('handles');
                }
                set handles(value) {
                    this._setOption('handles', value);
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
                 * Specifies whether to resize the UI component&apos;s content proportionally when you use corner handles.
                
                 */
                get keepAspectRatio() {
                    return this._getOption('keepAspectRatio');
                }
                set keepAspectRatio(value) {
                    this._setOption('keepAspectRatio', value);
                }
                /**
                 * Specifies the upper height boundary for resizing.
                
                 */
                get maxHeight() {
                    return this._getOption('maxHeight');
                }
                set maxHeight(value) {
                    this._setOption('maxHeight', value);
                }
                /**
                 * Specifies the upper width boundary for resizing.
                
                 */
                get maxWidth() {
                    return this._getOption('maxWidth');
                }
                set maxWidth(value) {
                    this._setOption('maxWidth', value);
                }
                /**
                 * Specifies the lower height boundary for resizing.
                
                 */
                get minHeight() {
                    return this._getOption('minHeight');
                }
                set minHeight(value) {
                    this._setOption('minHeight', value);
                }
                /**
                 * Specifies the lower width boundary for resizing.
                
                 */
                get minWidth() {
                    return this._getOption('minWidth');
                }
                set minWidth(value) {
                    this._setOption('minWidth', value);
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
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed each time the UI component is resized by one pixel.
                
                
                 */
                onResize;
                /**
                
                 * A function that is executed when resizing ends.
                
                
                 */
                onResizeEnd;
                /**
                
                 * A function that is executed when resizing starts.
                
                
                 */
                onResizeStart;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                areaChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                handlesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                keepAspectRatioChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxHeightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minHeightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minWidthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._createEventEmitters([
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'resize', emit: 'onResize' },
                        { subscribe: 'resizeEnd', emit: 'onResizeEnd' },
                        { subscribe: 'resizeStart', emit: 'onResizeStart' },
                        { emit: 'areaChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'handlesChange' },
                        { emit: 'heightChange' },
                        { emit: 'keepAspectRatioChange' },
                        { emit: 'maxHeightChange' },
                        { emit: 'maxWidthChange' },
                        { emit: 'minHeightChange' },
                        { emit: 'minWidthChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'widthChange' }
                    ]);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxResizable(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResizableComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxResizableComponent, selector: "dx-resizable", inputs: { area: "area", elementAttr: "elementAttr", handles: "handles", height: "height", keepAspectRatio: "keepAspectRatio", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", rtlEnabled: "rtlEnabled", width: "width" }, outputs: { onDisposing: "onDisposing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onResize: "onResize", onResizeEnd: "onResizeEnd", onResizeStart: "onResizeStart", areaChange: "areaChange", elementAttrChange: "elementAttrChange", handlesChange: "handlesChange", heightChange: "heightChange", keepAspectRatioChange: "keepAspectRatioChange", maxHeightChange: "maxHeightChange", maxWidthChange: "maxWidthChange", minHeightChange: "minHeightChange", minWidthChange: "minWidthChange", rtlEnabledChange: "rtlEnabledChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost
                    ], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxResizableComponent", DxResizableComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResizableComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-resizable',
                                template: '<ng-content></ng-content>',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { area: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], handles: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], keepAspectRatio: [{
                            type: Input
                        }], maxHeight: [{
                            type: Input
                        }], maxWidth: [{
                            type: Input
                        }], minHeight: [{
                            type: Input
                        }], minWidth: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onResize: [{
                            type: Output
                        }], onResizeEnd: [{
                            type: Output
                        }], onResizeStart: [{
                            type: Output
                        }], areaChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], handlesChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], keepAspectRatioChange: [{
                            type: Output
                        }], maxHeightChange: [{
                            type: Output
                        }], maxWidthChange: [{
                            type: Output
                        }], minHeightChange: [{
                            type: Output
                        }], minWidthChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }] } });
            class DxResizableModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResizableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxResizableModule, declarations: [DxResizableComponent], imports: [DxIntegrationModule,
                        DxTemplateModule], exports: [DxResizableComponent, DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResizableModule, imports: [DxIntegrationModule,
                        DxTemplateModule, DxTemplateModule] });
            } exports("DxResizableModule", DxResizableModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxResizableModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxResizableComponent
                                ],
                                exports: [
                                    DxResizableComponent,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
