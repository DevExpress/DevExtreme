System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/validation_summary', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, ContentChildren, NgModule, DxValidationSummary, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiItemComponent, DxiItemModule;
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
            DxValidationSummary = module.default;
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
             * A UI component for displaying the result of checking validation rules for editors.

             */
            class DxValidationSummaryComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
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
                 * Specifies whether the UI component changes its state when a user pauses on it.
                
                 */
                get hoverStateEnabled() {
                    return this._getOption('hoverStateEnabled');
                }
                set hoverStateEnabled(value) {
                    this._setOption('hoverStateEnabled', value);
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
                 * Specifies the validation group for which summary should be generated.
                
                 */
                get validationGroup() {
                    return this._getOption('validationGroup');
                }
                set validationGroup(value) {
                    this._setOption('validationGroup', value);
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
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
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
                validationGroupChange;
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
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { emit: 'elementAttrChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'itemsChange' },
                        { emit: 'itemTemplateChange' },
                        { emit: 'validationGroupChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxValidationSummary(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('items', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidationSummaryComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxValidationSummaryComponent, selector: "dx-validation-summary", inputs: { elementAttr: "elementAttr", hoverStateEnabled: "hoverStateEnabled", items: "items", itemTemplate: "itemTemplate", validationGroup: "validationGroup" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onItemClick: "onItemClick", onOptionChanged: "onOptionChanged", elementAttrChange: "elementAttrChange", hoverStateEnabledChange: "hoverStateEnabledChange", itemsChange: "itemsChange", itemTemplateChange: "itemTemplateChange", validationGroupChange: "validationGroupChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxValidationSummaryComponent", DxValidationSummaryComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidationSummaryComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-validation-summary',
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
                            }] }], propDecorators: { elementAttr: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], itemTemplate: [{
                            type: Input
                        }], validationGroup: [{
                            type: Input
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
                        }], elementAttrChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], itemTemplateChange: [{
                            type: Output
                        }], validationGroupChange: [{
                            type: Output
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }] } });
            class DxValidationSummaryModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidationSummaryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxValidationSummaryModule, declarations: [DxValidationSummaryComponent], imports: [DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxValidationSummaryComponent, DxiItemModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidationSummaryModule, imports: [DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiItemModule,
                        DxTemplateModule] });
            } exports("DxValidationSummaryModule", DxValidationSummaryModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidationSummaryModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiItemModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxValidationSummaryComponent
                                ],
                                exports: [
                                    DxValidationSummaryComponent,
                                    DxiItemModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
