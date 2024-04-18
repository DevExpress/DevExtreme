System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/sortable', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxSortable, DxComponent, DxTemplateHost, WatcherHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoCursorOffsetModule;
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
            DxSortable = module.default;
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
             * Sortable is a user interface utility that allows a UI component&apos;s items to be reordered via drag and drop gestures.

             */
            class DxSortableComponent extends DxComponent {
                instance = null;
                /**
                 * Allows a user to drop an item inside another item.
                
                 */
                get allowDropInsideItem() {
                    return this._getOption('allowDropInsideItem');
                }
                set allowDropInsideItem(value) {
                    this._setOption('allowDropInsideItem', value);
                }
                /**
                 * Allows a user to reorder sortable items.
                
                 */
                get allowReordering() {
                    return this._getOption('allowReordering');
                }
                set allowReordering(value) {
                    this._setOption('allowReordering', value);
                }
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
                 * Specifies how to highlight the item&apos;s drop position.
                
                 */
                get dropFeedbackMode() {
                    return this._getOption('dropFeedbackMode');
                }
                set dropFeedbackMode(value) {
                    this._setOption('dropFeedbackMode', value);
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
                 * Specifies a CSS selector for the items that can be dragged.
                
                 */
                get filter() {
                    return this._getOption('filter');
                }
                set filter(value) {
                    this._setOption('filter', value);
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
                 * Notifies the UI component of the items&apos; orientation.
                
                 */
                get itemOrientation() {
                    return this._getOption('itemOrientation');
                }
                set itemOrientation(value) {
                    this._setOption('itemOrientation', value);
                }
                /**
                 * Moves an element in the HTML markup when it is dropped.
                
                 */
                get moveItemOnDrop() {
                    return this._getOption('moveItemOnDrop');
                }
                set moveItemOnDrop(value) {
                    this._setOption('moveItemOnDrop', value);
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
                
                 * A function that is called when a new item is added.
                
                
                 */
                onAdd;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is called when the dragged item&apos;s position in the list is changed.
                
                
                 */
                onDragChange;
                /**
                
                 * A function that is called when the drag gesture is finished.
                
                
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
                
                 * A function that is called when a draggable item is removed.
                
                
                 */
                onRemove;
                /**
                
                 * A function that is called when the draggable items are reordered.
                
                
                 */
                onReorder;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowDropInsideItemChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowReorderingChange;
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
                dropFeedbackModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterChange;
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
                itemOrientationChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                moveItemOnDropChange;
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
                        { subscribe: 'add', emit: 'onAdd' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'dragChange', emit: 'onDragChange' },
                        { subscribe: 'dragEnd', emit: 'onDragEnd' },
                        { subscribe: 'dragMove', emit: 'onDragMove' },
                        { subscribe: 'dragStart', emit: 'onDragStart' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'remove', emit: 'onRemove' },
                        { subscribe: 'reorder', emit: 'onReorder' },
                        { emit: 'allowDropInsideItemChange' },
                        { emit: 'allowReorderingChange' },
                        { emit: 'autoScrollChange' },
                        { emit: 'boundaryChange' },
                        { emit: 'containerChange' },
                        { emit: 'cursorOffsetChange' },
                        { emit: 'dataChange' },
                        { emit: 'dragDirectionChange' },
                        { emit: 'dragTemplateChange' },
                        { emit: 'dropFeedbackModeChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'filterChange' },
                        { emit: 'groupChange' },
                        { emit: 'handleChange' },
                        { emit: 'heightChange' },
                        { emit: 'itemOrientationChange' },
                        { emit: 'moveItemOnDropChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'scrollSensitivityChange' },
                        { emit: 'scrollSpeedChange' },
                        { emit: 'widthChange' }
                    ]);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxSortable(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSortableComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxSortableComponent, selector: "dx-sortable", inputs: { allowDropInsideItem: "allowDropInsideItem", allowReordering: "allowReordering", autoScroll: "autoScroll", boundary: "boundary", container: "container", cursorOffset: "cursorOffset", data: "data", dragDirection: "dragDirection", dragTemplate: "dragTemplate", dropFeedbackMode: "dropFeedbackMode", elementAttr: "elementAttr", filter: "filter", group: "group", handle: "handle", height: "height", itemOrientation: "itemOrientation", moveItemOnDrop: "moveItemOnDrop", rtlEnabled: "rtlEnabled", scrollSensitivity: "scrollSensitivity", scrollSpeed: "scrollSpeed", width: "width" }, outputs: { onAdd: "onAdd", onDisposing: "onDisposing", onDragChange: "onDragChange", onDragEnd: "onDragEnd", onDragMove: "onDragMove", onDragStart: "onDragStart", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onRemove: "onRemove", onReorder: "onReorder", allowDropInsideItemChange: "allowDropInsideItemChange", allowReorderingChange: "allowReorderingChange", autoScrollChange: "autoScrollChange", boundaryChange: "boundaryChange", containerChange: "containerChange", cursorOffsetChange: "cursorOffsetChange", dataChange: "dataChange", dragDirectionChange: "dragDirectionChange", dragTemplateChange: "dragTemplateChange", dropFeedbackModeChange: "dropFeedbackModeChange", elementAttrChange: "elementAttrChange", filterChange: "filterChange", groupChange: "groupChange", handleChange: "handleChange", heightChange: "heightChange", itemOrientationChange: "itemOrientationChange", moveItemOnDropChange: "moveItemOnDropChange", rtlEnabledChange: "rtlEnabledChange", scrollSensitivityChange: "scrollSensitivityChange", scrollSpeedChange: "scrollSpeedChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost
                    ], usesInheritance: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxSortableComponent", DxSortableComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSortableComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-sortable',
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
                            }] }], propDecorators: { allowDropInsideItem: [{
                            type: Input
                        }], allowReordering: [{
                            type: Input
                        }], autoScroll: [{
                            type: Input
                        }], boundary: [{
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
                        }], dropFeedbackMode: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], filter: [{
                            type: Input
                        }], group: [{
                            type: Input
                        }], handle: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], itemOrientation: [{
                            type: Input
                        }], moveItemOnDrop: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], scrollSensitivity: [{
                            type: Input
                        }], scrollSpeed: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onAdd: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onDragChange: [{
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
                        }], onRemove: [{
                            type: Output
                        }], onReorder: [{
                            type: Output
                        }], allowDropInsideItemChange: [{
                            type: Output
                        }], allowReorderingChange: [{
                            type: Output
                        }], autoScrollChange: [{
                            type: Output
                        }], boundaryChange: [{
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
                        }], dropFeedbackModeChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], filterChange: [{
                            type: Output
                        }], groupChange: [{
                            type: Output
                        }], handleChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], itemOrientationChange: [{
                            type: Output
                        }], moveItemOnDropChange: [{
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
            class DxSortableModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSortableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxSortableModule, declarations: [DxSortableComponent], imports: [DxoCursorOffsetModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxSortableComponent, DxoCursorOffsetModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSortableModule, imports: [DxoCursorOffsetModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoCursorOffsetModule,
                        DxTemplateModule] });
            } exports("DxSortableModule", DxSortableModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxSortableModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoCursorOffsetModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxSortableComponent
                                ],
                                exports: [
                                    DxSortableComponent,
                                    DxoCursorOffsetModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
