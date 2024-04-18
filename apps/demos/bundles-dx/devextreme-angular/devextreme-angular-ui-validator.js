System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/validator', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, SkipSelf, Optional, Host, Inject, Input, Output, ContentChildren, NgModule, DxValidator, DxComponentExtension, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiValidationRuleComponent, DxoAdapterModule, DxiValidationRuleModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            SkipSelf = module.SkipSelf;
            Optional = module.Optional;
            Host = module.Host;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxValidator = module.default;
        }, function (module) {
            DxComponentExtension = module.d;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiValidationRuleComponent = module.DxiValidationRuleComponent;
            DxoAdapterModule = module.DxoAdapterModule;
            DxiValidationRuleModule = module.DxiValidationRuleModule;
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
             * A UI component that is used to validate the associated DevExtreme editors against the defined validation rules.

             */
            class DxValidatorComponent extends DxComponentExtension {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * An object that specifies what and when to validate, and how to apply the validation result.
                
                 */
                get adapter() {
                    return this._getOption('adapter');
                }
                set adapter(value) {
                    this._setOption('adapter', value);
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
                 * Specifies the editor name to be used in the validation default messages.
                
                 */
                get name() {
                    return this._getOption('name');
                }
                set name(value) {
                    this._setOption('name', value);
                }
                /**
                 * Specifies the validation group the editor will be related to.
                
                 */
                get validationGroup() {
                    return this._getOption('validationGroup');
                }
                set validationGroup(value) {
                    this._setOption('validationGroup', value);
                }
                /**
                 * An array of validation rules to be checked for the editor with which the dxValidator object is associated.
                
                 */
                get validationRules() {
                    return this._getOption('validationRules');
                }
                set validationRules(value) {
                    this._setOption('validationRules', value);
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
                
                 * A function that is executed after a value is validated.
                
                
                 */
                onValidated;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                adapterChange;
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
                nameChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationGroupChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationRulesChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                get validationRulesChildren() {
                    return this._getOption('validationRules');
                }
                set validationRulesChildren(value) {
                    this.setChildren('validationRules', value);
                }
                parentElement;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, parentOptionHost, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'validated', emit: 'onValidated' },
                        { emit: 'adapterChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'heightChange' },
                        { emit: 'nameChange' },
                        { emit: 'validationGroupChange' },
                        { emit: 'validationRulesChange' },
                        { emit: 'widthChange' }
                    ]);
                    this.parentElement = this.getParentElement(parentOptionHost);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    if (this.parentElement) {
                        return new DxValidator(this.parentElement, options);
                    }
                    return new DxValidator(element, options);
                }
                getParentElement(host) {
                    if (host) {
                        const parentHost = host.getHost();
                        return parentHost.element.nativeElement;
                    }
                    return;
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('validationRules', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('validationRules');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidatorComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost, host: true, optional: true, skipSelf: true }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxValidatorComponent, selector: "dx-validator", inputs: { adapter: "adapter", elementAttr: "elementAttr", height: "height", name: "name", validationGroup: "validationGroup", validationRules: "validationRules", width: "width" }, outputs: { onDisposing: "onDisposing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onValidated: "onValidated", adapterChange: "adapterChange", elementAttrChange: "elementAttrChange", heightChange: "heightChange", nameChange: "nameChange", validationGroupChange: "validationGroupChange", validationRulesChange: "validationRulesChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "validationRulesChildren", predicate: DxiValidationRuleComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxValidatorComponent", DxValidatorComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidatorComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-validator',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost, decorators: [{
                                type: SkipSelf
                            }, {
                                type: Optional
                            }, {
                                type: Host
                            }] }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { adapter: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], name: [{
                            type: Input
                        }], validationGroup: [{
                            type: Input
                        }], validationRules: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onValidated: [{
                            type: Output
                        }], adapterChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], nameChange: [{
                            type: Output
                        }], validationGroupChange: [{
                            type: Output
                        }], validationRulesChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], validationRulesChildren: [{
                            type: ContentChildren,
                            args: [DxiValidationRuleComponent]
                        }] } });
            class DxValidatorModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxValidatorModule, declarations: [DxValidatorComponent], imports: [DxoAdapterModule,
                        DxiValidationRuleModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxValidatorComponent, DxoAdapterModule,
                        DxiValidationRuleModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidatorModule, imports: [DxoAdapterModule,
                        DxiValidationRuleModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoAdapterModule,
                        DxiValidationRuleModule,
                        DxTemplateModule] });
            } exports("DxValidatorModule", DxValidatorModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxValidatorModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoAdapterModule,
                                    DxiValidationRuleModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxValidatorComponent
                                ],
                                exports: [
                                    DxValidatorComponent,
                                    DxoAdapterModule,
                                    DxiValidationRuleModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
