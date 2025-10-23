/* eslint-disable max-classes-per-file */
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import $, { type dxElementWrapper } from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import type dxButton from '@js/ui/button';
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
import { createFormIconTemplate, getStartDateCommonConfig, RecurrenceRule } from './utils';

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
  // todo: check if it works with runtime localization change
  text: capitalize(messageLocalization.format(item.recurrence)),
  value: item.value,
}));

const monthsValues = dateLocalization.getMonthNames().map((monthName, index) => ({
  value: index + 1,
  text: monthName,
}));

const FREQ = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

const weekDays = dateLocalization.getDayNames('abbreviated').map((dayName) => dayName.slice(0, 2).toUpperCase());

const RECURRENCE_GROUP_NAME = 'recurrenceGroup';

export class RecurrentForm {
  private readonly scheduler: any;

  private _dxForm!: dxForm;

  private _recurrenceRule: RecurrenceRule;

  private _tempRecurrenceRule?: RecurrenceRule;

  private readonly weekDayItems: { text: string; key: string }[] = [];

  private _weekDayButtons: Record<string, dxButton> = {};

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
    this._recurrenceRule = new RecurrenceRule('');
    this.weekDayItems = this.createWeekDayItems();
  }

  private createWeekDayItems(): { text: string; key: string }[] {
    const weekDayItems = weekDays.map((day) => ({
      text: day[0],
      key: day,
    }));

    const firstDayOfWeek = this.scheduler.getFirstDayOfWeek()
      ?? dateLocalization.firstDayOfWeekIndex();

    const arrangeWeekDayItems = weekDayItems
      .slice(firstDayOfWeek)
      .concat(weekDayItems.slice(0, firstDayOfWeek));

    return arrangeWeekDayItems;
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
          e.component.option('value', parseInt(this.recurrenceRule.getRule('bymonthday')?.toString() ?? '1', 10));
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
          template: createFormIconTemplate('clock'),
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
          template: createFormIconTemplate('repeat'),
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
                  e.component.option('value', parseInt(this.recurrenceRule.getRule('interval')?.toString() ?? '1', 10));
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
    return {
      name: 'byday', // todo: better to move such constants to constant variables and reuse them in the code
      colSpan: 1,
      label: {
        visible: false,
      },
      template: (): dxElementWrapper => {
        const $container = $('<div>').addClass(CLASSES.recurrenceByDayButtons);

        this.weekDayItems.forEach((item) => {
          const buttonContainer = $('<div>').appendTo($container);

          this._weekDayButtons[item.key] = this.scheduler.createComponent(buttonContainer, Button, {
            text: item.text,
            width: 32,
            height: 32,
            onClick: (): void => {
              // TODO: we do not need to parse and serialize 'byday' string every time
              const selectedWeekDays = this.recurrenceRule.getDaysFromByDayRule();
              const isSelected = selectedWeekDays.includes(item.key);

              if (isSelected) {
                selectedWeekDays.splice(selectedWeekDays.indexOf(item.key), 1);
              } else {
                selectedWeekDays.push(item.key);
              }

              this.recurrenceRule.setRule('byday', selectedWeekDays.toString());

              this.updateWeekDaysButtons();
            },
          });
        });

        return $container;
      },
    } as SimpleItem;
  }

  private createRecurrenceEndGroup(): GroupItem {
    const repeatType = this._recurrenceRule.getRepeatEndRule();

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
          template: createFormIconTemplate('description'),
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
                valueExpr: 'type',
                items: [
                  { text: messageLocalization.format('dxScheduler-recurrenceNever'), type: 'never' },
                  { text: messageLocalization.format('dxScheduler-recurrenceOn'), type: 'until' },
                  { text: messageLocalization.format('dxScheduler-recurrenceAfter'), type: 'count' },
                ],
                layout: 'vertical',
                onContentReady: (e): void => {
                  e.component.option('value', this.recurrenceRule.getRepeatEndRule());
                },
                onValueChanged: (e): void => {
                  this._repeatEndValueChangedHandler(e.value);
                },
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
                      e.component.option('value', this.recurrenceRule.getUntilValue() ?? dateUtils.setToDayEnd(new Date()));
                    },
                    onValueChanged: (e): void => {
                      this.recurrenceRule.setRule('until', e.value);
                      this.recurrenceRule.setUntilValue(e.value);
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
                      const count = this.recurrenceRule.getCountValue() ?? 1;
                      e.component.option('value', count);
                    },
                    onValueChanged: (e): void => {
                      this.recurrenceRule.setRule('count', e.value);
                      this.recurrenceRule.setCountValue(e.value);
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

    this.dxForm.getEditor('recurrenceStartDate')?.option('value', this.startDate);
    this.dxForm.getEditor('freq')?.option('value', repeatEditorValue);
    this.dxForm.getEditor('interval')?.option('value', rules.interval);
    this.dxForm.getEditor('repeatEnd')?.option('value', this.recurrenceRule.getRepeatEndRule());
    this.dxForm.getEditor('until')?.option('value', this.recurrenceRule.getUntilValue());
    this.dxForm.getEditor('count')?.option('value', this.recurrenceRule.getCountValue());

    this._updateDisabledRepeatEndEditors();
    this.updateRecurrenceRepeatOnVisibility();
    this.updateWeekDaysButtons();
  }

  private createRecurrenceRule(
    repeatEditorValue: string,
    recurrenceRuleRaw: string | null,
  ) {
    const recurrenceRule = new RecurrenceRule(recurrenceRuleRaw ?? '');
    const recurrenceFreq = recurrenceRule?.getRules().freq?.toLowerCase();

    if (recurrenceFreq !== repeatEditorValue) {
      // const todayEnd = dateUtils.setToDayEnd(new Date());
      const newRecurrenceRule = new RecurrenceRule('');
      const defaultByDay = weekDays[this.startDate?.getDay() ?? this.scheduler.getFirstDayOfWeek()];

      newRecurrenceRule.setRule('freq', repeatEditorValue);
      newRecurrenceRule.setRule('interval', 1);
      // newRecurrenceRule.setRule('repeatEnd', 'never'); // TODO: change 'never' to constant variable
      newRecurrenceRule.setUntilValue(dateUtils.setToDayEnd(new Date()));
      newRecurrenceRule.setCountValue(1);
      newRecurrenceRule.setRule('byday', defaultByDay);
      newRecurrenceRule.setRule('bymonth', (this.startDate?.getMonth() ?? 0) + 1);
      newRecurrenceRule.setRule('bymonthday', this.startDate?.getDate() ?? 1);

      return newRecurrenceRule;
    }

    return recurrenceRule;
  }

  private _repeatEndValueChangedHandler(value: string): void {
    if (value === 'until') {
      this.recurrenceRule.setRule('until', this.recurrenceRule.getUntilValue() ?? dateUtils.setToDayEnd(new Date()));
      this.recurrenceRule.setUntilValue(this.recurrenceRule.getUntilValue()
      ?? dateUtils.setToDayEnd(new Date()));
    }
    if (value === 'count') {
      this.recurrenceRule.setRule('count', this.recurrenceRule.getCountValue() ?? 1);
      this.recurrenceRule.setCountValue(this.recurrenceRule.getCountValue() ?? 1);
    }
    if (value === 'never') {
      this.recurrenceRule.setRule('count', '');
      this.recurrenceRule.setRule('until', '');
    }

    this._updateDisabledRepeatEndEditors();
  }

  private _updateDisabledRepeatEndEditors(): void {
    const repeatEndValue = this.recurrenceRule.getRepeatEndRule();

    const untilEditor = this.dxForm.getEditor('until');
    const countEditor = this.dxForm.getEditor('count');

    untilEditor?.option('disabled', repeatEndValue !== 'until');
    countEditor?.option('disabled', repeatEndValue !== 'count');
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

  private updateWeekDaysButtons(): void {
    Object.entries(this._weekDayButtons).forEach(([dayKey, button]) => {
      const isSelected = this.recurrenceRule.getDaysFromByDayRule().includes(dayKey);

      button.option('stylingMode', isSelected ? 'contained' : 'outlined');
      button.option('type', isSelected ? 'default' : 'normal');
    });
  }
}
