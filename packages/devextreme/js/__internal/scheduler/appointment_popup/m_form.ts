import type { TextEditorButton } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import { DataSource } from '@js/common/data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import type { Properties as DateBoxProperties } from '@js/ui/date_box';
import type {
  GroupItem, Item as FormItem, Properties as FormProperties, SimpleItem,
} from '@js/ui/form';
import dxForm from '@js/ui/form';
import type { Properties as SelectBoxProperties } from '@js/ui/select_box';
import type { Properties as SwitchProperties } from '@js/ui/switch';
import type { Properties as TextAreaProperties } from '@js/ui/text_area';
import { current, isFluent } from '@js/ui/themes';
import { dateSerialization } from '@ts/core/utils/m_date_serialization';

import timeZoneUtils from '../m_utils_time_zone';
import type { ResourceLoader } from '../utils/loader/resource_loader';
import { APPOINTMENT_FORM_GROUP_NAMES } from './m_form_constants';
import { RecurrenceRule, RecurrentForm } from './m_recurrent_form';

export { APPOINTMENT_FORM_GROUP_NAMES };

const CLASSES = {
  form: 'dx-scheduler-form',

  groupWithIcon: 'dx-scheduler-form-group-with-icon',
  icon: 'dx-scheduler-form-icon',
  defaultResourceIcon: 'dx-scheduler-default-resources-icon',

  mainGroup: 'dx-scheduler-form-main-group',
  subjectGroup: 'dx-scheduler-form-subject-group',
  dateRangeGroup: 'dx-scheduler-form-date-range-group',
  startDateGroup: 'dx-scheduler-form-start-date-group',
  endDateGroup: 'dx-scheduler-form-end-date-group',
  repeatGroup: 'dx-scheduler-form-repeat-group',
  descriptionGroup: 'dx-scheduler-form-description-group',
  resourcesGroup: 'dx-scheduler-form-resources-group',
  recurrenceRepeatEveryGroup: 'dx-scheduler-form-recurrence-repeat-every-group',
  recurrenceRepeatOnMonthlyGroup: 'dx-scheduler-form-recurrence-repeat-on-monthly-group',
  recurrenceRepeatOnYearlyGroup: 'dx-scheduler-form-recurrence-repeat-on-yearly-group',

  textEditor: 'dx-scheduler-form-text-editor',
  allDaySwitch: 'dx-scheduler-form-all-day-switch',
  startDateEditor: 'dx-scheduler-form-start-date-editor',
  startTimeEditor: 'dx-scheduler-form-start-time-editor',
  startDateTimeZoneEditor: 'dx-scheduler-form-start-date-timezone-editor',
  endDateEditor: 'dx-scheduler-form-end-date-editor',
  endTimeEditor: 'dx-scheduler-form-end-time-editor',
  endDateTimeZoneEditor: 'dx-scheduler-form-end-date-timezone-editor',
  repeatEditor: 'dx-scheduler-form-repeat-editor',
  descriptionEditor: 'dx-scheduler-form-description-editor',

  recurrenceSettingsButton: 'dx-scheduler-form-recurrence-settings-button',
  mainHidden: 'dx-scheduler-form-main-hidden',
  recurrenceGroup: 'dx-scheduler-form-recurrence-group',
  mainGroupClass: 'dx-scheduler-form-main-group',
  recurrenceHidden: 'dx-scheduler-form-recurrence-hidden',
};

const EDITOR_NAMES = {
  startDate: 'startDateEditor',
  startTime: 'startTimeEditor',
  endDate: 'endDateEditor',
  endTime: 'endTimeEditor',
  repeat: 'repeatEditor',
};

const repeatSelectBoxItems = [
  {
    recurrence: 'dxScheduler-recurrenceNever',
    value: 'never',
  }, {
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
].map(
  (item) => ({
    text: messageLocalization.format(item.recurrence),
    value: item.value,
  }),
);

const createTimeZoneDataSource = (): DataSource => new DataSource({
  store: timeZoneUtils.getTimeZonesCache(),
  paginate: true,
  pageSize: 10,
});

export class AppointmentForm {
  private readonly scheduler: any;

  private _dxForm?: dxForm;

  private _recurrenceRule!: RecurrenceRule;

  private _recurrentForm?: RecurrentForm;

  public _isRecurrenceFormVisible = false;

  private _isUpdatingRepeatEditor = false;

  public popup?: any;

  get dxForm(): dxForm {
    return this._dxForm as dxForm;
  }

  set readOnly(value: boolean) {
    this.dxForm.option('readOnly', value);
  }

  get formData(): Record<string, any> {
    return this.dxForm.option('formData') as Record<string, any>;
  }

  set formData(formData: Record<string, any>) {
    this.dxForm.option('formData', formData);
    const recurrenceRule = this.recurrenceRule ?? '';
    this._recurrenceRule = new RecurrenceRule(recurrenceRule);
  }

  get startDate(): Date | null {
    const { startDateExpr } = this.scheduler.getDataAccessors().expr;
    const value = this.formData[startDateExpr];

    return value ? new Date(dateSerialization.deserializeDate(value)) : null;
  }

  get endDate(): Date | null {
    const { endDateExpr } = this.scheduler.getDataAccessors().expr;
    const value = this.formData[endDateExpr];

    return value ? new Date(dateSerialization.deserializeDate(value)) : null;
  }

  get recurrenceRule(): string | null {
    const { recurrenceRuleExpr } = this.scheduler.getDataAccessors().expr;
    const value = this.formData[recurrenceRuleExpr] as string | undefined;

    return value && value.trim() !== '' ? value : null;
  }

  get isRecurrenceFormVisible(): boolean {
    return this._isRecurrenceFormVisible;
  }

  constructor(scheduler: any) {
    this.scheduler = scheduler;
    this._recurrenceRule = new RecurrenceRule('');
  }

  reset(): void {
    if (this._dxForm) {
      const repeatEditor = this._dxForm.getEditor(EDITOR_NAMES.repeat);
      if (repeatEditor) {
        repeatEditor.option('value', 'never');
      }
    }
  }

  create(): void {
    const mainGroup = this.createMainFormGroup();

    this._recurrentForm = new RecurrentForm(this.scheduler, this.dxForm, this._recurrenceRule);
    const recurrenceGroup = this._recurrentForm.createRecurrenceFormGroup();

    const items = [mainGroup, recurrenceGroup];

    this.setStylingModeToEditors(mainGroup);
    this.setStylingModeToEditors(recurrenceGroup);

    this.createForm(items);

    this._recurrentForm.dxForm = this.dxForm;
  }

  private createForm(items: FormProperties['items']): dxForm {
    const element = $('<div>');

    return this.scheduler.createComponent(element, dxForm, {
      items,
      formData: {},
      showColonAfterLabel: false,
      showValidationSummary: false,
      scrollingEnabled: false,
      labelLocation: 'top',
      elementAttr: {
        class: CLASSES.form,
      },
      onFieldDataChanged: (e) => {
        const {
          startDateExpr, endDateExpr, recurrenceRuleExpr, allDayExpr,
        } = this.scheduler.getDataAccessors().expr;

        const isAllDayChanged = e.dataField === allDayExpr;
        const isDateRangeChanged = [startDateExpr, endDateExpr].includes(e.dataField);
        const isRecurrenceRuleChanged = e.dataField === recurrenceRuleExpr;

        if (isAllDayChanged) {
          this.updateDateTimeEditorsVisibility();
        }

        if (isDateRangeChanged) {
          this.updateDateEditorsValues();
        }

        if (isRecurrenceRuleChanged) {
          this.updateRepeatEditor();
        }
      },
      onInitialized: (e): void => {
        this._dxForm = e.component;
      },
    } as FormProperties) as dxForm;
  }

  private createMainFormGroup(): GroupItem {
    return {
      name: APPOINTMENT_FORM_GROUP_NAMES.Main,
      itemType: 'group',
      colSpan: 1,
      cssClass: CLASSES.mainGroup,
      items: [
        this.createSubjectGroup(),
        this.createDateRangeGroup(),
        this.createRepeatGroup(),
        this.createResourcesGroup(),
        this.createDescriptionGroup(),
      ],
    } as GroupItem;
  }

  private createSubjectGroup(): GroupItem {
    const { textExpr } = this.scheduler.getDataAccessors().expr;

    return {
      itemType: 'group',
      cssClass: `${CLASSES.subjectGroup} ${CLASSES.groupWithIcon}`,
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        {
          colSpan: 1,
          cssClass: CLASSES.icon,
          template: this.createIconTemplate('isnotblank'),
        },
        {
          colSpan: 1,
          itemType: 'simple',
          cssClass: CLASSES.textEditor,
          dataField: textExpr,
          label: {
            text: messageLocalization.format('dxScheduler-editorLabelTitle'),
          },
          editorType: 'dxTextBox',
        },
      ],
    } as GroupItem;
  }

  private createDateRangeGroup(): GroupItem {
    return {
      itemType: 'group',
      cssClass: `${CLASSES.dateRangeGroup} ${CLASSES.groupWithIcon}`,
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        {
          colSpan: 1,
          cssClass: CLASSES.icon,
          template: this.createIconTemplate('clock'),
        },
        {
          colSpan: 1,
          itemType: 'group',
          items: [
            this.createAllDaySwitch(),
            this.createStartDateGroup(),
            this.createEndDateGroup(),
          ],
        },
      ],
    } as GroupItem;
  }

  private createAllDaySwitch(): SimpleItem {
    const { allDayExpr, startDateExpr, endDateExpr } = this.scheduler.getDataAccessors().expr;

    return {
      itemType: 'simple',
      dataField: allDayExpr,
      cssClass: CLASSES.allDaySwitch,
      label: {
        text: messageLocalization.format('dxScheduler-allDay'),
        location: 'left',
      },
      editorType: 'dxSwitch',
      editorOptions: {
        onValueChanged: (e) => {
          const { startDate } = this;

          if (!startDate) {
            return;
          }

          if (e.value) {
            const allDayStartDate = dateUtils.trimTime(startDate);

            this.dxForm.updateData(startDateExpr, allDayStartDate);
            this.dxForm.updateData(endDateExpr, allDayStartDate);
          } else {
            const startHour = this.scheduler.getStartDayHour();
            startDate.setHours(startHour);

            const endDate = this.scheduler.getCalculatedEndDate(startDate);

            this.dxForm.updateData(startDateExpr, startDate);
            this.dxForm.updateData(endDateExpr, endDate);
          }
        },
      } as SwitchProperties,
    } as SimpleItem;
  }

  private createStartDateGroup(): GroupItem {
    const {
      startDateExpr, startDateTimeZoneExpr, endDateTimeZoneExpr,
    } = this.scheduler.getDataAccessors().expr;

    return this.createDateGroup(
      startDateExpr,
      {
        cssClass: CLASSES.startDateGroup,
      },
      {
        name: EDITOR_NAMES.startDate,
        label: {
          text: messageLocalization.format('dxScheduler-editorLabelStartDate'),
        },
        cssClass: CLASSES.startDateEditor,
      },
      {
        name: EDITOR_NAMES.startTime,
        cssClass: CLASSES.startTimeEditor,
      },
      {
        dataField: startDateTimeZoneExpr,
        cssClass: CLASSES.startDateTimeZoneEditor,
        editorOptions: {
          onValueChanged: (e) => {
            const endDateTimeZoneEditor = this.dxForm.getEditor(endDateTimeZoneExpr);

            endDateTimeZoneEditor?.option('value', e.value);
          },
        } as SelectBoxProperties,
      },
    );
  }

  private createEndDateGroup(): GroupItem {
    const { endDateExpr, endDateTimeZoneExpr } = this.scheduler.getDataAccessors().expr;

    return this.createDateGroup(
      endDateExpr,
      {
        cssClass: CLASSES.endDateGroup,
      },
      {
        name: EDITOR_NAMES.endDate,
        label: {
          text: messageLocalization.format('dxScheduler-editorLabelEndDate'),
        },
        cssClass: CLASSES.endDateEditor,
      },
      {
        name: EDITOR_NAMES.endTime,
        cssClass: CLASSES.endTimeEditor,
      },
      {
        dataField: endDateTimeZoneExpr,
        cssClass: CLASSES.endDateTimeZoneEditor,
      },
    );
  }

  private createDateGroup(
    dateExpr: string,
    groupItemOptions?: GroupItem,
    dateItemOptions?: SimpleItem,
    timeItemOptions?: SimpleItem,
    timezoneItemOptions?: SimpleItem,
  ): GroupItem {
    const { allowTimeZoneEditing } = this.scheduler.getEditingConfig();
    const { startDateExpr } = this.scheduler.getDataAccessors().expr;
    const isStartDateEditor = dateExpr === startDateExpr;

    const getEditorsDate = (): Date | null => (isStartDateEditor ? this.startDate : this.endDate);

    const dateValueChanged = (e, modifyDate: (date: Date) => void): void => {
      const currentDate = getEditorsDate();

      if (!currentDate) {
        this.dxForm.updateData(dateExpr, e.value);
        return;
      }

      if (!e.value) {
        return;
      }

      if (!e.event && currentDate.getTime() === e.value.getTime()) {
        return;
      }

      const previousDateValue = new Date(currentDate);

      modifyDate(currentDate);

      this.dxForm.updateData(dateExpr, currentDate);
      this.correctDateRange(previousDateValue, isStartDateEditor);
    };

    return {
      itemType: 'group',
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      items: [
        extend(true, {
          itemType: 'simple',
          colSpan: 1,
          editorType: 'dxDateBox',
          validationRules: [{
            type: 'required',
          }],
          editorOptions: {
            type: 'date',
            useMaskBehavior: true,
            onValueChanged: (e) => {
              dateValueChanged(e, (date: Date): void => {
                date.setFullYear(e.value.getFullYear(), e.value.getMonth(), e.value.getDate());
              });
            },
            onContentReady: (e): void => {
              e.component.option('value', getEditorsDate());
            },
          } as DateBoxProperties,
        }, dateItemOptions),
        extend(true, {
          itemType: 'simple',
          colSpan: 1,
          editorType: 'dxDateBox',
          validationRules: [{
            type: 'required',
          }],
          editorOptions: {
            type: 'time',
            useMaskBehavior: true,
            calendarOptions: {
              firstDayOfWeek: this.scheduler.getFirstDayOfWeek(),
            },
            onValueChanged: (e) => {
              dateValueChanged(e, (date: Date): void => {
                date.setHours(e.value.getHours(), e.value.getMinutes());
              });
            },
            onContentReady: (e): void => {
              e.component.option('value', getEditorsDate());
            },
          } as DateBoxProperties,
        }, timeItemOptions),
        extend(true, {
          itemType: 'simple',
          colSpan: 2,
          editorType: 'dxSelectBox',
          visible: allowTimeZoneEditing,
          editorOptions: {
            displayExpr: 'title',
            valueExpr: 'id',
            placeholder: messageLocalization.format('dxScheduler-noTimezoneTitle'),
            searchEnabled: true,
            dataSource: createTimeZoneDataSource(),
          } as SelectBoxProperties,
        }, timezoneItemOptions),
      ],
      ...groupItemOptions,
    } as GroupItem;
  }

  private createRepeatGroup(): GroupItem {
    return {
      itemType: 'group',
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      cssClass: `${CLASSES.repeatGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          colSpan: 1,
          cssClass: CLASSES.icon,
          template: this.createIconTemplate('repeat'),
        },
        {
          name: EDITOR_NAMES.repeat,
          colSpan: 1,
          itemType: 'simple',
          cssClass: CLASSES.repeatEditor,
          label: {
            text: messageLocalization.format('dxScheduler-editorLabelRecurrence'),
          },
          editorType: 'dxSelectBox',
          editorOptions: {
            items: repeatSelectBoxItems,
            valueExpr: 'value',
            displayExpr: 'text',
            onContentReady: (): void => {
              this.updateRepeatEditor();
            },
            onValueChanged: (e): void => {
              if (this._isUpdatingRepeatEditor) {
                return;
              }

              const { value, previousValue } = e;
              const { recurrenceRuleExpr } = this.scheduler.getDataAccessors().expr;

              if (value === 'never') {
                this.dxForm.updateData(recurrenceRuleExpr, '');

                this.dxForm.updateData('freq', null);
                this.dxForm.updateData('interval', null);
                this.dxForm.updateData('repeatEnd', null);
                this.dxForm.updateData('count', null);
                this.dxForm.updateData('until', null);

                this._recurrenceRule.makeRules('');
                if (this._recurrentForm) {
                  this._recurrentForm.tempRecurrenceRule = undefined;
                }
              } else {
                if (!this.recurrenceRule) {
                  this._recurrenceRule.makeRule('freq', value);
                  this._recurrenceRule.makeRule('interval', 1);
                  const recurrenceString = this._recurrenceRule.getRecurrenceString();
                  this.dxForm.updateData(recurrenceRuleExpr, recurrenceString);
                } else {
                  this._recurrenceRule.makeRules(this.recurrenceRule);
                  this._recurrenceRule.makeRule('freq', value);
                  const recurrenceString = this._recurrenceRule.getRecurrenceString();
                  this.dxForm.updateData(recurrenceRuleExpr, recurrenceString);
                }

                if (previousValue !== undefined && previousValue !== value) {
                  this.showRecurrenceGroup();
                }
              }

              this.updateRepeatEditor();
            },
          } as SelectBoxProperties,
        },
      ],
    } as GroupItem;
  }

  private createDescriptionGroup(): GroupItem {
    return {
      itemType: 'group',
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      cssClass: `${CLASSES.descriptionGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          colSpan: 1,
          cssClass: CLASSES.icon,
          template: this.createIconTemplate('description'),
        },
        {
          colSpan: 1,
          itemType: 'simple',
          cssClass: CLASSES.descriptionEditor,
          label: {
            text: messageLocalization.format('dxScheduler-editorLabelDescription'),
          },
          editorType: 'dxTextArea',
          editorOptions: {
            height: 100,
          } as TextAreaProperties,
        },
      ],
    } as GroupItem;
  }

  private createResourcesGroup(): GroupItem | undefined {
    const resourcesLoaders: ResourceLoader[] = Object.values(this.scheduler.getResourceById());

    const resourcesItems = resourcesLoaders.map((resourceLoader) => {
      const { dataSource, dataAccessor } = resourceLoader;
      const dataField = resourceLoader.resourceIndex;
      const label = resourceLoader.resourceName ?? dataField;
      const editorType = resourceLoader.allowMultiple ? 'dxTagBox' : 'dxSelectBox';

      return {
        itemType: 'group',
        items: [
          {
            itemType: 'simple',
            dataField,
            label: { text: label },
            editorType,
            editorOptions: {
              dataSource,
              displayExpr: dataAccessor.textExpr,
              valueExpr: dataAccessor.idExpr,
            },
          },
        ],
      } as GroupItem;
    });

    return {
      itemType: 'group',
      visible: resourcesItems.length > 0,
      colCount: 2,
      colCountByScreen: {
        xs: 2,
      },
      cssClass: `${CLASSES.resourcesGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          colSpan: 1,
          cssClass: `${CLASSES.icon} ${CLASSES.defaultResourceIcon}`,
          template: this.createIconTemplate('addcircleoutline'),
        },
        {
          itemType: 'group',
          colSpan: 1,
          items: resourcesItems,
        },
      ],
    } as GroupItem;
  }

  private setStylingModeToEditors(item: FormItem): void {
    if (item.itemType === 'simple') {
      const simpleItem = item as SimpleItem;
      const stylingMode = isFluent(current()) ? 'filled' : undefined;

      simpleItem.editorOptions = extend(simpleItem.editorOptions, {
        stylingMode,
      });

      return;
    }

    if (item.itemType === 'group') {
      const groupItem = item as GroupItem;

      groupItem.items?.forEach((child) => {
        this.setStylingModeToEditors(child);
      });
    }
  }

  showRecurrenceGroup(): void {
    this._isRecurrenceFormVisible = true;

    if (!this._recurrentForm) {
      return;
    }

    const currentRule = this.recurrenceRule;

    if (currentRule) {
      this._recurrentForm.tempRecurrenceRule = new RecurrenceRule(currentRule);
    } else {
      this._recurrentForm.tempRecurrenceRule = new RecurrenceRule('');
    }

    const $formElement = $(this.dxForm.element());
    const mainGroup = $formElement.find(`.${CLASSES.mainGroupClass}`);
    const recurrenceGroup = $formElement.find(`.${CLASSES.recurrenceGroup}`);

    mainGroup.addClass(CLASSES.mainHidden);
    recurrenceGroup.removeClass(CLASSES.recurrenceHidden);

    this._recurrentForm?.updateRecurrenceFormValues();

    if (this.popup && typeof this.popup.updateToolbarForRecurrence === 'function') {
      this.popup.updateToolbarForRecurrence();
    }
  }

  showMainGroup(saveChanges = true): void {
    this._isRecurrenceFormVisible = false;

    if (!this._recurrentForm) {
      return;
    }

    if (saveChanges && this._recurrentForm.tempRecurrenceRule) {
      const tempRecurrenceString = this._recurrentForm.tempRecurrenceRule.getRecurrenceString();

      this._recurrenceRule = this._recurrentForm.tempRecurrenceRule;
      this._recurrentForm.recurrenceRule = this._recurrenceRule;

      const { recurrenceRuleExpr } = this.scheduler.getDataAccessors().expr;
      this.dxForm.updateData(recurrenceRuleExpr, tempRecurrenceString ?? undefined);

      const repeatEditor = this.dxForm.getEditor(EDITOR_NAMES.repeat);

      if (repeatEditor) {
        const { freq } = this._recurrenceRule.getRules();

        if (freq) {
          this._isUpdatingRepeatEditor = true;
          const freqValue = freq.toLowerCase();
          repeatEditor.option('value', freqValue);

          const buttons = this.getRepeatEditorButtons();
          repeatEditor.option('buttons', buttons);
          this._isUpdatingRepeatEditor = false;
        } else {
          this._isUpdatingRepeatEditor = true;
          repeatEditor.option('value', 'never');
          repeatEditor.option('buttons', this.getRepeatEditorButtons());
          this._isUpdatingRepeatEditor = false;
        }
      }
    } else if (!saveChanges) {
      this._recurrentForm.tempRecurrenceRule = undefined;
    }

    const $formElement = $(this.dxForm.element());
    const mainGroup = $formElement.find(`.${CLASSES.mainGroupClass}`);
    const recurrenceGroup = $formElement.find(`.${CLASSES.recurrenceGroup}`);

    mainGroup.removeClass(CLASSES.mainHidden);
    recurrenceGroup.addClass(CLASSES.recurrenceHidden);

    if (this.popup && typeof this.popup.updateToolbarForMain === 'function') {
      this.popup.updateToolbarForMain();
    }

    if (!saveChanges) {
      this.updateRepeatEditor();
    }
  }

  private correctDateRange(
    previousStartDate?: Date,
    isStartDateChanged = true,
  ): void {
    const { startDate, endDate } = this;

    if (!startDate || !endDate || startDate.getTime() <= endDate.getTime()) {
      return;
    }

    const { startDateExpr, endDateExpr } = this.scheduler.getDataAccessors().expr;

    if (isStartDateChanged) {
      const duration = previousStartDate
        ? endDate.getTime() - previousStartDate.getTime()
        : 0;
      const correctedEndDate = new Date(startDate.getTime() + duration);

      this.dxForm.updateData(endDateExpr, correctedEndDate);
    } else {
      const duration = previousStartDate
        ? previousStartDate.getTime() - startDate.getTime()
        : 0;
      const correctedStartDate = new Date(endDate.getTime() - duration);

      this.dxForm.updateData(startDateExpr, correctedStartDate);
    }
  }

  private updateDateEditorsValues(): void {
    this.correctDateRange();

    const startDateEditor = this.dxForm.getEditor(EDITOR_NAMES.startDate);
    const startTimeEditor = this.dxForm.getEditor(EDITOR_NAMES.startTime);
    const endDateEditor = this.dxForm.getEditor(EDITOR_NAMES.endDate);
    const endTimeEditor = this.dxForm.getEditor(EDITOR_NAMES.endTime);

    startDateEditor?.option('value', this.startDate);
    startTimeEditor?.option('value', this.startDate);
    endDateEditor?.option('value', this.endDate);
    endTimeEditor?.option('value', this.endDate);
  }

  private updateRepeatEditor(): void {
    if (this._isUpdatingRepeatEditor) {
      return;
    }

    const repeatEditor = this.dxForm.getEditor(EDITOR_NAMES.repeat);

    if (!repeatEditor) {
      return;
    }

    this._isUpdatingRepeatEditor = true;

    try {
      const currentRule = this.recurrenceRule;
      if (currentRule) {
        this._recurrenceRule.makeRules(currentRule);
        const { freq } = this._recurrenceRule.getRules();
        if (freq && repeatEditor.option('value') !== freq.toLowerCase()) {
          repeatEditor.option('value', freq.toLowerCase());
        }
      } else if (repeatEditor.option('value') !== 'never') {
        repeatEditor.option('value', 'never');
      }

      repeatEditor.option('buttons', this.getRepeatEditorButtons());
    } finally {
      this._isUpdatingRepeatEditor = false;
    }
  }

  private getRepeatEditorButtons(): TextEditorButton[] {
    const buttons: TextEditorButton[] = [];

    const repeatEditor = this.dxForm.getEditor(EDITOR_NAMES.repeat);
    const selectedValue = repeatEditor?.option('value');

    if (selectedValue && selectedValue !== 'never') {
      buttons.push({
        location: 'after',
        name: 'settings',
        options: {
          icon: 'optionsoutline',
          stylingMode: 'text',
          onClick: (): void => {
            this.showRecurrenceGroup();
          },
          elementAttr: {
            class: CLASSES.recurrenceSettingsButton,
          },
        },
      });
    }

    buttons.push({
      name: 'dropDown',
    });

    return buttons;
  }

  private updateDateTimeEditorsVisibility(): void {
    const { allDayExpr } = this.scheduler.getDataAccessors().expr;
    const visible = !this.formData[allDayExpr];
    const mainGroup = APPOINTMENT_FORM_GROUP_NAMES.Main;

    this.dxForm.beginUpdate();
    this.dxForm.itemOption(`${mainGroup}.${EDITOR_NAMES.startDate}`, 'colSpan', visible ? 1 : 2);
    this.dxForm.itemOption(`${mainGroup}.${EDITOR_NAMES.startTime}`, 'visible', visible);
    this.dxForm.itemOption(`${mainGroup}.${EDITOR_NAMES.endDate}`, 'colSpan', visible ? 1 : 2);
    this.dxForm.itemOption(`${mainGroup}.${EDITOR_NAMES.endTime}`, 'visible', visible);
    this.dxForm.endUpdate();
  }

  private createIconTemplate(iconName: string): () => void {
    return (): dxElementWrapper => $('<i>').addClass('dx-icon').addClass(`dx-icon-${iconName}`);
  }
}
