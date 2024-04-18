System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/date_range_box', '@angular/forms', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, forwardRef, i0, PLATFORM_ID, Component, Inject, Input, Output, HostListener, ContentChildren, NgModule, DxDateRangeBox, NG_VALUE_ACCESSOR, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxiButtonComponent, DxiButtonModule, DxoOptionsModule, DxoCalendarOptionsModule, DxoDisplayFormatModule, DxoDropDownOptionsModule, DxoAnimationModule, DxoHideModule, DxoFromModule, DxoPositionModule, DxoAtModule, DxoBoundaryOffsetModule, DxoCollisionModule, DxoMyModule, DxoOffsetModule, DxoToModule, DxoShowModule, DxiToolbarItemModule;
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
            DxDateRangeBox = module.default;
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
            DxiButtonModule = module.DxiButtonModule;
            DxoOptionsModule = module.DxoOptionsModule;
            DxoCalendarOptionsModule = module.DxoCalendarOptionsModule;
            DxoDisplayFormatModule = module.DxoDisplayFormatModule;
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
                useExisting: forwardRef(() => DxDateRangeBoxComponent),
                multi: true
            };
            /**
             * DateRangeBox is a UI component that allows a user to select a date range (pick or enter start and end dates).

             */
            class DxDateRangeBoxComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies whether or not the UI component allows an end user to enter a custom value.
                
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
                 * Specifies the Apply button&apos;s text.
                
                 */
                get applyButtonText() {
                    return this._getOption('applyButtonText');
                }
                set applyButtonText(value) {
                    this._setOption('applyButtonText', value);
                }
                /**
                 * Specifies the way an end user applies the selected value.
                
                 */
                get applyValueMode() {
                    return this._getOption('applyValueMode');
                }
                set applyValueMode(value) {
                    this._setOption('applyValueMode', value);
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
                 * Configures the calendar&apos;s value picker.
                
                 */
                get calendarOptions() {
                    return this._getOption('calendarOptions');
                }
                set calendarOptions(value) {
                    this._setOption('calendarOptions', value);
                }
                /**
                 * Specifies the Cancel button&apos;s text.
                
                 */
                get cancelButtonText() {
                    return this._getOption('cancelButtonText');
                }
                set cancelButtonText(value) {
                    this._setOption('cancelButtonText', value);
                }
                /**
                 * Specifies the date value serialization format.
                
                 */
                get dateSerializationFormat() {
                    return this._getOption('dateSerializationFormat');
                }
                set dateSerializationFormat(value) {
                    this._setOption('dateSerializationFormat', value);
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
                 * Specifies whether the UI component disables date selection before the start date and after the end date.
                
                 */
                get disableOutOfRangeSelection() {
                    return this._getOption('disableOutOfRangeSelection');
                }
                set disableOutOfRangeSelection(value) {
                    this._setOption('disableOutOfRangeSelection', value);
                }
                /**
                 * Specifies the date&apos;s display format.
                
                 */
                get displayFormat() {
                    return this._getOption('displayFormat');
                }
                set displayFormat(value) {
                    this._setOption('displayFormat', value);
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
                 * Configures the drop-down that holds the content.
                
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
                 * Specifies the range&apos;s end date.
                
                 */
                get endDate() {
                    return this._getOption('endDate');
                }
                set endDate(value) {
                    this._setOption('endDate', value);
                }
                /**
                 * Specifies the attributes passed to the end date input field.
                
                 */
                get endDateInputAttr() {
                    return this._getOption('endDateInputAttr');
                }
                set endDateInputAttr(value) {
                    this._setOption('endDateInputAttr', value);
                }
                /**
                 * Specifies the label of the end date input field.
                
                 */
                get endDateLabel() {
                    return this._getOption('endDateLabel');
                }
                set endDateLabel(value) {
                    this._setOption('endDateLabel', value);
                }
                /**
                 * Specifies the name attribute of the end date input field.
                
                 */
                get endDateName() {
                    return this._getOption('endDateName');
                }
                set endDateName(value) {
                    this._setOption('endDateName', value);
                }
                /**
                 * Specifies the message displayed if the specified end date is later than the max value or earlier than the min value.
                
                 */
                get endDateOutOfRangeMessage() {
                    return this._getOption('endDateOutOfRangeMessage');
                }
                set endDateOutOfRangeMessage(value) {
                    this._setOption('endDateOutOfRangeMessage', value);
                }
                /**
                 * Specifies a placeholder for the end date input field.
                
                 */
                get endDatePlaceholder() {
                    return this._getOption('endDatePlaceholder');
                }
                set endDatePlaceholder(value) {
                    this._setOption('endDatePlaceholder', value);
                }
                /**
                 * Returns the text displayed by the end date input field.
                
                 */
                get endDateText() {
                    return this._getOption('endDateText');
                }
                set endDateText(value) {
                    this._setOption('endDateText', value);
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
                 * Specifies a message for invalid end date input.
                
                 */
                get invalidEndDateMessage() {
                    return this._getOption('invalidEndDateMessage');
                }
                set invalidEndDateMessage(value) {
                    this._setOption('invalidEndDateMessage', value);
                }
                /**
                 * Specifies a message for invalid start date input.
                
                 */
                get invalidStartDateMessage() {
                    return this._getOption('invalidStartDateMessage');
                }
                set invalidStartDateMessage(value) {
                    this._setOption('invalidStartDateMessage', value);
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
                 * Specifies the label&apos;s display mode.
                
                 */
                get labelMode() {
                    return this._getOption('labelMode');
                }
                set labelMode(value) {
                    this._setOption('labelMode', value);
                }
                /**
                 * The latest date that can be selected in the UI component.
                
                 */
                get max() {
                    return this._getOption('max');
                }
                set max(value) {
                    this._setOption('max', value);
                }
                /**
                 * The earliest date that can be selected in the UI component.
                
                 */
                get min() {
                    return this._getOption('min');
                }
                set min(value) {
                    this._setOption('min', value);
                }
                /**
                 * Specifies whether the UI component displays a single-month calendar or a multi-month calendar.
                
                 */
                get multiView() {
                    return this._getOption('multiView');
                }
                set multiView(value) {
                    this._setOption('multiView', value);
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
                 * Specifies whether a user can open the popup calendar by clicking an input field.
                
                 */
                get openOnFieldClick() {
                    return this._getOption('openOnFieldClick');
                }
                set openOnFieldClick(value) {
                    this._setOption('openOnFieldClick', value);
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
                 * Specifies whether or not the UI component checks the inner text for spelling mistakes.
                
                 */
                get spellcheck() {
                    return this._getOption('spellcheck');
                }
                set spellcheck(value) {
                    this._setOption('spellcheck', value);
                }
                /**
                 * Specifies the start date of date range.
                
                 */
                get startDate() {
                    return this._getOption('startDate');
                }
                set startDate(value) {
                    this._setOption('startDate', value);
                }
                /**
                 * Specifies the attributes passed to the start date input field.
                
                 */
                get startDateInputAttr() {
                    return this._getOption('startDateInputAttr');
                }
                set startDateInputAttr(value) {
                    this._setOption('startDateInputAttr', value);
                }
                /**
                 * Specifies a label of the start date input field.
                
                 */
                get startDateLabel() {
                    return this._getOption('startDateLabel');
                }
                set startDateLabel(value) {
                    this._setOption('startDateLabel', value);
                }
                /**
                 * Specifies the name attribute of the start date input field.
                
                 */
                get startDateName() {
                    return this._getOption('startDateName');
                }
                set startDateName(value) {
                    this._setOption('startDateName', value);
                }
                /**
                 * Specifies the message displayed if the specified start date is later than the max value or earlier than the min value.
                
                 */
                get startDateOutOfRangeMessage() {
                    return this._getOption('startDateOutOfRangeMessage');
                }
                set startDateOutOfRangeMessage(value) {
                    this._setOption('startDateOutOfRangeMessage', value);
                }
                /**
                 * Specifies a placeholder for the start date input field.
                
                 */
                get startDatePlaceholder() {
                    return this._getOption('startDatePlaceholder');
                }
                set startDatePlaceholder(value) {
                    this._setOption('startDatePlaceholder', value);
                }
                /**
                 * Returns the text displayed by the start date input field.
                
                 */
                get startDateText() {
                    return this._getOption('startDateText');
                }
                set startDateText(value) {
                    this._setOption('startDateText', value);
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
                 * Specified the Today button&apos;s text.
                
                 */
                get todayButtonText() {
                    return this._getOption('todayButtonText');
                }
                set todayButtonText(value) {
                    this._setOption('todayButtonText', value);
                }
                /**
                 * Specifies whether to use an input mask based on the displayFormat property.
                
                 */
                get useMaskBehavior() {
                    return this._getOption('useMaskBehavior');
                }
                set useMaskBehavior(value) {
                    this._setOption('useMaskBehavior', value);
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
                 * An array that specifies the selected range (start and end dates).
                
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
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
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
                applyButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                applyValueModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                buttonsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                calendarOptionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                cancelButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                dateSerializationFormatChange;
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
                disableOutOfRangeSelectionChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                displayFormatChange;
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
                endDateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDateInputAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDateLabelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDateNameChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDateOutOfRangeMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDatePlaceholderChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                endDateTextChange;
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
                invalidEndDateMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                invalidStartDateMessageChange;
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
                labelModeChange;
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
                multiViewChange;
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
                spellcheckChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateInputAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateLabelChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateNameChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateOutOfRangeMessageChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDatePlaceholderChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                startDateTextChange;
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
                todayButtonTextChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                useMaskBehaviorChange;
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
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'change', emit: 'onChange' },
                        { subscribe: 'closed', emit: 'onClosed' },
                        { subscribe: 'contentReady', emit: 'onContentReady' },
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
                        { emit: 'applyButtonTextChange' },
                        { emit: 'applyValueModeChange' },
                        { emit: 'buttonsChange' },
                        { emit: 'calendarOptionsChange' },
                        { emit: 'cancelButtonTextChange' },
                        { emit: 'dateSerializationFormatChange' },
                        { emit: 'deferRenderingChange' },
                        { emit: 'disabledChange' },
                        { emit: 'disableOutOfRangeSelectionChange' },
                        { emit: 'displayFormatChange' },
                        { emit: 'dropDownButtonTemplateChange' },
                        { emit: 'dropDownOptionsChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'endDateChange' },
                        { emit: 'endDateInputAttrChange' },
                        { emit: 'endDateLabelChange' },
                        { emit: 'endDateNameChange' },
                        { emit: 'endDateOutOfRangeMessageChange' },
                        { emit: 'endDatePlaceholderChange' },
                        { emit: 'endDateTextChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'invalidEndDateMessageChange' },
                        { emit: 'invalidStartDateMessageChange' },
                        { emit: 'isDirtyChange' },
                        { emit: 'isValidChange' },
                        { emit: 'labelModeChange' },
                        { emit: 'maxChange' },
                        { emit: 'minChange' },
                        { emit: 'multiViewChange' },
                        { emit: 'openedChange' },
                        { emit: 'openOnFieldClickChange' },
                        { emit: 'readOnlyChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'showClearButtonChange' },
                        { emit: 'showDropDownButtonChange' },
                        { emit: 'spellcheckChange' },
                        { emit: 'startDateChange' },
                        { emit: 'startDateInputAttrChange' },
                        { emit: 'startDateLabelChange' },
                        { emit: 'startDateNameChange' },
                        { emit: 'startDateOutOfRangeMessageChange' },
                        { emit: 'startDatePlaceholderChange' },
                        { emit: 'startDateTextChange' },
                        { emit: 'stylingModeChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'todayButtonTextChange' },
                        { emit: 'useMaskBehaviorChange' },
                        { emit: 'validationErrorChange' },
                        { emit: 'validationErrorsChange' },
                        { emit: 'validationMessageModeChange' },
                        { emit: 'validationMessagePositionChange' },
                        { emit: 'validationStatusChange' },
                        { emit: 'valueChange' },
                        { emit: 'valueChangeEventChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' },
                        { emit: 'onBlur' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxDateRangeBox(element, options);
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
                    this.setupChanges('validationErrors', changes);
                    this.setupChanges('value', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('buttons');
                    this._idh.doCheck('validationErrors');
                    this._idh.doCheck('value');
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
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDateRangeBoxComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxDateRangeBoxComponent, selector: "dx-date-range-box", inputs: { acceptCustomValue: "acceptCustomValue", accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", applyButtonText: "applyButtonText", applyValueMode: "applyValueMode", buttons: "buttons", calendarOptions: "calendarOptions", cancelButtonText: "cancelButtonText", dateSerializationFormat: "dateSerializationFormat", deferRendering: "deferRendering", disabled: "disabled", disableOutOfRangeSelection: "disableOutOfRangeSelection", displayFormat: "displayFormat", dropDownButtonTemplate: "dropDownButtonTemplate", dropDownOptions: "dropDownOptions", elementAttr: "elementAttr", endDate: "endDate", endDateInputAttr: "endDateInputAttr", endDateLabel: "endDateLabel", endDateName: "endDateName", endDateOutOfRangeMessage: "endDateOutOfRangeMessage", endDatePlaceholder: "endDatePlaceholder", endDateText: "endDateText", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", invalidEndDateMessage: "invalidEndDateMessage", invalidStartDateMessage: "invalidStartDateMessage", isDirty: "isDirty", isValid: "isValid", labelMode: "labelMode", max: "max", min: "min", multiView: "multiView", opened: "opened", openOnFieldClick: "openOnFieldClick", readOnly: "readOnly", rtlEnabled: "rtlEnabled", showClearButton: "showClearButton", showDropDownButton: "showDropDownButton", spellcheck: "spellcheck", startDate: "startDate", startDateInputAttr: "startDateInputAttr", startDateLabel: "startDateLabel", startDateName: "startDateName", startDateOutOfRangeMessage: "startDateOutOfRangeMessage", startDatePlaceholder: "startDatePlaceholder", startDateText: "startDateText", stylingMode: "stylingMode", tabIndex: "tabIndex", todayButtonText: "todayButtonText", useMaskBehavior: "useMaskBehavior", validationError: "validationError", validationErrors: "validationErrors", validationMessageMode: "validationMessageMode", validationMessagePosition: "validationMessagePosition", validationStatus: "validationStatus", value: "value", valueChangeEvent: "valueChangeEvent", visible: "visible", width: "width" }, outputs: { onChange: "onChange", onClosed: "onClosed", onContentReady: "onContentReady", onCopy: "onCopy", onCut: "onCut", onDisposing: "onDisposing", onEnterKey: "onEnterKey", onFocusIn: "onFocusIn", onFocusOut: "onFocusOut", onInitialized: "onInitialized", onInput: "onInput", onKeyDown: "onKeyDown", onKeyUp: "onKeyUp", onOpened: "onOpened", onOptionChanged: "onOptionChanged", onPaste: "onPaste", onValueChanged: "onValueChanged", acceptCustomValueChange: "acceptCustomValueChange", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", applyButtonTextChange: "applyButtonTextChange", applyValueModeChange: "applyValueModeChange", buttonsChange: "buttonsChange", calendarOptionsChange: "calendarOptionsChange", cancelButtonTextChange: "cancelButtonTextChange", dateSerializationFormatChange: "dateSerializationFormatChange", deferRenderingChange: "deferRenderingChange", disabledChange: "disabledChange", disableOutOfRangeSelectionChange: "disableOutOfRangeSelectionChange", displayFormatChange: "displayFormatChange", dropDownButtonTemplateChange: "dropDownButtonTemplateChange", dropDownOptionsChange: "dropDownOptionsChange", elementAttrChange: "elementAttrChange", endDateChange: "endDateChange", endDateInputAttrChange: "endDateInputAttrChange", endDateLabelChange: "endDateLabelChange", endDateNameChange: "endDateNameChange", endDateOutOfRangeMessageChange: "endDateOutOfRangeMessageChange", endDatePlaceholderChange: "endDatePlaceholderChange", endDateTextChange: "endDateTextChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", invalidEndDateMessageChange: "invalidEndDateMessageChange", invalidStartDateMessageChange: "invalidStartDateMessageChange", isDirtyChange: "isDirtyChange", isValidChange: "isValidChange", labelModeChange: "labelModeChange", maxChange: "maxChange", minChange: "minChange", multiViewChange: "multiViewChange", openedChange: "openedChange", openOnFieldClickChange: "openOnFieldClickChange", readOnlyChange: "readOnlyChange", rtlEnabledChange: "rtlEnabledChange", showClearButtonChange: "showClearButtonChange", showDropDownButtonChange: "showDropDownButtonChange", spellcheckChange: "spellcheckChange", startDateChange: "startDateChange", startDateInputAttrChange: "startDateInputAttrChange", startDateLabelChange: "startDateLabelChange", startDateNameChange: "startDateNameChange", startDateOutOfRangeMessageChange: "startDateOutOfRangeMessageChange", startDatePlaceholderChange: "startDatePlaceholderChange", startDateTextChange: "startDateTextChange", stylingModeChange: "stylingModeChange", tabIndexChange: "tabIndexChange", todayButtonTextChange: "todayButtonTextChange", useMaskBehaviorChange: "useMaskBehaviorChange", validationErrorChange: "validationErrorChange", validationErrorsChange: "validationErrorsChange", validationMessageModeChange: "validationMessageModeChange", validationMessagePositionChange: "validationMessagePositionChange", validationStatusChange: "validationStatusChange", valueChange: "valueChange", valueChangeEventChange: "valueChangeEventChange", visibleChange: "visibleChange", widthChange: "widthChange", onBlur: "onBlur" }, host: { listeners: { "valueChange": "change($event)", "onBlur": "touched($event)" } }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        CUSTOM_VALUE_ACCESSOR_PROVIDER,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], queries: [{ propertyName: "buttonsChildren", predicate: DxiButtonComponent }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxDateRangeBoxComponent", DxDateRangeBoxComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDateRangeBoxComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-date-range-box',
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
                            }] }], propDecorators: { acceptCustomValue: [{
                            type: Input
                        }], accessKey: [{
                            type: Input
                        }], activeStateEnabled: [{
                            type: Input
                        }], applyButtonText: [{
                            type: Input
                        }], applyValueMode: [{
                            type: Input
                        }], buttons: [{
                            type: Input
                        }], calendarOptions: [{
                            type: Input
                        }], cancelButtonText: [{
                            type: Input
                        }], dateSerializationFormat: [{
                            type: Input
                        }], deferRendering: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], disableOutOfRangeSelection: [{
                            type: Input
                        }], displayFormat: [{
                            type: Input
                        }], dropDownButtonTemplate: [{
                            type: Input
                        }], dropDownOptions: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], endDate: [{
                            type: Input
                        }], endDateInputAttr: [{
                            type: Input
                        }], endDateLabel: [{
                            type: Input
                        }], endDateName: [{
                            type: Input
                        }], endDateOutOfRangeMessage: [{
                            type: Input
                        }], endDatePlaceholder: [{
                            type: Input
                        }], endDateText: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], invalidEndDateMessage: [{
                            type: Input
                        }], invalidStartDateMessage: [{
                            type: Input
                        }], isDirty: [{
                            type: Input
                        }], isValid: [{
                            type: Input
                        }], labelMode: [{
                            type: Input
                        }], max: [{
                            type: Input
                        }], min: [{
                            type: Input
                        }], multiView: [{
                            type: Input
                        }], opened: [{
                            type: Input
                        }], openOnFieldClick: [{
                            type: Input
                        }], readOnly: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], showClearButton: [{
                            type: Input
                        }], showDropDownButton: [{
                            type: Input
                        }], spellcheck: [{
                            type: Input
                        }], startDate: [{
                            type: Input
                        }], startDateInputAttr: [{
                            type: Input
                        }], startDateLabel: [{
                            type: Input
                        }], startDateName: [{
                            type: Input
                        }], startDateOutOfRangeMessage: [{
                            type: Input
                        }], startDatePlaceholder: [{
                            type: Input
                        }], startDateText: [{
                            type: Input
                        }], stylingMode: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], todayButtonText: [{
                            type: Input
                        }], useMaskBehavior: [{
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
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onChange: [{
                            type: Output
                        }], onClosed: [{
                            type: Output
                        }], onContentReady: [{
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
                        }], applyButtonTextChange: [{
                            type: Output
                        }], applyValueModeChange: [{
                            type: Output
                        }], buttonsChange: [{
                            type: Output
                        }], calendarOptionsChange: [{
                            type: Output
                        }], cancelButtonTextChange: [{
                            type: Output
                        }], dateSerializationFormatChange: [{
                            type: Output
                        }], deferRenderingChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], disableOutOfRangeSelectionChange: [{
                            type: Output
                        }], displayFormatChange: [{
                            type: Output
                        }], dropDownButtonTemplateChange: [{
                            type: Output
                        }], dropDownOptionsChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], endDateChange: [{
                            type: Output
                        }], endDateInputAttrChange: [{
                            type: Output
                        }], endDateLabelChange: [{
                            type: Output
                        }], endDateNameChange: [{
                            type: Output
                        }], endDateOutOfRangeMessageChange: [{
                            type: Output
                        }], endDatePlaceholderChange: [{
                            type: Output
                        }], endDateTextChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], invalidEndDateMessageChange: [{
                            type: Output
                        }], invalidStartDateMessageChange: [{
                            type: Output
                        }], isDirtyChange: [{
                            type: Output
                        }], isValidChange: [{
                            type: Output
                        }], labelModeChange: [{
                            type: Output
                        }], maxChange: [{
                            type: Output
                        }], minChange: [{
                            type: Output
                        }], multiViewChange: [{
                            type: Output
                        }], openedChange: [{
                            type: Output
                        }], openOnFieldClickChange: [{
                            type: Output
                        }], readOnlyChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], showClearButtonChange: [{
                            type: Output
                        }], showDropDownButtonChange: [{
                            type: Output
                        }], spellcheckChange: [{
                            type: Output
                        }], startDateChange: [{
                            type: Output
                        }], startDateInputAttrChange: [{
                            type: Output
                        }], startDateLabelChange: [{
                            type: Output
                        }], startDateNameChange: [{
                            type: Output
                        }], startDateOutOfRangeMessageChange: [{
                            type: Output
                        }], startDatePlaceholderChange: [{
                            type: Output
                        }], startDateTextChange: [{
                            type: Output
                        }], stylingModeChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], todayButtonTextChange: [{
                            type: Output
                        }], useMaskBehaviorChange: [{
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
                        }] } });
            class DxDateRangeBoxModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDateRangeBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxDateRangeBoxModule, declarations: [DxDateRangeBoxComponent], imports: [DxiButtonModule,
                        DxoOptionsModule,
                        DxoCalendarOptionsModule,
                        DxoDisplayFormatModule,
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
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxDateRangeBoxComponent, DxiButtonModule,
                        DxoOptionsModule,
                        DxoCalendarOptionsModule,
                        DxoDisplayFormatModule,
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
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDateRangeBoxModule, imports: [DxiButtonModule,
                        DxoOptionsModule,
                        DxoCalendarOptionsModule,
                        DxoDisplayFormatModule,
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
                        DxIntegrationModule,
                        DxTemplateModule, DxiButtonModule,
                        DxoOptionsModule,
                        DxoCalendarOptionsModule,
                        DxoDisplayFormatModule,
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
                        DxTemplateModule] });
            } exports("DxDateRangeBoxModule", DxDateRangeBoxModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxDateRangeBoxModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxiButtonModule,
                                    DxoOptionsModule,
                                    DxoCalendarOptionsModule,
                                    DxoDisplayFormatModule,
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
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxDateRangeBoxComponent
                                ],
                                exports: [
                                    DxDateRangeBoxComponent,
                                    DxiButtonModule,
                                    DxoOptionsModule,
                                    DxoCalendarOptionsModule,
                                    DxoDisplayFormatModule,
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
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
