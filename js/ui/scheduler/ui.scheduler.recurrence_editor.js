import $ from '../../core/renderer';
import Guid from '../../core/guid';
import registerComponent from '../../core/component_registrator';
import recurrenceUtils from './utils.recurrence';
import domUtils from '../../core/utils/dom';
import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';
import { inArray } from '../../core/utils/array';
import { each } from '../../core/utils/iterator';
import Editor from '../editor/editor';
import CheckBox from '../check_box';
import RadioGroup from '../radio_group';
import NumberBox from '../number_box';
import SelectBox from '../select_box';
import DateBox from '../date_box';
import messageLocalization from '../../localization/message';
import dateLocalization from '../../localization/date';
import dateUtils from '../../core/utils/date';
import publisherMixin from './ui.scheduler.publisher_mixin';

const RECURRENCE_EDITOR = 'dx-recurrence-editor';
const LABEL_POSTFIX = '-label';
const WRAPPER_POSTFIX = '-wrapper';
const RECURRENCE_EDITOR_CONTAINER = 'dx-recurrence-editor-container';
const FREQUENCY_EDITOR = 'dx-recurrence-selectbox-freq';
const INTERVAL_EDITOR = 'dx-recurrence-numberbox-interval';
const INTERVAL_EDITOR_FIELD = 'dx-recurrence-interval-field';
const REPEAT_END_EDITOR = 'dx-recurrence-repeat-end';
const REPEAT_END_EDITOR_CONTAINER = 'dx-recurrence-repeat-end-container';
const REPEAT_TYPE_EDITOR = 'dx-recurrence-radiogroup-repeat-type';
const REPEAT_COUNT_EDITOR = 'dx-recurrence-numberbox-repeat-count';
const REPEAT_UNTIL_DATE_EDITOR = 'dx-recurrence-datebox-until-date';
const REPEAT_ON_EDITOR = 'dx-recurrence-repeat-on';
const REPEAT_ON_WEEK_EDITOR = 'dx-recurrence-repeat-on-week';
const DAY_OF_WEEK = 'dx-recurrence-checkbox-day-of-week';
const REPEAT_ON_MONTH_EDITOR = 'dx-recurrence-repeat-on-month';
const DAY_OF_MONTH = 'dx-recurrence-numberbox-day-of-month';
const REPEAT_ON_YEAR_EDITOR = 'dx-recurrence-repeat-on-year';
const MONTH_OF_YEAR = 'dx-recurrence-selectbox-month-of-year';
const FIELD_CLASS = 'dx-field';
const RECURRENCE_FREQ_FIELD = 'dx-recurrence-freq-field';
const FIELD_LABEL_CLASS = 'dx-field-label';
const FIELD_VALUE_CLASS = 'dx-field-value';

const frequencies = [
    { text() { return messageLocalization.format('dxScheduler-recurrenceNever'); }, value: 'never' },
    { text() { return messageLocalization.format('dxScheduler-recurrenceDaily'); }, value: 'daily' },
    { text() { return messageLocalization.format('dxScheduler-recurrenceWeekly'); }, value: 'weekly' },
    { text() { return messageLocalization.format('dxScheduler-recurrenceMonthly'); }, value: 'monthly' },
    { text() { return messageLocalization.format('dxScheduler-recurrenceYearly'); }, value: 'yearly' }
];

const repeatEndTypes = [
    { text() { return messageLocalization.format('dxScheduler-recurrenceNever'); }, value: 'never' },
    { text() { return messageLocalization.format('dxScheduler-recurrenceRepeatOnDate'); }, value: 'until' },
    { text() { return messageLocalization.format('dxScheduler-recurrenceRepeatCount'); }, value: 'count' }
];

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

class RecurrenceRule {

    constructor(recurrence) {
        this._recurrenceRule = recurrenceUtils.getRecurrenceRule(recurrence).rule;
    }

    makeRules(string) {
        this._recurrenceRule = recurrenceUtils.getRecurrenceRule(string).rule;
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

    repeatableRule() {
        const rules = this._recurrenceRule;

        if('count' in rules) {
            return 'count';
        }

        if('until' in rules) {
            return 'until';
        }

        return null;
    }

    recurrenceString() {
        return recurrenceUtils.getRecurrenceString(this._recurrenceRule);
    }

    rules() {
        return this._recurrenceRule;
    }

    daysFromByDayRule() {
        return recurrenceUtils.daysFromByDayRule(this._recurrenceRule);
    }
}

const RecurrenceEditor = Editor.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            value: null,

            /**
            * @name dxRecurrenceEditorOptions.startDate
            * @type Date
            * @default new Date()
            * @hidden
            */
            startDate: new Date(),

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
        return isDefined(this.option('firstDayOfWeek')) ? this.option('firstDayOfWeek') : dateLocalization.firstDayOfWeekIndex();
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

        this._renderEditors();

        this._renderContainerVisibility(this.option('value'));
    },

    _renderContainerVisibility(value) {
        if(value) {
            this._$container.show();
            domUtils.triggerShownEvent(this._$container);
        } else {
            this._$container.hide();
        }
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
        this._recurrenceRule.makeRule('freq', 'daily');
        this._changeEditorValue();
    },

    _changeEditorValue() {
        this.option('value', this._recurrenceRule.recurrenceString() || '');
    },

    _renderEditors() {
        this._renderFreqEditor();
        this._renderIntervalEditor();

        this._renderRepeatOnEditor();

        this._renderRepeatEndEditor();
    },

    _renderFreqEditor() {
        const freq = (this._recurrenceRule.rules().freq || 'never').toLowerCase();

        const $freqEditor = $('<div>')
            .addClass(FREQUENCY_EDITOR)
            .addClass(FIELD_VALUE_CLASS);

        this._freqEditor = this._createComponent($freqEditor, SelectBox, {
            field: 'freq',
            items: frequencies,
            value: freq,
            valueExpr: 'value',
            displayExpr: 'text',
            layout: 'horizontal',
            onValueChanged: (args)=> {
                this._valueChangedHandler(args);
                this.invoke('resizePopup');
            }
        });

        const $field = $('<div>')
            .addClass(FIELD_CLASS)
            .addClass(RECURRENCE_FREQ_FIELD)
            .append($freqEditor);

        this.$element().prepend($field);
    },

    _renderIntervalEditor() {
        const freq = this._recurrenceRule.rules().freq || 'daily';

        const $intervalEditor = $('<div>')
            .addClass(INTERVAL_EDITOR)
            .addClass(FIELD_VALUE_CLASS);

        const $intervalEditorLabel = $('<div>')
            .text(messageLocalization.format('dxScheduler-recurrenceRepeatEvery'))
            .addClass(INTERVAL_EDITOR + LABEL_POSTFIX)
            .addClass(FIELD_LABEL_CLASS);

        this._$intervalTypeLabel = $('<div>')
            .text(messageLocalization.format(`dxScheduler-recurrenceRepeat${freq.charAt(0).toUpperCase()}${freq.substr(1).toLowerCase()}`))
            .addClass(REPEAT_TYPE_EDITOR + LABEL_POSTFIX);

        const interval = this._recurrenceRule.rules().interval || 1;

        this._intervalEditor = this._createComponent($intervalEditor, NumberBox, {
            field: 'interval',
            min: 1,
            value: interval,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            onValueChanged: this._valueChangedHandler.bind(this)
        });

        const $field = $('<div>')
            .addClass(FIELD_CLASS)
            .addClass(INTERVAL_EDITOR_FIELD)
            .append($intervalEditorLabel, $intervalEditor, this._$intervalTypeLabel);

        this._$container.append($field);

        this._setAriaDescribedBy(this._intervalEditor, $intervalEditorLabel);
    },

    _renderRepeatOnEditor() {
        const freq = (this._recurrenceRule.rules().freq || '').toLowerCase();

        if(!isDefined(this._$repeatOnEditor)) {
            this._$repeatOnEditor = $('<div>')
                .addClass(REPEAT_ON_EDITOR)
                .addClass(FIELD_CLASS)
                .appendTo(this._$container);
        }

        if(!freq || freq === 'daily') {
            this._clearRepeatOnEditor();
            this._clearRepeatOnLabel();
            return;
        }

        if(!isDefined(this._$repeatOnLabel)) {
            this._renderRepeatOnLabel(this._$repeatOnEditor);
        }

        if(freq === 'weekly' && !this._$repeatOnWeek) {
            this._renderRepeatOnWeekEditor();
            return;
        }

        if(freq === 'monthly' && !this._$repeatOnMonth) {
            this._renderRepeatOnMonthEditor();
            return;
        }

        if(freq === 'yearly' && !this._$repeatOnYear) {
            this._renderRepeatOnYearEditor();
            return;
        }
    },

    _renderRepeatOnLabel($element) {
        this._$repeatOnLabel = $('<div>')
            .text(messageLocalization.format('dxScheduler-recurrenceRepeatOn'))
            .addClass(REPEAT_ON_EDITOR + LABEL_POSTFIX)
            .addClass(FIELD_LABEL_CLASS);

        $element.append(this._$repeatOnLabel);
    },

    _clearRepeatOnEditor() {
        if(isDefined(this._$repeatOnWeek)) {
            this._$repeatOnWeek.detach();
            this._$repeatOnWeek.remove();

            delete this._$repeatOnWeek;
        }

        if(isDefined(this._$repeatOnMonth)) {
            this._$repeatOnMonth.detach();
            this._$repeatOnMonth.remove();

            delete this._$repeatOnMonth;
        }

        if(isDefined(this._$repeatOnYear)) {
            this._$repeatOnYear.detach();
            this._$repeatOnYear.remove();

            delete this._$repeatOnYear;
        }
    },

    _clearRepeatOnLabel() {
        if(isDefined(this._$repeatOnLabel)) {
            this._$repeatOnLabel.detach();
            this._$repeatOnLabel.remove();

            delete this._$repeatOnLabel;
        }
    },

    _renderRepeatOnWeekEditor() {
        this._clearRepeatOnEditor();

        this._$repeatOnWeek = $('<div>')
            .addClass(REPEAT_ON_WEEK_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo(this._$repeatOnEditor);

        const localDaysNames = dateLocalization.getDayNames('short');
        const daysFromRules = this._daysOfWeekByRules();

        this._daysOfWeek = [];

        for(let i = 0; i < 7; i++) {
            const daysOffset = this._getFirstDayOfWeek() + i;
            const dayIndex = daysOffset % 7;
            const checkBoxText = localDaysNames[dayIndex].toUpperCase();
            const dayName = days[dayIndex];
            const $day = $('<div>').addClass(DAY_OF_WEEK);

            const day = this._createComponent($day, CheckBox, {
                text: checkBoxText,
                value: inArray(dayName, daysFromRules) > -1 ? true : false,
                onValueChanged: this._repeatByDayValueChangeHandler.bind(this)
            });

            this._daysOfWeek[dayIndex] = day;
            this._$repeatOnWeek.append($day);
        }
    },

    _daysOfWeekByRules() {
        let daysByRule = this._recurrenceRule.daysFromByDayRule();

        if(!daysByRule.length) {
            daysByRule = [days[this.option('startDate').getDay()]];
        }

        return daysByRule;
    },

    _repeatByDayValueChangeHandler() {
        let byDayRule = '';

        each(this._daysOfWeek, (index, day) => {
            if(day.option('value')) {
                const dayName = days[index];

                if(!byDayRule) {
                    byDayRule = dayName;
                } else {
                    byDayRule = `${byDayRule},${dayName}`;
                }
            }
        });

        this._recurrenceRule.makeRule('byday', byDayRule);
        this._changeEditorValue();
    },

    _renderRepeatOnMonthEditor() {
        this._clearRepeatOnEditor();

        this._$repeatOnMonth = $('<div>')
            .addClass(REPEAT_ON_MONTH_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo(this._$repeatOnEditor);

        this._renderDayOfMonthEditor(this._$repeatOnMonth);
    },

    _renderRepeatOnYearEditor() {
        this._clearRepeatOnEditor();

        this._$repeatOnYear = $('<div>')
            .addClass(REPEAT_ON_YEAR_EDITOR)
            .addClass(FIELD_VALUE_CLASS).appendTo(this._$repeatOnEditor);

        const months = [];
        const monthsNames = dateLocalization.getMonthNames('wide');

        for(let i = 0; i < 12; i++) {
            months[i] = { value: String(i + 1), text: monthsNames[i] };
        }

        const byMonth = this._monthOfYearByRules();

        const $monthOfYear = $('<div>')
            .addClass(MONTH_OF_YEAR)
            .appendTo(this._$repeatOnYear);

        const monthChanged = function(args) {
            this._valueChangedHandler.call(this, args);

            const monthValue = parseInt(args.component.option('value'));
            if(this._dayEditor && monthValue) {
                let maxAllowedDay = new Date(new Date().getFullYear(), parseInt(monthValue), 0).getDate();
                if(monthValue === 2) {
                    maxAllowedDay = 29;
                }
                this._dayEditor.option('max', maxAllowedDay);
            }
        };

        this._monthEditor = this._createComponent($monthOfYear, SelectBox, {
            field: 'bymonth',
            items: months,
            value: byMonth,
            displayExpr: 'text',
            valueExpr: 'value',
            onValueChanged: monthChanged.bind(this)
        });

        this._renderDayOfMonthEditor(this._$repeatOnYear);
    },

    _monthOfYearByRules() {
        let monthByRule = this._recurrenceRule.rules()['bymonth'];

        if(!monthByRule) {
            monthByRule = this.option('startDate').getMonth() + 1;
        }

        return monthByRule;
    },

    _renderDayOfMonthEditor($element) {
        const byMonthDay = this._dayOfMonthByRules();

        const $dayEditor = $('<div>').addClass(DAY_OF_MONTH);
        this._dayEditor = this._createComponent($dayEditor, NumberBox, {
            field: 'bymonthday',
            min: 1,
            max: 31,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            value: byMonthDay,
            onValueChanged: this._valueChangedHandler.bind(this)
        });

        $element.append($dayEditor);
    },

    _dayOfMonthByRules() {
        let dayByRule = this._recurrenceRule.rules()['bymonthday'];

        if(!dayByRule) {
            dayByRule = this.option('startDate').getDate();
        }

        return dayByRule;
    },

    _setAriaDescribedBy(editor, $label) {
        const labelId = `label-${new Guid()}`;

        editor.setAria('describedby', labelId);
        editor.setAria('id', labelId, $label);
    },

    _repeatEndSwitchValueChangeHandler(args) {
        const value = args.value;

        this._renderRepeatEndVisibility(value);

        if(!this._recurrenceRule.rules().count && !this._recurrenceRule.rules().until && value) {
            this._handleRepeatEndDefaults();
        } else if(!value) {
            this._recurrenceRule.makeRule('count', '');
            this._recurrenceRule.makeRule('until', '');
            this._changeEditorValue();
        }
    },

    _renderRepeatEndVisibility(value) {
        if(!value) {
            this._$repeatEndEditor.hide();
        } else {
            this._$repeatEndEditor.show();
        }
    },

    _handleRepeatEndDefaults() {
        this._recurrenceRule.makeRule('count', 1);

        this._changeEditorValue();
    },

    _renderRepeatEndEditor(rule) {
        rule = isDefined(rule) ? rule : this._recurrenceRule.repeatableRule();

        if(!rule) rule = 'count';

        if(!isDefined(this._$repeatEndEditor)) {
            $('<div>')
                .text(messageLocalization.format('dxScheduler-recurrenceEnd'))
                .addClass(REPEAT_END_EDITOR_CONTAINER + LABEL_POSTFIX)
                .addClass(FIELD_LABEL_CLASS)
                .appendTo(this._$container);

            this._$repeatEndEditor = $('<div>')
                .addClass(REPEAT_END_EDITOR_CONTAINER)
                .addClass(FIELD_CLASS)
                .appendTo(this._$container);

            this._renderRepeatEndTypeEditor();
        }
    },

    _renderRepeatEndTypeEditor() {
        const repeatType = this._recurrenceRule.repeatableRule() || 'never';

        this._$repeatTypeEditor = $('<div>')
            .addClass(REPEAT_TYPE_EDITOR)
            .addClass(FIELD_VALUE_CLASS)
            .appendTo(this._$repeatEndEditor);

        this._repeatTypeEditor = this._createComponent(this._$repeatTypeEditor, RadioGroup, {
            items: repeatEndTypes,
            value: repeatType,
            displayExpr: 'text',
            valueExpr: 'value',
            itemTemplate: (itemData) => {
                if(itemData.value === 'count') {
                    return this._renderRepeatCountEditor();
                }
                if(itemData.value === 'until') {
                    return this._renderRepeatUntilEditor();
                }

                return this._renderDefaultRepeatEnd();

            },
            layout: 'vertical',
            onValueChanged: this._repeatTypeValueChangedHandler.bind(this)
        });

        this._disableRepeatEndParts(repeatType);
    },

    _renderDefaultRepeatEnd() {
        const $editorTemplate = $('<div>').addClass(REPEAT_END_EDITOR + WRAPPER_POSTFIX);

        $('<div>')
            .text(messageLocalization.format('dxScheduler-recurrenceNever'))
            .addClass(REPEAT_END_EDITOR + LABEL_POSTFIX)
            .appendTo($editorTemplate);

        return $editorTemplate;
    },

    _repeatTypeValueChangedHandler(args) {
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

    _disableRepeatEndParts(value) {
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
            min: 1,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            value: repeatCount,
            onValueChanged: this._repeatCountValueChangeHandler.bind(this)
        });

        return $editorTemplate;
    },

    _repeatCountValueChangeHandler(args) {
        if(this._recurrenceRule.repeatableRule() !== 'count') {
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
        if(this._recurrenceRule.repeatableRule() !== 'until') {
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
        const freqEditorValue = this._freqEditor && this._freqEditor.option('value');
        let visible = true;

        if(field === 'freq' && value === 'never' || field !== 'freq' && freqEditorValue === 'never') {
            visible = false;
            this.option('value', '');
        } else {
            this._recurrenceRule.makeRule(field, value);

            this._makeRepeatOnRule(field, value);
            this._changeEditorValue();
        }

        this._renderContainerVisibility(visible);
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

                this._repeatTypeEditor.option('value', this._recurrenceRule.repeatableRule() || 'never');
                this._renderRepeatEndEditor();
                this._renderRepeatOnEditor();

                this._changeEditorsValues(this._recurrenceRule.rules());

                this.callBase(args);
                break;
            case 'startDate':
                this._clearRepeatOnEditor();
                this._renderRepeatOnEditor();
                this._makeRepeatOnRule('freq', this._recurrenceRule.rules().freq);

                if(isDefined(this._recurrenceRule.recurrenceString())) {
                    this._changeEditorValue();
                }

                break;
            case 'firstDayOfWeek':
                this._clearRepeatOnEditor();
                this._renderRepeatOnEditor();

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

    _changeEditorsValues(rules) {
        this._changeCheckBoxesValue(!!rules['byday']);

        this._freqEditor.option('value', (rules.freq || 'never').toLowerCase());
        this._changeRepeatTypeLabel();
        this._intervalEditor.option('value', rules.interval);

        this._changeRepeatCountValue();
        this._changeRepeatUntilValue();

        this._changeDayOfMonthValue();
        this._changeMonthOfYearValue();
    },

    _changeRepeatTypeLabel() {
        const $labels = this.$element().find(`.${REPEAT_TYPE_EDITOR}${LABEL_POSTFIX}`);

        if(!$labels.length) {
            return;
        }

        const freq = this._recurrenceRule.rules().freq || 'daily';

        each($labels, (_, $label) => {
            $($label).text(messageLocalization.format(`dxScheduler-recurrenceRepeat${freq.charAt(0).toUpperCase()}${freq.substr(1).toLowerCase()}`));
        });
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

    _changeCheckBoxesValue(byDayChanged) {
        if(!this._$repeatOnWeek || !byDayChanged) {
            return;
        }

        const daysByRule = this._daysOfWeekByRules();

        each(this._daysOfWeek, (index, day) => {
            const dayName = days[index];

            day.option('value', inArray(dayName, daysByRule) > -1);
        });
    },

    _changeDayOfMonthValue() {
        if(!this._$repeatOnMonth && !this._$repeatOnYear) {
            return;
        }

        const day = this._dayOfMonthByRules() || 1;
        this._dayEditor.option('value', day);
    },

    _changeMonthOfYearValue() {
        if(!this._$repeatOnYear) {
            return;
        }

        const month = this._monthOfYearByRules() || 1;
        this._monthEditor.option('value', month);
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
