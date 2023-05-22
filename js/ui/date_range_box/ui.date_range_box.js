import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import domAdapter from '../../core/dom_adapter';
import { extend } from '../../core/utils/extend';
import { getImageContainer } from '../../core/utils/icon';
import config from '../../core/config';
import devices from '../../core/devices';
import messageLocalization from '../../localization/message';
import { current, isMaterial } from '../themes';
import Editor from '../editor/editor';
import MultiselectDateBox from './ui.multiselect_date_box';
import TextEditorButtonCollection from '../text_box/texteditor_button_collection/index';
import DropDownButton from '../drop_down_editor/ui.drop_down_button';
import ClearButton from '../text_box/ui.text_editor.clear';
import { FunctionTemplate } from '../../core/templates/function_template';
import { isSameDates, isSameDateArrays, sortDatesArray, getDeserializedDate } from './ui.date_range.utils';
import { each } from '../../core/utils/iterator';
import { camelize } from '../../core/utils/inflector';
import { addNamespace } from '../../events/utils/index';
import eventsEngine from '../../events/core/events_engine';

const DATERANGEBOX_CLASS = 'dx-daterangebox';
const DATERANGEBOX_WITH_LABEL_CLASS = 'dx-daterangebox-with-label';
const DATERANGEBOX_WITH_FLOATING_LABEL_CLASS = 'dx-daterangebox-with-floating-label';
const START_DATEBOX_CLASS = 'dx-start-datebox';
const END_DATEBOX_CLASS = 'dx-end-datebox';
const DATERANGEBOX_SEPARATOR_CLASS = 'dx-daterangebox-separator';
const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';

const READONLY_STATE_CLASS = 'dx-state-readonly';

const TEXTEDITOR_CLASS = 'dx-texteditor';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_EMPTY_INPUT_CLASS = 'dx-texteditor-empty';

const DROP_DOWN_EDITOR_CLASS = 'dx-dropdowneditor';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';

const SEPARATOR_ICON_NAME = 'to';

const EVENTS_LIST = [
    'KeyDown', 'KeyUp',
    'Change', 'Cut', 'Copy', 'Paste', 'Input',
    'EnterKey',
];

// STYLE dateRangeBox

class DateRangeBox extends Editor {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            acceptCustomValue: true,
            activeStateEnabled: true,
            applyButtonText: messageLocalization.format('OK'),
            applyValueMode: 'instantly',
            buttons: undefined,
            calendarOptions: {},
            cancelButtonText: messageLocalization.format('Cancel'),
            endDateOutOfRangeMessage: messageLocalization.format('dxDateRangeBox-endDateOutOfRangeMessage'),
            dateSerializationFormat: undefined,
            deferRendering: true,
            disabledDates: null,
            displayFormat: null,
            dropDownButtonTemplate: 'dropDownButton',
            dropDownOptions: {},
            endDate: null,
            endDateInputAttr: {},
            endDateLabel: messageLocalization.format('dxDateRangeBox-endDateLabel'),
            endDateName: '',
            endDatePlaceholder: '',
            endDateText: undefined,
            focusStateEnabled: true,
            hoverStateEnabled: true,
            invalidStartDateMessage: messageLocalization.format('dxDateRangeBox-invalidStartDateMessage'),
            invalidEndDateMessage: messageLocalization.format('dxDateRangeBox-invalidEndDateMessage'),
            isValid: true,
            labelMode: 'static',
            max: undefined,
            min: undefined,
            multiView: true,
            onChange: null,
            onClosed: null,
            onCopy: null,
            onCut: null,
            onEnterKey: null,
            onInput: null,
            onKeyDown: null,
            onKeyUp: null,
            onOpened: null,
            onPaste: null,
            onValueChanged: null,
            openOnFieldClick: true,
            opened: false,
            pickerType: 'calendar',
            readOnly: false,
            selectionBehavior: 'normal',
            showClearButton: false,
            showDropDownButton: true,
            spellcheck: false,
            startDate: null,
            startDateInputAttr: {},
            startDateLabel: messageLocalization.format('dxDateRangeBox-startDateLabel'),
            startDateName: '',
            startDateOutOfRangeMessage: messageLocalization.format('dxDateRangeBox-startDateOutOfRangeMessage'),
            startDatePlaceholder: '',
            startDateText: undefined,
            stylingMode: config().editorStylingMode || 'outlined',
            todayButtonText: messageLocalization.format('dxCalendar-todayButtonText'),
            useHiddenSubmitElement: false,
            useMaskBehavior: false,
            validationError: null,
            validationErrors: null,
            validationMessageMode: 'auto',
            validationMessagePosition: 'auto',
            validationStatus: 'valid',
            value: [null, null],
            valueChangeEvent: 'change',
            _internalValidationErrors: [],
            _currentSelection: 'startDate',
        });
    }

    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([
            {
                device: function() {
                    const themeName = current();
                    return isMaterial(themeName);
                },
                options: {
                    stylingMode: config().editorStylingMode || 'filled',
                    labelMode: 'floating'
                }
            },
            {
                device: function() {
                    const realDevice = devices.real();
                    const platform = realDevice.platform;
                    return platform === 'ios' || platform === 'android';
                },
                options: {
                    multiView: false
                }
            },
        ]);
    }

    _initOptions(options) {
        super._initOptions(options);

        const { value: initialValue } = this.initialOption();
        let { value, startDate, endDate } = this.option();

        if(value[0] && value[1] && getDeserializedDate(value[0]) > getDeserializedDate(value[1])) {
            value = [value[1], value[0]];
        }
        if(startDate && endDate && getDeserializedDate(startDate) > getDeserializedDate(endDate)) {
            [startDate, endDate] = [endDate, startDate];
        }

        if(isSameDateArrays(initialValue, value)) {
            value = [startDate, endDate];
        } else {
            [startDate, endDate] = value;
        }

        this.option({
            startDate,
            endDate,
            value
        });
    }

    _createOpenAction() {
        this._openAction = this._createActionByOption('onOpened', {
            excludeValidators: ['disabled', 'readOnly']
        });
    }

    _raiseOpenAction() {
        if(!this._openAction) {
            this._createOpenAction();
        }
        this._openAction();
    }

    _createCloseAction() {
        this._closeAction = this._createActionByOption('onClosed', {
            excludeValidators: ['disabled', 'readOnly']
        });
    }

    _raiseCloseAction() {
        if(!this._closeAction) {
            this._createCloseAction();
        }
        this._closeAction();
    }

    _createEventAction(eventName) {
        this[`_${camelize(eventName)}Action`] = this._createActionByOption(`on${eventName}`, {
            excludeValidators: ['readOnly']
        });
    }

    _raiseAction(eventName, event) {
        const action = this[`_${camelize(eventName)}Action`];
        if(!action) {
            this._createEventAction(eventName);
        }
        this[`_${camelize(eventName)}Action`]({ event });
    }

    _initTemplates() {
        this._templateManager.addDefaultTemplates({
            dropDownButton: new FunctionTemplate(function(options) {
                const $icon = $('<div>').addClass(DROP_DOWN_EDITOR_BUTTON_ICON);
                $(options.container).append($icon);
            })
        });
        this.callBase();
    }

    _getDefaultButtons() {
        return [
            { name: 'clear', Ctor: ClearButton },
            { name: 'dropDown', Ctor: DropDownButton }
        ];
    }

    _initMarkup() {
        this.$element()
            .addClass(DATERANGEBOX_CLASS)
            .addClass(TEXTEDITOR_CLASS)
            .addClass(DROP_DOWN_EDITOR_CLASS);

        this._toggleDropDownEditorActiveClass();
        this._toggleEditorLabelClass();

        this._toggleReadOnlyState();
        this._renderStylingMode();
        // TODO: probably it need to update styling mode for dropDown in buttons container. It depends from design decision

        this._renderStartDateBox();
        this._renderSeparator();
        this._renderEndDateBox();

        this._toggleEmptinessState();
        this._renderEmptinessEvent();
        this._renderButtonsContainer();

        super._initMarkup();
    }

    _renderEmptinessEvent() {
        const eventName = addNamespace('input blur', this.NAME);

        eventsEngine.off(this._focusTarget(), eventName);
        eventsEngine.on(this._focusTarget(), eventName, this._toggleEmptinessState.bind(this));
    }

    _toggleEmptinessState() {
        const isEmpty = this.getStartDateBox().$element().hasClass(TEXTEDITOR_EMPTY_INPUT_CLASS)
            && this.getEndDateBox().$element().hasClass(TEXTEDITOR_EMPTY_INPUT_CLASS);

        this.$element().toggleClass(TEXTEDITOR_EMPTY_INPUT_CLASS, isEmpty);
    }

    _attachKeyboardEvents() {
        if(!this.option('readOnly')) {
            super._attachKeyboardEvents();
        }
    }

    _toggleReadOnlyState() {
        const { readOnly } = this.option();

        this.$element().toggleClass(READONLY_STATE_CLASS, !!readOnly);
        // TODO: should we add area readonly here?
    }

    _toggleDropDownEditorActiveClass(state) {
        const { opened } = this.option();

        this.$element().toggleClass(DROP_DOWN_EDITOR_ACTIVE_CLASS, state ?? opened);
    }

    _toggleEditorLabelClass() {
        const { startDateLabel, endDateLabel, labelMode } = this.option();

        const isLabelVisible = (!!startDateLabel || !!endDateLabel) && labelMode !== 'hidden';

        this.$element()
            .removeClass(DATERANGEBOX_WITH_FLOATING_LABEL_CLASS)
            .removeClass(DATERANGEBOX_WITH_LABEL_CLASS);

        if(isLabelVisible) {
            this.$element()
                .addClass(labelMode === 'floating'
                    ? DATERANGEBOX_WITH_FLOATING_LABEL_CLASS
                    : DATERANGEBOX_WITH_LABEL_CLASS);
        }
    }

    _renderStartDateBox() {
        this._$startDateBox = $('<div>')
            .addClass(START_DATEBOX_CLASS)
            .appendTo(this.$element());

        this._startDateBox = this._createComponent(this._$startDateBox, MultiselectDateBox, this._getStartDateBoxConfig());
        this._startDateBox.NAME = '_StartDateBox';
    }

    _renderEndDateBox() {
        this._$endDateBox = $('<div>')
            .addClass(END_DATEBOX_CLASS)
            .appendTo(this.$element());

        this._endDateBox = this._createComponent(this._$endDateBox, MultiselectDateBox, this._getEndDateBoxConfig());
        this._endDateBox.NAME = '_EndDateBox';
    }

    _renderSeparator() {
        const $icon = getImageContainer(SEPARATOR_ICON_NAME);
        this._$separator = $('<div>')
            .addClass(DATERANGEBOX_SEPARATOR_CLASS)
            .appendTo(this.$element());

        this._renderPreventBlurOnSeparatorClick();

        $icon.appendTo(this._$separator);
    }

    _renderPreventBlurOnSeparatorClick() {
        const eventName = addNamespace('mousedown', this.NAME);

        eventsEngine.off(this._$separator, eventName);
        eventsEngine.on(this._$separator, eventName, (e) => {
            if(!this._hasActiveElement()) {
                this.focus();
            }

            e.preventDefault();

        });
    }

    _renderButtonsContainer() {
        this._buttonCollection = new TextEditorButtonCollection(this, this._getDefaultButtons());

        this._$beforeButtonsContainer = null;
        this._$afterButtonsContainer = null;

        const { buttons } = this.option();

        this._$beforeButtonsContainer = this._buttonCollection.renderBeforeButtons(buttons, this.$element());
        this._$afterButtonsContainer = this._buttonCollection.renderAfterButtons(buttons, this.$element());
    }

    _updateButtons(names) {
        this._buttonCollection.updateButtons(names);
    }

    _openHandler() {
        this._toggleOpenState();
    }

    _shouldCallOpenHandler() {
        return true;
    }

    _toggleOpenState() {
        const { opened } = this.option();

        if(!opened) {
            this.getStartDateBox()._focusInput();
        }

        if(!this.option('readOnly')) {
            this.option('opened', !this.option('opened'));
        }
    }

    _clearValueHandler(e) {
        this._saveValueChangeEvent(e);

        this._shouldSuppressValueSync = true;
        this.getEndDateBox()._clearValueHandler(e);
        this.getStartDateBox()._clearValueHandler(e);
        this._shouldSuppressValueSync = false;

        this.reset();
    }

    _isClearButtonVisible() {
        return this.option('showClearButton') && !this.option('readOnly');
    }

    _focusInHandler(event) {
        if(this._shouldSkipFocusEvent(event)) {
            return;
        }

        super._focusInHandler(event);
    }

    _focusOutHandler(event) {
        if(this._shouldSkipFocusEvent(event)) {
            return;
        }

        super._focusOutHandler(event);
    }

    _shouldSkipFocusEvent(event) {
        const { target, relatedTarget } = event;

        return $(target).is(this.startDateField()) && $(relatedTarget).is(this.endDateField())
            || $(target).is(this.endDateField()) && $(relatedTarget).is(this.startDateField());
    }

    _getPickerType() {
        const { pickerType } = this.option();
        return ['calendar', 'native'].includes(pickerType) ? pickerType : 'calendar';
    }

    _getRestErrors(allErrors, partialErrors) {
        return allErrors.filter((error) => {
            return !partialErrors.some((prevError) => error.message === prevError.message);
        });
    }

    _syncValidationErrors(optionName, newPartialErrors, previousPartialErrors) {
        newPartialErrors ||= [];
        previousPartialErrors ||= [];

        const allErrors = this.option(optionName) || [];
        const otherErrors = this._getRestErrors(allErrors, previousPartialErrors);

        this.option(optionName, [...otherErrors, ...newPartialErrors]);
    }

    _getDateBoxConfig() {
        const options = this.option();

        const dateBoxConfig = {
            acceptCustomValue: options.acceptCustomValue,
            activeStateEnabled: options.activeStateEnabled,
            applyValueMode: options.applyValueMode,
            dateOutOfRangeMessage: options.dateOutOfRangeMessage,
            dateSerializationFormat: options.dateSerializationFormat,
            deferRendering: options.deferRendering,
            disabled: options.disabled,
            displayFormat: options.displayFormat,
            focusStateEnabled: options.focusStateEnabled,
            tabIndex: options.tabIndex,
            height: options.height,
            hoverStateEnabled: options.hoverStateEnabled,
            labelMode: options.labelMode,
            max: options.max,
            min: options.min,
            openOnFieldClick: options.openOnFieldClick,
            pickerType: this._getPickerType(),
            readOnly: options.readOnly,
            rtlEnabled: options.rtlEnabled,
            spellcheck: options.spellcheck,
            stylingMode: options.stylingMode,
            type: 'date',
            useMaskBehavior: options.useMaskBehavior,
            validationMessageMode: options.validationMessageMode,
            validationMessagePosition: options.validationMessagePosition,
            valueChangeEvent: options.valueChangeEvent,
            onKeyDown: options.onKeyUp,
            onKeyUp: options.onKeyUp,
            onChange: options.onChange,
            onInput: options.onInput,
            onCut: options.onCut,
            onCopy: options.onCopy,
            onPaste: options.onPaste,
            onEnterKey: options.onEnterKey,
            _dateRangeBoxInstance: this,
            _showValidationMessage: false,
        };

        each(EVENTS_LIST, (_, eventName) => {
            const optionName = `on${eventName}`;

            if(this.hasActionSubscription(optionName)) {
                dateBoxConfig[optionName] = (e) => {
                    this._raiseAction(eventName, e.event);
                };
            }
        });

        return dateBoxConfig;
    }

    _getStartDateBoxConfig() {
        const options = this.option();

        return {
            ...this._getDateBoxConfig(),
            applyButtonText: options.applyButtonText,
            calendarOptions: options.calendarOptions,
            cancelButtonText: options.cancelButtonText,
            dateOutOfRangeMessage: options.startDateOutOfRangeMessage,
            deferRendering: options.deferRendering,
            disabledDates: options.disabledDates,
            'dropDownOptions.showTitle': false,
            'dropDownOptions.title': '',
            dropDownOptions: options.dropDownOptions,
            invalidDateMessage: options.invalidStartDateMessage,
            onValueChanged: ({ value, event }) => {
                if(!this._shouldSuppressValueSync) {
                    const newValue = [value, this.option('value')[1]];

                    this.updateValue(newValue, event);
                }
            },
            opened: options.opened,
            onOpened: () => {
                this.option('opened', true);

                this._raiseOpenAction();
            },
            onClosed: () => {
                this.option('opened', false);

                this._raiseCloseAction();
            },
            onOptionChanged: (args) => {
                const { name, value, previousValue } = args;
                if(name === 'text') {
                    this.option('startDateText', value);
                }
                if(name === 'validationErrors') {
                    this._syncValidationErrors('_internalValidationErrors', value, previousValue);
                }
            },
            todayButtonText: options.todayButtonText,
            showClearButton: false,
            showDropDownButton: false,
            value: this.option('value')[0],
            label: options.startDateLabel,
            placeholder: options.startDatePlaceholder,
            inputAttr: options.startDateInputAttr,
            name: options.startDateName,
            _showValidationIcon: false,
        };
    }

    _getEndDateBoxConfig() {
        const options = this.option();

        return {
            ...this._getDateBoxConfig(),
            invalidDateMessage: options.invalidEndDateMessage,
            dateOutOfRangeMessage: options.endDateOutOfRangeMessage,
            dropDownOptions: {
                onShowing: (e) => {
                    e.cancel = true;
                    this.getStartDateBox().open();

                    // TODO: datebox doesn't clear opened state after prevent of opening
                    this.getEndDateBox().option('opened', false);
                },
                showTitle: false,
                title: '',
            },
            onValueChanged: ({ value, event }) => {
                if(!this._shouldSuppressValueSync) {
                    const newValue = [this.option('value')[0], value];

                    this.updateValue(newValue, event);
                }
            },
            onOptionChanged: (args) => {
                const { name, value, previousValue } = args;
                if(name === 'text') {
                    this.option('endDateText', value);
                }
                if(name === 'validationErrors') {
                    this._syncValidationErrors('_internalValidationErrors', value, previousValue);
                }
            },
            showClearButton: false,
            showDropDownButton: false,
            value: this.option('value')[1],
            label: options.endDateLabel,
            placeholder: options.endDatePlaceholder,
            deferRendering: true,
            inputAttr: options.endDateInputAttr,
            name: options.endDateName,
        };
    }

    _getValidationMessagePosition() {
        const { validationMessagePosition } = this.option();

        if(validationMessagePosition === 'auto') {
            return this.option('opened') ? 'top' : 'bottom';
        }

        return validationMessagePosition;
    }

    updateValue(newValue, event) {
        if(!isSameDateArrays(newValue, this.option('value'))) {
            if(event) {
                this._saveValueChangeEvent(event);
            }

            this.option('value', newValue);
        }
    }

    _updateDateBoxesValue(newValue) {
        const startDateBox = this.getStartDateBox();
        const endDateBox = this.getEndDateBox();
        const [newStartDate, newEndDate] = newValue;
        const oldStartDate = startDateBox.option('value');
        const oldEndDate = endDateBox.option('value');

        if(!isSameDates(newStartDate, oldStartDate)) {
            startDateBox.option('value', newStartDate);
        }

        if(!isSameDates(newEndDate, oldEndDate)) {
            endDateBox.option('value', newEndDate);
        }
    }

    _renderAccessKey() {
        const $startDateInput = $(this.field()[0]);
        const { accessKey } = this.option();

        $startDateInput.attr('accesskey', accessKey);
    }

    _focusTarget() {
        return this.$element().find(`.${TEXTEDITOR_INPUT_CLASS}`);
    }

    _focusEventTarget() {
        return this.element();
    }

    _focusClassTarget() {
        return this.$element();
    }

    _toggleFocusClass(isFocused, $element) {
        super._toggleFocusClass(isFocused, this._focusClassTarget($element));
    }

    _hasActiveElement() {
        const [startDateInput, endDateInput] = this.field();

        return this._isActiveElement(startDateInput) || this._isActiveElement(endDateInput);
    }

    _isActiveElement(input) {
        return $(input).is(domAdapter.getActiveElement(input));
    }

    _cleanButtonContainers() {
        this._$beforeButtonsContainer?.remove();
        this._$afterButtonsContainer?.remove();
        this._buttonCollection.clean();
        this._$beforeButtonsContainer = null;
        this._$afterButtonsContainer = null;
    }

    _applyCustomValidation(value) {
        this.validationRequest.fire({
            editor: this,
            value
        });
    }

    _clean() {
        this._cleanButtonContainers();

        this._$startDateBox?.remove();
        this._$endDateBox?.remove();
        this._$separator?.remove();

        super._clean();
    }

    _optionChanged(args) {
        const { name, fullName, value, previousValue } = args;

        switch(name) {
            case 'acceptCustomValue':
            case 'dateSerializationFormat':
            case 'displayFormat':
            case 'max':
            case 'min':
            case 'openOnFieldClick':
            case 'spellcheck':
            case 'useMaskBehavior':
            case 'valueChangeEvent':
                this.getStartDateBox().option(name, value);
                this.getEndDateBox().option(name, value);
                break;
            case 'rtlEnabled':
                super._optionChanged(args);
                break;
            case 'labelMode':
                this._toggleEditorLabelClass();
                this.getStartDateBox().option(name, value);
                this.getEndDateBox().option(name, value);
                break;
            case 'applyButtonText':
            case 'applyValueMode':
            case 'cancelButtonText':
            case 'deferRendering':
            case 'disabledDates':
            case 'todayButtonText':
                this.getStartDateBox().option(name, value);
                break;
            case 'opened':
                this._toggleDropDownEditorActiveClass(value);
                this.getStartDateBox().option(name, value);
                break;
            case 'buttons':
                this._cleanButtonContainers();
                this._renderButtonsContainer();
                break;
            case 'calendarOptions':
            case 'dropDownOptions':
                this.getStartDateBox().option(fullName, value);
                break;
            case 'pickerType': {
                const pickerType = this._getPickerType();
                this.getStartDateBox().option(name, pickerType);
                this.getEndDateBox().option(name, pickerType);
                break;
            }
            case 'dateOutOfRangeMessage':
                break;
            case 'height':
                this.getStartDateBox().option(name, value);
                this.getEndDateBox().option(name, value);
                super._optionChanged(args);
                break;
            case 'dropDownButtonTemplate':
            case 'showDropDownButton':
                this._updateButtons(['dropDown']);
                break;
            case 'showClearButton':
                this._updateButtons(['clear']);
                break;
            case 'endDate':
                this.updateValue([this.option('value')[0], value]);
                break;
            case 'startDateLabel':
                this._toggleEditorLabelClass();
                this.getStartDateBox().option('label', value);
                break;
            case 'endDateLabel':
                this._toggleEditorLabelClass();
                this.getEndDateBox().option('label', value);
                break;
            case 'startDatePlaceholder':
                this.getStartDateBox().option('placeholder', value);
                break;
            case 'endDatePlaceholder':
                this.getEndDateBox().option('placeholder', value);
                break;
            case 'startDateInputAttr':
                this.getStartDateBox().option('inputAttr', value);
                break;
            case 'startDateName':
                this.getStartDateBox().option('name', value);
                break;
            case 'endDateInputAttr':
                this.getEndDateBox().option('inputAttr', value);
                break;
            case 'endDateName':
                this.getEndDateBox().option('name', value);
                break;
            case 'multiView':
                this.getStartDateBox().option('calendarOptions.viewsCount', value ? 2 : 1);
                break;
            case 'tabIndex':
            case 'focusStateEnabled':
                super._optionChanged(args);

                this.getStartDateBox().option(name, value);
                this.getEndDateBox().option(name, value);
                break;
            case 'onValueChanged':
                this._createValueChangeAction();
                break;
            case 'onOpened':
                this._createOpenAction();
                break;
            case 'onClosed':
                this._createCloseAction();
                break;
            case 'onKeyDown':
            case 'onKeyUp':
            case 'onChange':
            case 'onInput':
            case 'onCut':
            case 'onCopy':
            case 'onPaste':
            case 'onEnterKey':
                this._createEventAction(name.replace('on', ''));
                break;
            case 'readOnly':
                this._updateButtons();

                super._optionChanged(args);

                this.getStartDateBox().option(name, value);
                this.getEndDateBox().option(name, value);
                break;
            case 'disabled':
                this._updateButtons();

                super._optionChanged(args);

                this.getStartDateBox().option(name, value);
                this.getEndDateBox().option(name, value);
                break;
            case 'selectionBehavior':
                break;
            case 'startDate':
                this.updateValue([value, this.option('value')[1]]);
                break;
            case 'stylingMode':
                this._renderStylingMode();
                break;
            case 'startDateText':
            case 'endDateText':
            case 'useHiddenSubmitElement':
                break;
            case 'invalidStartDateMessage':
                this.getStartDateBox().option('invalidDateMessage', value);
                break;
            case 'invalidEndDateMessage':
                this.getEndDateBox().option('invalidDateMessage', value);
                break;
            case 'startDateOutOfRangeMessage':
                this.getStartDateBox().option('dateOutOfRangeMessage', value);
                break;
            case 'endDateOutOfRangeMessage':
                this.getEndDateBox().option('dateOutOfRangeMessage', value);
                break;
            case 'validationMessagePosition':
                this.getStartDateBox().option(name, value);
                super._optionChanged(args);
                break;
            case '_internalValidationErrors': {
                this._syncValidationErrors('validationErrors', value, previousValue);

                const validationErrors = this.option('validationErrors');
                this.option('isValid', !validationErrors?.length);
                break;
            }
            case 'isValid': {
                this.getEndDateBox().option(name, value);

                const isValid = value && !this.option('_internalValidationErrors').length;

                if(this._shouldSkipIsValidChange || isValid === value) {
                    super._optionChanged(args);
                    return;
                }

                this._shouldSkipIsValidChange = true;
                this.option('isValid', isValid);
                this._shouldSkipIsValidChange = false;
                break;
            }
            case 'validationErrors': {
                const internalValidationErrors = this.option('_internalValidationErrors') || [];
                const allErrors = value || [];
                const externalErrors = this._getRestErrors(allErrors, internalValidationErrors);
                const errors = [...externalErrors, ...internalValidationErrors];
                const newValue = errors.length ? errors : null;
                this._options.silent('validationErrors', newValue);
                super._optionChanged({ ...args, value: newValue });
                break;
            }
            case 'value': {
                const newValue = sortDatesArray(value);
                if(!isSameDateArrays(newValue, previousValue)) {
                    this._setOptionWithoutOptionChange('value', newValue);
                    this._setOptionWithoutOptionChange('startDate', newValue[0]);
                    this._setOptionWithoutOptionChange('endDate', newValue[1]);

                    this._applyCustomValidation(newValue);

                    this._updateDateBoxesValue(newValue);

                    this._raiseValueChangeAction(newValue, previousValue);
                    this._saveValueChangeEvent(undefined);
                }

                break;
            }
            case '_currentSelection':
                // TODO: change calendar option here?
                break;
            default:
                super._optionChanged(args);
        }
    }

    getStartDateBox() {
        return this._startDateBox;
    }

    getEndDateBox() {
        return this._endDateBox;
    }

    getButton(name) {
        return this._buttonCollection.getButton(name);
    }

    open() {
        this.option('opened', true);
    }

    close() {
        this.option('opened', false);
    }

    content() {
        return this.getStartDateBox().content();
    }

    field() {
        return [this.startDateField(), this.endDateField()];
    }

    startDateField() {
        return this.getStartDateBox().field();
    }

    endDateField() {
        return this.getEndDateBox().field();
    }

    focus() {
        this.getStartDateBox().focus();
    }

    reset() {
        // this.getEndDateBox().reset();
        // this.getStartDateBox().reset();

        super.reset();
    }
}

registerComponent('dxDateRangeBox', DateRangeBox);

export default DateRangeBox;
