/* eslint-disable max-classes-per-file */
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import $, { type dxElementWrapper } from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import Button from '@js/ui/button';
import type { Properties as DateBoxProperties } from '@js/ui/date_box';
import type { GroupItem, SimpleItem } from '@js/ui/form';
import type dxForm from '@js/ui/form';
import type { Properties as NumberBoxProperties } from '@js/ui/number_box';
import type { Properties as RadioGroupProperties } from '@js/ui/radio_group';
import type { Properties as SelectBoxProperties } from '@js/ui/select_box';
import { capitalize } from '@ts/core/utils/capitalize';
import { dateSerialization } from '@ts/core/utils/m_date_serialization';

import type Scheduler from '../m_scheduler';
import { getRecurrenceString, parseRecurrenceRule } from '../recurrence/base';
import { daysFromByDayRule } from '../recurrence/days_from_by_day_rule';
import type { Rule } from '../recurrence/types';
import { getStartDateCommonConfig } from './utils';

const CLASSES = {
  groupWithIcon: 'dx-scheduler-form-group-with-icon',
  icon: 'dx-scheduler-form-icon',
  recurrenceStartDateGroup: 'dx-scheduler-form-recurrence-start-date-group',
  recurrenceRepeatEveryGroup: 'dx-scheduler-form-recurrence-repeat-every-group',
  recurrenceRepeatOnMonthlyGroup: 'dx-scheduler-form-recurrence-repeat-on-monthly-group',
  recurrenceRepeatOnYearlyGroup: 'dx-scheduler-form-recurrence-repeat-on-yearly-group',
  recurrenceEndGroup: 'dx-scheduler-form-recurrence-end-group',
  recurrenceEndContainer: 'dx-scheduler-form-recurrence-end-repeat-group',
  recurrenceByDayButtons: 'dx-scheduler-recurrence-byday-buttons',
  recurrenceGroupRoot: 'dx-scheduler-form-recurrence-group',
  recurrenceHidden: 'dx-scheduler-form-recurrence-hidden',
  recurrenceEndRadio: 'dx-scheduler-form-recurrence-end-radio',
  recurrenceEndInputs: 'dx-scheduler-form-recurrence-end-inputs',
  freqEditor: 'dx-scheduler-form-recurrence-freq-editor',
};

const frequenciesValues = [
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
].map((item) => ({
  text: capitalize(messageLocalization.format(item.recurrence)),
  value: item.value,
}));

const monthsValues = dateLocalization.getMonthNames().map((monthName, index) => ({
  value: index + 1,
  text: monthName,
}));

const weekDays = dateLocalization.getDayNames('short').map((dayName) => dayName.toUpperCase());

const weekDaysButtons = dateLocalization.getDayNames('short').map((dayName) => ({
  text: dayName[0],
  key: dayName,
}));

const FREQ = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

const RECURRENCE_GROUP_NAME = 'recurrenceGroup';

export class RecurrenceRule {
  private _recurrenceRule: Rule;

  constructor(rule: string) {
    this._recurrenceRule = parseRecurrenceRule(rule);
  }

  setRule(field: string, value: any): void {
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

  getRules(): Rule {
    return this._recurrenceRule;
  }

  getRule(field: string): any | undefined {
    return this._recurrenceRule[field];
  }

  getDaysFromByDayRule(): string[] {
    return daysFromByDayRule(this._recurrenceRule);
  }
}

/*
1. Use RecurrenceRule to store editor's value
2. Use RecurrentForm properties to store editor's value
3. Use formData
*/
export class RecurrentForm {
  private readonly scheduler: any;

  private _dxForm!: dxForm;

  private _recurrenceRule: RecurrenceRule;

  private _dayButtons?: Button[];

  private _tempRecurrenceRule?: RecurrenceRule;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
    this._recurrenceRule = new RecurrenceRule('');
  }

  private createByMonthDayNumberBoxItem(
    name: string,
    labelVisible: boolean,
  ): SimpleItem {
    return {
      itemType: 'simple',
      name,
      colSpan: 1,
      editorType: 'dxNumberBox',
      label: labelVisible
        ? { text: messageLocalization.format('dxScheduler-recurrenceRepeatOn') }
        : { visible: false },
      editorOptions: {
        min: 1,
        max: 31,
        format: '#',
        showSpinButtons: true,
        useLargeSpinButtons: false,
        onContentReady: (e): void => {
          e.component.option('value', this.recurrenceRule.getRule('bymonthday'));
        },
        onValueChanged: (e): void => {
          this.recurrenceRule.setRule('bymonthday', e.value);
        },
      } as NumberBoxProperties,
    } as SimpleItem;
  }

  private createByMonthSelectBoxItem(): SimpleItem {
    return {
      itemType: 'simple',
      name: 'bymonth',
      colSpan: 1,
      editorType: 'dxSelectBox',
      label: {
        text: messageLocalization.format('dxScheduler-recurrenceRepeatEvery'),
      },
      editorOptions: {
        items: monthsValues,
        displayExpr: 'text',
        valueExpr: 'value',
        onContentReady: (e): void => {
          e.component.option('value', this.recurrenceRule.getRule('bymonth'));
        },
        onValueChanged: (e): void => {
          this.recurrenceRule.setRule('bymonth', e.value);
        },
      } as SelectBoxProperties,
    } as SimpleItem;
  }

  private renderByDayButtons(
    itemsButtonGroup: { text: string; key: string }[],
    itemElement: any,
  ): void {
    const container = $('<div>')
      .addClass(CLASSES.recurrenceByDayButtons)
      .appendTo(itemElement);

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

      this._tempRecurrenceRule.setRule('byday', newByDay);

      this._dayButtons?.forEach((btn) => {
        const key = buttonKeyMap.get(btn);
        const selected = key ? newByDay.includes(key) : false;
        btn.option('stylingMode', selected ? 'contained' : 'outlined');
        btn.option('type', selected ? 'default' : 'normal');
      });
    };

    itemsButtonGroup.forEach((item) => {
      const isSelected = this.recurrenceRule.getRule('byDay').includes(item.key);
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
          // change button style
          // recurrenceRule.getDaysFromByDayRule().includes(item.key);
          // recurrenceRule.getRules().byday.filter()
          // recurrenceRule.getRules().byday.push()

          const currentByDay = this._daysOfWeekByRules();
          const isCurrentlySelected = currentByDay.includes(item.key);
          updateByDay(item.key, !isCurrentlySelected);
        },
      });

      this._dayButtons?.push(button);
      buttonKeyMap.set(button, item.key);
    });
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
    const { startDateExpr } = this.scheduler.getDataAccessors().expr;
    const value = this.dxForm.option('formData')[startDateExpr];

    return value ? new Date(dateSerialization.deserializeDate(value)) : null;
  }

  createRecurrenceFormGroup(): GroupItem {
    return {
      name: RECURRENCE_GROUP_NAME,
      itemType: 'group',
      cssClass: `${CLASSES.recurrenceGroupRoot} ${CLASSES.recurrenceHidden}`,
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
        extend(
          true,
          getStartDateCommonConfig(this.scheduler.getFirstDayOfWeek()),
          {
            name: 'recurrenceStartDate',
            label: {
              text: messageLocalization.format('dxScheduler-editorLabelStartDate'),
            },
            editorOptions: {
              onContentReady: (e): void => {
                e.component.option('value', this.startDate);
              },
              onValueChanged: (e): void => {
                this.dxForm.getEditor('startDateEditor')?.option('value', e.value);
              },
            } as unknown as DateBoxProperties,
          },
        ) as SimpleItem,
      ],
    } as GroupItem;
  }

  private createRecurrenceRepeatEveryGroup(): GroupItem {
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
              colSpan: 1,
              editorType: 'dxNumberBox',
              label: {
                text: messageLocalization.format('dxScheduler-recurrenceRepeatEvery'),
              },
              editorOptions: {
                format: '#',
                min: 1,
                showSpinButtons: true,
                useLargeSpinButtons: false,
                onContentReady: (e): void => {
                  e.component.option('value', this.recurrenceRule.getRule('interval'));
                },
                onValueChanged: (e): void => {
                  this.recurrenceRule.setRule('interval', e.value);
                },
              } as NumberBoxProperties,
            },
            {
              itemType: 'simple',
              name: 'freq',
              cssClass: CLASSES.freqEditor,
              colSpan: 1,
              editorType: 'dxSelectBox',
              label: {
                visible: false,
              },
              editorOptions: {
                items: frequenciesValues,
                valueExpr: 'value',
                displayExpr: 'text',
                onContentReady: (e): void => {
                  e.component.option('value', this.recurrenceRule.getRule('freq'));
                },
                onValueChanged: (e): void => {
                  const previousValue = this.recurrenceRule.getRule('freq');

                  if (previousValue === e.value) {
                    return;
                  }

                  this.recurrenceRule.setRule('freq', e.value);
                  this.updateRecurrenceRepeatOnVisibility();
                },
              } as SelectBoxProperties,
            },
            {
              ...this.createRecurrenceByDayEditor(),
              colSpan: 2,
            },
            {
              ...this.createRecurrenceRepeatOnMonthlyGroup(),
              colSpan: 2,
            },
            {
              ...this.createRecurrenceRepeatOnYearlyGroup(),
              colSpan: 2,
            },
          ],
        },
      ],
    } as GroupItem;
  }

  private createRecurrenceRepeatOnMonthlyGroup(): GroupItem {
    return {
      itemType: 'group',
      name: 'repeatOnMonthlyGroup',
      cssClass: CLASSES.recurrenceRepeatOnMonthlyGroup,
      colCount: 1,
      items: [
        this.createByMonthDayNumberBoxItem('bymonthday', true),
      ],
    } as GroupItem;
  }

  private createRecurrenceRepeatOnYearlyGroup(): GroupItem {
    return {
      itemType: 'group',
      name: 'repeatOnYearlyGroup',
      cssClass: CLASSES.recurrenceRepeatOnYearlyGroup,
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        this.createByMonthSelectBoxItem(),
        // TODO: move editor name to constant EDITOR_NAME
        this.createByMonthDayNumberBoxItem('bymonthdayYearly', false),
      ],
    } as GroupItem;
  }

  private createRecurrenceByDayEditor(): SimpleItem {
    const firstDayOfWeek = this.scheduler.getFirstDayOfWeek();

    const buttonGroupItems = weekDaysButtons
      .slice(firstDayOfWeek)
      .concat(weekDaysButtons.slice(0, firstDayOfWeek));

    return {
      itemType: 'simple',
      name: 'byday', // todo: better to move such constants to constant variables and reuse them in the code
      colSpan: 1,
      label: {
        visible: false,
      },
      template: (_, itemElement): void => {
        this.renderByDayButtons(buttonGroupItems, itemElement);
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
              editorType: 'dxRadioGroup',
              cssClass: CLASSES.recurrenceEndRadio,
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
              cssClass: CLASSES.recurrenceEndInputs,
              colSpan: 1,
              items: [
                {
                  itemType: 'empty',
                },
                {
                  itemType: 'simple',
                  name: 'until',
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
                        this._tempRecurrenceRule.setRule('until', dateInTimeZone);
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
                      const count = this._recurrenceRule.getRules().count ?? 1;
                      e.component.option('value', count);
                    },
                    onValueChanged: (args): void => {
                      if (this._tempRecurrenceRule && this._tempRecurrenceRule.getRepeatEndRule() === 'count') {
                        this._tempRecurrenceRule.setRule('count', args.value);
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

  updateRecurrenceFormValues(repeatEditorValue: string, recurrenceRuleRaw: string | null): void {
    this.recurrenceRule = this.createRecurrenceRule(repeatEditorValue, recurrenceRuleRaw);
    const rules = this.recurrenceRule.getRules();
    const repeatEndValue = this.recurrenceRule.getRepeatEndRule();

    this.dxForm.getEditor('recurrenceStartDate')?.option('value', this.startDate);
    this.dxForm.getEditor('freq')?.option('value', repeatEditorValue);
    this.dxForm.getEditor('interval')?.option('value', rules.interval);
    this.dxForm.getEditor('repeatEnd')?.option('value', repeatEndValue);
    this.dxForm.getEditor('until')?.option('value', rules.until);
    this.dxForm.getEditor('count')?.option('value', rules.count);

    this._updateDisabledRepeatEndEditors(repeatEndValue);
    this.updateRecurrenceRepeatOnVisibility();
  }

  private createRecurrenceRule(
    repeatEditorValue: string,
    recurrenceRuleRaw: string | null,
  ) {
    const recurrenceRule = new RecurrenceRule(recurrenceRuleRaw ?? '');
    const recurrenceFreq = recurrenceRule?.getRules().freq?.toLowerCase();

    if (recurrenceFreq !== repeatEditorValue) {
      const todayEnd = dateUtils.setToDayEnd(new Date());
      const newRecurrenceRule = new RecurrenceRule('');
      const defaultByDay = weekDays[this.startDate?.getDay() ?? this.scheduler.getFirstDayOfWeek()];

      newRecurrenceRule.setRule('freq', repeatEditorValue);
      newRecurrenceRule.setRule('interval', 1);
      newRecurrenceRule.setRule('repeatEnd', 'never'); // TODO: change 'never' to constant variable
      newRecurrenceRule.setRule('until', todayEnd);
      newRecurrenceRule.setRule('count', 1);
      newRecurrenceRule.setRule('byday', [defaultByDay]);
      newRecurrenceRule.setRule('bymonth', (this.startDate?.getMonth() ?? 0) + 1);
      newRecurrenceRule.setRule('bymonthday', this.startDate?.getDate() ?? 1);

      return newRecurrenceRule;
    }

    return recurrenceRule;
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

    this._updateDisabledRepeatEndEditors(value);

    if (!this._tempRecurrenceRule) {
      return;
    }

    if (value === 'until') {
      this._tempRecurrenceRule.setRule(value, this._getTempUntilValue());
    }
    if (value === 'count') {
      const countEditor = this.dxForm.getEditor('count');
      this._tempRecurrenceRule.setRule(value, countEditor?.option('value') || 1);
    }
    if (value === 'never') {
      this._tempRecurrenceRule.setRule('count', '');
      this._tempRecurrenceRule.setRule('until', '');
    }
  }

  private _updateDisabledRepeatEndEditors(repeatEndValue: string): void {
    const untilEditor = this.dxForm.getEditor('until');
    const countEditor = this.dxForm.getEditor('count');

    untilEditor?.option('disabled', repeatEndValue !== 'until');
    countEditor?.option('disabled', repeatEndValue !== 'count');
  }

  private _formatUntilDate(date: Date): Date {
    return dateUtils.setToDayEnd(date);
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
    return [weekDays[startDay]];
  }

  private updateRecurrenceRepeatOnVisibility(): void {
    const freq = this.recurrenceRule.getRule('freq');

    this.dxForm.beginUpdate();

    this.dxForm.itemOption(`${RECURRENCE_GROUP_NAME}.byday`, 'visible', false);
    this.dxForm.itemOption(`${RECURRENCE_GROUP_NAME}.repeatOnMonthlyGroup`, 'visible', false);
    this.dxForm.itemOption(`${RECURRENCE_GROUP_NAME}.repeatOnYearlyGroup`, 'visible', false);

    switch (freq) {
      case FREQ.WEEKLY:
        this.dxForm.itemOption(`${RECURRENCE_GROUP_NAME}.byday`, 'visible', true);
        break;
      case FREQ.MONTHLY:
        this.dxForm.itemOption(`${RECURRENCE_GROUP_NAME}.repeatOnMonthlyGroup`, 'visible', true);
        break;
      case FREQ.YEARLY:
        this.dxForm.itemOption(`${RECURRENCE_GROUP_NAME}.repeatOnYearlyGroup`, 'visible', true);
        break;
      default:
        break;
    }

    this.dxForm.endUpdate();
  }

  // TODO: move to utils, reuse in main form and in recurrence form
  private static createIconTemplate(iconName: string): () => void {
    return (): dxElementWrapper => $('<i>').addClass('dx-icon').addClass(`dx-icon-${iconName}`);
  }
}
