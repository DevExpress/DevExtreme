/* eslint-disable max-classes-per-file, spellcheck/spell-checker */
import '@js/ui/radio_group';

import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import ButtonGroup from '@js/ui/button_group';
import Editor from '@js/ui/editor/editor';
import Form from '@js/ui/form';
import { current, isFluent } from '@js/ui/themes';

import { getRecurrenceString, parseRecurrenceRule } from './recurrence/base';
import { daysFromByDayRule } from './recurrence/days_from_by_day_rule';

const RECURRENCE_EDITOR = 'dx-recurrence-editor';
const LABEL_POSTFIX = '-label';
const WRAPPER_POSTFIX = '-wrapper';
const RECURRENCE_EDITOR_CONTAINER = 'dx-recurrence-editor-container';
const REPEAT_END_TYPE_EDITOR = 'dx-recurrence-radiogroup-repeat-type';
const REPEAT_COUNT_EDITOR = 'dx-recurrence-numberbox-repeat-count';
const REPEAT_UNTIL_DATE_EDITOR = 'dx-recurrence-datebox-until-date';
const RECURRENCE_BUTTON_GROUP = 'dx-recurrence-button-group';
const FREQUENCY_EDITOR = 'dx-recurrence-selectbox-freq';
const INTERVAL_EDITOR = 'dx-recurrence-numberbox-interval';
const REPEAT_ON_EDITOR = 'dx-recurrence-repeat-on';
const DAY_OF_MONTH = 'dx-recurrence-numberbox-day-of-month';
const MONTH_OF_YEAR = 'dx-recurrence-selectbox-month-of-year';

const recurrentEditorNumberBoxWidth = 150;
const repeatInputWidth = '100%';
const recurrentEditorSelectBoxWidth = 150;
const defaultRecurrenceTypeIndex = 1; // default daily recurrence

const frequenciesMessages = [
  /* {
        // functionality is not removed, but hide the ability to set minute recurrence in the editor.
        // in the future, if we publish the dxRecurrenceEditor, then we publish the minute recurrence
        recurrence: 'dxScheduler-recurrenceMinutely',
        value: 'minutely'
    } */
  {
    recurrence: 'dxScheduler-recurrenceHourly',
    value: 'hourly',
  }, {
    recurrence: 'dxScheduler-recurrenceDaily',
    value: 'daily',
  }, {
    recurrence: 'dxScheduler-recurrenceWeekly',
    value: 'weekly',
  }, {
    recurrence: 'dxScheduler-recurrenceMonthly',
    value: 'monthly',
  }, {
    recurrence: 'dxScheduler-recurrenceYearly',
    value: 'yearly',
  },
];

const frequencies = frequenciesMessages.map((item) => ({ text() { return messageLocalization.format(item.recurrence); }, value: item.value }));

const repeatEndTypes = [
  { type: 'never' },
  { type: 'until' },
  { type: 'count' },
];

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

const getStylingModeFunc = (): string | undefined => (isFluent(current()) ? 'filled' : undefined);

class RecurrenceRule {
  private recurrenceRule: any;

  constructor(rule) {
    this.recurrenceRule = parseRecurrenceRule(rule);
  }

  makeRules(string) {
    this.recurrenceRule = parseRecurrenceRule(string);
  }

  makeRule(field, value) {
    if (!value || (Array.isArray(value) && !value.length)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.recurrenceRule[field];
      return;
    }

    if (isDefined(field)) {
      if (field === 'until') {
        delete this.recurrenceRule.count;
      }

      if (field === 'count') {
        delete this.recurrenceRule.until;
      }

      this.recurrenceRule[field] = value;
    }
  }

  getRepeatEndRule() {
    const rules = this.recurrenceRule;

    if ('count' in rules) {
      return 'count';
    }

    if ('until' in rules) {
      return 'until';
    }

    return 'never';
  }

  getRecurrenceString() {
    return getRecurrenceString(this.recurrenceRule);
  }

  getRules() {
    return this.recurrenceRule;
  }

  getDaysFromByDayRule() {
    return daysFromByDayRule(this.recurrenceRule);
  }
}

class RecurrenceEditor extends Editor {
  private recurrenceRule!: RecurrenceRule;

  private $container: any;

  private weekEditor: any;

  private editors!: any[];

  private $repeatOnWeek: any;

  private recurrenceForm: any;

  _getDefaultOptions() {
    // @ts-expect-error
    const defaultOptions = super._getDefaultOptions();

    return extend(defaultOptions, {
      value: null,

      startDate: new Date(),

      firstDayOfWeek: undefined,
    });
  }

  private getFirstDayOfWeek() {
    const firstDayOfWeek = this.option('firstDayOfWeek');
    return isDefined(firstDayOfWeek) ? firstDayOfWeek : dateLocalization.firstDayOfWeekIndex();
  }

  private createComponent(element, name, config = {}) {
    // @ts-expect-error
    this._extendConfig(config, {
      readOnly: this.option('readOnly'),
    });

    // @ts-expect-error
    return super._createComponent(element, name, config);
  }

  _init() {
    // @ts-expect-error
    super._init();
    this.recurrenceRule = new RecurrenceRule(this.option('value'));
  }

  _render() {
    // @ts-expect-error
    super._render();

    (this.$element() as any).addClass(RECURRENCE_EDITOR);

    this.$container = $('<div>')
      .addClass(RECURRENCE_EDITOR_CONTAINER)
      .appendTo(this.$element());

    this.prepareEditors();
    this.renderEditors(this.$container);
    this.updateRepeatInputAriaLabel();
  }

  getEditorByField(fieldName) {
    let editor = this.getRecurrenceForm().getEditor(fieldName);

    if (!isDefined(editor)) {
      switch (fieldName) {
        case 'byday':
          editor = this.weekEditor;
          break;
        default:
          break;
      }
    }

    return editor;
  }

  private prepareEditors() {
    const freq = (this.recurrenceRule.getRules().freq || frequenciesMessages[defaultRecurrenceTypeIndex].value).toLowerCase();

    this.editors = [
      this.createFreqEditor(freq),
      this.createIntervalEditor(freq),
      this.createRepeatOnLabel(freq),
      {
        itemType: 'group',
        cssClass: REPEAT_ON_EDITOR,
        colCount: 2,
        colCountByScreen: { xs: 2 },
        items: this.createRepeatOnEditor(freq),
      },
      {
        itemType: 'group',
        colCount: 2,
        items: this.createRepeatEndEditor(),
      },
    ];

    return this.editors;
  }

  private createFreqEditor(freq) {
    return {
      dataField: 'freq',
      name: 'FREQ',
      editorType: 'dxSelectBox',
      cssClass: FREQUENCY_EDITOR,
      editorOptions: {
        stylingMode: getStylingModeFunc(),
        items: frequencies,
        value: freq,
        field: 'freq',
        valueExpr: 'value',
        displayExpr: 'text',
        layout: 'horizontal',
        elementAttr: {
          class: FREQUENCY_EDITOR,
        },
        onValueChanged: (args) => this.valueChangedHandler(args),
      },
      label: {
        text: messageLocalization.format('dxScheduler-editorLabelRecurrence'),
      },
    };
  }

  private createIntervalEditor(freq) {
    const interval = this.recurrenceRule.getRules().interval || 1;
    return {
      itemType: 'group',
      colCount: 2,
      cssClass: `${INTERVAL_EDITOR}${WRAPPER_POSTFIX}`,
      colCountByScreen: { xs: 2 },
      items: [
        {
          dataField: 'interval',
          editorType: 'dxNumberBox',
          editorOptions: {
            stylingMode: getStylingModeFunc(),
            format: '#',
            width: recurrentEditorNumberBoxWidth,
            min: 1,
            field: 'interval',
            value: interval,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            elementAttr: {
              class: INTERVAL_EDITOR,
            },
            onValueChanged: (args) => this.valueChangedHandler(args),
          },
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceRepeatEvery'),
          },
        },
        {
          name: 'intervalLabel',
          cssClass: `${INTERVAL_EDITOR}${LABEL_POSTFIX}`,
          template: () => messageLocalization.format(`dxScheduler-recurrenceRepeat${freq.charAt(0).toUpperCase()}${freq.substr(1).toLowerCase()}`),
        },
      ],
    };
  }

  private createRepeatOnLabel(freq) {
    return {
      itemType: 'group',
      cssClass: `${REPEAT_ON_EDITOR}${LABEL_POSTFIX}`,
      items: [
        {
          name: 'repeatOnLabel',
          colSpan: 2,
          template: () => messageLocalization.format('dxScheduler-recurrenceRepeatOn'),
          visible: freq && freq !== 'daily' && freq !== 'hourly',
        },
      ],
    };
  }

  private createRepeatOnEditor(freq) {
    return [
      this.createByDayEditor(freq),
      this.createByMonthEditor(freq),
      this.createByMonthDayEditor(freq),
    ];
  }

  private createByDayEditor(freq) {
    return {
      dataField: 'byday',
      colSpan: 2,
      template: (_, itemElement) => {
        const firstDayOfWeek = this.getFirstDayOfWeek() as any;
        const byDay = this.daysOfWeekByRules();

        const localDaysNames = dateLocalization.getDayNames('abbreviated');
        const dayNames = days.slice(firstDayOfWeek).concat(days.slice(0, firstDayOfWeek));

        const itemsButtonGroup = localDaysNames.slice(firstDayOfWeek).concat(localDaysNames.slice(0, firstDayOfWeek)).map((item, index) => ({ text: item, key: dayNames[index] }));

        this.$repeatOnWeek = $('<div>').addClass(RECURRENCE_BUTTON_GROUP).appendTo(itemElement);

        this.weekEditor = this.createComponent(this.$repeatOnWeek, ButtonGroup, {
          items: itemsButtonGroup,
          field: 'byday',
          selectionMode: 'multiple',
          selectedItemKeys: byDay,
          keyExpr: 'key',
          onSelectionChanged: (e) => {
            const selectedItemKeys = e.component.option('selectedItemKeys');
            const selectedKeys = selectedItemKeys?.length
              ? selectedItemKeys
              : this.getDefaultByDayValue();

            this.recurrenceRule.makeRule('byday', selectedKeys);
            this.changeEditorValue();
          },
        });
      },
      visible: freq === 'weekly',
      label: {
        visible: false,
      },
    };
  }

  private createByMonthEditor(freq) {
    const monthsName = (dateLocalization.getMonthNames as any)('wide');
    const months = [...Array(12)].map((_, i) => ({ value: `${i + 1}`, text: monthsName[i] }));

    return {
      dataField: 'bymonth',
      editorType: 'dxSelectBox',
      editorOptions: {
        stylingMode: getStylingModeFunc(),
        field: 'bymonth',
        items: months,
        value: this.monthOfYearByRules(),
        width: recurrentEditorSelectBoxWidth,
        displayExpr: 'text',
        valueExpr: 'value',
        elementAttr: {
          class: MONTH_OF_YEAR,
        },
        onValueChanged: (args) => this.valueChangedHandler(args),
      },
      visible: freq === 'yearly',
      label: {
        visible: false,
      },
    };
  }

  private createByMonthDayEditor(freq) {
    return {
      dataField: 'bymonthday',
      editorType: 'dxNumberBox',
      editorOptions: {
        stylingMode: getStylingModeFunc(),
        min: 1,
        max: 31,
        format: '#',
        width: recurrentEditorNumberBoxWidth,
        field: 'bymonthday',
        showSpinButtons: true,
        useLargeSpinButtons: false,
        value: this.dayOfMonthByRules(),
        elementAttr: {
          class: DAY_OF_MONTH,
        },
        onValueChanged: (args) => this.valueChangedHandler(args),
      },
      visible: freq === 'monthly' || freq === 'yearly',
      label: {
        visible: false,
      },
    };
  }

  private createRepeatEndEditor() {
    const repeatType = this.recurrenceRule.getRepeatEndRule();

    return [{
      colSpan: 2,
      template: messageLocalization.format('dxScheduler-recurrenceEnd'),
    }, {
      colSpan: 1,
      label: { visible: false },
      dataField: 'repeatEnd',
      editorType: 'dxRadioGroup',
      editorOptions: {
        items: repeatEndTypes,
        value: repeatType,
        valueExpr: 'type',
        field: 'repeatEnd',
        itemTemplate: (itemData) => {
          if (itemData.type === 'count') {
            return messageLocalization.format('dxScheduler-recurrenceAfter');
          }
          if (itemData.type === 'until') {
            return messageLocalization.format('dxScheduler-recurrenceOn');
          }

          return messageLocalization.format('dxScheduler-recurrenceNever');
        },
        layout: 'vertical',
        elementAttr: { class: REPEAT_END_TYPE_EDITOR },
        onValueChanged: (args) => this.repeatEndValueChangedHandler(args),
      },
    }, {
      colSpan: 1,
      itemType: 'group',
      items: [
        this.getRepeatUntilEditorOptions(),
        this.getRepeatCountEditorOptions(),
      ],
    }];
  }

  private renderEditors($container) {
    this.recurrenceForm = this.createComponent($container, Form, {
      items: this.editors,
      showValidationSummary: false,
      scrollingEnabled: true,
      showColonAfterLabel: false,
      labelLocation: 'top',
    });

    this.changeRepeatEndInputsVisibility();
  }

  getRecurrenceForm() {
    return this.recurrenceForm;
  }

  changeValueByVisibility(value) {
    if (value) {
      if (!this.option('value')) {
        this.handleDefaults();
      }
    } else {
      this.recurrenceRule.makeRules('');
      this.option('value', '');
    }
  }

  private handleDefaults() {
    this.recurrenceRule.makeRule('freq', frequenciesMessages[defaultRecurrenceTypeIndex].value);
    this.changeEditorValue();
  }

  private changeEditorValue() {
    this.option('value', this.recurrenceRule.getRecurrenceString() ?? '');
  }

  private daysOfWeekByRules() {
    let daysByRule = this.recurrenceRule.getDaysFromByDayRule();
    if (!daysByRule.length) {
      daysByRule = this.getDefaultByDayValue();
    }

    return daysByRule;
  }

  private getDefaultByDayValue() {
    const startDate = this.option('startDate') as any;
    const startDay = startDate.getDay();
    return [days[startDay]];
  }

  private dayOfMonthByRules() {
    let dayByRule = this.recurrenceRule.getRules().bymonthday;

    if (!dayByRule) {
      dayByRule = (this.option('startDate') as any).getDate();
    }

    return dayByRule;
  }

  private monthOfYearByRules() {
    let monthByRule = this.recurrenceRule.getRules().bymonth;

    if (!monthByRule) {
      monthByRule = (this.option('startDate') as any).getMonth() + 1;
    }

    return String(monthByRule);
  }

  private repeatEndValueChangedHandler(args) {
    const { value } = args;

    this.changeRepeatEndInputsVisibility(value);

    if (value === 'until') {
      this.recurrenceRule.makeRule(value, this.getUntilValue());
    }
    if (value === 'count') {
      this.recurrenceRule.makeRule(value, this.recurrenceForm.option('formData.count'));
    }
    if (value === 'never') {
      this.recurrenceRule.makeRule('count', '');
      this.recurrenceRule.makeRule('until', '');
    }

    this.changeEditorValue();
    this.updateRepeatInputAriaLabel();
  }

  private changeRepeatEndInputsVisibility(value = this.recurrenceRule.getRepeatEndRule()) {
    if (value === 'until') {
      this.recurrenceForm.itemOption('until', 'visible', true);
      this.recurrenceForm.itemOption('count', 'visible', false);
    }
    if (value === 'count') {
      this.recurrenceForm.itemOption('until', 'visible', false);
      this.recurrenceForm.itemOption('count', 'visible', true);
    }
    if (value === 'never') {
      this.recurrenceForm.itemOption('until', 'visible', false);
      this.recurrenceForm.itemOption('count', 'visible', false);
    }
  }

  private getRepeatCountEditorOptions() {
    const count = this.recurrenceRule.getRules().count || 1;

    return {
      dataField: 'count',
      cssClass: REPEAT_COUNT_EDITOR,
      label: { visible: false },
      editorType: 'dxNumberBox',
      editorOptions: {
        stylingMode: getStylingModeFunc(),
        field: 'count',
        format: `# ${messageLocalization.format('dxScheduler-recurrenceRepeatCount')}`,
        width: repeatInputWidth,
        min: 1,
        showSpinButtons: true,
        useLargeSpinButtons: false,
        value: count,
        onValueChanged: this.repeatCountValueChangeHandler.bind(this),
        inputAttr: { 'aria-label': messageLocalization.format('dxScheduler-recurrenceOccurrenceLabel') },
      },
    };
  }

  private updateRepeatInputAriaLabel(): void {
    const radioButtons = this.getEditorByField('repeatEnd').itemElements();
    const untilLabel = messageLocalization.format('dxScheduler-recurrenceOn');
    const untilValue = this.recurrenceForm.getEditor('until').option('value');
    const untilValueFormat = `${dateLocalization.format(untilValue, 'd')} ${dateLocalization.format(untilValue, 'monthAndYear')}`;
    const isUntilVisible = this.recurrenceForm.itemOption('until').visible;

    const countLabel = messageLocalization.format('dxScheduler-recurrenceAfter');
    const countPostfix = messageLocalization.format('dxScheduler-recurrenceRepeatCount');
    const countValue = this.recurrenceForm.getEditor('count').option('value');
    const isCountVisible = this.recurrenceForm.itemOption('count').visible;

    radioButtons[1].setAttribute('aria-label', isUntilVisible ? `${untilLabel} ${untilValueFormat}` : untilLabel);
    radioButtons[2].setAttribute('aria-label', isCountVisible ? `${countLabel} ${countValue} ${countPostfix}` : countLabel);
  }

  private repeatCountValueChangeHandler(args) {
    if (this.recurrenceRule.getRepeatEndRule() === 'count') {
      const { value } = args;
      this.recurrenceRule.makeRule('count', value);
      this.changeEditorValue();
      this.updateRepeatInputAriaLabel();
    }
  }

  private getRepeatUntilEditorOptions() {
    const until = this.getUntilValue();

    return {
      dataField: 'until',
      label: { visible: false },
      cssClass: REPEAT_UNTIL_DATE_EDITOR,
      editorType: 'dxDateBox',
      editorOptions: {
        stylingMode: getStylingModeFunc(),
        field: 'until',
        value: until,
        type: 'date',
        width: repeatInputWidth,
        onValueChanged: this.repeatUntilValueChangeHandler.bind(this),
        calendarOptions: {
          firstDayOfWeek: this.getFirstDayOfWeek(),
        },
        useMaskBehavior: true,
        inputAttr: { 'aria-label': messageLocalization.format('dxScheduler-recurrenceUntilDateLabel') },
      },
    };
  }

  private formatUntilDate(date: Date): Date {
    const untilDate = this.recurrenceRule.getRules().until;
    const isSameDate = dateUtils.sameDate(untilDate, date);

    return untilDate && isSameDate
      ? date
      : dateUtils.setToDayEnd(date);
  }

  private repeatUntilValueChangeHandler(args) {
    if (this.recurrenceRule.getRepeatEndRule() === 'until') {
      const dateInTimeZone = this.formatUntilDate(new Date(args.value));
      const getStartDateTimeZone: any = this.option('getStartDateTimeZone');
      const appointmentTimeZone = getStartDateTimeZone();

      const path = appointmentTimeZone ? 'fromAppointment' : 'fromGrid';
      const dateInLocaleTimeZone = (this.option('timeZoneCalculator') as any)
        .createDate(dateInTimeZone, path, appointmentTimeZone);

      this.recurrenceRule.makeRule('until', dateInLocaleTimeZone);
      this.changeEditorValue();
      this.updateRepeatInputAriaLabel();
    }
  }

  private valueChangedHandler(args) {
    const { value, previousValue } = args;
    const field = args.component.option('field');

    if (!this.option('visible')) {
      this.option('value', '');
    } else {
      this.recurrenceRule.makeRule(field, value);
      if (field === 'freq') {
        this.makeRepeatOnRule(value);
        this.changeRepeatOnVisibility(value, previousValue);
      }
      this.changeEditorValue();
    }
  }

  private makeRepeatOnRule(value) {
    if (value === 'daily' || value === 'hourly') {
      this.recurrenceRule.makeRule('byday', '');
      this.recurrenceRule.makeRule('bymonth', '');
      this.recurrenceRule.makeRule('bymonthday', '');
    }
    if (value === 'weekly') {
      this.recurrenceRule.makeRule('byday', this.daysOfWeekByRules());
      this.recurrenceRule.makeRule('bymonth', '');
      this.recurrenceRule.makeRule('bymonthday', '');
    }

    if (value === 'monthly') {
      this.recurrenceRule.makeRule('bymonthday', this.dayOfMonthByRules());
      this.recurrenceRule.makeRule('bymonth', '');
      this.recurrenceRule.makeRule('byday', '');
    }

    if (value === 'yearly') {
      this.recurrenceRule.makeRule('bymonthday', this.dayOfMonthByRules());
      this.recurrenceRule.makeRule('bymonth', this.monthOfYearByRules());
      this.recurrenceRule.makeRule('byday', '');
    }
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'readOnly':
        this.recurrenceForm?.option('readOnly', args.value);
        this.weekEditor?.option('readOnly', args.value);
        // @ts-expect-error
        super._optionChanged(args);
        break;
      case 'value':
        this.recurrenceRule.makeRules(args.value);

        this.changeRepeatIntervalLabel();
        this.changeRepeatEndInputsVisibility();
        this.changeEditorsValue(this.recurrenceRule.getRules());

        // @ts-expect-error
        super._optionChanged(args);
        break;
      case 'startDate':
        this.makeRepeatOnRule(this.recurrenceRule.getRules().freq);

        if (isDefined(this.recurrenceRule.getRecurrenceString())) {
          this.changeEditorValue();
        }

        break;
      case 'firstDayOfWeek':
        if (this.weekEditor) {
          const localDaysNames = dateLocalization.getDayNames('abbreviated');
          const dayNames = days.slice(args.value).concat(days.slice(0, args.value));

          const itemsButtonGroup = localDaysNames.slice(args.value).concat(localDaysNames.slice(0, args.value)).map((item, index) => ({ text: item, key: dayNames[index] }));

          this.weekEditor.option('items', itemsButtonGroup);
        }
        if (this.recurrenceForm.itemOption('until').visible) {
          this.recurrenceForm.getEditor('until').option('calendarOptions.firstDayOfWeek', this.getFirstDayOfWeek());
        }
        break;
      default:
        // @ts-expect-error
        super._optionChanged(args);
    }
  }

  private changeRepeatOnVisibility(freq, previousFreq) {
    if (freq !== previousFreq) {
      this.recurrenceForm.itemOption('byday', 'visible', false);
      this.recurrenceForm.itemOption('bymonthday', 'visible', false);
      this.recurrenceForm.itemOption('bymonth', 'visible', false);

      this.recurrenceForm.itemOption('repeatOnLabel', 'visible', freq && freq !== 'daily' && freq !== 'hourly');

      if (freq === 'weekly') {
        this.recurrenceForm.itemOption('byday', 'visible', true);
      }
      if (freq === 'monthly') {
        this.recurrenceForm.itemOption('bymonthday', 'visible', true);
      }
      if (freq === 'yearly') {
        this.recurrenceForm.itemOption('bymonthday', 'visible', true);
        this.recurrenceForm.itemOption('bymonth', 'visible', true);
      }
    }
  }

  private changeRepeatIntervalLabel() {
    const { freq } = this.recurrenceRule.getRules();

    freq && this.recurrenceForm.itemOption('intervalLabel', 'template', messageLocalization.format(`dxScheduler-recurrenceRepeat${freq.charAt(0).toUpperCase()}${freq.substr(1).toLowerCase()}`));
  }

  private changeEditorsValue(rules) {
    this.recurrenceForm.getEditor('freq').option('value', (rules.freq || frequenciesMessages[defaultRecurrenceTypeIndex].value).toLowerCase());

    this.changeDayOfWeekValue();
    this.changeDayOfMonthValue();
    this.changeMonthOfYearValue();

    this.changeIntervalValue(rules.interval);

    this.changeRepeatCountValue();
    this.changeRepeatEndValue();
    this.changeRepeatUntilValue();
  }

  private changeIntervalValue(value) {
    this.recurrenceForm.getEditor('interval').option('value', value || 1);
  }

  private changeRepeatEndValue() {
    const repeatType = this.recurrenceRule.getRepeatEndRule();

    this.recurrenceForm.getEditor('repeatEnd').option('value', repeatType);
  }

  private changeDayOfWeekValue() {
    const isEditorVisible = this.recurrenceForm.itemOption('byday').visible;
    if (isEditorVisible) {
      const days = this.daysOfWeekByRules();
      this.getEditorByField('byday').option('selectedItemKeys', days);
    }
  }

  private changeDayOfMonthValue() {
    const isEditorVisible = this.recurrenceForm.itemOption('bymonthday').visible;
    if (isEditorVisible) {
      const day = this.dayOfMonthByRules();
      this.recurrenceForm.getEditor('bymonthday').option('value', day);
    }
  }

  private changeMonthOfYearValue() {
    const isEditorVisible = this.recurrenceForm.itemOption('bymonth').visible;
    if (isEditorVisible) {
      const month = this.monthOfYearByRules();
      this.recurrenceForm.getEditor('bymonth').option('value', month);
    }
  }

  private changeRepeatCountValue() {
    const count = this.recurrenceRule.getRules().count || 1;
    this.recurrenceForm.getEditor('count').option('value', count);
  }

  private changeRepeatUntilValue() {
    this.recurrenceForm.getEditor('until').option('value', this.getUntilValue());
  }

  private getUntilValue() {
    const untilDate = this.recurrenceRule.getRules().until;

    if (!untilDate) {
      return this.formatUntilDate(new Date());
    }

    const getStartDateTimeZone: any = this.option('getStartDateTimeZone');
    const appointmentTimeZone = getStartDateTimeZone();

    const path = appointmentTimeZone ? 'toAppointment' : 'toGrid';

    return (this.option('timeZoneCalculator') as any).createDate(untilDate, path, appointmentTimeZone);
  }
}

registerComponent('dxRecurrenceEditor', RecurrenceEditor as any);

export default RecurrenceEditor;
