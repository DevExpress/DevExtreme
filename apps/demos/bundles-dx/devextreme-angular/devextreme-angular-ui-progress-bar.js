System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/progress_bar', '@angular/forms', './devextreme-angular-core.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, forwardRef, i0, PLATFORM_ID, Component, Inject, Input, Output, HostListener, NgModule, DxProgressBar, NG_VALUE_ACCESSOR, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule;
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
            NgModule = module.NgModule;
        }, function (module) {
            DxProgressBar = module.default;
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
                useExisting: forwardRef(() => DxProgressBarComponent),
                multi: true
            };
            /**
             * The ProgressBar is a UI component that shows current progress.

             */
            class DxProgressBarComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
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
                 * Specifies whether the component&apos;s current value differs from the initial value.
                
                 */
                get isDirty() {
                    return this._getOption('isDirty');
                }
                set isDirty(value) {
                    this._setOption('isDirty', value);
                }
                /**
                 * Specifies or indicates whether the editor&apos;s value is valid.
                
                 */
                get isValid() {
                    return this._getOption('isValid');
                }
                set isValid(value) {
                    this._setOption('isValid', value);
                }
                /**
                 * The maximum value the UI component can accept.
                
                 */
                get max() {
                    return this._getOption('max');
                }
                set max(value) {
                    this._setOption('max', value);
                }
                /**
                 * The minimum value the UI component can accept.
                
                 */
                get min() {
                    return this._getOption('min');
                }
                set min(value) {
                    this._setOption('min', value);
                }
                /**
                 * Specifies whether the editor is read-only.
                
                 */
                get readOnly() {
                    return this._getOption('readOnly');
                }
                set readOnly(value) {
                    this._setOption('readOnly', value);
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
                 * Specifies whether or not the UI component displays a progress status.
                
                 */
                get showStatus() {
                    return this._getOption('showStatus');
                }
                set showStatus(value) {
                    this._setOption('showStatus', value);
                }
                /**
                 * Specifies a format for the progress status.
                
                 */
                get statusFormat() {
                    return this._getOption('statusFormat');
                }
                set statusFormat(value) {
                    this._setOption('statusFormat', value);
                }
                /**
                 * Information on the broken validation rule. Contains the first item from the validationErrors array.
                
                 */
                get validationError() {
                    return this._getOption('validationError');
                }
                set validationError(value) {
                    this._setOption('validationError', value);
                }
                /**
                 * An array of the validation rules that failed.
                
                 */
                get validationErrors() {
                    return this._getOption('validationErrors');
                }
                set validationErrors(value) {
                    this._setOption('validationErrors', value);
                }
                /**
                 * Specifies how the message about the validation rules that are not satisfied by this editor&apos;s value is displayed.
                
                 */
                get validationMessageMode() {
                    return this._getOption('validationMessageMode');
                }
                set validationMessageMode(value) {
                    this._setOption('validationMessageMode', value);
                }
                /**
                 * Specifies the position of a validation message relative to the component. The validation message describes the validation rules that this component&apos;s value does not satisfy.
                
                 */
                get validationMessagePosition() {
                    return this._getOption('validationMessagePosition');
                }
                set validationMessagePosition(value) {
                    this._setOption('validationMessagePosition', value);
                }
                /**
                 * Indicates or specifies the current validation status.
                
                 */
                get validationStatus() {
                    return this._getOption('validationStatus');
                }
                set validationStatus(value) {
                    this._setOption('validationStatus', value);
                }
                /**
                 * The current UI component value.
                
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
                
                 * A function that is executed when the value reaches the maximum.
                
                
                 */
                onComplete;
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
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                isDirtyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                isValidChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                minChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                readOnlyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showStatusChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                statusFormatChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationErrorChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationErrorsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationMessageModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationMessagePositionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                validationStatusChange;
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
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'complete', emit: 'onComplete' },
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'valueChanged', emit: 'onValueChanged' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'isDirtyChange' },
                        { emit: 'isValidChange' },
                        { emit: 'maxChange' },
                        { emit: 'minChange' },
                        { emit: 'readOnlyChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'showStatusChange' },
                        { emit: 'statusFormatChange' },
                        { emit: 'validationErrorChange' },
                        { emit: 'validationErrorsChange' },
                        { emit: 'validationMessageModeChange' },
                        { emit: 'validationMessagePositionChange' },
                        { emit: 'validationStatusChange' },
                        { emit: 'valueChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'onBlur' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxProgressBar(element, options);
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
                    this.setupChanges('validationErrors', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('validationErrors');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxProgressBarComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxProgressBarComponent, selector: "dx-progress-bar", inputs: { disabled: "disabled", elementAttr: "elementAttr", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", isDirty: "isDirty", isValid: "isValid", max: "max", min: "min", readOnly: "readOnly", rtlEnabled: "rtlEnabled", showStatus: "showStatus", statusFormat: "statusFormat", validationError: "validationError", validationErrors: "validationErrors", validationMessageMode: "validationMessageMode", validationMessagePosition: "validationMessagePosition", validationStatus: "validationStatus", value: "value", visible: "visible", width: "width" }, outputs: { onComplete: "onComplete", onContentReady: "onContentReady", onDisposing: "onDisposing", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onValueChanged: "onValueChanged", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", isDirtyChange: "isDirtyChange", isValidChange: "isValidChange", maxChange: "maxChange", minChange: "minChange", readOnlyChange: "readOnlyChange", rtlEnabledChange: "rtlEnabledChange", showStatusChange: "showStatusChange", statusFormatChange: "statusFormatChange", validationErrorChange: "validationErrorChange", validationErrorsChange: "validationErrorsChange", validationMessageModeChange: "validationMessageModeChange", validationMessagePositionChange: "validationMessagePositionChange", validationStatusChange: "validationStatusChange", valueChange: "valueChange", visibleChange: "visibleChange", widthChange: "widthChange", onBlur: "onBlur" }, host: { listeners: { "valueChange": "change($event)", "onBlur": "touched($event)" } }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        CUSTOM_VALUE_ACCESSOR_PROVIDER,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxProgressBarComponent", DxProgressBarComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxProgressBarComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-progress-bar',
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
                            }] }], propDecorators: { disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], isDirty: [{
                            type: Input
                        }], isValid: [{
                            type: Input
                        }], max: [{
                            type: Input
                        }], min: [{
                            type: Input
                        }], readOnly: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], showStatus: [{
                            type: Input
                        }], statusFormat: [{
                            type: Input
                        }], validationError: [{
                            type: Input
                        }], validationErrors: [{
                            type: Input
                        }], validationMessageMode: [{
                            type: Input
                        }], validationMessagePosition: [{
                            type: Input
                        }], validationStatus: [{
                            type: Input
                        }], value: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onComplete: [{
                            type: Output
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onValueChanged: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], isDirtyChange: [{
                            type: Output
                        }], isValidChange: [{
                            type: Output
                        }], maxChange: [{
                            type: Output
                        }], minChange: [{
                            type: Output
                        }], readOnlyChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], showStatusChange: [{
                            type: Output
                        }], statusFormatChange: [{
                            type: Output
                        }], validationErrorChange: [{
                            type: Output
                        }], validationErrorsChange: [{
                            type: Output
                        }], validationMessageModeChange: [{
                            type: Output
                        }], validationMessagePositionChange: [{
                            type: Output
                        }], validationStatusChange: [{
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
                        }] } });
            class DxProgressBarModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxProgressBarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxProgressBarModule, declarations: [DxProgressBarComponent], imports: [DxIntegrationModule,
                        DxTemplateModule], exports: [DxProgressBarComponent, DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxProgressBarModule, imports: [DxIntegrationModule,
                        DxTemplateModule, DxTemplateModule] });
            } exports("DxProgressBarModule", DxProgressBarModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxProgressBarModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxProgressBarComponent
                                ],
                                exports: [
                                    DxProgressBarComponent,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
