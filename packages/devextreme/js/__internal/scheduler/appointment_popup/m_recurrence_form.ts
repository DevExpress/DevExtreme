import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import $, { type dxElementWrapper } from '@js/core/renderer';
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

import type Scheduler from '../m_scheduler';
import { createFormIconTemplate, getStartDateCommonConfig, RecurrenceRule } from './utils';

const CLASSES = {
  groupWithIcon: 'dx-scheduler-form-group-with-icon',
  formIcon: 'dx-scheduler-form-icon',

  recurrenceGroup: 'dx-scheduler-form-recurrence-group',
  recurrenceHidden: 'dx-scheduler-form-recurrence-group-hidden',

  recurrenceStartDateEditor: 'dx-scheduler-form-recurrence-start-date-editor',
  frequencyEditor: 'dx-scheduler-form-recurrence-frequency-editor',
  byMonthEditor: 'dx-scheduler-form-recurrence-by-month-editor',
  dayOfMonthEditor: 'dx-scheduler-form-day-of-month-editor',
  countEditor: 'dx-scheduler-form-recurrence-count-editor',
  daysOfWeekButtons: 'dx-scheduler-days-of-week-buttons',
  dayOfMonthGroup: 'dx-scheduler-form-day-of-month-group',
  dayOfYearGroup: 'dx-scheduler-form-day-of-year-group',

  recurrenceEndGroup: 'dx-scheduler-form-recurrence-end-group',
  recurrenceEndEditors: 'dx-scheduler-form-recurrence-end-editors',
  recurrenceSettingsGroup: 'dx-scheduler-form-recurrence-settings-group',
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

const EDITOR_NAMES = {
  recurrenceStartDateEditor: 'recurrenceStartDateEditor',
  recurrenceCountEditor: 'recurrenceCountEditor',
  recurrencePeriodEditor: 'recurrencePeriodEditor',
  recurrenceDayOfYearMonthEditor: 'recurrenceDayOfYearMonthEditor',
  recurrenceDayOfMonthEditor: 'recurrenceDayOfMonthEditor',
  recurrenceDayOfYearDayEditor: 'recurrenceDayOfYearDayEditor',
  recurrenceEndEditor: 'recurrenceEndEditor',
  recurrenceRepeatEndEditor: 'recurrenceRepeatEndEditor',
  recurrenceEndUntilEditor: 'recurrenceEndUntilEditor',
  recurrenceEndCountEditor: 'recurrenceEndCountEditor',
  recurrenceEndSpacer: 'recurrenceEndSpacer',
};

const GROUP_NAMES = {
  recurrenceStartDateGroup: 'recurrenceStartDateGroup',
  recurrenceRuleGroup: 'recurrenceRuleGroup',
  recurrencePatternGroup: 'recurrencePatternGroup',
  recurrenceRuleRepeatGroup: 'recurrenceRuleRepeatGroup',
  recurrenceEndGroup: 'recurrenceEndGroup',
  recurrenceDaysOfWeekEditor: 'recurrenceDaysOfWeekEditor',
  recurrenceDayOfYearGroup: 'recurrenceDayOfYearGroup',
  recurrenceEndEditorsGroup: 'recurrenceEndEditorsGroup',
};

const ICON_NAMES = {
  recurrenceStartDateIcon: 'recurrenceStartDateIcon',
  recurrenceRuleIcon: 'recurrenceRuleIcon',
  recurrenceEndIcon: 'recurrenceEndIcon',
};

const weekDays = dateLocalization.getDayNames('abbreviated').map((dayName) => dayName.slice(0, 2).toUpperCase());

const RECURRENCE_GROUP_NAME = 'recurrenceGroup';

export class RecurrenceForm {
  recurrenceRule: RecurrenceRule = new RecurrenceRule('', new Date());

  private readonly scheduler: any;

  private _dxForm?: dxForm;

  private readonly weekDayItems: { text: string; key: string }[] = [];

  private _weekDayButtons: Record<string, dxButton> = {};

  private _readOnly = false;

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler;
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
      cssClass: CLASSES.dayOfMonthEditor,
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
          e.component.option('value', this.recurrenceRule.byMonthDay ?? undefined);
        },
        onValueChanged: (e): void => {
          this.recurrenceRule.byMonthDay = e.value;
        },
      } as NumberBoxProperties,
    } as SimpleItem;
  }

  get dxForm(): dxForm {
    return this._dxForm as dxForm;
  }

  set dxForm(value: dxForm | undefined) {
    this._dxForm = value;
  }

  setReadOnly(value: boolean): void {
    this._readOnly = value;
  }

  createRecurrenceFormGroup(): GroupItem {
    return {
      name: RECURRENCE_GROUP_NAME,
      itemType: 'group',
      cssClass: `${CLASSES.recurrenceGroup} ${CLASSES.recurrenceHidden}`,
      colSpan: 1,
      items: [
        this.createRecurrenceStartDateGroup(),
        this.createRecurrenceSettingsGroup(),
        this.createRecurrenceEndGroup(),
      ],
    } as GroupItem;
  }

  private createRecurrenceStartDateGroup(): GroupItem {
    return {
      name: GROUP_NAMES.recurrenceStartDateGroup,
      itemType: 'group',
      cssClass: CLASSES.groupWithIcon,
      items: [
        {
          name: ICON_NAMES.recurrenceStartDateIcon,
          colSpan: 1,
          cssClass: CLASSES.formIcon,
          template: createFormIconTemplate('clock'),
        },
        extend(
          true,
          getStartDateCommonConfig(this.scheduler.getFirstDayOfWeek()),
          {
            name: EDITOR_NAMES.recurrenceStartDateEditor,
            cssClass: CLASSES.recurrenceStartDateEditor,
            label: {
              text: messageLocalization.format('dxScheduler-editorLabelStartDate'),
            },
            editorOptions: {
              onContentReady: (e): void => {
                e.component.option('value', this.recurrenceRule.startDate);
              },
              onValueChanged: (e): void => {
                this.recurrenceRule.startDate = e.value;
              },
            } as DateBoxProperties,
          },
        ) as SimpleItem,
      ],
    } as GroupItem;
  }

  private createRecurrenceSettingsGroup(): GroupItem {
    return {
      itemType: 'group',
      name: GROUP_NAMES.recurrenceRuleGroup,
      cssClass: `${CLASSES.recurrenceSettingsGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          name: ICON_NAMES.recurrenceRuleIcon,
          colSpan: 1,
          cssClass: CLASSES.formIcon,
          template: createFormIconTemplate('repeat'),
        },
        {
          itemType: 'group',
          name: GROUP_NAMES.recurrencePatternGroup,
          colSpan: 1,
          colCount: 1,
          colCountByScreen: {
            xs: 1,
          },
          items: [
            this.createRecurrenceRuleGroup(),
            this.createDaysOfWeekGroup(),
            this.createDayOfMonthGroup(),
            this.createDayOfYearGroup(),
          ],
        },
      ],
    } as GroupItem;
  }

  private createRecurrenceRuleGroup(): GroupItem {
    // Change of frequency editor's value causes rerender of the recurrencePatternGroup.
    // To prevent focus loss in this editor, we use this flag.
    let needRestoreFrequencyEditorFocus = false;

    return {
      itemType: 'group',
      name: GROUP_NAMES.recurrenceRuleRepeatGroup,
      colSpan: 1,
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        {
          itemType: 'simple',
          name: EDITOR_NAMES.recurrenceCountEditor,
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
              e.component.option('value', this.recurrenceRule.interval);
            },
            onValueChanged: (e): void => {
              this.recurrenceRule.interval = e.value;
            },
          } as NumberBoxProperties,
        },
        {
          itemType: 'simple',
          name: EDITOR_NAMES.recurrencePeriodEditor,
          cssClass: CLASSES.frequencyEditor,
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
              e.component.option('value', this.recurrenceRule.frequency);

              if (needRestoreFrequencyEditorFocus) {
                setTimeout(() => {
                  e.component.focus();
                  needRestoreFrequencyEditorFocus = false;
                });
              }
            },
            onValueChanged: (e): void => {
              const previousValue = this.recurrenceRule.frequency;

              if (previousValue === e.value) {
                return;
              }

              if (e.event) {
                needRestoreFrequencyEditorFocus = true;
              }

              this.recurrenceRule.frequency = e.value;
              this.updateDayEditorsVisibility();
            },
          } as SelectBoxProperties,
        },
      ],
    };
  }

  private createDaysOfWeekGroup(): SimpleItem {
    return {
      name: GROUP_NAMES.recurrenceDaysOfWeekEditor,
      colSpan: 1,
      cssClass: 'dx-field-item-has-group',
      label: {
        visible: false,
      },
      template: (): dxElementWrapper => {
        const $container = $('<div>').addClass(CLASSES.daysOfWeekButtons);

        this.weekDayItems.forEach((item) => {
          const buttonContainer = $('<div>').appendTo($container);

          this._weekDayButtons[item.key]?.dispose();
          this._weekDayButtons[item.key] = this.scheduler.createComponent(buttonContainer, Button, {
            text: item.text,
            disabled: this._readOnly,
            onContentReady: (e): void => {
              $(e.element).removeClass('dx-button-has-text');

              const isSelected = this.recurrenceRule.byDay.includes(item.key);

              e.component.option('stylingMode', isSelected ? 'contained' : 'outlined');
              e.component.option('type', isSelected ? 'default' : 'normal');
            },
            onClick: (e): void => {
              const isSelected = this.recurrenceRule.byDay.includes(item.key);

              if (isSelected) {
                const index = this.recurrenceRule.byDay.indexOf(item.key);

                this.recurrenceRule.byDay.splice(index, 1);
                e.component.option('stylingMode', 'outlined');
                e.component.option('type', 'normal');
              } else {
                this.recurrenceRule.byDay.push(item.key);
                e.component.option('stylingMode', 'contained');
                e.component.option('type', 'default');
              }
            },
          });
        });

        return $container;
      },
    } as SimpleItem;
  }

  private createDayOfMonthGroup(): SimpleItem {
    return {
      ...this.createByMonthDayNumberBoxItem(EDITOR_NAMES.recurrenceDayOfMonthEditor, true),
      cssClass: `${CLASSES.dayOfMonthEditor} ${CLASSES.dayOfMonthGroup}`,
    };
  }

  private createDayOfYearGroup(): GroupItem {
    return {
      itemType: 'group',
      name: GROUP_NAMES.recurrenceDayOfYearGroup,
      cssClass: CLASSES.dayOfYearGroup,
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        {
          itemType: 'simple',
          name: EDITOR_NAMES.recurrenceDayOfYearMonthEditor,
          colSpan: 1,
          cssClass: CLASSES.byMonthEditor,
          editorType: 'dxSelectBox',
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceRepeatEvery'),
          },
          editorOptions: {
            items: monthsValues,
            displayExpr: 'text',
            valueExpr: 'value',
            onContentReady: (e): void => {
              e.component.option('value', this.recurrenceRule.byMonth);
            },
            onValueChanged: (e): void => {
              this.recurrenceRule.byMonth = e.value;
            },
          } as SelectBoxProperties,
        } as SimpleItem,
        this.createByMonthDayNumberBoxItem(EDITOR_NAMES.recurrenceDayOfYearDayEditor, false),
      ],
    } as GroupItem;
  }

  private createRecurrenceEndGroup(): GroupItem {
    return {
      name: GROUP_NAMES.recurrenceEndGroup,
      itemType: 'group',
      cssClass: `${CLASSES.groupWithIcon} ${CLASSES.recurrenceEndGroup}`,
      items: [
        {
          name: ICON_NAMES.recurrenceEndIcon,
          colSpan: 1,
          cssClass: CLASSES.formIcon,
          template: createFormIconTemplate('description'),
        },
        {
          itemType: 'group',
          name: EDITOR_NAMES.recurrenceEndEditor,
          colSpan: 1,
          colCount: 2,
          colCountByScreen: { xs: 2 },
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceEnd'),
          },
          items: [
            this.createRecurrenceEndRadioGroup(),
            this.createRecurrenceEndEditors(),
          ],
        },
      ],
    } as GroupItem;
  }

  private createRecurrenceEndRadioGroup(): SimpleItem {
    return {
      itemType: 'simple',
      name: EDITOR_NAMES.recurrenceRepeatEndEditor,
      colSpan: 1,
      editorType: 'dxRadioGroup',
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
          e.component.option('value', this.recurrenceRule.repeatEnd);
        },
        onValueChanged: (e): void => {
          this.recurrenceRule.repeatEnd = e.value;
          this.updateRepeatEndEditors();
        },
      } as RadioGroupProperties,
    } as SimpleItem;
  }

  private createRecurrenceEndEditors(): GroupItem {
    return {
      itemType: 'group',
      name: GROUP_NAMES.recurrenceEndEditorsGroup,
      cssClass: CLASSES.recurrenceEndEditors,
      colSpan: 1,
      items: [
        {
          itemType: 'empty',
          name: EDITOR_NAMES.recurrenceEndSpacer,
        },
        {
          itemType: 'simple',
          name: EDITOR_NAMES.recurrenceEndUntilEditor,
          label: {
            visible: false,
          },
          editorType: 'dxDateBox',
          editorOptions: {
            type: 'date',
            useMaskBehavior: true,
            calendarOptions: {
              firstDayOfWeek: this.scheduler.getFirstDayOfWeek(),
            },
            inputAttr: {
              'aria-label': messageLocalization.format('dxScheduler-recurrenceUntilDateLabel'),
            },
            onContentReady: (e): void => {
              const repeatEndValue = this.recurrenceRule.repeatEnd;
              e.component.option('value', this.recurrenceRule.until);
              e.component.option('disabled', repeatEndValue !== 'until');
            },
            onValueChanged: (e): void => {
              this.recurrenceRule.until = e.value;
            },
          } as DateBoxProperties,
        },
        {
          itemType: 'simple',
          name: EDITOR_NAMES.recurrenceEndCountEditor,
          cssClass: CLASSES.countEditor,
          label: {
            visible: false,
          },
          editorType: 'dxNumberBox',
          editorOptions: {
            format: `# ${messageLocalization.format('dxScheduler-recurrenceRepeatCount')}`,
            min: 1,
            showSpinButtons: true,
            useLargeSpinButtons: false,
            inputAttr: {
              'aria-label': messageLocalization.format('dxScheduler-recurrenceOccurrenceLabel'),
            },
            onContentReady: (e): void => {
              const repeatEndValue = this.recurrenceRule.repeatEnd;
              e.component.option('value', this.recurrenceRule.count ?? undefined);
              e.component.option('disabled', repeatEndValue !== 'count');
            },
            onValueChanged: (e): void => {
              this.recurrenceRule.count = e.value;
            },
          } as NumberBoxProperties,
        },
      ],
    } as GroupItem;
  }

  updateRecurrenceFormValues(
    recurrenceRuleRaw: string | null,
    startDate: Date | null,
  ): void {
    this.recurrenceRule = this.createRecurrenceRule(
      recurrenceRuleRaw,
      startDate,
    );

    this.dxForm.getEditor(EDITOR_NAMES.recurrenceStartDateEditor)?.option('value', this.recurrenceRule.startDate);
    this.dxForm.getEditor(EDITOR_NAMES.recurrencePeriodEditor)?.option('value', this.recurrenceRule.frequency);
    this.dxForm.getEditor(EDITOR_NAMES.recurrenceCountEditor)?.option('value', this.recurrenceRule.interval);
    this.dxForm.getEditor(EDITOR_NAMES.recurrenceRepeatEndEditor)?.option('value', this.recurrenceRule.repeatEnd);
    this.dxForm.getEditor(EDITOR_NAMES.recurrenceEndUntilEditor)?.option('value', this.recurrenceRule.until);
    this.dxForm.getEditor(EDITOR_NAMES.recurrenceEndCountEditor)?.option('value', this.recurrenceRule.count);

    this.updateRepeatEndEditors();
    this.updateDayEditorsVisibility();
  }

  private createRecurrenceRule(
    recurrenceRuleRaw: string | null,
    startDate: Date | null,
  ): RecurrenceRule {
    const recurrenceRule = new RecurrenceRule(recurrenceRuleRaw ?? '', startDate);

    if (recurrenceRule.byDay.length === 0) {
      const defaultByDay = [
        weekDays[startDate?.getDay() ?? this.scheduler.getFirstDayOfWeek()],
      ];

      recurrenceRule.byDay = defaultByDay;
    }

    return recurrenceRule;
  }

  private updateRepeatEndEditors(): void {
    const repeatEndValue = this.recurrenceRule.repeatEnd;

    const untilEditor = this.dxForm.getEditor(EDITOR_NAMES.recurrenceEndUntilEditor);
    const countEditor = this.dxForm.getEditor(EDITOR_NAMES.recurrenceEndCountEditor);

    untilEditor?.option('disabled', repeatEndValue !== 'until');
    countEditor?.option('disabled', repeatEndValue !== 'count');
  }

  private updateDayEditorsVisibility(): void {
    const recurrencePatternGroupPath = `${RECURRENCE_GROUP_NAME}.${GROUP_NAMES.recurrenceRuleGroup}.${GROUP_NAMES.recurrencePatternGroup}`;

    const daysOfWeekGroup = `${recurrencePatternGroupPath}.${GROUP_NAMES.recurrenceDaysOfWeekEditor}`;
    const dayOfMonthGroup = `${recurrencePatternGroupPath}.${EDITOR_NAMES.recurrenceDayOfMonthEditor}`;
    const dayOfYearGroup = `${recurrencePatternGroupPath}.${GROUP_NAMES.recurrenceDayOfYearGroup}`;

    this.dxForm.beginUpdate();
    this.dxForm.itemOption(daysOfWeekGroup, 'visible', false);
    this.dxForm.itemOption(dayOfMonthGroup, 'visible', false);
    this.dxForm.itemOption(dayOfYearGroup, 'visible', false);

    switch (this.recurrenceRule.frequency) {
      case FREQ.WEEKLY:
        this.dxForm.itemOption(daysOfWeekGroup, 'visible', true);
        break;
      case FREQ.MONTHLY:
        this.dxForm.itemOption(dayOfMonthGroup, 'visible', true);
        break;
      case FREQ.YEARLY:
        this.dxForm.itemOption(dayOfYearGroup, 'visible', true);
        break;
      default:
        break;
    }

    this.dxForm.endUpdate();
  }
}
