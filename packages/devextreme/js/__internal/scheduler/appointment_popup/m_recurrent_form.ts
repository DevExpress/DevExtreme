/* eslint-disable max-classes-per-file */
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { isDefined } from '@js/core/utils/type';
import Button from '@js/ui/button';
import type { Properties as DateBoxProperties } from '@js/ui/date_box';
import type { GroupItem, SimpleItem } from '@js/ui/form';
import type dxForm from '@js/ui/form';
import type { Properties as NumberBoxProperties } from '@js/ui/number_box';
import type { Properties as RadioGroupProperties } from '@js/ui/radio_group';
import type { Properties as SelectBoxProperties } from '@js/ui/select_box';

import { getRecurrenceString, parseRecurrenceRule } from '../recurrence/base';
import { daysFromByDayRule } from '../recurrence/days_from_by_day_rule';
import { APPOINTMENT_FORM_GROUP_NAMES } from './m_form_constants';

const CLASSES = {
  recurrenceRepeatEveryGroup: 'dx-scheduler-form-recurrence-repeat-every-group',
  recurrenceRepeatOnMonthlyGroup: 'dx-scheduler-form-recurrence-repeat-on-monthly-group',
  recurrenceRepeatOnYearlyGroup: 'dx-scheduler-form-recurrence-repeat-on-yearly-group',
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

  constructor(scheduler: any, dxForm: dxForm, recurrenceRule: RecurrenceRule) {
    this.scheduler = scheduler;
    this._dxForm = dxForm;
    this._recurrenceRule = recurrenceRule;
  }

  get dxForm(): dxForm {
    return this._dxForm;
  }

  set dxForm(value: dxForm) {
    console.warn('🔄 RecurrentForm: dxForm updated');
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
    // Guard check: dxForm might not be initialized yet
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
        this.createRecurrenceRepeatOnGroup(),
      ],
    } as GroupItem;
  }

  private createRecurrenceStartDateGroup(): GroupItem {
    const { startDateExpr } = this.scheduler.getDataAccessors().expr;

    return {
      itemType: 'group',
      colCount: 1,
      items: [
        {
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

              // Update only date part, preserve time
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
      cssClass: CLASSES.recurrenceRepeatEveryGroup,
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
                console.warn('⏭️ Skipping interval update: programmatic update in progress');
                return;
              }

              if (this._tempRecurrenceRule) {
                this._tempRecurrenceRule.makeRule('interval', args.value);
                console.warn('🔄 Updated temp interval:', args.value);
              } else {
                console.warn('⚠️ Skipping interval update: _tempRecurrenceRule not initialized');
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
              console.warn('📣 FREQ CHANGED in RecurrentForm!');
              console.warn('  Previous value:', args.previousValue);
              console.warn('  New value:', args.value);
              console.warn('  _isUpdatingEditors:', this._isUpdatingEditors);
              console.warn('  _tempRecurrenceRule exists?', !!this._tempRecurrenceRule);

              if (this._isUpdatingEditors) {
                console.warn('  ⏭️ Skipping freq update: programmatic update in progress');
                return;
              }

              if (this._tempRecurrenceRule) {
                this._tempRecurrenceRule.makeRule('freq', args.value);
                const currentRules = this._tempRecurrenceRule.getRules();
                console.warn('  ✅ Updated temp freq to:', args.value);
                console.warn('  Current temp rules:', JSON.stringify(currentRules));
                console.warn('  Recurrence string:', this._tempRecurrenceRule.getRecurrenceString());

                this.updateRecurrenceRepeatOnVisibility(args.value, args.previousValue);
              } else {
                console.warn('  ⚠️ Skipping: _tempRecurrenceRule not initialized yet (form is being created)');
                // This happens during form initialization via onContentReady
                // The temp rule will be created when showRecurrenceGroup() is called
              }
            },
          } as SelectBoxProperties,
        },
      ],
    } as GroupItem;
  }

  private createRecurrenceRepeatOnGroup(): GroupItem {
    const freq = (this._recurrenceRule.getRules().freq || 'daily').toLowerCase();

    return {
      itemType: 'group',
      colCount: 1,
      items: [
        // Weekly: Repeat On with ButtonGroup for days
        {
          itemType: 'simple',
          colSpan: 1,
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceRepeatOn'),
          },
          visible: freq === 'weekly',
          template: (): string => '',
        },
        this.createRecurrenceByDayEditor(freq),
        // Monthly: Repeat On with day of month
        this.createRecurrenceRepeatOnMonthlyGroup(freq),
        // Yearly: Repeat Every with month and day
        this.createRecurrenceRepeatOnYearlyGroup(freq),
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
                console.warn('🔄 Updated temp bymonthday (monthly):', args.value);
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
                console.warn('🔄 Updated temp bymonth (yearly):', args.value);
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
                console.warn('🔄 Updated temp bymonthday (yearly):', args.value);
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

    // Reorder localized day names to match the firstDayOfWeek
    const reorderedLocalDaysNames = localDaysNames
      .slice(firstDayOfWeek)
      .concat(localDaysNames.slice(0, firstDayOfWeek));

    // Create button group items
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

        // Create a map to store button-to-key association
        const buttonKeyMap = new Map<Button, string>();

        console.warn('🔵 Creating day buttons...');
        console.warn('  itemsButtonGroup:', itemsButtonGroup);
        console.warn('  Initial byDay:', byDay);

        // Helper function to update byday rule
        const updateByDay = (clickedKey: string, isSelected: boolean): void => {
          console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.warn('🔘 updateByDay called');
          console.warn('  clickedKey:', clickedKey);
          console.warn('  isSelected (new state):', isSelected);

          if (!this._tempRecurrenceRule) {
            console.error('❌ No temp recurrence rule!');
            return;
          }

          const currentByDay = this._daysOfWeekByRules();
          console.warn('  currentByDay before update:', currentByDay);

          let newByDay: string[] = [];

          if (isSelected) {
            // Add day if not already selected
            newByDay = currentByDay.includes(clickedKey)
              ? currentByDay
              : [...currentByDay, clickedKey];
            console.warn('  ➕ Adding day. newByDay:', newByDay);
          } else {
            // Remove day
            newByDay = currentByDay.filter((d) => d !== clickedKey);
            console.warn('  ➖ Removing day. newByDay:', newByDay);
          }

          // If no days selected, use default
          if (newByDay.length === 0) {
            newByDay = this._getDefaultByDayValue();
            console.warn('  ⚠️ No days selected, using default:', newByDay);
          }

          console.warn('  Final newByDay:', newByDay);
          this._tempRecurrenceRule.makeRule('byday', newByDay);

          // Update all buttons styling using the map
          console.warn('  Updating button styles...');
          this._dayButtons?.forEach((btn, idx) => {
            const key = buttonKeyMap.get(btn);
            const selected = key ? newByDay.includes(key) : false;
            console.warn(`    Button ${idx}: key="${key}", selected=${selected}`);
            btn.option('stylingMode', selected ? 'contained' : 'outlined');
            btn.option('type', selected ? 'default' : 'normal');
          });
          console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        };

        // Create individual buttons for each day
        itemsButtonGroup.forEach((item, index) => {
          const isSelected = byDay.includes(item.key);
          console.warn(`  Creating button ${index}: key="${item.key}", text="${item.text}", selected=${isSelected}`);

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
              console.warn(`🖱️ Button clicked: key="${item.key}", text="${item.text}"`);
              const currentByDay = this._daysOfWeekByRules();
              const isCurrentlySelected = currentByDay.includes(item.key);
              console.warn(`  Current selection state: ${isCurrentlySelected}`);
              console.warn(`  New selection state: ${!isCurrentlySelected}`);
              updateByDay(item.key, !isCurrentlySelected);
            },
          });

          this._dayButtons?.push(button);
          buttonKeyMap.set(button, item.key);
          console.warn(`    ✅ Button ${index} created and mapped to key "${item.key}"`);
        });

        console.warn('✅ All day buttons created. Total:', this._dayButtons?.length);
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
      colCount: 1,
      items: [
        {
          itemType: 'simple',
          colSpan: 1,
          label: {
            text: messageLocalization.format('dxScheduler-recurrenceEnd'),
          },
          template: (): string => '',
        },
        {
          itemType: 'group',
          cssClass: 'dx-scheduler-form-recurrence-end-container',
          colCount: 2,
          colCountByScreen: { xs: 2 },
          items: [
            // RadioGroup column
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
            // Inputs column
            {
              itemType: 'group',
              cssClass: 'dx-scheduler-form-recurrence-end-inputs',
              colSpan: 1,
              items: [
                // Empty space for Never
                {
                  itemType: 'empty',
                },
                // DateBox for On
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
                        console.warn('🔄 Updated temp until:', dateInTimeZone);
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
                // NumberBox for After
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
                        console.warn('🔄 Updated temp count:', args.value);
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
      console.warn('⚠️ No temp recurrence rule');
      return;
    }

    console.warn('🔄 Starting programmatic update of RecurrenceForm values');
    this._isUpdatingEditors = true;

    try {
      const rules = this._tempRecurrenceRule.getRules();
      console.warn('📋 Rules to apply:', rules);

      // Update freq SelectBox
      const freqEditor = this.dxForm.getEditor('freq');
      console.warn('📝 freqEditor:', freqEditor, 'freq value:', rules.freq);
      if (freqEditor && rules.freq) {
        freqEditor.option('value', rules.freq.toLowerCase());
        console.warn('✅ Set freq to:', rules.freq.toLowerCase());
      }

      // Update interval NumberBox
      const intervalEditor = this.dxForm.getEditor('interval');
      console.warn('📝 intervalEditor:', intervalEditor, 'interval value:', rules.interval);
      if (intervalEditor) {
        intervalEditor.option('value', rules.interval || 1);
        console.warn('✅ Set interval to:', rules.interval || 1);
      }

      // Update repeat end RadioGroup
      const repeatEndEditor = this.dxForm.getEditor('repeatEnd');
      const repeatEndValue = this._tempRecurrenceRule.getRepeatEndRule();
      console.warn('📝 repeatEndEditor:', repeatEndEditor, 'repeatEnd value:', repeatEndValue);
      if (repeatEndEditor) {
        repeatEndEditor.option('value', repeatEndValue);
        console.warn('✅ Set repeatEnd to:', repeatEndValue);
      }

      // Update until DateBox
      const untilEditor = this.dxForm.getEditor('until');
      const untilValue = this._getTempUntilValue();
      console.warn('📝 untilEditor:', untilEditor, 'until value:', untilValue);
      if (untilEditor) {
        untilEditor.option('value', untilValue);
        console.warn('✅ Set until to:', untilValue);
      }

      // Update count NumberBox
      const countEditor = this.dxForm.getEditor('count');
      console.warn('📝 countEditor:', countEditor, 'count value:', rules.count);
      if (countEditor) {
        countEditor.option('value', rules.count || 1);
        console.warn('✅ Set count to:', rules.count || 1);
      }

      // Update disabled state of inputs
      this._updateRepeatEndInputsState(repeatEndValue);
      console.warn('✅ RecurrenceForm values updated');
    } finally {
      this._isUpdatingEditors = false;
      console.warn('✅ Programmatic update complete, flag cleared');
    }

    // After programmatic update, manually update visibility of Repeat On fields
    // This is necessary because the flag prevented the normal onValueChanged handler
    const rules = this._tempRecurrenceRule.getRules();
    if (rules.freq) {
      const currentFreq = rules.freq.toLowerCase();
      console.warn('🔄 Manually updating Repeat On visibility for freq:', currentFreq);
      // Force update visibility even if freq hasn't changed
      this.updateRecurrenceRepeatOnVisibility(currentFreq, '', true);
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

    // Update disabled state of inputs
    this._updateRepeatEndInputsState(value);

    if (!this._tempRecurrenceRule) {
      return;
    }

    if (value === 'until') {
      this._tempRecurrenceRule.makeRule(value, this._getTempUntilValue());
      console.warn('🔄 Updated temp repeatEnd to until');
    }
    if (value === 'count') {
      const countEditor = this.dxForm.getEditor('count');
      this._tempRecurrenceRule.makeRule(value, countEditor?.option('value') || 1);
      console.warn('🔄 Updated temp repeatEnd to count');
    }
    if (value === 'never') {
      this._tempRecurrenceRule.makeRule('count', '');
      this._tempRecurrenceRule.makeRule('until', '');
      console.warn('🔄 Updated temp repeatEnd to never');
    }
  }

  private _updateRepeatEndInputsState(
    value: string = this._recurrenceRule.getRepeatEndRule(),
  ): void {
    if (!this.dxForm) {
      return;
    }

    // Enable/disable inputs based on selected radio button
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
    // Use temp recurrence rule if available, otherwise use main recurrence rule
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
    // Use temp recurrence rule if available, otherwise use main recurrence rule
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
    // Use temp recurrence rule if available, otherwise use main recurrence rule
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

      console.warn(`🔄 Updating Repeat On visibility: ${previousFreq} → ${freq}, force: ${force}`);

      // Hide all repeat on groups
      this.dxForm.itemOption(`${recurrenceGroup}.byday`, 'visible', false);
      this.dxForm.itemOption(`${recurrenceGroup}.repeatOnMonthlyGroup`, 'visible', false);
      this.dxForm.itemOption(`${recurrenceGroup}.repeatOnYearlyGroup`, 'visible', false);

      if (!this._tempRecurrenceRule) {
        console.warn('⚠️ No temp recurrence rule, skipping');
        return;
      }

      if (freq === 'weekly') {
        this._tempRecurrenceRule.makeRule('byday', this._daysOfWeekByRules());
        this._tempRecurrenceRule.makeRule('bymonth', '');
        this._tempRecurrenceRule.makeRule('bymonthday', '');
        this.dxForm.itemOption(`${recurrenceGroup}.byday`, 'visible', true);
        console.warn('✅ Shown weekly fields (byday)');
      }
      if (freq === 'monthly') {
        this._tempRecurrenceRule.makeRule('bymonthday', this._dayOfMonthByRules());
        this._tempRecurrenceRule.makeRule('bymonth', '');
        this._tempRecurrenceRule.makeRule('byday', '');
        this.dxForm.itemOption(`${recurrenceGroup}.repeatOnMonthlyGroup`, 'visible', true);
        console.warn('✅ Shown monthly fields (bymonthday)');
      }
      if (freq === 'yearly') {
        this._tempRecurrenceRule.makeRule('bymonthday', this._dayOfMonthByRules());
        this._tempRecurrenceRule.makeRule('bymonth', this._monthOfYearByRules());
        this._tempRecurrenceRule.makeRule('byday', '');
        this.dxForm.itemOption(`${recurrenceGroup}.repeatOnYearlyGroup`, 'visible', true);
        console.warn('✅ Shown yearly fields (bymonth, bymonthday)');
      }
      if (freq === 'daily' || freq === 'hourly') {
        this._tempRecurrenceRule.makeRule('byday', '');
        this._tempRecurrenceRule.makeRule('bymonth', '');
        this._tempRecurrenceRule.makeRule('bymonthday', '');
        console.warn('✅ Hidden all repeat on fields for daily/hourly');
      }
    } else {
      console.warn(`⏭️ Skipping visibility update: freq unchanged (${freq})`);
    }
  }
}
