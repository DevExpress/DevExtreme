System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/drop_down_box', '@angular/forms', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, forwardRef, i0, PLATFORM_ID, Component, Inject, Input, Output, HostListener, ContentChildren, NgModule, DxDropDownBox, NG_VALUE_ACCESSOR, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiButtonComponent, DxiItemComponent, DxiButtonModule, DxoOptionsModule, DxoDropDownOptionsModule, DxoAnimationModule, DxoHideModule, DxoFromModule, DxoPositionModule, DxoAtModule, DxoBoundaryOffsetModule, DxoCollisionModule, DxoMyModule, DxoOffsetModule, DxoToModule, DxoShowModule, DxiToolbarItemModule, DxiItemModule;
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
            DxDropDownBox = module.default;
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
            DxiButtonComponent = module.DxiButtonComponent;
            DxiItemComponent = module.DxiItemComponent;
            DxiButtonModule = module.DxiButtonModule;
            DxoOptionsModule = module.DxoOptionsModule;
            DxoDropDownOptionsModule = module.DxoDropDownOptionsModule;
            DxoAnimationModule = module.DxoAnimationModule;
            DxoHideModule = module.DxoHideModule;
            DxoFromModule = module.DxoFromModule;
            DxoPositionModule = module.DxoPositionModule;
            DxoAtModule = module.DxoAtModule;
            DxoBoundaryOffsetModule = module.DxoBoundaryOffsetModule;
            DxoCollisionModule = module.DxoCollisionModule;
            DxoMyModule = module.DxoMyModule;
            DxoOffsetModule = module.DxoOffsetModule;
            DxoToModule = module.DxoToModule;
            DxoShowModule = module.DxoShowModule;
            DxiToolbarItemModule = module.DxiToolbarItemModule;
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
            const CUSTOM_VALUE_ACCESSOR_PROVIDER = {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DxDropDownBoxComponent),
                multi: true
            };
            /**
             * The DropDownBox UI component consists of a text field, which displays the current value, and a drop-down field, which can contain any UI element.

             */
            class DxDropDownBoxComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies whether the UI component allows a user to enter a custom value.
                
                 */
                get acceptCustomValue() {
                    return this._getOption('acceptCustomValue');
                }
                set acceptCustomValue(value) {
                    this._setOption('acceptCustomValue', value);
                }
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
                 * Allows you to add custom buttons to the input text field.
                
                 */
                get buttons() {
                    return this._getOption('buttons');
                }
                set buttons(value) {
                    this._setOption('buttons', value);
                }
                /**
                 * Specifies a custom template for the drop-down content.
                
                 */
                get contentTemplate() {
                    return this._getOption('contentTemplate');
                }
                set contentTemplate(value) {
                    this._setOption('contentTemplate', value);
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
                 * Specifies whether to render the drop-down field&apos;s content when it is displayed. If false, the content is rendered immediately.
                
                 */
                get deferRendering() {
                    return this._getOption('deferRendering');
                }
                set deferRendering(value) {
                    this._setOption('deferRendering', value);
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
                 * Specifies the data field whose values should be displayed.
                
                 */
                get displayExpr() {
                    return this._getOption('displayExpr');
                }
                set displayExpr(value) {
                    this._setOption('displayExpr', value);
                }
                /**
                 * Customizes text before it is displayed in the input field.
                
                 */
                get displayValueFormatter() {
                    return this._getOption('displayValueFormatter');
                }
                set displayValueFormatter(value) {
                    this._setOption('displayValueFormatter', value);
                }
                /**
                 * Specifies a custom template for the drop-down button.
                
                 */
                get dropDownButtonTemplate() {
                    return this._getOption('dropDownButtonTemplate');
                }
                set dropDownButtonTemplate(value) {
                    this._setOption('dropDownButtonTemplate', value);
                }
                /**
                 * Configures the drop-down field which holds the content.
                
                 */
                get dropDownOptions() {
                    return this._getOption('dropDownOptions');
                }
                set dropDownOptions(value) {
                    this._setOption('dropDownOptions', value);
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
                 * Specifies a custom template for the text field. Must contain the TextBox UI component.
                
                 */
                get fieldTemplate() {
                    return this._getOption('fieldTemplate');
                }
                set fieldTemplate(value) {
                    this._setOption('fieldTemplate', value);
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
                 * Specifies the attributes to be passed on to the underlying HTML element.
                
                 */
                get inputAttr() {
                    return this._getOption('inputAttr');
                }
                set inputAttr(value) {
                    this._setOption('inputAttr', value);
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
                 * An array of items used to synchronize the DropDownBox with an embedded UI component.
                
                 */
                get items() {
                    return this._getOption('items');
                }
                set items(value) {
                    this._setOption('items', value);
                }
                /**
                 * Specifies a text string used to annotate the editor&apos;s value.
                
                 */
                get label() {
                    return this._getOption('label');
                }
                set label(value) {
                    this._setOption('label', value);
                }
                /**
                 * Specifies the label&apos;s display mode.
                
                 */
                get labelMode() {
                    return this._getOption('labelMode');
                }
                set labelMode(value) {
                    this._setOption('labelMode', value);
                }
                /**
                 * Specifies the maximum number of characters you can enter into the textbox.
                
                 */
                get maxLength() {
                    return this._getOption('maxLength');
                }
                set maxLength(value) {
                    this._setOption('maxLength', value);
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
                 * Specifies whether or not the drop-down editor is displayed.
                
                 */
                get opened() {
                    return this._getOption('opened');
                }
                set opened(value) {
                    this._setOption('opened', value);
                }
                /**
                 * Specifies whether a user can open the drop-down list by clicking a text field.
                
                 */
                get openOnFieldClick() {
                    return this._getOption('openOnFieldClick');
                }
                set openOnFieldClick(value) {
                    this._setOption('openOnFieldClick', value);
                }
                /**
                 * Specifies a text string displayed when the editor&apos;s value is empty.
                
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
                 * Specifies whether to display the Clear button in the UI component.
                
                 */
                get showClearButton() {
                    return this._getOption('showClearButton');
                }
                set showClearButton(value) {
                    this._setOption('showClearButton', value);
                }
                /**
                 * Specifies whether the drop-down button is visible.
                
                 */
                get showDropDownButton() {
                    return this._getOption('showDropDownButton');
                }
                set showDropDownButton(value) {
                    this._setOption('showDropDownButton', value);
                }
                /**
                 * Specifies how the UI component&apos;s text field is styled.
                
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
                 * The read-only property that holds the text displayed by the UI component input element.
                
                 */
                get text() {
                    return this._getOption('text');
                }
                set text(value) {
                    this._setOption('text', value);
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
                 * Specifies the currently selected value. May be an object if dataSource contains objects, the store key is specified, and valueExpr is not set.
                
                 */
                get value() {
                    return this._getOption('value');
                }
                set value(value) {
                    this._setOption('value', value);
                }
                /**
                 * Specifies the DOM events after which the UI component&apos;s value should be updated.
                
                 */
                get valueChangeEvent() {
                    return this._getOption('valueChangeEvent');
                }
                set valueChangeEvent(value) {
                    this._setOption('valueChangeEvent', value);
                }
                /**
                 * Specifies which data field provides unique values to the UI component&apos;s value.
                
                 */
                get valueExpr() {
                    return this._getOption('valueExpr');
                }
                set valueExpr(value) {
                    this._setOption('valueExpr', value);
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
                
                 * A function that is executed when the UI component loses focus after the text field&apos;s content was changed using the keyboard.
                
                
                 */
                onChange;
                /**
                
                 * A function that is executed once the drop-down editor is closed.
                
                
                 */
                onClosed;
                /**
                
                 * A function that is executed when the UI component&apos;s input has been copied.
                
                
                 */
                onCopy;
                /**
                
                 * A function that is executed when the UI component&apos;s input has been cut.
                
                
                 */
                onCut;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed when the Enter key has been pressed while the UI component is focused.
                
                
                 */
                onEnterKey;
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
                
                 * A function that is executed each time the UI component&apos;s input is changed while the UI component is focused.
                
                
                 */
                onInput;
                /**
                
                 * A function that is executed when a user is pressing a key on the keyboard.
                
                
                 */
                onKeyDown;
                /**
                
                 * A function that is executed when a user releases a key on the keyboard.
                
                
                 */
                onKeyUp;
                /**
                
                 * A function that is executed once the drop-down editor is opened.
                
                
                 */
                onOpened;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when the UI component&apos;s input has been pasted.
                
                
                 */
                onPaste;
                /**
                
                 * A function that is executed after the UI component&apos;s value is changed.
                
                
                 */
                onValueChanged;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                acceptCustomValueChange;
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
                buttonsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                contentTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dataSourceChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                deferRenderingChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                displayExprChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                displayValueFormatterChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dropDownButtonTemplateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dropDownOptionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                fieldTemplateChange;
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
                inputAttrChange;
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
                itemsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                labelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                labelModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                maxLengthChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                nameChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                openedChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                openOnFieldClickChange;
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
                showClearButtonChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                showDropDownButtonChange;
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
                textChange;
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
                valueChangeEventChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                valueExprChange;
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
                get buttonsChildren() {
                    return this._getOption('buttons');
                }
                set buttonsChildren(value) {
                    this.setChildren('buttons', value);
                }
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
                        { subscribe: 'change', emit: 'onChange' },
                        { subscribe: 'closed', emit: 'onClosed' },
                        { subscribe: 'copy', emit: 'onCopy' },
                        { subscribe: 'cut', emit: 'onCut' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'enterKey', emit: 'onEnterKey' },
                        { subscribe: 'focusIn', emit: 'onFocusIn' },
                        { subscribe: 'focusOut', emit: 'onFocusOut' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'input', emit: 'onInput' },
                        { subscribe: 'keyDown', emit: 'onKeyDown' },
                        { subscribe: 'keyUp', emit: 'onKeyUp' },
                        { subscribe: 'opened', emit: 'onOpened' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'paste', emit: 'onPaste' },
                        { subscribe: 'valueChanged', emit: 'onValueChanged' },
                        { emit: 'acceptCustomValueChange' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'buttonsChange' },
                        { emit: 'contentTemplateChange' },
                        { emit: 'dataSourceChange' },
                        { emit: 'deferRenderingChange' },
                        { emit: 'disabledChange' },
                        { emit: 'displayExprChange' },
                        { emit: 'displayValueFormatterChange' },
                        { emit: 'dropDownButtonTemplateChange' },
                        { emit: 'dropDownOptionsChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'fieldTemplateChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'inputAttrChange' },
                        { emit: 'isDirtyChange' },
                        { emit: 'isValidChange' },
                        { emit: 'itemsChange' },
                        { emit: 'labelChange' },
                        { emit: 'labelModeChange' },
                        { emit: 'maxLengthChange' },
                        { emit: 'nameChange' },
                        { emit: 'openedChange' },
                        { emit: 'openOnFieldClickChange' },
                        { emit: 'placeholderChange' },
                        { emit: 'readOnlyChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'showClearButtonChange' },
                        { emit: 'showDropDownButtonChange' },
                        { emit: 'stylingModeChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'textChange' },
                        { emit: 'validationErrorChange' },
                        { emit: 'validationErrorsChange' },
                        { emit: 'validationMessageModeChange' },
                        { emit: 'validationMessagePositionChange' },
                        { emit: 'validationStatusChange' },
                        { emit: 'valueChange' },
                        { emit: 'valueChangeEventChange' },
                        { emit: 'valueExprChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'onBlur' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxDropDownBox(element, options);
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
                    this.setupChanges('buttons', changes);
                    this.setupChanges('dataSource', changes);
                    this.setupChanges('items', changes);
                    this.setupChanges('validationErrors', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('buttons');
                    this._idh.doCheck('dataSource');
                    this._idh.doCheck('items');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownBoxComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxDropDownBoxComponent, selector: "dx-drop-down-box", inputs: { acceptCustomValue: "acceptCustomValue", accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", buttons: "buttons", contentTemplate: "contentTemplate", dataSource: "dataSource", deferRendering: "deferRendering", disabled: "disabled", displayExpr: "displayExpr", displayValueFormatter: "displayValueFormatter", dropDownButtonTemplate: "dropDownButtonTemplate", dropDownOptions: "dropDownOptions", elementAttr: "elementAttr", fieldTemplate: "fieldTemplate", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", inputAttr: "inputAttr", isDirty: "isDirty", isValid: "isValid", items: "items", label: "label", labelMode: "labelMode", maxLength: "maxLength", name: "name", opened: "opened", openOnFieldClick: "openOnFieldClick", placeholder: "placeholder", readOnly: "readOnly", rtlEnabled: "rtlEnabled", showClearButton: "showClearButton", showDropDownButton: "showDropDownButton", stylingMode: "stylingMode", tabIndex: "tabIndex", text: "text", validationError: "validationError", validationErrors: "validationErrors", validationMessageMode: "validationMessageMode", validationMessagePosition: "validationMessagePosition", validationStatus: "validationStatus", value: "value", valueChangeEvent: "valueChangeEvent", valueExpr: "valueExpr", visible: "visible", width: "width" }, outputs: { onChange: "onChange", onClosed: "onClosed", onCopy: "onCopy", onCut: "onCut", onDisposing: "onDisposing", onEnterKey: "onEnterKey", onFocusIn: "onFocusIn", onFocusOut: "onFocusOut", onInitialized: "onInitialized", onInput: "onInput", onKeyDown: "onKeyDown", onKeyUp: "onKeyUp", onOpened: "onOpened", onOptionChanged: "onOptionChanged", onPaste: "onPaste", onValueChanged: "onValueChanged", acceptCustomValueChange: "acceptCustomValueChange", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", buttonsChange: "buttonsChange", contentTemplateChange: "contentTemplateChange", dataSourceChange: "dataSourceChange", deferRenderingChange: "deferRenderingChange", disabledChange: "disabledChange", displayExprChange: "displayExprChange", displayValueFormatterChange: "displayValueFormatterChange", dropDownButtonTemplateChange: "dropDownButtonTemplateChange", dropDownOptionsChange: "dropDownOptionsChange", elementAttrChange: "elementAttrChange", fieldTemplateChange: "fieldTemplateChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", inputAttrChange: "inputAttrChange", isDirtyChange: "isDirtyChange", isValidChange: "isValidChange", itemsChange: "itemsChange", labelChange: "labelChange", labelModeChange: "labelModeChange", maxLengthChange: "maxLengthChange", nameChange: "nameChange", openedChange: "openedChange", openOnFieldClickChange: "openOnFieldClickChange", placeholderChange: "placeholderChange", readOnlyChange: "readOnlyChange", rtlEnabledChange: "rtlEnabledChange", showClearButtonChange: "showClearButtonChange", showDropDownButtonChange: "showDropDownButtonChange", stylingModeChange: "stylingModeChange", tabIndexChange: "tabIndexChange", textChange: "textChange", validationErrorChange: "validationErrorChange", validationErrorsChange: "validationErrorsChange", validationMessageModeChange: "validationMessageModeChange", validationMessagePositionChange: "validationMessagePositionChange", validationStatusChange: "validationStatusChange", valueChange: "valueChange", valueChangeEventChange: "valueChangeEventChange", valueExprChange: "valueExprChange", visibleChange: "visibleChange", widthChange: "widthChange", onBlur: "onBlur" }, host: { listeners: { "valueChange": "change($event)", "onBlur": "touched($event)" } }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        CUSTOM_VALUE_ACCESSOR_PROVIDER,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "buttonsChildren", predicate: DxiButtonComponent }, { propertyName: "itemsChildren", predicate: DxiItemComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
            } exports("DxDropDownBoxComponent", DxDropDownBoxComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownBoxComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-drop-down-box',
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
                            }] }], propDecorators: { acceptCustomValue: [{
                            type: Input
                        }], accessKey: [{
                            type: Input
                        }], activeStateEnabled: [{
                            type: Input
                        }], buttons: [{
                            type: Input
                        }], contentTemplate: [{
                            type: Input
                        }], dataSource: [{
                            type: Input
                        }], deferRendering: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], displayExpr: [{
                            type: Input
                        }], displayValueFormatter: [{
                            type: Input
                        }], dropDownButtonTemplate: [{
                            type: Input
                        }], dropDownOptions: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], fieldTemplate: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], inputAttr: [{
                            type: Input
                        }], isDirty: [{
                            type: Input
                        }], isValid: [{
                            type: Input
                        }], items: [{
                            type: Input
                        }], label: [{
                            type: Input
                        }], labelMode: [{
                            type: Input
                        }], maxLength: [{
                            type: Input
                        }], name: [{
                            type: Input
                        }], opened: [{
                            type: Input
                        }], openOnFieldClick: [{
                            type: Input
                        }], placeholder: [{
                            type: Input
                        }], readOnly: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], showClearButton: [{
                            type: Input
                        }], showDropDownButton: [{
                            type: Input
                        }], stylingMode: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], text: [{
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
                        }], valueChangeEvent: [{
                            type: Input
                        }], valueExpr: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onChange: [{
                            type: Output
                        }], onClosed: [{
                            type: Output
                        }], onCopy: [{
                            type: Output
                        }], onCut: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onEnterKey: [{
                            type: Output
                        }], onFocusIn: [{
                            type: Output
                        }], onFocusOut: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onInput: [{
                            type: Output
                        }], onKeyDown: [{
                            type: Output
                        }], onKeyUp: [{
                            type: Output
                        }], onOpened: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onPaste: [{
                            type: Output
                        }], onValueChanged: [{
                            type: Output
                        }], acceptCustomValueChange: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], buttonsChange: [{
                            type: Output
                        }], contentTemplateChange: [{
                            type: Output
                        }], dataSourceChange: [{
                            type: Output
                        }], deferRenderingChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], displayExprChange: [{
                            type: Output
                        }], displayValueFormatterChange: [{
                            type: Output
                        }], dropDownButtonTemplateChange: [{
                            type: Output
                        }], dropDownOptionsChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], fieldTemplateChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], inputAttrChange: [{
                            type: Output
                        }], isDirtyChange: [{
                            type: Output
                        }], isValidChange: [{
                            type: Output
                        }], itemsChange: [{
                            type: Output
                        }], labelChange: [{
                            type: Output
                        }], labelModeChange: [{
                            type: Output
                        }], maxLengthChange: [{
                            type: Output
                        }], nameChange: [{
                            type: Output
                        }], openedChange: [{
                            type: Output
                        }], openOnFieldClickChange: [{
                            type: Output
                        }], placeholderChange: [{
                            type: Output
                        }], readOnlyChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], showClearButtonChange: [{
                            type: Output
                        }], showDropDownButtonChange: [{
                            type: Output
                        }], stylingModeChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], textChange: [{
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
                        }], valueChangeEventChange: [{
                            type: Output
                        }], valueExprChange: [{
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
                        }], buttonsChildren: [{
                            type: ContentChildren,
                            args: [DxiButtonComponent]
                        }], itemsChildren: [{
                            type: ContentChildren,
                            args: [DxiItemComponent]
                        }] } });
            class DxDropDownBoxModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownBoxModule, declarations: [DxDropDownBoxComponent], imports: [DxiButtonModule,
                        DxoOptionsModule,
                        DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxDropDownBoxComponent, DxiButtonModule,
                        DxoOptionsModule,
                        DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownBoxModule, imports: [DxiButtonModule,
                        DxoOptionsModule,
                        DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxiButtonModule,
                        DxoOptionsModule,
                        DxoDropDownOptionsModule,
                        DxoAnimationModule,
                        DxoHideModule,
                        DxoFromModule,
                        DxoPositionModule,
                        DxoAtModule,
                        DxoBoundaryOffsetModule,
                        DxoCollisionModule,
                        DxoMyModule,
                        DxoOffsetModule,
                        DxoToModule,
                        DxoShowModule,
                        DxiToolbarItemModule,
                        DxiItemModule,
                        DxTemplateModule] });
            } exports("DxDropDownBoxModule", DxDropDownBoxModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDropDownBoxModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiButtonModule,
                                    DxoOptionsModule,
                                    DxoDropDownOptionsModule,
                                    DxoAnimationModule,
                                    DxoHideModule,
                                    DxoFromModule,
                                    DxoPositionModule,
                                    DxoAtModule,
                                    DxoBoundaryOffsetModule,
                                    DxoCollisionModule,
                                    DxoMyModule,
                                    DxoOffsetModule,
                                    DxoToModule,
                                    DxoShowModule,
                                    DxiToolbarItemModule,
                                    DxiItemModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxDropDownBoxComponent
                                ],
                                exports: [
                                    DxDropDownBoxComponent,
                                    DxiButtonModule,
                                    DxoOptionsModule,
                                    DxoDropDownOptionsModule,
                                    DxoAnimationModule,
                                    DxoHideModule,
                                    DxoFromModule,
                                    DxoPositionModule,
                                    DxoAtModule,
                                    DxoBoundaryOffsetModule,
                                    DxoCollisionModule,
                                    DxoMyModule,
                                    DxoOffsetModule,
                                    DxoToModule,
                                    DxoShowModule,
                                    DxiToolbarItemModule,
                                    DxiItemModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
