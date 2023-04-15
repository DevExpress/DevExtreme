/* eslint-disable no-this-before-super */
import $ from '../../core/renderer';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import { getImageContainer } from '../../core/utils/icon';
import config from '../../core/config';
import messageLocalization from '../../localization/message';
import { current, isMaterial } from '../themes';
import Widget from '../widget/ui.widget';
import DateBox from '../date_box';
import TextEditorButtonCollection from '../text_box/texteditor_button_collection/index';
import DropDownButton from '../drop_down_editor/ui.drop_down_button';
import { FunctionTemplate } from '../../core/templates/function_template';

const DATERANGEBOX_CLASS = 'dx-daterangebox';
const START_DATEBOX_CLASS = 'dx-start-datebox';
const END_DATEBOX_CLASS = 'dx-end-datebox';
const DATERANGEBOX_SEPARATOR_CLASS = 'dx-daterangebox-separator';
const DROP_DOWN_EDITOR_BUTTON_ICON = 'dx-dropdowneditor-icon';

// STYLE dateRangeBox

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

            dropDownButtonTemplate: 'dropDownButton',

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
        return [{ name: 'dropDown', Ctor: DropDownButton }];
    }

    _initMarkup() {
        super._initMarkup();
        this.$element()
            .addClass(DATERANGEBOX_CLASS)
            // TODO: remove next classes after adding styles
            .addClass('dx-texteditor')
            .addClass('dx-editor-outlined')
            .addClass('dx-datebox-date')
            .addClass('dx-dropdowneditor');

        this._renderStartDateBox();
        this._renderSeparator();
        this._renderEndDateBox();

        this._renderButtonsContainer();
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
        this.getStartDateBox().open();
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
            value: this.option('value')[0],
            label: '',
        };
    }

    _getEndDateBoxConfig() {
        const options = this.option();

        return {
            ...this._getDateBoxConfig(),
            showClearButton: options.showClearButton,
            showDropDownButton: false,
            value: this.option('value')[1],
            label: '',
        };
    }

    getStartDateBox() {
        return this._startDateBox;
    }

    getEndDateBox() {
        return this._endDateBox;
    }

    _cleanButtonContainers() {
        this._$beforeButtonsContainer?.remove();
        this._$afterButtonsContainer?.remove();
        this._buttonCollection.clean();
        this._$beforeButtonsContainer = null;
        this._$afterButtonsContainer = null;
    }

    _clean() {
        this._cleanButtonContainers();

        this._$startDateBox?.remove();
        this._$endDateBox?.remove();
        this._$separator?.remove();

        super._clean();
    }

    _optionChanged(args) {
        const { name } = args;

        switch(name) {
            case 'acceptCustomValue':
            case 'applyButtonText':
            case 'applyValueMode':
                break;
            case 'buttons':
                this._cleanButtonContainers();
                this._renderButtonContainers();
                break;
            case 'calendarOptions':
            case 'cancelButtonText':
            case 'dateOutOfRangeMessage':
            case 'disabledDates':
            case 'displayFormat':
            case 'dropDownOptions':
                break;
            case 'dropDownButtonTemplate':
            case 'showDropDownButton':
                this._updateButtons(['dropDown']);
                break;
            case 'endDate':
            case 'invalidDateMessage':
            case 'isValid':
            case 'label':
            case 'labelMode':
            case 'maxLength':
            case 'opened':
            case 'openOnFieldClick':
            case 'placeholder':
            case 'readOnly':
            case 'showClearButton':
            case 'spellcheck':
            case 'startDate':
            case 'stylingMode':
            case 'text':
            case 'todayButtonText':
            case 'useHiddenSubmitElement':
            case 'useMaskBehavior':
            case 'validationError':
            case 'validationErrors':
            case 'validationMessageMode':
            case 'validationMessagePosition':
            case 'validationStatus':
            case 'value':
            case 'valueChangeEvent':
                break;
            default:
                super._optionChanged(args);
        }
    }

    getButton(name) {
        return this._buttonCollection.getButton(name);
    }
}

registerComponent('dxDateRangeBox', DateRangeBox);

export default DateRangeBox;
