import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
  OneWay,
  Consumer,
} from '@devextreme-generator/declarations';
import { Form } from '../../../form/wrapper/form';
import { AppointmentData } from '../../appointment/types';
import { DataAccessorType } from '../../types';
import { getFormLayoutConfig } from './config/formLayout';
import { FormDate } from './utils/normalizeDate';
import type { GroupItem } from '../../../../../ui/form.d';
import { FormContext, IFormContext } from '../../form_context';
import { JSXEndDateEditorTemplate, JSXStartDateEditorTemplate, JSXTimeZoneEditorTemplate } from './type';
import { StartDateEditor } from './editors/startDateEditor';
import { EndDateEditor } from './editors/endDateEditor';
import { TimeZoneEditor } from './editors/timeZoneEditor';

const FormColCount = { lg: 2, xs: 1 };
export const viewFunction = ({
  formContextValue,
  formItems,
}: EditForm): JSX.Element => (
  <Form
    formData={formContextValue.formData}
    items={formItems}
    showValidationSummary
    scrollingEnabled
    colCountByScreen={FormColCount}
    showColonAfterLabel={false}
    colCount="auto"
    labelLocation="top"
  />
);

@ComponentBindings()
export class EditFormProps {
  @OneWay() allowUpdating!: boolean;

  @OneWay() firstDayOfWeek?: number;

  @OneWay() appointmentData!: AppointmentData;

  @OneWay() dataAccessors!: DataAccessorType;

  @OneWay() allowTimeZoneEditing?: boolean;

  @Template() startDateEditorTemplate: JSXStartDateEditorTemplate = StartDateEditor;

  @Template() endDateEditorTemplate: JSXEndDateEditorTemplate = EndDateEditor;

  @Template() timeZoneEditorTemplate: JSXTimeZoneEditorTemplate = TimeZoneEditor;
}

@Component({ view: viewFunction })
export class EditForm extends
  JSXComponent<EditFormProps, 'allowUpdating' | 'appointmentData' | 'dataAccessors'>() {
  @Consumer(FormContext)
  formContextValue!: IFormContext;

  startDateChange(date: Date): void {
    this.formContextValue.formData.startDate = date;
  }

  endDateChange(date: Date): void {
    this.formContextValue.formData.endDate = date;
  }

  startDateTimeZoneChange(timeZone: string): void {
    this.formContextValue.formData.startDateTimeZone = timeZone;
  }

  endDateTimeZoneChange(timeZone: string): void {
    this.formContextValue.formData.endDateTimeZone = timeZone;
  }

  get formItems(): GroupItem[] {
    const { formData } = this.formContextValue;
    const StartDateTemplate = this.props.startDateEditorTemplate;
    const EndDateTemplate = this.props.endDateEditorTemplate;
    const TimeZoneTemplate = this.props.timeZoneEditorTemplate;
    const { allDay } = this.formContextValue.formData;

    const {
      startDateTimeZone = '',
      endDateTimeZone = '',
    } = this.props.appointmentData;

    return getFormLayoutConfig(
      this.props.dataAccessors.expr,
      formData,
      this.props.allowTimeZoneEditing,
      () => (
        <StartDateTemplate
          value={this.props.appointmentData.startDate}
          dateChange={this.startDateChange}
          startDate={formData.startDate as FormDate}
          endDate={formData.endDate as FormDate}
          firstDayOfWeek={this.props.firstDayOfWeek}
          isAllDay={allDay as boolean}
        />
      ),
      () => (
        <EndDateTemplate
          value={this.props.appointmentData.endDate}
          dateChange={this.endDateChange}
          startDate={formData.startDate as FormDate}
          endDate={formData.endDate as FormDate}
          firstDayOfWeek={this.props.firstDayOfWeek}
          isAllDay={allDay as boolean}
        />
      ),
      () => (
        <TimeZoneTemplate
          value={startDateTimeZone}
          valueChange={this.startDateTimeZoneChange}
          date={this.props.appointmentData.startDate}
        />
      ),
      () => (
        <TimeZoneTemplate
          value={endDateTimeZone}
          valueChange={this.endDateTimeZoneChange}
          date={this.props.appointmentData.endDate}
        />
      ),
    );
  }
}
