System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/filter_builder', '@angular/forms', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, forwardRef, i0, PLATFORM_ID, Component, Inject, Input, Output, HostListener, ContentChildren, NgModule, DxFilterBuilder, NG_VALUE_ACCESSOR, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiCustomOperationComponent, DxiFieldComponent, DxiCustomOperationModule, DxiFieldModule, DxoFormatModule, DxoLookupModule, DxoFilterOperationDescriptionsModule, DxoGroupOperationDescriptionsModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            forwardRef = module.forwardRef;
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            HostListener = module.HostListener;
            ContentChildren = module.ContentChildren;
            NgModule = module.NgModule;
        }, function (module) {
            DxFilterBuilder = module.default;
        }, function (module) {
            NG_VALUE_ACCESSOR = module.NG_VALUE_ACCESSOR;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxiCustomOperationComponent = module.DxiCustomOperationComponent;
            DxiFieldComponent = module.DxiFieldComponent;
            DxiCustomOperationModule = module.DxiCustomOperationModule;
            DxiFieldModule = module.DxiFieldModule;
            DxoFormatModule = module.DxoFormatModule;
            DxoLookupModule = module.DxoLookupModule;
            DxoFilterOperationDescriptionsModule = module.DxoFilterOperationDescriptionsModule;
            DxoGroupOperationDescriptionsModule = module.DxoGroupOperationDescriptionsModule;
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
            const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DxFilterBuilderComponent),
                multi: true
            };
            /**
             * The FilterBuilder UI component allows a user to build complex filter expressions with an unlimited number of filter conditions, combined by logical operations using the UI.

             */
            class DxFilterBuilderComponent extends DxComponent {
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
                 * Specifies whether the UI component can display hierarchical data fields.
                
                 */
                get allowHierarchicalFields() {
                    return this._getOption('allowHierarchicalFields');
                }
                set allowHierarchicalFields(value) {
                    this._setOption('allowHierarchicalFields', value);
                }
                /**
                 * Configures custom filter operations.
                
                 */
                get customOperations() {
                    return this._getOption('customOperations');
                }
                set customOperations(value) {
                    this._setOption('customOperations', value);
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
                 * Configures fields.
                
                 */
                get fields() {
                    return this._getOption('fields');
                }
                set fields(value) {
                    this._setOption('fields', value);
                }
                /**
                 * Specifies filter operation descriptions.
                
                 */
                get filterOperationDescriptions() {
                    return this._getOption('filterOperationDescriptions');
                }
                set filterOperationDescriptions(value) {
                    this._setOption('filterOperationDescriptions', value);
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
                 * Specifies group operation descriptions.
                
                 */
                get groupOperationDescriptions() {
                    return this._getOption('groupOperationDescriptions');
                }
                set groupOperationDescriptions(value) {
                    this._setOption('groupOperationDescriptions', value);
                }
                /**
                 * Specifies a set of available group operations.
                
                 */
                get groupOperations() {
                    return this._getOption('groupOperations');
                }
                set groupOperations(value) {
                    this._setOption('groupOperations', value);
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
                 * Specifies groups&apos; maximum nesting level.
                
                 */
                get maxGroupLevel() {
                    return this._getOption('maxGroupLevel');
                }
                set maxGroupLevel(value) {
                    this._setOption('maxGroupLevel', value);
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
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * Allows you to specify a filter.
                
                 */
                get value() {
                    return this._getOption('value');
                }
                set value(value) {
                    this._setOption('value', value);
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
                
                 * A function that is executed after an editor is created.
                
                
                 */
                onEditorPrepared;
                /**
                
                 * A function that is executed before an editor is created.
                
                
                 */
                onEditorPreparing;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed after the UI component&apos;s value is changed.
                
                
                 */
                onValueChanged;
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
                allowHierarchicalFieldsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customOperationsChange;
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
                fieldsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                filterOperationDescriptionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupOperationDescriptionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                groupOperationsChange;
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
                maxGroupLevelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                /**
                
                 * 
                
                
                 */
                onBlur;
                change(_) { }
                touched = (_) => { };
                get customOperationsChildren() {
                    return this._getOption('customOperations');
                }
                set customOperationsChildren(value) {
                    this.setChildren('customOperations', value);
                }
                get fieldsChildren() {
                    return this._getOption('fields');
                }
                set fieldsChildren(value) {
                    this.setChildren('fields', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'editorPrepared', emit: 'onEditorPrepared' },
                        { subscribe: 'editorPreparing', emit: 'onEditorPreparing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'valueChanged', emit: 'onValueChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'allowHierarchicalFieldsChange' },
                        { emit: 'customOperationsChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'fieldsChange' },
                        { emit: 'filterOperationDescriptionsChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'groupOperationDescriptionsChange' },
                        { emit: 'groupOperationsChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'maxGroupLevelChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'valueChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'onBlur' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxFilterBuilder(element, options);
                }
                writeValue(value) {
                    this.eventHelper.lockedValueChangeEvent = true;
                    this.value = value;
                    this.eventHelper.lockedValueChangeEvent = false;
                }
                setDisabledState(isDisabled) {
                    this.disabled = isDisabled;
                }
                registerOnChange(fn) { this.change = fn; }
                registerOnTouched(fn) { this.touched = fn; }
                _createWidget(element) {
                    super._createWidget(element);
                    this.instance.on('focusOut', (e) => {
                        this.eventHelper.fireNgEvent('onBlur', [e]);
                    });
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('customOperations', changes);
                    this.setupChanges('fields', changes);
                    this.setupChanges('groupOperations', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('customOperations');
                    this._idh.doCheck('fields');
                    this._idh.doCheck('groupOperations');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFilterBuilderComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxFilterBuilderComponent, selector: "dx-filter-builder", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", allowHierarchicalFields: "allowHierarchicalFields", customOperations: "customOperations", disabled: "disabled", elementAttr: "elementAttr", fields: "fields", filterOperationDescriptions: "filterOperationDescriptions", focusStateEnabled: "focusStateEnabled", groupOperationDescriptions: "groupOperationDescriptions", groupOperations: "groupOperations", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", maxGroupLevel: "maxGroupLevel", rtlEnabled: "rtlEnabled", tabIndex: "tabIndex", value: "value", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onEditorPrepared: "onEditorPrepared", onEditorPreparing: "onEditorPreparing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onValueChanged: "onValueChanged", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", allowHierarchicalFieldsChange: "allowHierarchicalFieldsChange", customOperationsChange: "customOperationsChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", fieldsChange: "fieldsChange", filterOperationDescriptionsChange: "filterOperationDescriptionsChange", focusStateEnabledChange: "focusStateEnabledChange", groupOperationDescriptionsChange: "groupOperationDescriptionsChange", groupOperationsChange: "groupOperationsChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", maxGroupLevelChange: "maxGroupLevelChange", rtlEnabledChange: "rtlEnabledChange", tabIndexChange: "tabIndexChange", valueChange: "valueChange", visibleChange: "visibleChange", widthChange: "widthChange", onBlur: "onBlur" }, host: { listeners: { "valueChange": "change($event)", "onBlur": "touched($event)" } }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        CUSTOM_VALUE_ACCESSOR_PROVIDER,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "customOperationsChildren", predicate: DxiCustomOperationComponent }, { propertyName: "fieldsChildren", predicate: DxiFieldComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxFilterBuilderComponent", DxFilterBuilderComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFilterBuilderComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-filter-builder',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    CUSTOM_VALUE_ACCESSOR_PROVIDER,
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
                        }], allowHierarchicalFields: [{
                            type: Input
                        }], customOperations: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], fields: [{
                            type: Input
                        }], filterOperationDescriptions: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], groupOperationDescriptions: [{
                            type: Input
                        }], groupOperations: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], maxGroupLevel: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], value: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onEditorPrepared: [{
                            type: Output
                        }], onEditorPreparing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onValueChanged: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], allowHierarchicalFieldsChange: [{
                            type: Output
                        }], customOperationsChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], fieldsChange: [{
                            type: Output
                        }], filterOperationDescriptionsChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], groupOperationDescriptionsChange: [{
                            type: Output
                        }], groupOperationsChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], maxGroupLevelChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], valueChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }], onBlur: [{
                            type: Output
                        }], change: [{
                            type: HostListener,
                            args: ['valueChange', ['$event']]
                        }], touched: [{
                            type: HostListener,
                            args: ['onBlur', ['$event']]
                        }], customOperationsChildren: [{
                            type: ContentChildren,
                            args: [DxiCustomOperationComponent]
                        }], fieldsChildren: [{
                            type: ContentChildren,
                            args: [DxiFieldComponent]
                        }] } });
            class DxFilterBuilderModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFilterBuilderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxFilterBuilderModule, declarations: [DxFilterBuilderComponent], imports: [DxiCustomOperationModule,
                        DxiFieldModule,
                        DxoFormatModule,
                        DxoLookupModule,
                        DxoFilterOperationDescriptionsModule,
                        DxoGroupOperationDescriptionsModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxFilterBuilderComponent, DxiCustomOperationModule,
                        DxiFieldModule,
                        DxoFormatModule,
                        DxoLookupModule,
                        DxoFilterOperationDescriptionsModule,
                        DxoGroupOperationDescriptionsModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFilterBuilderModule, imports: [DxiCustomOperationModule,
                        DxiFieldModule,
                        DxoFormatModule,
                        DxoLookupModule,
                        DxoFilterOperationDescriptionsModule,
                        DxoGroupOperationDescriptionsModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiCustomOperationModule,
                        DxiFieldModule,
                        DxoFormatModule,
                        DxoLookupModule,
                        DxoFilterOperationDescriptionsModule,
                        DxoGroupOperationDescriptionsModule,
                        DxTemplateModule] });
            } exports("DxFilterBuilderModule", DxFilterBuilderModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFilterBuilderModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiCustomOperationModule,
                                    DxiFieldModule,
                                    DxoFormatModule,
                                    DxoLookupModule,
                                    DxoFilterOperationDescriptionsModule,
                                    DxoGroupOperationDescriptionsModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxFilterBuilderComponent
                                ],
                                exports: [
                                    DxFilterBuilderComponent,
                                    DxiCustomOperationModule,
                                    DxiFieldModule,
                                    DxoFormatModule,
                                    DxoLookupModule,
                                    DxoFilterOperationDescriptionsModule,
                                    DxoGroupOperationDescriptionsModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
