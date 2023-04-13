import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import { getImageContainer } from '../../core/utils/icon';
import config from '../../core/config';
import messageLocalization from '../../localization/message';
import { current, isMaterial } from '../themes';
import Widget from '../widget/ui.widget';
import DateBox from '../date_box';


const DATERANGEBOX_CLASS = 'dx-daterangebox';
const START_DATEBOX_CLASS = 'dx-start-datebox';
const END_DATEBOX_CLASS = 'dx-end-datebox';
const DATERANGEBOX_SEPARATOR_CLASS = 'dx-daterangebox-separator';

class DateRangeBox extends Widget {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            acceptCustomValue: true,

            activeStateEnabled: true,

            applyButtonText: messageLocalization.format('OK'),

            applyValueMode: 'useButtons',

            buttons: undefined,

            calendarOptions: {},

            cancelButtonText: messageLocalization.format('Cancel'),

            dateOutOfRangeMessage: messageLocalization.format('validation-range'),

            dateSerializationFormat: undefined,

            disabledDates: null,

            displayFormat: null,

            dropDownOptions: {},

            endDate: null,

            focusStateEnabled: true,

            hoverStateEnabled: true,

            invalidDateMessage: messageLocalization.format('dxDateBox-validation-datetime'),

            isValid: true,

            label: '',

            labelMode: 'static',

            max: undefined,

            maxLength: null,

            min: undefined,

            opened: false,

            openOnFieldClick: false,

            placeholder: '',

            readOnly: false,

            showClearButton: false,

            showDropDownButton: true,

            spellcheck: false,

            startDate: null,

            stylingMode: config().editorStylingMode || 'outlined',

            text: '',

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
            }
        ]);
    }

    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DATERANGEBOX_CLASS);

        this._renderStartDateBox();
        this._renderSeparator();
        this._renderEndDateBox();
    }

    _renderStartDateBox() {
        this._$startDateBox = $('<div>')
            .addClass(START_DATEBOX_CLASS)
            .appendTo(this.$element());

        this._startDateBox = this._createComponent(this._$startDateBox, DateBox, this._getStartDateBoxConfig());
    }

    _renderEndDateBox() {
        this._$endDateBox = $('<div>')
            .addClass(END_DATEBOX_CLASS)
            .appendTo(this.$element());

        this._endDateBox = this._createComponent(this._$endDateBox, DateBox, this._getEndDateBoxConfig());
    }

    _renderSeparator() {
        const $icon = getImageContainer(this.option('rtlEnabled') ? 'arrowleft' : 'arrowright');
        this._$separator = $('<div>')
            .addClass(DATERANGEBOX_SEPARATOR_CLASS)
            .appendTo(this.$element());

        $icon.appendTo(this._$separator);
    }

    _getDateBoxConfig() {
        const options = this.option();

        return {
            acceptCustomValue: options.acceptCustomValue,
            activeStateEnabled: false,
            applyValueMode: options.applyValueMode,
            dateOutOfRangeMessage: options.dateOutOfRangeMessage,
            dateSerializationFormat: options.dateSerializationFormat,
            displayFormat: options.displayFormat,
            elementAttr: options.elementAttr,
            focusStateEnabled: options.focusStateEnabled,
            hoverStateEnabled: false,
            invalidDateMessage: options.invalidDateMessage,
            isValid: options.isValid,
            label: options.label,
            labelMode: options.labelMode,
            max: options.max,
            maxLength: options.maxLength,
            min: options.min,
            placeholder: options.placeholder,
            readOnly: options.readOnly,
            rtlEnabled: options.rtlEnabled,
            spellcheck: options.spellcheck,
            stylingMode: options.stylingMode,
            useMaskBehavior: options.useMaskBehavior,
            validationMessageMode: options.validationMessageMode,
            validationMessagePosition: options.validationMessagePosition,
            validationStatus: options.validationStatus,
            valueChangeEvent: options.valueChangeEvent
        };
    }

    _getStartDateBoxConfig() {
        // NOTE: delete part of options if we deside to use new Popup
        const options = this.option();
        return {
            ...this._getDateBoxConfig(),
            applyButtonText: options.applyButtonText,
            calendarOptions: options.calendarOptions,
            cancelButtonText: options.cancelButtonText,
            disabledDates: options.disabledDates,
            dropDownOptions: options.dropDownOptions,
            opened: options.opened,
            todayButtonText: options.todayButtonText,
            showClearButton: options.showClearButton,
            showDropDownButton: false,
            value: this.option('value')[0]
        };
    }

    _getEndDateBoxConfig() {
        return {
            ...this._getDateBoxConfig(),
            showClearButton: true,
            value: this.option('value')[1]
        };
    }

    getStartDateBox() {
        return this._startDateBox;
    }

    getEndDateBox() {
        return this._endDateBox;
    }

    _clean() {
        this._$startDateBox?.remove();
        this._$endDateBox?.remove();
        this._$separator?.remove();

        super._clean();
    }
}

registerComponent('dxDateRangeBox', DateRangeBox);

export default DateRangeBox;
