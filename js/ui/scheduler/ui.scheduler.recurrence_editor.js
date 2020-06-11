import registerComponent from '../../core/component_registrator';
import Guid from '../../core/guid';
import $ from '../../core/renderer';
import dateUtils from '../../core/utils/date';
import { extend } from '../../core/utils/extend';
import { isDefined } from '../../core/utils/type';
import { triggerShownEvent } from '../../events/visibility_change';
import dateLocalization from '../../localization/date';
import messageLocalization from '../../localization/message';
import Form from '../form';
import ButtonGroup from '../button_group';
import DateBox from '../date_box';
import Editor from '../editor/editor';
import NumberBox from '../number_box';
import RadioGroup from '../radio_group';
import publisherMixin from './ui.scheduler.publisher_mixin';
import { getRecurrenceProcessor } from './recurrence';

const RECURRENCE_EDITOR = 'dx-recurrence-editor';
const LABEL_POSTFIX = '-label';
const WRAPPER_POSTFIX = '-wrapper';
const RECURRENCE_EDITOR_CONTAINER = 'dx-recurrence-editor-container';
const REPEAT_END_EDITOR = 'dx-recurrence-repeat-end';
const REPEAT_END_TYPE_EDITOR = 'dx-recurrence-radiogroup-repeat-type';
const REPEAT_COUNT_EDITOR = 'dx-recurrence-numberbox-repeat-count';
const REPEAT_UNTIL_DATE_EDITOR = 'dx-recurrence-datebox-until-date';

const FIELD_VALUE_CLASS = 'dx-field-value';
const RECURRENCE_BUTTON_GROUP = 'dx-recurrence-button-group';

const FREQUENCY_EDITOR = 'dx-recurrence-selectbox-freq';
const INTERVAL_EDITOR = 'dx-recurrence-numberbox-interval';
const REPEAT_ON_EDITOR = 'dx-recurrence-repeat-on';
const DAY_OF_MONTH = 'dx-recurrence-numberbox-day-of-month';
const MONTH_OF_YEAR = 'dx-recurrence-selectbox-month-of-year';

const recurrentEditorNumberBoxWidth = 70;
const defaultRecurrenceTypeIndex = 1; // TODO default daily recurrence

const frequenciesMessages = [
    /* {
        // functionality is not removed, but hide the ability to set minute recurrence in the editor.
        // in the future, if we publish the dxRecurrenceEditor, then we publish the minute recurrence
        recurrence: 'dxScheduler-recurrenceMinutely',
        value: 'minutely'
    }*/
    {
        recurrence: 'dxScheduler-recurrenceHourly',
        value: 'hourly'
    }, {
        recurrence: 'dxScheduler-recurrenceDaily',
        value: 'daily'
    }, {
        recurrence: 'dxScheduler-recurrenceWeekly',
        value: 'weekly'
    }, {
        recurrence: 'dxScheduler-recurrenceMonthly',
        value: 'monthly'
    }, {
        recurrence: 'dxScheduler-recurrenceYearly',
        value: 'yearly'
    }
];

const frequencies = frequenciesMessages.map((item) => {
    return { text() { return messageLocalization.format(item.recurrence); }, value: item.value };
});

const repeatEndTypes = [
    { type: 'never' },
    { type: 'until' },
    { type: 'count' }
];


const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

class RecurrenceRule {

    constructor(rule) {
        this._recurrenceProcessor = getRecurrenceProcessor();
        this._recurrenceRule = this._recurrenceProcessor.evalRecurrenceRule(rule).rule;
    }

    makeRules(string) {
        this._recurrenceRule = this._recurrenceProcessor.evalRecurrenceRule(string).rule;
    }

    makeRule(field, value) {
        if(!value) {
            delete this._recurrenceRule[field];
            return;
        }

        if(isDefined(field)) {
            if(field === 'until') {
                delete this._recurrenceRule.count;
            }

            if(field === 'count') {
                delete this._recurrenceRule.until;
            }

            this._recurrenceRule[field] = value;
        }
    }

    getRepeatEndRule() {
        const rules = this._recurrenceRule;

        if('count' in rules) {
            return 'count';
        }

        if('until' in rules) {
            return 'until';
        }

        return 'never';
    }

    recurrenceString() {
        return this._recurrenceProcessor.getRecurrenceString(this._recurrenceRule);
    }

    rules() {
        return this._recurrenceRule;
    }

    daysFromByDayRule() {
        return this._recurrenceProcessor.daysFromByDayRule(this._recurrenceRule);
    }
}

const RecurrenceEditor = Editor.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            value: null,

            /**
            * @name dxRecurrenceEditorOptions.startDate
            * @type Date
            * @default undefined
            * @hidden
            */
            startDate: undefined,

            /**
            * @name dxRecurrenceEditorOptions.firstDayOfWeek
            * @type Enums.FirstDayOfWeek
            * @default undefined
            * @hidden
            */
            firstDayOfWeek: undefined
        });
    },

    _getFirstDayOfWeek() {
        const firstDayOfWeek = this.option('firstDayOfWeek');
        return isDefined(firstDayOfWeek) ? firstDayOfWeek : dateLocalization.firstDayOfWeekIndex();
    },

    _createComponent(element, name, config = {}) {
        this._extendConfig(config, {
            readOnly: this.option('readOnly')
        });
        return this.callBase(element, name, config);
    },

    _init() {
        this.callBase();
        this._recurrenceRule = new RecurrenceRule(this.option('value'));
    },

    _render() {
        this.callBase();

        this.$element().addClass(RECURRENCE_EDITOR);

        this._$container = $('<div>')
            .addClass(RECURRENCE_EDITOR_CONTAINER)
            .appendTo(this.$element());

        this._prepareEditors();
        this._renderEditors(this._$container, this._recurrenceRule.rules());

        this._renderContainerVisibility(this.option('value'));
    },

    _renderContainerVisibility(value) {
        if(value) {
            this._$container.show();
            triggerShownEvent(this._$container);
        } else {
            this._$container.hide();
        }
    },

    _prepareEditors: function(dataExprs, schedulerInst, triggerResize, changeSize, appointmentData, allowTimeZoneEditing, readOnly) {
        const freq = (this._recurrenceRule.rules().freq || frequenciesMessages[defaultRecurrenceTypeIndex].value).toLowerCase();
        const interval = this._recurrenceRule.rules().interval || 1;
        const months = [];
        const monthsNames = dateLocalization.getMonthNames('wide');

        for(let i = 0; i < 12; i++) {
            months[i] = { value: String(i + 1), text: monthsNames[i] };
        }

        this._editors = [
            {
                dataField: 'freq',
                name: 'FREQ',
                editorType: 'dxSelectBox',
                cssClass: FREQUENCY_EDITOR,
                editorOptions: {
                    items: frequencies,
                    value: freq,
                    field: 'freq',
                    valueExpr: 'value',
                    displayExpr: 'text',
                    layout: 'horizontal',
                    elementAttr: {
                        class: FREQUENCY_EDITOR
                    },
                    onValueChanged: (args) => this._valueChangedHandler(args)
                },
                label: {
                    text: messageLocalization.format('dxScheduler-editorLabelRecurrence')
                }
            },
            {
                itemType: 'group',
                colCount: 2,
                cssClass: `${INTERVAL_EDITOR}${WRAPPER_POSTFIX}`,
                colCountByScreen: { xs: 2 },
                items: [
                    {
                        dataField: 'interval',
                        editorType: 'dxNumberBox',
                        editorOptions: {
                            width: recurrentEditorNumberBoxWidth,
                            min: 1,
                            field: 'interval',
                            value: interval,
                            showSpinButtons: true,
                            useLargeSpinButtons: false,
                            elementAttr: {
                                class: INTERVAL_EDITOR
                            },
                            onValueChanged: (args) => this._valueChangedHandler(args)
                        },
                        label: {
                            text: messageLocalization.format('dxScheduler-recurrenceRepeatEvery')
                        }
                    },
                    {
                        name: 'intervalLabel',
                        cssClass: `${INTERVAL_EDITOR}${LABEL_POSTFIX}`,
                        template: () => messageLocalization.format(`dxScheduler-recurrenceRepeat${freq.charAt(0).toUpperCase()}${freq.substr(1).toLowerCase()}`)
                    }
                ]
            },
            {
                itemType: 'group',
                items: [
                    {
                        name: 'repeatOnLabel',
                        colSpan: 2,
                        template: () => messageLocalization.format('dxScheduler-recurrenceRepeatOn'),
                        visible: freq && freq !== 'daily' && freq !== 'hourly',
                    }
                ]
            },
            {
                itemType: 'group',
                cssClass: REPEAT_ON_EDITOR,
                colCount: 2,
                colCountByScreen: { xs: 2 },
                items: this._getRepeatOnItems(freq)
            },
            {
                itemType: 'group',
                items: this._getRepeatEndItems()
            }
        ];

        return this._editors;
    },

    _getRepeatOnItems: function(freq) {
        const monthsNames = dateLocalization.getMonthNames('wide');
        const months = [];

        for(let i = 0; i < 12; i++) {
            months[i] = { value: String(i + 1), text: monthsNames[i] };
        }

        return [
            {
                dataField: 'byday',
                template: (data, itemElement) =>{
                    const firstDayOfWeek = this._getFirstDayOfWeek();
                    const byDay = this._recurrenceRule.rules()['byday'] ?
                        this._recurrenceRule.rules()['byday'].split(',') : days[firstDayOfWeek];

                    const localDaysNames = dateLocalization.getDayNames('abbreviated');
                    const dayNames = days.slice(firstDayOfWeek).concat(days.slice(0, firstDayOfWeek));

                    const itemsButtonGroup = localDaysNames.slice(firstDayOfWeek).concat(localDaysNames.slice(0, firstDayOfWeek)).map((item, index) => { return { text: item, key: dayNames[index] }; });

                    this._$repeatOnWeek = $('<div>').addClass(RECURRENCE_BUTTON_GROUP).appendTo(itemElement);

                    this._weekEditor = this._createComponent(this._$repeatOnWeek, ButtonGroup, {
                        items: itemsButtonGroup,
                        field: 'byday',
                        selectionMode: 'multiple',
                        selectedItemKeys: byDay,
                        keyExpr: 'key',
                        onSelectionChanged: (e) => {
                            const selectedKeys = e.component.option('selectedItemKeys');
                            this._recurrenceRule.makeRule('byday', selectedKeys);
                            this._changeEditorValue();
                        }
                    });
                },
                visible: freq === 'weekly',
                label: {
                    visible: false
                }
            },
            {
                dataField: 'bymonthday',
                editorType: 'dxNumberBox',
                cssClass: DAY_OF_MONTH,
                editorOptions: {
                    min: 1,
                    max: 31,
                    width: recurrentEditorNumberBoxWidth,
                    field: 'bymonthday',
                    showSpinButtons: true,
                    useLargeSpinButtons: false,
                    value: this._dayOfMonthByRules(),
                    onValueChanged: (args) => this._valueChangedHandler(args)
                },
                visible: freq === 'monthly' || freq === 'yearly',
                label: {
                    visible: false
                }
            },
            {
                dataField: 'bymonth',
                editorType: 'dxSelectBox',
                cssClass: MONTH_OF_YEAR,
                editorOptions: {
                    field: 'bymonth',
                    items: months,
                    value: this._monthOfYearByRules(),
                    displayExpr: 'text',
                    valueExpr: 'value',
                    onValueChanged: (args) => this._valueChangedHandler(args)
                },
                visible: freq === 'yearly',
                label: {
                    visible: false
                }
            },
        ];
    },

    _getRepeatEndItems: function() {
        const repeatType = this._recurrenceRule.getRepeatEndRule();

        return [
            {
                template: (data, itemElement) =>{
                    this._$repeatEndEditor = $('<div>')
                        .addClass(REPEAT_END_TYPE_EDITOR)
                        .addClass(FIELD_VALUE_CLASS)
                        .appendTo(itemElement);

                    this._repeatEndEditor = this._createComponent(this._$repeatEndEditor, RadioGroup, {
                        items: repeatEndTypes,
                        value: repeatType,
                        valueExpr: 'type',
                        itemTemplate: (itemData) => {
                            if(itemData.type === 'count') {
                                return this._renderRepeatCountEditor();
                            }
                            if(itemData.type === 'until') {
                                return this._renderRepeatUntilEditor();
                            }

                            return this._renderDefaultRepeatEnd();

                        },
                        layout: 'vertical',
                        onValueChanged: (args) => this._repeatEndValueChangedHandler(args)
                    });

                    this._disableRepeatEndParts(repeatType);
                },
                label: {
                    text: messageLocalization.format('dxScheduler-recurrenceEnd')
                }
            }
        ];
    },

    _renderEditors: function($container, formData) {
        this._recurrenceForm = this._createComponent($container, Form, {
            items: this._editors,
            showValidationSummary: true,
            scrollingEnabled: true,
            showColonAfterLabel: false,
            labelLocation: 'top',
        });

        this._disableRepeatEndParts();
    },

    _setAriaDescribedBy(editor, $label) {
        const labelId = `label-${new Guid()}`;

        editor.setAria('describedby', labelId);
        editor.setAria('id', labelId, $label);
    },

    getRecurrenceForm: function() {
        return this._recurrenceForm;
    },

    _changeValueByVisibility(value) {
        this._renderContainerVisibility(value);

        if(value) {
            if(!this.option('value')) {
                this._handleDefaults();
            }
        } else {
            this._recurrenceRule.makeRules('');
            this.option('value', '');
        }
    },

    _handleDefaults() {
        this._recurrenceRule.makeRule('freq', frequenciesMessages[defaultRecurrenceTypeIndex].value);
        this._changeEditorValue();
    },

    _changeEditorValue() {
        this.option('value', this._recurrenceRule.recurrenceString() || '');
    },

    _daysOfWeekByRules() {
        let daysByRule = this._recurrenceRule.daysFromByDayRule();
        if(!daysByRule.length && this.option('startDate')) {
            daysByRule = [days[this.option('startDate').getDay()]];
        }

        return daysByRule;
    },

    _dayOfMonthByRules() {
        let dayByRule = this._recurrenceRule.rules()['bymonthday'];

        if(!dayByRule && this.option('startDate')) {
            dayByRule = this.option('startDate').getDate();
        }

        return dayByRule;
    },

    _monthOfYearByRules() {
        let monthByRule = this._recurrenceRule.rules()['bymonth'];

        if(!monthByRule && this.option('startDate')) {
            monthByRule = this.option('startDate').getMonth() + 1;
        }

        return monthByRule;
    },


    _handleRepeatEndDefaults() {
        this._recurrenceRule.makeRule('count', 1);

        this._changeEditorValue();
    },

    _renderDefaultRepeatEnd() {
        const $editorTemplate = $('<div>').addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);

        $('<div>')
            .text(messageLocalization.format('dxScheduler-recurrenceNever'))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        return $editorTemplate;
    },

    _repeatEndValueChangedHandler(args) {
        const value = args.value;

        this._disableRepeatEndParts(value);

        if(value === 'until') {
            this._recurrenceRule.makeRule(value, this._getUntilValue());
        }
        if(value === 'count') {
            this._recurrenceRule.makeRule(value, this._repeatCountEditor.option('value'));
        }
        if(value === 'never') {
            this._recurrenceRule.makeRule('count', '');
            this._recurrenceRule.makeRule('until', '');
        }

        this._changeEditorValue();
    },

    _disableRepeatEndParts(value = this._recurrenceRule.getRepeatEndRule()) {
        if(!this._repeatCountEditor && !this._repeatUntilDate) {
            return;
        }

        if(value === 'until') {
            this._repeatCountEditor.option('disabled', true);
            this._repeatUntilDate.option('disabled', false);
        }
        if(value === 'count') {
            this._repeatCountEditor.option('disabled', false);
            this._repeatUntilDate.option('disabled', true);
        }
        if(value === 'never') {
            this._repeatCountEditor.option('disabled', true);
            this._repeatUntilDate.option('disabled', true);
        }
    },

    _renderRepeatCountEditor() {
        const repeatCount = this._recurrenceRule.rules().count || 1;
        const $editorTemplate = $('<div>').addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);

        $('<div>')
            .text(messageLocalization.format('dxScheduler-recurrenceAfter'))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        this._$repeatCountEditor = $('<div>')
            .addClass(REPEAT_COUNT_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo($editorTemplate);

        $('<div>')
            .text(messageLocalization.format('dxScheduler-recurrenceRepeatCount'))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        this._repeatCountEditor = this._createComponent(this._$repeatCountEditor, NumberBox, {
            field: 'count',
            width: recurrentEditorNumberBoxWidth,
            min: 1,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            value: repeatCount,
            onValueChanged: this._repeatCountValueChangeHandler.bind(this)
        });

        return $editorTemplate;
    },

    _repeatCountValueChangeHandler(args) {
        if(this._recurrenceRule.getRepeatEndRule() !== 'count') {
            return;
        }

        const value = args.value;
        this._recurrenceRule.makeRule('count', value);
        this._changeEditorValue();
    },

    _formatUntilDate(date) {
        if(this._recurrenceRule.rules().until && dateUtils.sameDate(this._recurrenceRule.rules().until, date)) {
            return date;
        }

        return dateUtils.setToDayEnd(date);
    },

    _renderRepeatUntilEditor() {
        const repeatUntil = this._recurrenceRule.rules().until || this._formatUntilDate(new Date());
        const $editorTemplate = $('<div>').addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);

        $('<div>')
            .text(messageLocalization.format('dxScheduler-recurrenceOn'))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        this._$repeatDateEditor = $('<div>')
            .addClass(REPEAT_UNTIL_DATE_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo($editorTemplate);

        this._repeatUntilDate = this._createComponent(this._$repeatDateEditor, DateBox, {
            field: 'until',
            value: repeatUntil,
            type: 'date',
            onValueChanged: this._repeatUntilValueChangeHandler.bind(this),
            calendarOptions: {
                firstDayOfWeek: this._getFirstDayOfWeek()
            }
        });

        return $editorTemplate;
    },

    _repeatUntilValueChangeHandler(args) {
        if(this._recurrenceRule.getRepeatEndRule() !== 'until') {
            return;
        }

        const untilDate = this._formatUntilDate(new Date(args.value));

        this._repeatUntilDate.option('value', untilDate);

        this._recurrenceRule.makeRule('until', untilDate);
        this._changeEditorValue();
    },

    _valueChangedHandler(args) {
        const value = args.component.option('value');
        const field = args.component.option('field');

        if(!this.option('visible')) {
            this.option('value', '');
        } else {
            this._recurrenceRule.makeRule(field, value);
            this._makeRepeatOnRule(field, value);
            this._changeEditorValue();
        }
    },

    _makeRepeatOnRule(field, value) {
        if(field !== 'freq') {
            return;
        }

        if(value === 'daily') {
            this._recurrenceRule.makeRule('byday', '');
            this._recurrenceRule.makeRule('bymonth', '');
            this._recurrenceRule.makeRule('bymonthday', '');
        }
        if(value === 'weekly') {
            this._recurrenceRule.makeRule('byday', this._daysOfWeekByRules());
            this._recurrenceRule.makeRule('bymonth', '');
            this._recurrenceRule.makeRule('bymonthday', '');
        }

        if(value === 'monthly') {
            this._recurrenceRule.makeRule('bymonthday', this._dayOfMonthByRules());
            this._recurrenceRule.makeRule('bymonth', '');
            this._recurrenceRule.makeRule('byday', '');
        }

        if(value === 'yearly') {
            this._recurrenceRule.makeRule('bymonthday', this._dayOfMonthByRules());
            this._recurrenceRule.makeRule('bymonth', this._monthOfYearByRules());
            this._recurrenceRule.makeRule('byday', '');
        }
    },

    _optionChanged(args) {
        switch(args.name) {
            case 'value':
                this._recurrenceRule.makeRules(args.value);
                this._changeRepeatOnVisibility();
                this._changeRepeatIntervalLabel();
                this._disableRepeatEndParts();
                this._changeEditorsValues(this._recurrenceRule.rules());

                this.callBase(args);
                break;
            case 'startDate':
                this._makeRepeatOnRule('freq', this._recurrenceRule.rules().freq);

                if(isDefined(this._recurrenceRule.recurrenceString())) {
                    this._changeEditorValue();
                }

                break;
            case 'firstDayOfWeek':
                if(this._weekEditor) {
                    const localDaysNames = dateLocalization.getDayNames('abbreviated');
                    const dayNames = days.slice(args.value).concat(days.slice(0, args.value));

                    const itemsButtonGroup = localDaysNames.slice(args.value).concat(localDaysNames.slice(0, args.value)).map((item, index) => { return { text: item, key: dayNames[index] }; });

                    this._weekEditor.option('items', itemsButtonGroup);
                }
                if(this._$repeatDateEditor) {
                    this._repeatUntilDate.option('calendarOptions.firstDayOfWeek', this._getFirstDayOfWeek());
                }
                break;
            case 'visible':
                this._changeValueByVisibility(args.value);
                this.callBase(args);
                break;
            default:
                this.callBase(args);
        }
    },

    _changeRepeatOnVisibility() {

        const freq = this._recurrenceRule.rules().freq;

        this._recurrenceForm.itemOption('byday', 'visible', false);
        this._recurrenceForm.itemOption('bymonthday', 'visible', false);
        this._recurrenceForm.itemOption('bymonth', 'visible', false);

        this._recurrenceForm.itemOption('repeatOnLabel', 'visible', freq && freq !== 'DAILY' && freq !== 'HOURLY');

        if(freq === 'WEEKLY') {
            this._recurrenceForm.itemOption('byday', 'visible', true);
        }
        if(freq === 'MONTHLY') {
            this._recurrenceForm.itemOption('bymonthday', 'visible', true);
        }
        if(freq === 'YEARLY') {
            this._recurrenceForm.itemOption('bymonthday', 'visible', true);
            this._recurrenceForm.itemOption('bymonth', 'visible', true);
        }
    },

    _changeRepeatIntervalLabel() {
        const freq = this._recurrenceRule.rules().freq;

        freq && this._recurrenceForm.itemOption('intervalLabel', 'template', messageLocalization.format(`dxScheduler-recurrenceRepeat${freq.charAt(0).toUpperCase()}${freq.substr(1).toLowerCase()}`));
    },

    _changeEditorsValues(rules) {
        this._recurrenceForm.getEditor('freq').option('value', (rules.freq || frequenciesMessages[defaultRecurrenceTypeIndex].value).toLowerCase());
        this._changeDayOfMonthValue();

        this._changeIntervalValue(rules.interval);
        this._changeRepeatCountValue();
        this._changeRepeatEndValue();
        this._changeRepeatUntilValue();
        this._changeMonthOfYearValue();
    },

    _changeIntervalValue(value) {
        this._recurrenceForm.getEditor('interval').option('value', value || 1);
    },

    _changeRepeatEndValue() {
        const repeatType = this._recurrenceRule.getRepeatEndRule();

        this._repeatEndEditor.option('value', repeatType);
    },

    _changeDayOfMonthValue() {
        const isVisible = this._recurrenceForm.itemOption('bymonthday').visible;
        if(!isVisible) {
            return;
        }

        const day = this._dayOfMonthByRules() || 1;
        this._recurrenceForm.getEditor('bymonthday').option('value', day);
    },

    _changeRepeatCountValue() {
        if(!this._$repeatCountEditor) {
            return;
        }

        const count = this._recurrenceRule.rules().count || 1;
        this._repeatCountEditor.option('value', count);
    },

    _changeRepeatUntilValue() {
        if(!this._$repeatDateEditor) {
            return;
        }

        this._repeatUntilDate.option('value', this._getUntilValue());
    },

    _getUntilValue() {
        return this._recurrenceRule.rules().until || this._formatUntilDate(new Date());
    },

    _changeMonthOfYearValue() {
        const isEditorVisible = this._recurrenceForm.itemOption('bymonth').visible;

        if(!isEditorVisible) {
            return;
        }

        const month = this._monthOfYearByRules() || 1;
        this._recurrenceForm.getEditor('bymonth').option('value', month);
    },

    toggle() {
        this._freqEditor.focus();
    },

    setAria(...args) {
        if(this._switchEditor) {
            this._switchEditor.setAria(args[0], args[1]);
        }
    }
}).include(publisherMixin);

registerComponent('dxRecurrenceEditor', RecurrenceEditor);

module.exports = RecurrenceEditor;
