/* eslint-disable max-classes-per-file */
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import $, { type dxElementWrapper } from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { isDefined } from '@js/core/utils/type';
import Button from '@js/ui/button';
import type { Properties as DateBoxProperties } from '@js/ui/date_box';
import type { GroupItem, SimpleItem } from '@js/ui/form';
import type dxForm from '@js/ui/form';
import type { Properties as NumberBoxProperties } from '@js/ui/number_box';
import type { Properties as RadioGroupProperties } from '@js/ui/radio_group';
import type { Properties as SelectBoxProperties } from '@js/ui/select_box';

import type Scheduler from '../m_scheduler';
import { getRecurrenceString, parseRecurrenceRule } from '../recurrence/base';
import { daysFromByDayRule } from '../recurrence/days_from_by_day_rule';
import { APPOINTMENT_FORM_GROUP_NAMES } from './m_form_constants';

const CLASSES = {
  groupWithIcon: 'dx-scheduler-form-group-with-icon',
  icon: 'dx-scheduler-form-icon',
  recurrenceStartDateGroup: 'dx-scheduler-form-recurrence-start-date-group',
  recurrenceRepeatEveryGroup: 'dx-scheduler-form-recurrence-repeat-every-group',
  recurrenceRepeatOnMonthlyGroup: 'dx-scheduler-form-recurrence-repeat-on-monthly-group',
  recurrenceRepeatOnYearlyGroup: 'dx-scheduler-form-recurrence-repeat-on-yearly-group',
  recurrenceEndGroup: 'dx-scheduler-form-recurrence-end-group',
  recurrenceEndContainer: 'dx-scheduler-form-recurrence-end-repeat-group',
};

const frequenciesMessages = [
  {
    recurrence: 'dxScheduler-recurrenceRepeatHourly',
    value: 'hourly',
  }, {
    recurrence: 'dxScheduler-recurrenceRepeatDaily',
    value: 'daily',
  }, {
    recurrence: 'dxScheduler-recurrenceRepeatWeekly',
    value: 'weekly',
  }, {
    recurrence: 'dxScheduler-recurrenceRepeatMonthly',
    value: 'monthly',
  }, {
    recurrence: 'dxScheduler-recurrenceRepeatYearly',
    value: 'yearly',
  },
];

const frequencies = frequenciesMessages.map((item) => ({
  text: messageLocalization.format(item.recurrence),
  value: item.value,
}));

const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export class RecurrenceRule {
  private _recurrenceRule: any;

  constructor(rule: string) {
    this._recurrenceRule = parseRecurrenceRule(rule);
  }

  makeRules(string: string): void {
    this._recurrenceRule = parseRecurrenceRule(string);
  }

  makeRule(field: string, value: any): void {
    if (!value || (Array.isArray(value) && !value.length)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._recurrenceRule[field];
      return;
    }

    if (isDefined(field)) {
      if (field === 'until') {
        delete this._recurrenceRule.count;
      }

      if (field === 'count') {
        delete this._recurrenceRule.until;
      }

      this._recurrenceRule[field] = value;
    }
  }

  getRepeatEndRule(): string {
    const rules = this._recurrenceRule;

    if ('count' in rules) {
      return 'count';
    }

    if ('until' in rules) {
      return 'until';
    }

    return 'never';
  }

  getRecurrenceString(): string | undefined {
    return getRecurrenceString(this._recurrenceRule);
  }

  getRules(): any {
    return this._recurrenceRule;
  }

  getDaysFromByDayRule(): string[] {
    return daysFromByDayRule(this._recurrenceRule);
  }
}

export class RecurrentForm {
  private readonly scheduler: any;

  private _dxForm: dxForm;

  private _recurrenceRule: RecurrenceRule;

  private _dayButtons?: Button[];

  private _tempRecurrenceRule?: RecurrenceRule;

  private _isUpdatingEditors = false;

  constructor(scheduler: Scheduler, dxForm: dxForm, recurrenceRule: RecurrenceRule) {
    this.scheduler = scheduler;
    this._dxForm = dxForm;
    this._recurrenceRule = recurrenceRule;
  }

  get dxForm(): dxForm {
    return this._dxForm;
  }

  set dxForm(value: dxForm) {
    this._dxForm = value;
  }

  get tempRecurrenceRule(): RecurrenceRule | undefined {
    return this._tempRecurrenceRule;
  }

  set tempRecurrenceRule(value: RecurrenceRule | undefined) {
    this._tempRecurrenceRule = value;
  }

  get recurrenceRule(): RecurrenceRule {
    return this._recurrenceRule;
  }

  set recurrenceRule(value: RecurrenceRule) {
    this._recurrenceRule = value;
  }

  private get startDate(): Date | null {
    if (!this.dxForm) {
      return null;
    }

    const { startDateExpr } = this.scheduler.getDataAccessors().expr;
    const formData = this.dxForm.option('formData') as Record<string, any>;

    if (!formData) {
      return null;
    }

    const value = formData[startDateExpr];

    if (!value) return null;

    const dateValue = new Date(value);
    return Number.isNaN(dateValue.getTime()) ? null : dateValue;
  }

  createRecurrenceFormGroup(): GroupItem {
    return {
      name: APPOINTMENT_FORM_GROUP_NAMES.Recurrence,
      itemType: 'group',
      cssClass: 'dx-scheduler-form-recurrence-group dx-scheduler-form-recurrence-hidden',
      colSpan: 1,
      items: [
        this.createRecurrenceStartDateGroup(),
        this.createRecurrenceSettingsGroup(),
        this.createRecurrenceEndGroup(),
      ],
    } as GroupItem;
  }

  private createRecurrenceSettingsGroup(): GroupItem {
    return {
      itemType: 'group',
      colCount: 1,
      items: [
        this.createRecurrenceRepeatEveryGroup(),
      ],
    } as GroupItem;
  }

  private createRecurrenceStartDateGroup(): GroupItem {
    const { startDateExpr } = this.scheduler.getDataAccessors().expr;

    return {
      itemType: 'group',
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      cssClass: `${CLASSES.recurrenceStartDateGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          colSpan: 1,
          cssClass: CLASSES.icon,
          template: RecurrentForm.createIconTemplate('clock'),
        },
        {
          colSpan: 1,
          itemType: 'simple',
          dataField: startDateExpr,
          editorType: 'dxDateBox',
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceStart'),
          },
          validationRules: [{
            type: 'required',
          }],
          editorOptions: {
            type: 'date',
            useMaskBehavior: true,
            calendarOptions: {
              firstDayOfWeek: this.scheduler.getFirstDayOfWeek(),
            },
            onValueChanged: (e): void => {
              if (!e.value) {
                return;
              }

              const currentStartDate = this.startDate;
              if (!currentStartDate) {
                return;
              }

              const newDate = new Date(e.value);
              currentStartDate.setFullYear(
                newDate.getFullYear(),
                newDate.getMonth(),
                newDate.getDate(),
              );

              this.dxForm.updateData(startDateExpr, currentStartDate);
            },
          } as DateBoxProperties,
        },
      ],
    } as GroupItem;
  }

  private createRecurrenceRepeatEveryGroup(): GroupItem {
    const freq = (this._recurrenceRule.getRules().freq || 'daily').toLowerCase();
    const interval = this._recurrenceRule.getRules().interval || 1;

    return {
      itemType: 'group',
      cssClass: `${CLASSES.recurrenceRepeatEveryGroup} ${CLASSES.groupWithIcon}`,
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        {
          colSpan: 1,
          cssClass: CLASSES.icon,
          template: RecurrentForm.createIconTemplate('repeat'),
        },
        {
          itemType: 'group',
          colSpan: 1,
          colCount: 2,
          colCountByScreen: {
            xs: 2,
          },
          items: [
            {
              itemType: 'simple',
              name: 'interval',
              dataField: 'interval',
              colSpan: 1,
              editorType: 'dxNumberBox',
              label: {
                text: messageLocalization.format('dxScheduler-recurrenceRepeatEvery'),
              },
              editorOptions: {
                format: '#',
                min: 1,
                value: interval,
                showSpinButtons: true,
                useLargeSpinButtons: false,
                onValueChanged: (args): void => {
                  if (this._isUpdatingEditors) {
                    return;
                  }

                  if (this._tempRecurrenceRule) {
                    this._tempRecurrenceRule.makeRule('interval', args.value);
                  }
                },
              } as NumberBoxProperties,
            },
            {
              itemType: 'simple',
              name: 'freq',
              dataField: 'freq',
              colSpan: 1,
              editorType: 'dxSelectBox',
              label: {
                visible: false,
              },
              editorOptions: {
                items: frequencies,
                value: freq,
                valueExpr: 'value',
                displayExpr: 'text',
                onValueChanged: (args): void => {
                  if (this._isUpdatingEditors) {
                    return;
                  }

                  if (this._tempRecurrenceRule) {
                    this._tempRecurrenceRule.makeRule('freq', args.value.toUpperCase());

                    this._isUpdatingEditors = true;
                    try {
                      this.updateRecurrenceRepeatOnVisibility(args.value, args.previousValue);
                    } finally {
                      this._isUpdatingEditors = false;
                    }
                  }
                },
              } as SelectBoxProperties,
            },
            {
              itemType: 'simple',
              colSpan: 2,
              label: {
                text: messageLocalization.format('dxScheduler-recurrenceRepeatOn'),
              },
              visible: freq === 'weekly',
              template: (): string => '',
            },
            {
              ...this.createRecurrenceByDayEditor(freq),
              colSpan: 2,
            },
            {
              ...this.createRecurrenceRepeatOnMonthlyGroup(freq),
              colSpan: 2,
            },
            {
              ...this.createRecurrenceRepeatOnYearlyGroup(freq),
              colSpan: 2,
            },
          ],
        },
      ],
    } as GroupItem;
  }

  private createRecurrenceRepeatOnMonthlyGroup(freq: string): GroupItem {
    return {
      itemType: 'group',
      name: 'repeatOnMonthlyGroup',
      cssClass: CLASSES.recurrenceRepeatOnMonthlyGroup,
      visible: freq === 'monthly',
      colCount: 1,
      items: [
        {
          itemType: 'simple',
          name: 'bymonthday',
          dataField: 'bymonthday',
          colSpan: 1,
          editorType: 'dxNumberBox',
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceRepeatOn'),
          },
          editorOptions: {
            min: 1,
            max: 31,
            format: '#',
            showSpinButtons: true,
            useLargeSpinButtons: false,
            onContentReady: (e): void => {
              e.component.option('value', this._dayOfMonthByRules());
            },
            onValueChanged: (args): void => {
              if (this._tempRecurrenceRule) {
                this._tempRecurrenceRule.makeRule('bymonthday', args.value);
              }
            },
          } as NumberBoxProperties,
        },
      ],
    } as GroupItem;
  }

  private createRecurrenceRepeatOnYearlyGroup(freq: string): GroupItem {
    const monthsName = (dateLocalization.getMonthNames as any)('wide');
    const months = [...Array(12)].map((_, i) => ({ value: `${i + 1}`, text: monthsName[i] }));

    return {
      itemType: 'group',
      name: 'repeatOnYearlyGroup',
      cssClass: CLASSES.recurrenceRepeatOnYearlyGroup,
      visible: freq === 'yearly',
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        {
          itemType: 'simple',
          name: 'bymonth',
          dataField: 'bymonth',
          colSpan: 1,
          editorType: 'dxSelectBox',
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceRepeatEvery'),
          },
          editorOptions: {
            items: months,
            displayExpr: 'text',
            valueExpr: 'value',
            onContentReady: (e): void => {
              e.component.option('value', this._monthOfYearByRules());
            },
            onValueChanged: (args): void => {
              if (this._tempRecurrenceRule) {
                this._tempRecurrenceRule.makeRule('bymonth', args.value);
              }
            },
          } as SelectBoxProperties,
        },
        {
          itemType: 'simple',
          name: 'bymonthdayYearly',
          dataField: 'bymonthday',
          colSpan: 1,
          editorType: 'dxNumberBox',
          label: {
            visible: false,
          },
          editorOptions: {
            min: 1,
            max: 31,
            format: '#',
            showSpinButtons: true,
            useLargeSpinButtons: false,
            onContentReady: (e): void => {
              e.component.option('value', this._dayOfMonthByRules());
            },
            onValueChanged: (args): void => {
              if (this._tempRecurrenceRule) {
                this._tempRecurrenceRule.makeRule('bymonthday', args.value);
              }
            },
          } as NumberBoxProperties,
        },
      ],
    } as GroupItem;
  }

  private createRecurrenceByDayEditor(freq: string): SimpleItem {
    const firstDayOfWeek = this.scheduler.getFirstDayOfWeek()
    ?? dateLocalization.firstDayOfWeekIndex();

    const localDaysNames = dateLocalization.getDayNames('short');

    const dayNames = days.slice(firstDayOfWeek).concat(days.slice(0, firstDayOfWeek));

    const reorderedLocalDaysNames = localDaysNames
      .slice(firstDayOfWeek)
      .concat(localDaysNames.slice(0, firstDayOfWeek));

    const itemsButtonGroup = dayNames.map((key, index) => ({
      text: reorderedLocalDaysNames[index],
      key,
    }));

    return {
      itemType: 'simple',
      dataField: 'byday',
      colSpan: 1,
      visible: freq === 'weekly',
      label: {
        visible: false,
      },
      template: (_, itemElement): void => {
        const container = $('<div>')
          .addClass('dx-scheduler-recurrence-byday-buttons')
          .appendTo(itemElement);

        const byDay = this._daysOfWeekByRules();
        this._dayButtons = [];

        const buttonKeyMap = new Map<Button, string>();

        const updateByDay = (clickedKey: string, isSelected: boolean): void => {
          if (!this._tempRecurrenceRule) {
            return;
          }

          const currentByDay = this._daysOfWeekByRules();
          let newByDay: string[] = [];

          if (isSelected) {
            newByDay = currentByDay.includes(clickedKey)
              ? currentByDay
              : [...currentByDay, clickedKey];
          } else {
            newByDay = currentByDay.filter((d) => d !== clickedKey);
          }

          if (newByDay.length === 0) {
            newByDay = this._getDefaultByDayValue();
          }

          this._tempRecurrenceRule.makeRule('byday', newByDay);

          this._dayButtons?.forEach((btn) => {
            const key = buttonKeyMap.get(btn);
            const selected = key ? newByDay.includes(key) : false;
            btn.option('stylingMode', selected ? 'contained' : 'outlined');
            btn.option('type', selected ? 'default' : 'normal');
          });
        };

        itemsButtonGroup.forEach((item) => {
          const isSelected = byDay.includes(item.key);
          const buttonContainer = $('<div>').appendTo(container);

          const button = this.scheduler.createComponent(buttonContainer, Button, {
            text: item.text,
            width: 32,
            height: 32,
            stylingMode: isSelected ? 'contained' : 'outlined',
            type: isSelected ? 'default' : 'normal',
            elementAttr: {
              'data-day-key': item.key,
            },
            onClick: (): void => {
              const currentByDay = this._daysOfWeekByRules();
              const isCurrentlySelected = currentByDay.includes(item.key);
              updateByDay(item.key, !isCurrentlySelected);
            },
          });

          this._dayButtons?.push(button);
          buttonKeyMap.set(button, item.key);
        });
      },
    } as SimpleItem;
  }

  private createRecurrenceEndGroup(): GroupItem {
    const repeatType = this._recurrenceRule.getRepeatEndRule();

    const repeatEndTypes = [
      { type: 'never' },
      { type: 'until' },
      { type: 'count' },
    ];

    return {
      itemType: 'group',
      name: 'recurrenceEndGroup',
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      cssClass: `${CLASSES.recurrenceEndGroup} ${CLASSES.groupWithIcon} ${CLASSES.recurrenceEndContainer}`,
      items: [
        {
          colSpan: 1,
          cssClass: CLASSES.icon,
          template: RecurrentForm.createIconTemplate('description'),
        },
        {
          itemType: 'group',
          colSpan: 1,
          colCount: 2,
          colCountByScreen: { xs: 2 },
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceEnd'),
          },
          items: [
            {
              itemType: 'simple',
              name: 'repeatEnd',
              colSpan: 1,
              dataField: 'repeatEnd',
              editorType: 'dxRadioGroup',
              cssClass: 'dx-scheduler-form-recurrence-end-radio',
              label: {
                visible: false,
              },
              editorOptions: {
                items: repeatEndTypes,
                value: repeatType,
                valueExpr: 'type',
                itemTemplate: (itemData): string => {
                  if (itemData.type === 'count') {
                    return messageLocalization.format('dxScheduler-recurrenceAfter');
                  }
                  if (itemData.type === 'until') {
                    return messageLocalization.format('dxScheduler-recurrenceOn');
                  }
                  return messageLocalization.format('dxScheduler-recurrenceNever');
                },
                layout: 'vertical',
                onValueChanged: (args): void => this._repeatEndValueChangedHandler(args),
              } as RadioGroupProperties,
            },
            {
              itemType: 'group',
              cssClass: 'dx-scheduler-form-recurrence-end-inputs',
              colSpan: 1,
              items: [
                {
                  itemType: 'empty',
                },
                {
                  itemType: 'simple',
                  name: 'until',
                  dataField: 'until',
                  editorType: 'dxDateBox',
                  label: {
                    visible: false,
                  },
                  editorOptions: {
                    type: 'date',
                    useMaskBehavior: true,
                    disabled: repeatType !== 'until',
                    calendarOptions: {
                      firstDayOfWeek: this.scheduler.getFirstDayOfWeek(),
                    },
                    onContentReady: (e): void => {
                      e.component.option('value', this._getUntilValue());
                    },
                    onValueChanged: (args): void => {
                      if (this._tempRecurrenceRule && this._tempRecurrenceRule.getRepeatEndRule() === 'until') {
                        const dateInTimeZone = this._formatUntilDate(new Date(args.value));
                        this._tempRecurrenceRule.makeRule('until', dateInTimeZone);
                      }
                    },
                    onFocusIn: (): void => {
                      const currentRepeatEnd = this._tempRecurrenceRule?.getRepeatEndRule();
                      if (currentRepeatEnd !== 'until') {
                        this._repeatEndValueChangedHandler({ value: 'until' });
                      }
                    },
                  } as DateBoxProperties,
                },
                {
                  itemType: 'simple',
                  name: 'count',
                  dataField: 'count',
                  editorType: 'dxNumberBox',
                  label: {
                    visible: false,
                  },
                  editorOptions: {
                    format: `# ${messageLocalization.format('dxScheduler-recurrenceRepeatCount')}`,
                    min: 1,
                    showSpinButtons: true,
                    useLargeSpinButtons: false,
                    disabled: repeatType !== 'count',
                    onContentReady: (e): void => {
                      const count = this._recurrenceRule.getRules().count || 1;
                      e.component.option('value', count);
                    },
                    onValueChanged: (args): void => {
                      if (this._tempRecurrenceRule && this._tempRecurrenceRule.getRepeatEndRule() === 'count') {
                        this._tempRecurrenceRule.makeRule('count', args.value);
                      }
                    },
                    onFocusIn: (): void => {
                      const currentRepeatEnd = this._tempRecurrenceRule?.getRepeatEndRule();
                      if (currentRepeatEnd !== 'count') {
                        this._repeatEndValueChangedHandler({ value: 'count' });
                      }
                    },
                  } as NumberBoxProperties,
                },
              ],
            },
          ],
        },
      ],
    } as GroupItem;
  }

  updateRecurrenceFormValues(): void {
    if (!this._tempRecurrenceRule) {
      return;
    }

    const rules = this._tempRecurrenceRule.getRules();

    this._isUpdatingEditors = true;

    try {
      const freqEditor = this.dxForm.getEditor('freq');
      if (freqEditor && rules.freq) {
        const freqValue = rules.freq.toLowerCase();
        freqEditor.option('value', freqValue);
        freqEditor.repaint();
      }

      const intervalEditor = this.dxForm.getEditor('interval');
      if (intervalEditor) {
        intervalEditor.option('value', rules.interval || 1);
      }

      const repeatEndEditor = this.dxForm.getEditor('repeatEnd');
      const repeatEndValue = this._tempRecurrenceRule.getRepeatEndRule();
      if (repeatEndEditor) {
        repeatEndEditor.option('value', repeatEndValue);
      }

      const untilEditor = this.dxForm.getEditor('until');
      const untilValue = this._getTempUntilValue();
      if (untilEditor) {
        untilEditor.option('value', untilValue);
      }

      const countEditor = this.dxForm.getEditor('count');
      if (countEditor) {
        countEditor.option('value', rules.count || 1);
      }

      this._updateRepeatEndInputsState(repeatEndValue);
    } finally {
      this._isUpdatingEditors = false;
    }
  }

  private _getTempUntilValue(): Date {
    if (!this._tempRecurrenceRule) {
      return this._formatUntilDate(new Date());
    }

    const untilDate = this._tempRecurrenceRule.getRules().until;

    if (!untilDate) {
      return this._formatUntilDate(new Date());
    }

    return new Date(untilDate);
  }

  private _repeatEndValueChangedHandler(args: any): void {
    const { value } = args;

    this._updateRepeatEndInputsState(value);

    if (!this._tempRecurrenceRule) {
      return;
    }

    if (value === 'until') {
      this._tempRecurrenceRule.makeRule(value, this._getTempUntilValue());
    }
    if (value === 'count') {
      const countEditor = this.dxForm.getEditor('count');
      this._tempRecurrenceRule.makeRule(value, countEditor?.option('value') || 1);
    }
    if (value === 'never') {
      this._tempRecurrenceRule.makeRule('count', '');
      this._tempRecurrenceRule.makeRule('until', '');
    }
  }

  private _updateRepeatEndInputsState(
    value: string = this._recurrenceRule.getRepeatEndRule(),
  ): void {
    if (!this.dxForm) {
      return;
    }

    const untilEditor = this.dxForm.getEditor('until');
    const countEditor = this.dxForm.getEditor('count');

    if (untilEditor) {
      untilEditor.option('disabled', value !== 'until');
    }
    if (countEditor) {
      countEditor.option('disabled', value !== 'count');
    }
  }

  private _formatUntilDate(date: Date): Date {
    const untilDate = this._recurrenceRule.getRules().until;
    const isSameDate = dateUtils.sameDate(untilDate, date);

    return untilDate && isSameDate
      ? date
      : dateUtils.setToDayEnd(date);
  }

  private _getUntilValue(): Date {
    const untilDate = this._recurrenceRule.getRules().until;

    if (!untilDate) {
      return this._formatUntilDate(new Date());
    }

    return new Date(untilDate);
  }

  private _daysOfWeekByRules(): string[] {
    const ruleToUse = this._tempRecurrenceRule ?? this._recurrenceRule;
    let daysByRule = ruleToUse.getDaysFromByDayRule();
    if (!daysByRule.length) {
      daysByRule = this._getDefaultByDayValue();
    }

    return daysByRule;
  }

  private _getDefaultByDayValue(): string[] {
    const { startDate } = this;
    if (!startDate) {
      return ['MO'];
    }
    const startDay = startDate.getDay();
    return [days[startDay]];
  }

  private _dayOfMonthByRules(): number {
    const ruleToUse = this._tempRecurrenceRule ?? this._recurrenceRule;
    const rules = ruleToUse.getRules();
    // eslint-disable-next-line spellcheck/spell-checker
    const byMonthDay = rules.bymonthday;

    if (!byMonthDay) {
      const { startDate } = this;
      return startDate?.getDate() ?? 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return byMonthDay;
  }

  private _monthOfYearByRules(): string {
    const ruleToUse = this._tempRecurrenceRule ?? this._recurrenceRule;
    const rules = ruleToUse.getRules();
    // eslint-disable-next-line spellcheck/spell-checker
    const byMonth = rules.bymonth;

    if (!byMonth) {
      const { startDate } = this;
      return String((startDate?.getMonth() ?? 0) + 1);
    }

    return String(byMonth);
  }

  updateRecurrenceRepeatOnVisibility(freq: string, previousFreq: string, force = false): void {
    if (freq !== previousFreq || force) {
      const recurrenceGroup = APPOINTMENT_FORM_GROUP_NAMES.Recurrence;

      this.dxForm.itemOption(`${recurrenceGroup}.byday`, 'visible', false);
      this.dxForm.itemOption(`${recurrenceGroup}.repeatOnMonthlyGroup`, 'visible', false);
      this.dxForm.itemOption(`${recurrenceGroup}.repeatOnYearlyGroup`, 'visible', false);

      if (!this._tempRecurrenceRule) {
        return;
      }

      if (freq === 'weekly') {
        this._tempRecurrenceRule.makeRule('byday', this._daysOfWeekByRules());
        this._tempRecurrenceRule.makeRule('bymonth', '');
        this._tempRecurrenceRule.makeRule('bymonthday', '');
        this.dxForm.itemOption(`${recurrenceGroup}.byday`, 'visible', true);
      }
      if (freq === 'monthly') {
        this._tempRecurrenceRule.makeRule('bymonthday', this._dayOfMonthByRules());
        this._tempRecurrenceRule.makeRule('bymonth', '');
        this._tempRecurrenceRule.makeRule('byday', '');
        this.dxForm.itemOption(`${recurrenceGroup}.repeatOnMonthlyGroup`, 'visible', true);
      }
      if (freq === 'yearly') {
        this._tempRecurrenceRule.makeRule('bymonthday', this._dayOfMonthByRules());
        this._tempRecurrenceRule.makeRule('bymonth', this._monthOfYearByRules());
        this._tempRecurrenceRule.makeRule('byday', '');
        this.dxForm.itemOption(`${recurrenceGroup}.repeatOnYearlyGroup`, 'visible', true);
      }
      if (freq === 'daily' || freq === 'hourly') {
        this._tempRecurrenceRule.makeRule('byday', '');
        this._tempRecurrenceRule.makeRule('bymonth', '');
        this._tempRecurrenceRule.makeRule('bymonthday', '');
      }

      const freqEditor = this.dxForm.getEditor('freq');
      if (freqEditor) {
        this._isUpdatingEditors = true;
        try {
          freqEditor.option('value', freq);
        } finally {
          this._isUpdatingEditors = false;
        }
      }
    }
  }

  private static createIconTemplate(iconName: string): () => void {
    return (): dxElementWrapper => $('<i>').addClass('dx-icon').addClass(`dx-icon-${iconName}`);
  }
}
