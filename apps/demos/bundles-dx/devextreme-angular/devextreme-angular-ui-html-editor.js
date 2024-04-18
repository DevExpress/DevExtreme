System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/html_editor', '@angular/forms', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, forwardRef, i0, PLATFORM_ID, Component, Inject, Input, Output, HostListener, ContentChildren, NgModule, DxHtmlEditor, NG_VALUE_ACCESSOR, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiMentionComponent, DxoImageUploadModule, DxoFileUploaderOptionsModule, DxiTabModule, DxoMediaResizingModule, DxiMentionModule, DxoTableContextMenuModule, DxiItemModule, DxoTableResizingModule, DxoToolbarModule, DxoVariablesModule;
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
            DxHtmlEditor = module.default;
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
            DxiMentionComponent = module.DxiMentionComponent;
            DxoImageUploadModule = module.DxoImageUploadModule;
            DxoFileUploaderOptionsModule = module.DxoFileUploaderOptionsModule;
            DxiTabModule = module.DxiTabModule;
            DxoMediaResizingModule = module.DxoMediaResizingModule;
            DxiMentionModule = module.DxiMentionModule;
            DxoTableContextMenuModule = module.DxoTableContextMenuModule;
            DxiItemModule = module.DxiItemModule;
            DxoTableResizingModule = module.DxoTableResizingModule;
            DxoToolbarModule = module.DxoToolbarModule;
            DxoVariablesModule = module.DxoVariablesModule;
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
                useExisting: forwardRef(() => DxHtmlEditorComponent),
                multi: true
            };
            /**
             * HtmlEditor is a WYSIWYG editor that allows you to format textual and visual content and to output it in HTML or Markdown. HtmlEditor is built on top of and requires the DevExtreme Quill.

             */
            class DxHtmlEditorComponent extends DxComponent {
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
                 * Allows users to break content into multiple lines within a single block element. The Shift + Enter key combination generates the new line.
                
                 */
                get allowSoftLineBreak() {
                    return this._getOption('allowSoftLineBreak');
                }
                set allowSoftLineBreak(value) {
                    this._setOption('allowSoftLineBreak', value);
                }
                /**
                 * Allows you to customize the DevExtreme Quill and 3rd-party modules.
                
                 */
                get customizeModules() {
                    return this._getOption('customizeModules');
                }
                set customizeModules(value) {
                    this._setOption('customizeModules', value);
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
                 * Configures the image upload.
                
                 */
                get imageUpload() {
                    return this._getOption('imageUpload');
                }
                set imageUpload(value) {
                    this._setOption('imageUpload', value);
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
                 * Configures media resizing.
                
                 */
                get mediaResizing() {
                    return this._getOption('mediaResizing');
                }
                set mediaResizing(value) {
                    this._setOption('mediaResizing', value);
                }
                /**
                 * Configures mentions.
                
                 */
                get mentions() {
                    return this._getOption('mentions');
                }
                set mentions(value) {
                    this._setOption('mentions', value);
                }
                /**
                 * The value to be assigned to the `name` attribute of the underlying HTML element.
                
                 */
                get name() {
                    return this._getOption('name');
                }
                set name(value) {
                    this._setOption('name', value);
                }
                /**
                 * Specifies the text displayed when the input field is empty.
                
                 */
                get placeholder() {
                    return this._getOption('placeholder');
                }
                set placeholder(value) {
                    this._setOption('placeholder', value);
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
                 * Specifies how the HtmlEditor&apos;s toolbar and content field are styled.
                
                 */
                get stylingMode() {
                    return this._getOption('stylingMode');
                }
                set stylingMode(value) {
                    this._setOption('stylingMode', value);
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
                 * Configures table context menu settings.
                
                 */
                get tableContextMenu() {
                    return this._getOption('tableContextMenu');
                }
                set tableContextMenu(value) {
                    this._setOption('tableContextMenu', value);
                }
                /**
                 * Configures table resize.
                
                 */
                get tableResizing() {
                    return this._getOption('tableResizing');
                }
                set tableResizing(value) {
                    this._setOption('tableResizing', value);
                }
                /**
                 * Configures the UI component&apos;s toolbar.
                
                 */
                get toolbar() {
                    return this._getOption('toolbar');
                }
                set toolbar(value) {
                    this._setOption('toolbar', value);
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
                 * Specifies the UI component&apos;s value.
                
                 */
                get value() {
                    return this._getOption('value');
                }
                set value(value) {
                    this._setOption('value', value);
                }
                /**
                 * Specifies in which markup language the value is stored.
                
                 */
                get valueType() {
                    return this._getOption('valueType');
                }
                set valueType(value) {
                    this._setOption('valueType', value);
                }
                /**
                 * Configures variables, which are placeholders to be replaced with actual values when processing text.
                
                 */
                get variables() {
                    return this._getOption('variables');
                }
                set variables(value) {
                    this._setOption('variables', value);
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
                
                 * A function that is executed when the UI component gets focus.
                
                
                 */
                onFocusIn;
                /**
                
                 * A function that is executed when the UI component loses focus.
                
                
                 */
                onFocusOut;
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
                allowSoftLineBreakChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizeModulesChange;
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
                focusStateEnabledChange;
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
                imageUploadChange;
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
                mediaResizingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                mentionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                nameChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                placeholderChange;
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
                stylingModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tableContextMenuChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tableResizingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                toolbarChange;
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
                valueTypeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                variablesChange;
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
                get mentionsChildren() {
                    return this._getOption('mentions');
                }
                set mentionsChildren(value) {
                    this.setChildren('mentions', value);
                }
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'focusIn', emit: 'onFocusIn' },
                        { subscribe: 'focusOut', emit: 'onFocusOut' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'valueChanged', emit: 'onValueChanged' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'allowSoftLineBreakChange' },
                        { emit: 'customizeModulesChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'imageUploadChange' },
                        { emit: 'isDirtyChange' },
                        { emit: 'isValidChange' },
                        { emit: 'mediaResizingChange' },
                        { emit: 'mentionsChange' },
                        { emit: 'nameChange' },
                        { emit: 'placeholderChange' },
                        { emit: 'readOnlyChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'stylingModeChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'tableContextMenuChange' },
                        { emit: 'tableResizingChange' },
                        { emit: 'toolbarChange' },
                        { emit: 'validationErrorChange' },
                        { emit: 'validationErrorsChange' },
                        { emit: 'validationMessageModeChange' },
                        { emit: 'validationMessagePositionChange' },
                        { emit: 'validationStatusChange' },
                        { emit: 'valueChange' },
                        { emit: 'valueTypeChange' },
                        { emit: 'variablesChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'onBlur' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxHtmlEditor(element, options);
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
                    this.setupChanges('mentions', changes);
                    this.setupChanges('validationErrors', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('mentions');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxHtmlEditorComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxHtmlEditorComponent, selector: "dx-html-editor", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", allowSoftLineBreak: "allowSoftLineBreak", customizeModules: "customizeModules", disabled: "disabled", elementAttr: "elementAttr", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", imageUpload: "imageUpload", isDirty: "isDirty", isValid: "isValid", mediaResizing: "mediaResizing", mentions: "mentions", name: "name", placeholder: "placeholder", readOnly: "readOnly", rtlEnabled: "rtlEnabled", stylingMode: "stylingMode", tabIndex: "tabIndex", tableContextMenu: "tableContextMenu", tableResizing: "tableResizing", toolbar: "toolbar", validationError: "validationError", validationErrors: "validationErrors", validationMessageMode: "validationMessageMode", validationMessagePosition: "validationMessagePosition", validationStatus: "validationStatus", value: "value", valueType: "valueType", variables: "variables", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onDisposing: "onDisposing", onFocusIn: "onFocusIn", onFocusOut: "onFocusOut", onInitialized: "onInitialized", onOptionChanged: "onOptionChanged", onValueChanged: "onValueChanged", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", allowSoftLineBreakChange: "allowSoftLineBreakChange", customizeModulesChange: "customizeModulesChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", imageUploadChange: "imageUploadChange", isDirtyChange: "isDirtyChange", isValidChange: "isValidChange", mediaResizingChange: "mediaResizingChange", mentionsChange: "mentionsChange", nameChange: "nameChange", placeholderChange: "placeholderChange", readOnlyChange: "readOnlyChange", rtlEnabledChange: "rtlEnabledChange", stylingModeChange: "stylingModeChange", tabIndexChange: "tabIndexChange", tableContextMenuChange: "tableContextMenuChange", tableResizingChange: "tableResizingChange", toolbarChange: "toolbarChange", validationErrorChange: "validationErrorChange", validationErrorsChange: "validationErrorsChange", validationMessageModeChange: "validationMessageModeChange", validationMessagePositionChange: "validationMessagePositionChange", validationStatusChange: "validationStatusChange", valueChange: "valueChange", valueTypeChange: "valueTypeChange", variablesChange: "variablesChange", visibleChange: "visibleChange", widthChange: "widthChange", onBlur: "onBlur" }, host: { listeners: { "valueChange": "change($event)", "onBlur": "touched($event)" } }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        CUSTOM_VALUE_ACCESSOR_PROVIDER,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "mentionsChildren", predicate: DxiMentionComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxHtmlEditorComponent", DxHtmlEditorComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxHtmlEditorComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-html-editor',
                                template: '<ng-content></ng-content>',
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
                        }], allowSoftLineBreak: [{
                            type: Input
                        }], customizeModules: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], imageUpload: [{
                            type: Input
                        }], isDirty: [{
                            type: Input
                        }], isValid: [{
                            type: Input
                        }], mediaResizing: [{
                            type: Input
                        }], mentions: [{
                            type: Input
                        }], name: [{
                            type: Input
                        }], placeholder: [{
                            type: Input
                        }], readOnly: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], stylingMode: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], tableContextMenu: [{
                            type: Input
                        }], tableResizing: [{
                            type: Input
                        }], toolbar: [{
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
                        }], valueType: [{
                            type: Input
                        }], variables: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onFocusIn: [{
                            type: Output
                        }], onFocusOut: [{
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
                        }], allowSoftLineBreakChange: [{
                            type: Output
                        }], customizeModulesChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], imageUploadChange: [{
                            type: Output
                        }], isDirtyChange: [{
                            type: Output
                        }], isValidChange: [{
                            type: Output
                        }], mediaResizingChange: [{
                            type: Output
                        }], mentionsChange: [{
                            type: Output
                        }], nameChange: [{
                            type: Output
                        }], placeholderChange: [{
                            type: Output
                        }], readOnlyChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], stylingModeChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], tableContextMenuChange: [{
                            type: Output
                        }], tableResizingChange: [{
                            type: Output
                        }], toolbarChange: [{
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
                        }], valueTypeChange: [{
                            type: Output
                        }], variablesChange: [{
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
                        }], mentionsChildren: [{
                            type: ContentChildren,
                            args: [DxiMentionComponent]
                        }] } });
            class DxHtmlEditorModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxHtmlEditorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxHtmlEditorModule, declarations: [DxHtmlEditorComponent], imports: [DxoImageUploadModule,
                        DxoFileUploaderOptionsModule,
                        DxiTabModule,
                        DxoMediaResizingModule,
                        DxiMentionModule,
                        DxoTableContextMenuModule,
                        DxiItemModule,
                        DxoTableResizingModule,
                        DxoToolbarModule,
                        DxoVariablesModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxHtmlEditorComponent, DxoImageUploadModule,
                        DxoFileUploaderOptionsModule,
                        DxiTabModule,
                        DxoMediaResizingModule,
                        DxiMentionModule,
                        DxoTableContextMenuModule,
                        DxiItemModule,
                        DxoTableResizingModule,
                        DxoToolbarModule,
                        DxoVariablesModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxHtmlEditorModule, imports: [DxoImageUploadModule,
                        DxoFileUploaderOptionsModule,
                        DxiTabModule,
                        DxoMediaResizingModule,
                        DxiMentionModule,
                        DxoTableContextMenuModule,
                        DxiItemModule,
                        DxoTableResizingModule,
                        DxoToolbarModule,
                        DxoVariablesModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoImageUploadModule,
                        DxoFileUploaderOptionsModule,
                        DxiTabModule,
                        DxoMediaResizingModule,
                        DxiMentionModule,
                        DxoTableContextMenuModule,
                        DxiItemModule,
                        DxoTableResizingModule,
                        DxoToolbarModule,
                        DxoVariablesModule,
                        DxTemplateModule] });
            } exports("DxHtmlEditorModule", DxHtmlEditorModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxHtmlEditorModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoImageUploadModule,
                                    DxoFileUploaderOptionsModule,
                                    DxiTabModule,
                                    DxoMediaResizingModule,
                                    DxiMentionModule,
                                    DxoTableContextMenuModule,
                                    DxiItemModule,
                                    DxoTableResizingModule,
                                    DxoToolbarModule,
                                    DxoVariablesModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxHtmlEditorComponent
                                ],
                                exports: [
                                    DxHtmlEditorComponent,
                                    DxoImageUploadModule,
                                    DxoFileUploaderOptionsModule,
                                    DxiTabModule,
                                    DxoMediaResizingModule,
                                    DxiMentionModule,
                                    DxoTableContextMenuModule,
                                    DxiItemModule,
                                    DxoTableResizingModule,
                                    DxoToolbarModule,
                                    DxoVariablesModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
