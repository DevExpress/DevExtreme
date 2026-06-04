import '@js/ui/radio_group';
import '@js/ui/text_area';
import '@js/ui/tag_box';
import '@js/ui/switch';
import '@js/ui/select_box';

import type { DayOfWeek, TextEditorButton } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import { DataSource } from '@js/common/data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import dateUtils from '@js/core/utils/date';
import { extend } from '@js/core/utils/extend';
import { isBoolean } from '@js/core/utils/type';
import type { Properties as DateBoxProperties } from '@js/ui/date_box';
import type {
  GroupItem, Item as FormItem, Properties as FormProperties, SimpleItem,
} from '@js/ui/form';
import dxForm from '@js/ui/form';
import type { AppointmentFormIconsShowMode, Properties as SchedulerProperties } from '@js/ui/scheduler';
import type { Properties as SelectBoxProperties } from '@js/ui/select_box';
import type { Properties as SwitchProperties } from '@js/ui/switch';
import type { Properties as TextAreaProperties } from '@js/ui/text_area';
import { current, isFluent } from '@js/ui/themes';
import { dateSerialization } from '@ts/core/utils/m_date_serialization';
import DropDownEditor from '@ts/ui/drop_down_editor/drop_down_editor';
import type Popup from '@ts/ui/popup/m_popup';

import type { TimeZoneCalculator } from '../r1/timezone_calculator/calculator';
import type { CreateComponentFn, SafeAppointment } from '../types';
import type { AppointmentDataAccessor } from '../utils/data_accessor/appointment_data_accessor';
import type { ResourceLoader } from '../utils/loader/resource_loader';
import { DEFAULT_ICONS_SHOW_MODE } from '../utils/options/constants';
import { getAppointmentGroupIndex, getRawAppointmentGroupValues, getSafeGroupValues } from '../utils/resource_manager/appointment_groups_utils';
import type { ResourceManager } from '../utils/resource_manager/resource_manager';
import timeZoneUtils from '../utils_time_zone';
import { customizeFormItems } from './customize_form_items';
import { getRepeatSelectItems, REPEAT_NEVER_VALUE } from './localized_items';
import type { AppointmentPopupContext } from './popup';
import { RecurrenceForm } from './recurrence_form';
import { createFormIconTemplate, getStartDateCommonConfig, RecurrenceRule } from './utils';

type SchedulerEditingObject = Exclude<NonNullable<SchedulerProperties['editing']>, boolean>;

export interface AppointmentFormConfig {
  dataAccessors: AppointmentDataAccessor;
  editing: SchedulerProperties['editing'];
  resourceManager: ResourceManager;
  firstDayOfWeek: DayOfWeek;
  startDayHour: number;
  createComponent: CreateComponentFn;
  getCalculatedEndDate: (startDate: Date) => Date;
}

const CLASSES = {
  form: 'dx-scheduler-form',
  icon: 'dx-icon',
  hidden: 'dx-hidden',
  fieldItemContent: 'dx-field-item-content',
  formItem: 'dx-item',
  labelTop: 'dx-field-item-label-location-top',
  label: 'dx-label',

  groupWithIcon: 'dx-scheduler-form-group-with-icon',
  formIcon: 'dx-scheduler-form-icon',
  formIconTopLabelOffset: 'dx-scheduler-form-top-label-offset',
  formIconInnerLabelOffset: 'dx-scheduler-form-inner-label-offset',
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
  mainHidden: 'dx-scheduler-form-main-group-hidden',
  recurrenceGroup: 'dx-scheduler-form-recurrence-group',
  recurrenceHidden: 'dx-scheduler-form-recurrence-group-hidden',
};

const createTimeZoneDataSource = (): DataSource => new DataSource({
  store: timeZoneUtils.getTimeZonesCache(),
  paginate: true,
  pageSize: 10,
});

const MAIN_GROUP_NAME = 'mainGroup';
const DATE_GROUP_NAME = 'dateGroup';
const DATE_OPTIONS_GROUP_NAME = 'dateOptionsGroup';
const START_DATE_GROUP_NAME = 'startDateGroup';
const END_DATE_GROUP_NAME = 'endDateGroup';
const RESOURCES_GROUP_NAME = 'resourcesGroup';
const RESOURCE_EDITORS_GROUP_NAME = 'resourceEditorsGroup';
const SUBJECT_GROUP_NAME = 'subjectGroup';
const REPEAT_GROUP_NAME = 'repeatGroup';
const DESCRIPTION_GROUP_NAME = 'descriptionGroup';

const START_DATE_TIME_GROUP_NAME = 'startDateTimeGroup';
const START_DATE_EDITOR_NAME = 'startDateEditor';
const START_TIME_EDITOR_NAME = 'startTimeEditor';
const END_DATE_TIME_GROUP_NAME = 'endDateTimeGroup';
const END_DATE_EDITOR_NAME = 'endDateEditor';
const END_TIME_EDITOR_NAME = 'endTimeEditor';
const REPEAT_EDITOR_NAME = 'repeatEditor';
const ALL_DAY_EDITOR_NAME = 'allDayEditor';
const SUBJECT_EDITOR_NAME = 'subjectEditor';
const DESCRIPTION_EDITOR_NAME = 'descriptionEditor';
const START_DATE_TIMEZONE_EDITOR_NAME = 'startDateTimeZoneEditor';
const END_DATE_TIMEZONE_EDITOR_NAME = 'endDateTimeZoneEditor';

const SUBJECT_ICON_NAME = 'subjectIcon';
const DATE_ICON_NAME = 'dateIcon';
const REPEAT_ICON_NAME = 'repeatIcon';
const RESOURCES_GROUP_ICON_NAME = 'resourcesGroupIcon';
const DESCRIPTION_ICON_NAME = 'descriptionIcon';

export interface AppointmentFormScheduler {
  getResourceById: () => ResourceManager['resourceById'];
  getDataAccessors: () => AppointmentDataAccessor;
  createComponent: <T>(element: dxElementWrapper, component: unknown, options: unknown) => T;
  getEditingConfig: () => SchedulerProperties['editing'];
  getResourceManager: () => ResourceManager;
  getFirstDayOfWeek: () => DayOfWeek;
  getStartDayHour: () => number;
  getCalculatedEndDate: (startDate: Date) => Date;
  getTimeZoneCalculator: () => TimeZoneCalculator;
}

export class AppointmentForm {
  private readonly config: AppointmentFormConfig;

  private dxFormInstance?: dxForm;

  private recurrenceForm!: RecurrenceForm;

  private _popup!: AppointmentPopupContext;

  private $mainGroup?: dxElementWrapper;

  private $recurrenceGroup?: dxElementWrapper;

  private get resourceManager(): ResourceManager {
    return this.config.resourceManager;
  }

  get dxForm(): dxForm {
    return this.dxFormInstance as dxForm;
  }

  private get dxPopup(): Popup {
    return this._popup.dxPopup;
  }

  get readOnly(): boolean {
    return this.dxForm.option('readOnly') as boolean;
  }

  set readOnly(value: boolean) {
    this.dxForm.option('readOnly', value);
    this.recurrenceForm.setReadOnly(value);
  }

  get formData(): Record<string, unknown> {
    return this.dxForm.option('formData') as Record<string, unknown>;
  }

  set formData(formData: Record<string, unknown>) {
    this.dxForm.option('formData', formData);
  }

  get startDate(): Date | null {
    const { startDateExpr } = this.config.dataAccessors.expr;
    const value = this.getFormDataField(startDateExpr);

    return value ? new Date(dateSerialization.deserializeDate(value)) : null;
  }

  get endDate(): Date | null {
    const { endDateExpr } = this.config.dataAccessors.expr;
    const value = this.getFormDataField(endDateExpr);

    return value ? new Date(dateSerialization.deserializeDate(value)) : null;
  }

  get recurrenceRuleRaw(): string | null {
    const { recurrenceRuleExpr } = this.config.dataAccessors.expr;
    const value = this.getFormDataField(recurrenceRuleExpr) as string | undefined;

    return value ?? null;
  }

  constructor(config: AppointmentFormConfig) {
    this.config = config;
  }

  private getFormDataField(field: string): unknown {
    return this.dxForm.option(`formData.${field}`);
  }

  dispose(): void {
    this.dxFormInstance?.dispose();
    this.dxFormInstance = undefined;
    if (this.recurrenceForm) {
      this.recurrenceForm.dxForm = undefined;
    }
  }

  create(popup: AppointmentPopupContext): void {
    this._popup = popup;

    const mainGroup = this.createMainFormGroup();

    this.recurrenceForm = new RecurrenceForm({
      firstDayOfWeek: this.config.firstDayOfWeek,
      createComponent: this.config.createComponent,
    });
    const recurrenceGroup = this.recurrenceForm.createRecurrenceFormGroup();

    const items = [mainGroup, recurrenceGroup];

    const iconsShowMode = this.getIconsShowMode();
    const showMainGroupIcons = ['main', 'both'].includes(iconsShowMode);
    const showRecurrenceGroupIcons = ['recurrence', 'both'].includes(iconsShowMode);

    this.applyFormItemDefaults(mainGroup, showMainGroupIcons);
    this.applyFormItemDefaults(recurrenceGroup, showRecurrenceGroupIcons);

    const customizedItems = customizeFormItems(items, this.getEditingForm()?.items);

    this.createForm(customizedItems);
  }

  private getEditingForm(): SchedulerEditingObject['form'] {
    const editing = this.getEditingObject();
    return editing?.form;
  }

  private getEditingObject(): SchedulerEditingObject | undefined {
    const { editing } = this.config;
    if (isBoolean(editing) || !editing) {
      return undefined;
    }
    return editing;
  }

  private getIconsShowMode(): AppointmentFormIconsShowMode {
    return this.getEditingForm()?.iconsShowMode ?? DEFAULT_ICONS_SHOW_MODE;
  }

  private createForm(items: FormProperties['items']): dxForm {
    const element = $('<div>');
    const {
      items: formItems, onContentReady, onInitialized, ...customFormOptions
    } = this.getEditingForm() ?? {};

    const defaultOptions: FormProperties = {
      items,
      formData: {},
      showColonAfterLabel: false,
      showValidationSummary: false,
      scrollingEnabled: false,
      labelLocation: 'top',
      colCountByScreen: {
        xs: 1,
      },
      elementAttr: {
        class: CLASSES.form,
      },
      onFieldDataChanged: (e) => {
        const {
          startDateExpr, endDateExpr, recurrenceRuleExpr,
        } = this.config.dataAccessors.expr;

        const { dataField } = e;

        if (!dataField) {
          return;
        }

        const isDateRangeChanged = [startDateExpr, endDateExpr].includes(dataField);
        const isRecurrenceRuleChanged = dataField === recurrenceRuleExpr;
        const isResourceChanged = Object.keys(this.config.resourceManager.resourceById)
          .includes(dataField);

        if (isDateRangeChanged) {
          this.updateDateEditorsValues();
        }

        if (isRecurrenceRuleChanged || startDateExpr === dataField) {
          this.recurrenceForm.updateRecurrenceFormValues(
            this.recurrenceRuleRaw,
            this.startDate,
          );
        }

        if (isRecurrenceRuleChanged) {
          this.updateRepeatEditorValue();
        }

        if (isResourceChanged) {
          this.updateSubjectIconColor().catch(noop);
        }
      },
      onInitialized: (e): void => {
        this.dxFormInstance = e.component;
        this.recurrenceForm.dxForm = this.dxForm;

        onInitialized?.call(this, e);
      },
      onContentReady: (e): void => {
        const $formElement = e.component.$element();
        this.$mainGroup = $formElement.find(`.${CLASSES.mainGroup}`);
        this.$recurrenceGroup = $formElement.find(`.${CLASSES.recurrenceGroup}`);

        this.alignIconsWithEditors();

        onContentReady?.call(this, e);
      },
    } as FormProperties;

    const formOptions = extend(true, defaultOptions, customFormOptions);
    return this.config.createComponent(element, dxForm, formOptions);
  }

  private createMainFormGroup(): GroupItem {
    return {
      name: MAIN_GROUP_NAME,
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
    const { textExpr } = this.config.dataAccessors.expr;

    return {
      name: SUBJECT_GROUP_NAME,
      itemType: 'group',
      cssClass: `${CLASSES.subjectGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          name: SUBJECT_ICON_NAME,
          colSpan: 1,
          cssClass: CLASSES.formIcon,
          template: createFormIconTemplate('isnotblank'),
        },
        {
          name: SUBJECT_EDITOR_NAME,
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
      name: DATE_GROUP_NAME,
      itemType: 'group',
      cssClass: `${CLASSES.dateRangeGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          name: DATE_ICON_NAME,
          colSpan: 1,
          cssClass: CLASSES.formIcon,
          template: createFormIconTemplate('clock'),
        },
        {
          colSpan: 1,
          name: DATE_OPTIONS_GROUP_NAME,
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
    const { allDayExpr, startDateExpr, endDateExpr } = this.config.dataAccessors.expr;

    return {
      name: ALL_DAY_EDITOR_NAME,
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
          this.updateDateTimeEditorsVisibility();

          const { startDate } = this;

          if (!startDate || e.event === undefined) {
            return;
          }

          if (e.value) {
            const allDayStartDate = dateUtils.trimTime(startDate);

            this.dxForm.updateData(startDateExpr, allDayStartDate);
            this.dxForm.updateData(endDateExpr, allDayStartDate);
          } else {
            startDate.setHours(this.config.startDayHour);

            const calculatedEndDate = this.config.getCalculatedEndDate(startDate);

            this.dxForm.updateData(startDateExpr, startDate);
            this.dxForm.updateData(endDateExpr, calculatedEndDate);
          }
        },
      } as SwitchProperties,
    } as SimpleItem;
  }

  private createStartDateGroup(): GroupItem {
    const {
      startDateExpr, startDateTimeZoneExpr, endDateTimeZoneExpr,
    } = this.config.dataAccessors.expr;

    return this.createDateGroup(
      startDateExpr,
      {
        name: START_DATE_GROUP_NAME,
        cssClass: CLASSES.startDateGroup,
      },
      {
        name: START_DATE_EDITOR_NAME,
        label: {
          text: messageLocalization.format('dxScheduler-editorLabelStartDate'),
        },
        cssClass: CLASSES.startDateEditor,
      },
      {
        name: START_TIME_EDITOR_NAME,
        cssClass: CLASSES.startTimeEditor,
        editorOptions: {
          inputAttr: {
            'aria-label': messageLocalization.format('dxScheduler-editorAriaLabelStartTime'),
          },
        },
      },
      {
        name: START_DATE_TIMEZONE_EDITOR_NAME,
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
    const { endDateExpr, endDateTimeZoneExpr } = this.config.dataAccessors.expr;

    return this.createDateGroup(
      endDateExpr,
      {
        name: END_DATE_GROUP_NAME,
        cssClass: CLASSES.endDateGroup,
      },
      {
        name: END_DATE_EDITOR_NAME,
        label: {
          text: messageLocalization.format('dxScheduler-editorLabelEndDate'),
        },
        cssClass: CLASSES.endDateEditor,
      },
      {
        name: END_TIME_EDITOR_NAME,
        cssClass: CLASSES.endTimeEditor,
        editorOptions: {
          inputAttr: {
            'aria-label': messageLocalization.format('dxScheduler-editorAriaLabelEndTime'),
          },
        },
      },
      {
        name: END_DATE_TIMEZONE_EDITOR_NAME,
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
    const allowTimeZoneEditing = this.getEditingObject()?.allowTimeZoneEditing;
    const { startDateExpr, endDateExpr } = this.config.dataAccessors.expr;
    const isStartDateEditor = dateExpr === startDateExpr;

    const getEditorsDate = (): Date | null => (isStartDateEditor ? this.startDate : this.endDate);

    const correctDateRange = (
      previousDateValue?: Date,
    ): void => {
      const { startDate, endDate } = this;

      if (!startDate || !endDate || startDate.getTime() <= endDate.getTime()) {
        return;
      }

      if (isStartDateEditor) {
        const duration = previousDateValue
          ? endDate.getTime() - previousDateValue.getTime()
          : 0;
        const correctedEndDate = new Date(startDate.getTime() + duration);

        this.dxForm.updateData(endDateExpr, correctedEndDate);
      } else {
        const duration = previousDateValue
          ? previousDateValue.getTime() - startDate.getTime()
          : 0;
        const correctedStartDate = new Date(endDate.getTime() - duration);

        this.dxForm.updateData(startDateExpr, correctedStartDate);
      }
    };

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
      correctDateRange(previousDateValue);
    };

    return {
      itemType: 'group',
      items: [
        {
          name: isStartDateEditor ? START_DATE_TIME_GROUP_NAME : END_DATE_TIME_GROUP_NAME,
          itemType: 'group',
          colCount: 2,
          colCountByScreen: {
            xs: 2,
          },
          items: [
            extend(
              true,
              getStartDateCommonConfig(this.config.firstDayOfWeek),
              {
                editorOptions: {
                  onValueChanged: (e) => {
                    dateValueChanged(e, (date: Date): void => {
                      date.setFullYear(
                        e.value.getFullYear(),
                        e.value.getMonth(),
                        e.value.getDate(),
                      );
                    });
                  },
                  onContentReady: (e): void => {
                    e.component.option('value', getEditorsDate());
                  },
                } as DateBoxProperties,
              },
              dateItemOptions,
            ),
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
                  firstDayOfWeek: this.config.firstDayOfWeek,
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
            }, timeItemOptions)],
        },
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
    const { recurrenceRuleExpr } = this.config.dataAccessors.expr;

    return {
      name: REPEAT_GROUP_NAME,
      itemType: 'group',
      cssClass: `${CLASSES.repeatGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          name: REPEAT_ICON_NAME,
          colSpan: 1,
          cssClass: CLASSES.formIcon,
          template: createFormIconTemplate('repeat'),
        },
        {
          name: REPEAT_EDITOR_NAME,
          colSpan: 1,
          itemType: 'simple',
          cssClass: CLASSES.repeatEditor,
          label: {
            text: messageLocalization.format('dxScheduler-editorLabelRecurrence'),
          },
          editorType: 'dxSelectBox',
          editorOptions: {
            items: getRepeatSelectItems(),
            valueExpr: 'value',
            displayExpr: 'text',
            onContentReady: (): void => {
              this.updateRepeatEditorValue();
            },
            onValueChanged: (e): void => {
              if (e.value === REPEAT_NEVER_VALUE) {
                this.dxForm.updateData(recurrenceRuleExpr, '');
              } else {
                const currentRecurrenceRule = this.recurrenceForm.recurrenceRule.toString() ?? '';
                const recurrenceRule = new RecurrenceRule(currentRecurrenceRule, this.startDate);
                recurrenceRule.frequency = e.value;
                this.dxForm.updateData(recurrenceRuleExpr, recurrenceRule.toString());
              }

              if (e.value !== REPEAT_NEVER_VALUE && e.event) {
                this.showRecurrenceGroup();
              }

              e.component.option('buttons', this.getRepeatEditorButtons());
            },
          } as SelectBoxProperties,
        },
      ],
    } as GroupItem;
  }

  private createDescriptionGroup(): GroupItem {
    const { descriptionExpr } = this.config.dataAccessors.expr;

    return {
      name: DESCRIPTION_GROUP_NAME,
      itemType: 'group',
      cssClass: `${CLASSES.descriptionGroup} ${CLASSES.groupWithIcon}`,
      items: [
        {
          name: DESCRIPTION_ICON_NAME,
          colSpan: 1,
          cssClass: CLASSES.formIcon,
          template: createFormIconTemplate('description'),
        },
        {
          name: DESCRIPTION_EDITOR_NAME,
          dataField: descriptionExpr,
          colSpan: 1,
          itemType: 'simple',
          cssClass: CLASSES.descriptionEditor,
          label: {
            text: messageLocalization.format('dxScheduler-editorLabelDescription'),
          },
          editorType: 'dxTextArea',
          editorOptions: {
            minHeight: 100,
          } as TextAreaProperties,
        },
      ],
    } as GroupItem;
  }

  private createResourcesGroup(): GroupItem {
    const resourceById = Object.values(this.config.resourceManager.resourceById);
    const resourcesLoaders: ResourceLoader[] = resourceById;

    let resourcesItems: FormItem[] = resourcesLoaders.map((resourceLoader) => {
      const { dataSource, dataAccessor } = resourceLoader;
      const dataField = resourceLoader.resourceIndex;
      const name = `${dataField}Editor`;
      const label = resourceLoader.resourceName ?? dataField;
      const editorType = resourceLoader.allowMultiple ? 'dxTagBox' : 'dxSelectBox';

      return {
        itemType: 'simple',
        name,
        dataField,
        label: { text: label },
        colSpan: 1,
        editorType,
        editorOptions: {
          dataSource,
          displayExpr: dataAccessor.textExpr,
          valueExpr: dataAccessor.idExpr,
        },
      } as SimpleItem;
    });

    const noCustomResourceIcons = resourcesLoaders.every((resource) => !resource.icon);

    if (noCustomResourceIcons) {
      return {
        name: RESOURCES_GROUP_NAME,
        itemType: 'group',
        visible: resourcesItems.length > 0,
        cssClass: `${CLASSES.resourcesGroup} ${CLASSES.groupWithIcon}`,
        items: [
          {
            name: RESOURCES_GROUP_ICON_NAME,
            colSpan: 1,
            cssClass: `${CLASSES.formIcon} ${CLASSES.defaultResourceIcon}`,
            template: createFormIconTemplate('addcircleoutline'),
          },
          {
            name: RESOURCE_EDITORS_GROUP_NAME,
            itemType: 'group',
            colSpan: 1,
            items: resourcesItems,
          },
        ],
      } as GroupItem;
    }

    resourcesItems = resourcesItems.map((item, index) => {
      const icon = resourcesLoaders[index].icon ?? '';
      const dataField = resourcesLoaders[index].resourceIndex;

      return {
        itemType: 'group',
        name: `${dataField}Group`,
        cssClass: CLASSES.groupWithIcon,
        items: [
          {
            colSpan: 1,
            name: `${dataField}Icon`,
            cssClass: CLASSES.formIcon,
            template: createFormIconTemplate(icon),
          },
          item,
        ],
      } as GroupItem;
    });

    return {
      name: RESOURCES_GROUP_NAME,
      itemType: 'group',
      colCount: 1,
      colCountByScreen: {
        xs: 1,
      },
      cssClass: CLASSES.resourcesGroup,
      items: resourcesItems,
    } as GroupItem;
  }

  private applyFormItemDefaults(item: FormItem, showIcon: boolean): void {
    const itemClasses = (item.cssClass ?? '').split(' ');
    const isIconItem = itemClasses.includes(CLASSES.formIcon);

    if (isIconItem) {
      item.visible = showIcon;
      return;
    }

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

      if (itemClasses.includes(CLASSES.groupWithIcon)) {
        const colCount = showIcon ? 2 : 1;
        groupItem.colCount = colCount;
        groupItem.colCountByScreen = { xs: colCount };
      }

      groupItem.items?.forEach((child) => {
        this.applyFormItemDefaults(child, showIcon);
      });
    }
  }

  private alignIconsWithEditors(): void {
    const $groups = this.dxForm.$element().find(`.${CLASSES.groupWithIcon}`);

    $groups.toArray().forEach((groupElement) => {
      const iconElement = groupElement.querySelector(`.${CLASSES.formIcon}`);

      const itemElements = groupElement.querySelectorAll(`.${CLASSES.formItem}`);
      const firstSimpleItemElement = Array.from(itemElements)
        .find((itemElement) => {
          const isGroup = itemElement.querySelector(`.${CLASSES.formItem}`) !== null;
          const isIcon = itemElement.querySelector(`.${CLASSES.formIcon}`) !== null;

          return !isGroup && !isIcon;
        });

      if (!firstSimpleItemElement || !iconElement) {
        return;
      }

      const hasTopLabel = firstSimpleItemElement.querySelector(`.${CLASSES.labelTop}`) !== null;
      const hasInnerLabel = !hasTopLabel && firstSimpleItemElement.querySelector(`.${CLASSES.label}`) !== null;

      iconElement.classList.toggle(CLASSES.formIconTopLabelOffset, hasTopLabel);
      iconElement.classList.toggle(CLASSES.formIconInnerLabelOffset, hasInnerLabel);
    });
  }

  showMainGroup(): void {
    const currentHeight = this.dxPopup.option('height') as string | number | undefined;
    const configuredHeight = this.getEditingObject()?.popup?.height ?? 'auto';

    if (typeof currentHeight === 'number') {
      this.dxPopup.option('height', configuredHeight);
    }

    if (this.$mainGroup) {
      this.$mainGroup.removeClass(CLASSES.mainHidden);
      this.$mainGroup.removeAttr('inert');

      this.focusFirstFocusableInGroup(this.$mainGroup);
    }

    if (this.$recurrenceGroup) {
      this.$recurrenceGroup.addClass(CLASSES.recurrenceHidden);
      this.$recurrenceGroup.attr('inert', true);
    }

    this._popup.updateToolbarForMainGroup();
  }

  showRecurrenceGroup(): void {
    const repeatEditor = this.dxForm.getEditor(REPEAT_EDITOR_NAME);
    if (repeatEditor instanceof DropDownEditor) {
      repeatEditor.close();
    }

    this.updateAnimationOffset();

    const currentHeight = this.dxPopup.option('height') as string | number | undefined;

    if (currentHeight === 'auto' || currentHeight === undefined) {
      const overlayHeight = this.dxPopup.$overlayContent().get(0).clientHeight;
      this.dxPopup.option('height', overlayHeight);
    }

    if (this.$mainGroup) {
      this.$mainGroup.addClass(CLASSES.mainHidden);
      this.$mainGroup.attr('inert', true);
    }

    if (this.$recurrenceGroup) {
      this.$recurrenceGroup.removeClass(CLASSES.recurrenceHidden);
      this.$recurrenceGroup.removeAttr('inert');

      this.focusFirstFocusableInGroup(this.$recurrenceGroup);
    }

    this._popup.updateToolbarForRecurrenceGroup();
  }

  saveRecurrenceValue(): void {
    const { recurrenceRule } = this.recurrenceForm;
    const { recurrenceRuleExpr } = this.config.dataAccessors.expr;

    const recurrenceRuleSerialized = recurrenceRule.toString() ?? '';

    this.dxForm.updateData(
      recurrenceRuleExpr,
      recurrenceRuleSerialized,
    );

    if (recurrenceRuleSerialized) {
      this.dxForm.getEditor(START_DATE_EDITOR_NAME)?.option('value', recurrenceRule.startDate);
    }
  }

  private async updateSubjectIconColor(): Promise<void> {
    const groupValues = getRawAppointmentGroupValues(
      this.formData as SafeAppointment,
      this.resourceManager.resources,
    );
    const groupIndex = getAppointmentGroupIndex(
      getSafeGroupValues(groupValues),
      this.resourceManager.groupsLeafs,
    )[0];
    const color = await this.resourceManager.getAppointmentColor({
      itemData: this.formData as SafeAppointment,
      groupIndex,
    });

    const $icon = this.dxForm.$element().find(`.${CLASSES.subjectGroup} .${CLASSES.formIcon} .${CLASSES.icon}`);

    $icon.css('color', color ?? '');
  }

  private updateDateEditorsValues(): void {
    const startDateEditor = this.dxForm.getEditor(START_DATE_EDITOR_NAME);
    const startTimeEditor = this.dxForm.getEditor(START_TIME_EDITOR_NAME);
    const endDateEditor = this.dxForm.getEditor(END_DATE_EDITOR_NAME);
    const endTimeEditor = this.dxForm.getEditor(END_TIME_EDITOR_NAME);

    startDateEditor?.option('value', this.startDate);
    startTimeEditor?.option('value', this.startDate);
    endDateEditor?.option('value', this.endDate);
    endTimeEditor?.option('value', this.endDate);
  }

  private updateRepeatEditorValue(): void {
    const repeatEditor = this.dxForm.getEditor(REPEAT_EDITOR_NAME);

    if (!repeatEditor) {
      return;
    }

    if (this.recurrenceRuleRaw === null) {
      repeatEditor.option('value', REPEAT_NEVER_VALUE);
    } else {
      const recurrenceRule = new RecurrenceRule(this.recurrenceRuleRaw, this.startDate);
      const { frequency } = recurrenceRule;
      const value = frequency ?? REPEAT_NEVER_VALUE;

      repeatEditor.option('value', value);
    }
  }

  private getRepeatEditorButtons(): TextEditorButton[] {
    const buttons: TextEditorButton[] = [];

    const repeatEditor = this.dxForm.getEditor(REPEAT_EDITOR_NAME);
    const selectedValue = repeatEditor?.option('value');

    if (selectedValue && selectedValue !== 'never') {
      buttons.push({
        location: 'after',
        name: 'settings',
        options: {
          disabled: false,
          icon: 'optionsoutline',
          stylingMode: 'text',
          onClick: (): void => {
            this.showRecurrenceGroup();
          },
          elementAttr: {
            class: `${CLASSES.recurrenceSettingsButton} dx-shape-standard`,
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
    const { allDayExpr } = this.config.dataAccessors.expr;
    const visible = !this.getFormDataField(allDayExpr);

    const dateOptionsGroupPath = `${MAIN_GROUP_NAME}.${DATE_GROUP_NAME}.${DATE_OPTIONS_GROUP_NAME}`;
    const startDateGroupPath = `${dateOptionsGroupPath}.${START_DATE_GROUP_NAME}.${START_DATE_TIME_GROUP_NAME}`;
    const endDateGroupPath = `${dateOptionsGroupPath}.${END_DATE_GROUP_NAME}.${END_DATE_TIME_GROUP_NAME}`;

    const startDateItemName = `${startDateGroupPath}.${START_DATE_EDITOR_NAME}`;
    const startTimeItemName = `${startDateGroupPath}.${START_TIME_EDITOR_NAME}`;
    const endDateItemName = `${endDateGroupPath}.${END_DATE_EDITOR_NAME}`;
    const endTimeItemName = `${endDateGroupPath}.${END_TIME_EDITOR_NAME}`;

    this.dxForm.beginUpdate();
    this.dxForm.itemOption(startDateItemName, 'colSpan', visible ? 1 : 2);
    this.dxForm.itemOption(startTimeItemName, 'visible', visible);
    this.dxForm.itemOption(endDateItemName, 'colSpan', visible ? 1 : 2);
    this.dxForm.itemOption(endTimeItemName, 'visible', visible);
    this.dxForm.endUpdate();
  }

  private updateAnimationOffset(): void {
    if (!this.$mainGroup) {
      return;
    }

    const formElement = this.dxForm.$element()[0];
    const mainGroupElement = this.$mainGroup[0];
    const formRect = formElement.getBoundingClientRect();
    const groupRect = mainGroupElement.getBoundingClientRect();
    const topOffset = groupRect.top - formRect.top;
    formElement.style.setProperty('--dx-scheduler-animation-top', `${topOffset}px`);
  }

  private focusFirstFocusableInGroup($group: dxElementWrapper): void {
    const focusTarget = $group.find(`.${CLASSES.fieldItemContent} [tabindex]`).first().get(0) as HTMLElement;
    focusTarget?.focus({ preventScroll: true });
  }
}
