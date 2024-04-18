System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/draggable', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxDraggable, DxComponent, DxTemplateHost, WatcherHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoCursorOffsetModule;
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
            DxDraggable = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoCursorOffsetModule = module.DxoCursorOffsetModule;
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
             * Draggable is a user interface utility that allows UI component elements to be dragged and dropped.

             */
            class DxDraggableComponent extends DxComponent {
                instance = null;
                /**
                 * Enables automatic scrolling while dragging an item beyond the viewport.
                
                 */
                get autoScroll() {
                    return this._getOption('autoScroll');
                }
                set autoScroll(value) {
                    this._setOption('autoScroll', value);
                }
                /**
                 * Specifies a DOM element that limits the dragging area.
                
                 */
                get boundary() {
                    return this._getOption('boundary');
                }
                set boundary(value) {
                    this._setOption('boundary', value);
                }
                /**
                 * Allows a user to drag clones of items instead of actual items.
                
                 */
                get clone() {
                    return this._getOption('clone');
                }
                set clone(value) {
                    this._setOption('clone', value);
                }
                /**
                 * Specifies a custom container in which the draggable item should be rendered.
                
                 */
                get container() {
                    return this._getOption('container');
                }
                set container(value) {
                    this._setOption('container', value);
                }
                /**
                 * Specifies the cursor offset from the dragged item.
                
                 */
                get cursorOffset() {
                    return this._getOption('cursorOffset');
                }
                set cursorOffset(value) {
                    this._setOption('cursorOffset', value);
                }
                /**
                 * A container for custom data.
                
                 */
                get data() {
                    return this._getOption('data');
                }
                set data(value) {
                    this._setOption('data', value);
                }
                /**
                 * Specifies the directions in which an item can be dragged.
                
                 */
                get dragDirection() {
                    return this._getOption('dragDirection');
                }
                set dragDirection(value) {
                    this._setOption('dragDirection', value);
                }
                /**
                 * Specifies custom markup to be shown instead of the item being dragged.
                
                 */
                get dragTemplate() {
                    return this._getOption('dragTemplate');
                }
                set dragTemplate(value) {
                    this._setOption('dragTemplate', value);
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
                 * Allows you to group several UI components, so that users can drag and drop items between them.
                
                 */
                get group() {
                    return this._getOption('group');
                }
                set group(value) {
                    this._setOption('group', value);
                }
                /**
                 * Specifies a CSS selector (ID or class) that should act as the drag handle(s) for the item(s).
                
                 */
                get handle() {
                    return this._getOption('handle');
                }
                set handle(value) {
                    this._setOption('handle', value);
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
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * Specifies the distance in pixels from the edge of viewport at which scrolling should start. Applies only if autoScroll is true.
                
                 */
                get scrollSensitivity() {
                    return this._getOption('scrollSensitivity');
                }
                set scrollSensitivity(value) {
                    this._setOption('scrollSensitivity', value);
                }
                /**
                 * Specifies the scrolling speed when dragging an item beyond the viewport. Applies only if autoScroll is true.
                
                 */
                get scrollSpeed() {
                    return this._getOption('scrollSpeed');
                }
                set scrollSpeed(value) {
                    this._setOption('scrollSpeed', value);
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
                
                 * A function that is called when a drag gesture is finished.
                
                
                 */
                onDragEnd;
                /**
                
                 * A function that is called every time a draggable item is moved.
                
                
                 */
                onDragMove;
                /**
                
                 * A function that is called when a drag gesture is initialized.
                
                
                 */
                onDragStart;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                autoScrollChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                boundaryChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cloneChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                containerChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cursorOffsetChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dragDirectionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dragTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                handleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollSensitivityChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                scrollSpeedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._createEventEmitters([
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'dragEnd', emit: 'onDragEnd' },
                        { subscribe: 'dragMove', emit: 'onDragMove' },
                        { subscribe: 'dragStart', emit: 'onDragStart' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { emit: 'autoScrollChange' },
                        { emit: 'boundaryChange' },
                        { emit: 'cloneChange' },
                        { emit: 'containerChange' },
                        { emit: 'cursorOffsetChange' },
                        { emit: 'dataChange' },
                        { emit: 'dragDirectionChange' },
                        { emit: 'dragTemplateChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'groupChange' },
                        { emit: 'handleChange' },
                        { emit: 'heightChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollSensitivityChange' },
                        { emit: 'scrollSpeedChange' },
                        { emit: 'widthChange' }
                    ]);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxDraggable(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDraggableComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxDraggableComponent, selector: "dx-draggable", inputs: { autoScroll: "autoScroll", boundary: "boundary", clone: "clone", container: "container", cursorOffset: "cursorOffset", data: "data", dragDirection: "dragDirection", dragTemplate: "dragTemplate", elementAttr: "elementAttr", group: "group", handle: "handle", height: "height", rtlEnabled: "rtlEnabled", scrollSensitivity: "scrollSensitivity", scrollSpeed: "scrollSpeed", width: "width" }, outputs: { onDisposing: "onDisposing", onDragEnd: "onDragEnd", onDragMove: "onDragMove", onDragStart: "onDragStart", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", autoScrollChange: "autoScrollChange", boundaryChange: "boundaryChange", cloneChange: "cloneChange", containerChange: "containerChange", cursorOffsetChange: "cursorOffsetChange", dataChange: "dataChange", dragDirectionChange: "dragDirectionChange", dragTemplateChange: "dragTemplateChange", elementAttrChange: "elementAttrChange", groupChange: "groupChange", handleChange: "handleChange", heightChange: "heightChange", rtlEnabledChange: "rtlEnabledChange", scrollSensitivityChange: "scrollSensitivityChange", scrollSpeedChange: "scrollSpeedChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost
                    ], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxDraggableComponent", DxDraggableComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDraggableComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-draggable',
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
                            }] }], propDecorators: { autoScroll: [{
                            type: Input
                        }], boundary: [{
                            type: Input
                        }], clone: [{
                            type: Input
                        }], container: [{
                            type: Input
                        }], cursorOffset: [{
                            type: Input
                        }], data: [{
                            type: Input
                        }], dragDirection: [{
                            type: Input
                        }], dragTemplate: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], group: [{
                            type: Input
                        }], handle: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrollSensitivity: [{
                            type: Input
                        }], scrollSpeed: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onDisposing: [{
                            type: Output
                        }], onDragEnd: [{
                            type: Output
                        }], onDragMove: [{
                            type: Output
                        }], onDragStart: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], autoScrollChange: [{
                            type: Output
                        }], boundaryChange: [{
                            type: Output
                        }], cloneChange: [{
                            type: Output
                        }], containerChange: [{
                            type: Output
                        }], cursorOffsetChange: [{
                            type: Output
                        }], dataChange: [{
                            type: Output
                        }], dragDirectionChange: [{
                            type: Output
                        }], dragTemplateChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], groupChange: [{
                            type: Output
                        }], handleChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], scrollSensitivityChange: [{
                            type: Output
                        }], scrollSpeedChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }] } });
            class DxDraggableModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDraggableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxDraggableModule, declarations: [DxDraggableComponent], imports: [DxoCursorOffsetModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxDraggableComponent, DxoCursorOffsetModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDraggableModule, imports: [DxoCursorOffsetModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoCursorOffsetModule,
                        DxTemplateModule] });
            } exports("DxDraggableModule", DxDraggableModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDraggableModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoCursorOffsetModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxDraggableComponent
                                ],
                                exports: [
                                    DxDraggableComponent,
                                    DxoCursorOffsetModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
