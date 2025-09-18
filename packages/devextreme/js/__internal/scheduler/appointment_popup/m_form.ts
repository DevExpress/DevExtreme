import '../m_recurrence_editor';
import '@js/ui/text_area';
import '@js/ui/tag_box';
import '@js/ui/switch';
import '@js/ui/select_box';

import messageLocalization from '@js/common/core/localization/message';
import DataSource from '@js/common/data/data_source';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import dateSerialization from '@js/core/utils/date_serialization';
import { extend } from '@js/core/utils/extend';
import Form, { type Item } from '@js/ui/form';
import { current, isFluent } from '@js/ui/themes';

import timeZoneUtils from '../m_utils_time_zone';

const SCREEN_SIZE_OF_SINGLE_COLUMN = 600;

export const APPOINTMENT_FORM_GROUP_NAMES = {
  Main: 'mainGroup',
  Recurrence: 'recurrenceGroup',
};

// TODO: Remove duplication in the scheduler's popup testing model.
// NOTE: These CSS classes allow access the editors
// from e2e testcafe tests.
const E2E_TEST_CLASSES = {
  form: 'e2e-dx-scheduler-form',
  textEditor: 'e2e-dx-scheduler-form-text',
  descriptionEditor: 'e2e-dx-scheduler-form-description',
  startDateEditor: 'e2e-dx-scheduler-form-start-date',
  endDateEditor: 'e2e-dx-scheduler-form-end-date',
  startDateTimeZoneEditor: 'e2e-dx-scheduler-form-start-date-timezone',
  endDateTimeZoneEditor: 'e2e-dx-scheduler-form-end-date-timezone',
  allDaySwitch: 'e2e-dx-scheduler-form-all-day-switch',
  recurrenceSwitch: 'e2e-dx-scheduler-form-recurrence-switch',
};

const createTimeZoneDataSource = () => new DataSource({
  store: timeZoneUtils.getTimeZonesCache(),
  paginate: true,
  pageSize: 10,
});

const getStylingModeFunc = (): string | undefined => (isFluent(current()) ? 'filled' : undefined);

const getStartDateWithStartHour = (startDate, startDayHour) => new Date(new Date(startDate).setHours(startDayHour));

const validateAppointmentFormDate = (editor, value, previousValue) => {
  const isCurrentDateCorrect = value === null || Boolean(value);
  const isPreviousDateCorrect = previousValue === null || Boolean(previousValue);
  if (!isCurrentDateCorrect && isPreviousDateCorrect) {
    editor.option('value', previousValue);
  }
};

const updateRecurrenceItemVisibility = (recurrenceRuleExpr, value, form) => {
  form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence, 'visible', value);
  form.getEditor(recurrenceRuleExpr)?.changeValueByVisibility(value);
};

const defaultFormOptions = {
  showValidationSummary: true,
  scrollingEnabled: true,
  colCount: 'auto',
  colCountByScreen: {
    lg: 2,
    xs: 1,
  },
  showColonAfterLabel: false,
  labelLocation: 'top',
  screenByWidth: (width) => (width < SCREEN_SIZE_OF_SINGLE_COLUMN || devices.current().deviceType !== 'desktop' ? 'xs' : 'lg'),
  elementAttr: {
    class: E2E_TEST_CLASSES.form,
  },
};

export class AppointmentForm {
  scheduler: any;

  form: Form;

  // NOTE: flag to prevent double value set during form updating
  private isFormUpdating = false;

  constructor(scheduler) {
    this.scheduler = scheduler;
    const element = $('<div>');

    this.form = this.scheduler.createComponent(element, Form, {
      onInitialized: (e) => {
        this.form = e.component;
      },
      ...defaultFormOptions,
    });
  }

  get dxForm() {
    return this.form;
  }

  set readOnly(value) {
    this.form.option('readOnly', value);
    const { recurrenceRuleExpr } = this.scheduler.getDataAccessors().expr;

    const recurrenceEditor = this.form.getEditor(recurrenceRuleExpr);
    recurrenceEditor?.option('readOnly', value);
  }

  get formData() {
    return this.form.option('formData');
  }

  set formData(value) {
    this.form.option('formData', value);
  }

  create(triggerResize, changeSize, formData) {
    const { allowTimeZoneEditing } = this.scheduler.getEditingConfig();
    const dataAccessors = this.scheduler.getDataAccessors();
    const { expr } = dataAccessors;

    const isRecurrence = Boolean(dataAccessors.get('recurrenceRule', formData));
    const colSpan = isRecurrence ? 1 : 2;

    const mainItems = [
      ...this.createMainItems(expr, triggerResize, changeSize, allowTimeZoneEditing),
      ...this.scheduler.createResourceEditorModel(),
    ];

    changeSize(isRecurrence);

    const items: Item[] = [
      {
        itemType: 'group',
        name: APPOINTMENT_FORM_GROUP_NAMES.Main,
        colCountByScreen: {
          lg: 2,
          xs: 1,
        },
        colSpan,
        items: mainItems,
      }, {
        itemType: 'group',
        name: APPOINTMENT_FORM_GROUP_NAMES.Recurrence,
        visible: isRecurrence,
        colSpan,
        items: this.createRecurrenceEditor(expr),
      },
    ];

    this.form.option({
      items,
      formData,
    });
  }

  private dateBoxValueChanged(args, dateExpr, isNeedCorrect) {
    validateAppointmentFormDate(args.component, args.value, args.previousValue);

    const value = dateSerialization.deserializeDate(args.value);
    const previousValue = dateSerialization.deserializeDate(args.previousValue);
    const dateEditor = this.form.getEditor(dateExpr);
    // @ts-expect-error should be fixed in the future
    const dateValue = dateSerialization.deserializeDate(dateEditor.option('value'));

    if (!this.isFormUpdating && dateValue && value && isNeedCorrect(dateValue, value)) {
      const duration = previousValue ? dateValue.getTime() - previousValue.getTime() : 0;
      // @ts-expect-error should be fixed in the future
      dateEditor.option('value', new Date(value.getTime() + duration));
    }
  }

  private createTimezoneEditor(timeZoneExpr, secondTimeZoneExpr, visibleIndex, colSpan, isMainTimeZone, cssClass, visible = false) {
    const noTzTitle = messageLocalization.format('dxScheduler-noTimezoneTitle');

    return {
      name: this.normalizeEditorName(timeZoneExpr),
      dataField: timeZoneExpr,
      editorType: 'dxSelectBox',
      visibleIndex,
      colSpan,
      cssClass,
      label: {
        text: ' ',
      },
      editorOptions: {
        displayExpr: 'title',
        valueExpr: 'id',
        placeholder: noTzTitle,
        searchEnabled: true,
        dataSource: createTimeZoneDataSource(),
        onValueChanged: (args) => {
          const { form } = this;
          const secondTimezoneEditor = form.getEditor(secondTimeZoneExpr);
          if (isMainTimeZone) {
            // @ts-expect-error should be fixed in the future
            secondTimezoneEditor.option('value', args.value);
          }
        },
      },
      visible,
    };
  }

  private createDateBoxItems(dataExprs, allowTimeZoneEditing) {
    const colSpan = allowTimeZoneEditing ? 2 : 1;
    const firstDayOfWeek = this.scheduler.getFirstDayOfWeek();

    return [
      this.createDateBoxEditor(
        dataExprs.startDateExpr,
        colSpan,
        firstDayOfWeek,
        'dxScheduler-editorLabelStartDate',
        E2E_TEST_CLASSES.startDateEditor,
        (args) => {
          this.dateBoxValueChanged(args, dataExprs.endDateExpr, (endValue, startValue) => endValue < startValue);
        },
      ),

      this.createTimezoneEditor(
        dataExprs.startDateTimeZoneExpr,
        dataExprs.endDateTimeZoneExpr,
        1,
        colSpan,
        true,
        E2E_TEST_CLASSES.startDateTimeZoneEditor,
        allowTimeZoneEditing,
      ),

      this.createDateBoxEditor(
        dataExprs.endDateExpr,
        colSpan,
        firstDayOfWeek,
        'dxScheduler-editorLabelEndDate',
        E2E_TEST_CLASSES.endDateEditor,
        (args) => {
          this.dateBoxValueChanged(args, dataExprs.startDateExpr, (startValue, endValue) => endValue < startValue);
        },
      ),

      this.createTimezoneEditor(
        dataExprs.endDateTimeZoneExpr,
        dataExprs.startDateTimeZoneExpr,
        3,
        colSpan,
        false,
        E2E_TEST_CLASSES.endDateTimeZoneEditor,
        allowTimeZoneEditing,
      ),
    ];
  }

  private changeFormItemDateType(name: string, groupName: string, isAllDay: boolean): void {
    const editorPath = this.getEditorPath(name, groupName);
    const itemEditorOptions = this.form.itemOption(editorPath).editorOptions;

    const type = isAllDay ? 'date' : 'datetime';

    const newEditorOption = { ...itemEditorOptions, type };

    this.form.itemOption(editorPath, 'editorOptions', newEditorOption);
  }

  private createMainItems(dataExprs, triggerResize, changeSize, allowTimeZoneEditing) {
    return [
      {
        name: this.normalizeEditorName(dataExprs.textExpr),
        dataField: dataExprs.textExpr,
        cssClass: E2E_TEST_CLASSES.textEditor,
        editorType: 'dxTextBox',
        colSpan: 2,
        label: {
          text: messageLocalization.format('dxScheduler-editorLabelTitle'),
        },
        editorOptions: {
          stylingMode: getStylingModeFunc(),
        },
      },
      {
        itemType: 'group',
        colSpan: 2,
        colCountByScreen: {
          lg: 2,
          xs: 1,
        },
        items: this.createDateBoxItems(dataExprs, allowTimeZoneEditing),
      },
      {
        itemType: 'group',
        colSpan: 2,
        colCountByScreen: {
          lg: 2,
          xs: 2,
        },
        items: [{
          name: this.normalizeEditorName(dataExprs.allDayExpr),
          dataField: dataExprs.allDayExpr,
          cssClass: `dx-appointment-form-switch ${E2E_TEST_CLASSES.allDaySwitch}`,
          editorType: 'dxSwitch',
          label: {
            text: messageLocalization.format('dxScheduler-allDay'),
            location: 'right',
          },
          editorOptions: {
            onValueChanged: (args) => {
              const { value } = args;
              const startDateEditor = this.form.getEditor(dataExprs.startDateExpr);
              const endDateEditor = this.form.getEditor(dataExprs.endDateExpr);
              // @ts-expect-error should be fixed in the future
              const startDate = dateSerialization.deserializeDate(startDateEditor.option('value'));

              if (!this.isFormUpdating && startDate) {
                if (value) {
                  const allDayStartDate = dateUtils.trimTime(startDate);
                  // @ts-expect-error should be fixed in the future
                  startDateEditor.option('value', new Date(allDayStartDate));
                  // @ts-expect-error should be fixed in the future
                  endDateEditor.option('value', new Date(allDayStartDate));
                } else {
                  const startDateWithStartHour = getStartDateWithStartHour(startDate, this.scheduler.getStartDayHour());
                  const endDate = this.scheduler.getCalculatedEndDate(startDateWithStartHour);
                  // @ts-expect-error should be fixed in the future
                  startDateEditor.option('value', startDateWithStartHour);
                  // @ts-expect-error should be fixed in the future
                  endDateEditor.option('value', endDate);
                }
              }

              this.changeFormItemDateType(dataExprs.startDateExpr, 'Main', value);
              this.changeFormItemDateType(dataExprs.endDateExpr, 'Main', value);
            },
          },
        }, {
          editorType: 'dxSwitch',
          dataField: 'repeat',
          cssClass: `dx-appointment-form-switch ${E2E_TEST_CLASSES.recurrenceSwitch}`,
          name: 'visibilityChanged',
          label: {
            text: messageLocalization.format('dxScheduler-editorLabelRecurrence'),
            location: 'right',
          },
          editorOptions: {
            onValueChanged: (args) => {
              const { form } = this;
              const colSpan = args.value ? 1 : 2;

              form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Main, 'colSpan', colSpan);
              form.itemOption(APPOINTMENT_FORM_GROUP_NAMES.Recurrence, 'colSpan', colSpan);

              updateRecurrenceItemVisibility(dataExprs.recurrenceRuleExpr, args.value, form);

              changeSize(args.value);
              triggerResize();
            },
          },
        }],
      },
      {
        itemType: 'empty',
        colSpan: 2,
      },
      {
        name: this.normalizeEditorName(dataExprs.descriptionExpr),
        dataField: dataExprs.descriptionExpr,
        cssClass: E2E_TEST_CLASSES.descriptionEditor,
        editorType: 'dxTextArea',
        colSpan: 2,
        label: {
          text: messageLocalization.format('dxScheduler-editorLabelDescription'),
        },
        editorOptions: {
          stylingMode: getStylingModeFunc(),
        },
      },
      {
        itemType: 'empty',
        colSpan: 2,
      },
    ];
  }

  private createRecurrenceEditor(dataExprs) {
    return [{
      name: this.normalizeEditorName(dataExprs.recurrenceRuleExpr),
      dataField: dataExprs.recurrenceRuleExpr,
      editorType: 'dxRecurrenceEditor',
      editorOptions: {
        firstDayOfWeek: this.scheduler.getFirstDayOfWeek(),
        timeZoneCalculator: this.scheduler.getTimeZoneCalculator(),
        getStartDateTimeZone: () => this.scheduler.getDataAccessors().get('startDateTimeZone', this.formData),
      },
      label: {
        text: ' ',
        visible: false,
      },
    }];
  }

  private setEditorsType(allDay) {
    const { startDateExpr, endDateExpr } = this.scheduler.getDataAccessors().expr;

    const startDateItemPath = this.getEditorPath(startDateExpr, 'Main');
    const endDateItemPath = this.getEditorPath(endDateExpr, 'Main');

    const startDateFormItem = this.form.itemOption(startDateItemPath);
    const endDateFormItem = this.form.itemOption(endDateItemPath);

    if (startDateFormItem && endDateFormItem) {
      const startDateEditorOptions = startDateFormItem.editorOptions;
      const endDateEditorOptions = endDateFormItem.editorOptions;

      startDateEditorOptions.type = endDateEditorOptions.type = allDay ? 'date' : 'datetime';

      this.form.itemOption(startDateItemPath, 'editorOptions', startDateEditorOptions);
      this.form.itemOption(endDateItemPath, 'editorOptions', endDateEditorOptions);
    }
  }

  private updateRecurrenceEditorStartDate(date, expression) {
    const options = { startDate: date };

    this.setEditorOptions(expression, 'Recurrence', options);
  }

  private setEditorOptions(name, groupName: 'Main' | 'Recurrence', options) {
    const editorPath = this.getEditorPath(name, groupName);
    const editor = this.form.itemOption(editorPath);

    editor && this.form.itemOption(editorPath, 'editorOptions', extend({}, editor.editorOptions, options));
  }

  updateFormData(formData: Record<string, any>): void {
    this.isFormUpdating = true;
    this.form.option('formData', formData);

    const dataAccessors = this.scheduler.getDataAccessors();
    const { expr } = dataAccessors;

    const rawStartDate = dataAccessors.get('startDate', formData);

    const allDay = dataAccessors.get('allDay', formData);
    const startDate = new Date(rawStartDate);

    this.updateRecurrenceEditorStartDate(startDate, expr.recurrenceRuleExpr);

    this.setEditorsType(allDay);
    this.isFormUpdating = false;
  }

  private createDateBoxEditor(dataField, colSpan, firstDayOfWeek, label, cssClass, onValueChanged) {
    return {
      editorType: 'dxDateBox',
      name: this.normalizeEditorName(dataField),
      dataField,
      colSpan,
      cssClass,
      label: {
        text: messageLocalization.format(label),
      },
      validationRules: [{
        type: 'required',
      }],
      editorOptions: {
        stylingMode: getStylingModeFunc(),
        width: '100%',
        calendarOptions: {
          firstDayOfWeek,
        },
        onValueChanged,
        useMaskBehavior: true,
      },
    };
  }

  private getEditorPath(name: string, groupName: string): string {
    const normalizedName = this.normalizeEditorName(name);
    return `${APPOINTMENT_FORM_GROUP_NAMES[groupName]}.${normalizedName}`;
  }

  private normalizeEditorName(name: string): string {
    // NOTE: This ternary operator covers the "recurrenceRuleExpr: null/''" scenarios.
    return name
      ? name.replace(/\./g, '_')
      : name;
  }
}
