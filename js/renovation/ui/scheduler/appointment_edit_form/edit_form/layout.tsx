import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
  OneWay,
  Consumer,
  InternalState,
  Effect,
} from '@devextreme-generator/declarations';
import { Form } from '../../../form/wrapper/form';
import type { AppointmentData } from '../../appointment/types';
import type { DataAccessorType } from '../../types';
import { getFormLayoutConfig } from './layout_items/formLayout';
import { FormDate } from './utils/normalizeDate';
import type { GroupItem } from '../../../../../ui/form.d';
import { FormContext, IFormContext } from '../../form_context';
import {
  JSXDescriptionEditorTemplate,
  JSXEndDateEditorTemplate,
  JSXStartDateEditorTemplate,
  JSXSwitchEditorTemplate,
  JSXTimeZoneEditorTemplate,
} from './type';
import { StartDateEditor } from './editors/startDateEditor';
import { EndDateEditor } from './editors/endDateEditor';
import { TimeZoneEditor } from './editors/timeZoneEditor';
import { SwitchEditor } from './editors/switchEditor';
import { DescriptionEditor } from './editors/descriptionEditor';

const FormColCount = { lg: 2, xs: 1 };

// istanbul ignore next: should be tested in React infrastructure
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

  @Template() allDayEditorTemplate: JSXSwitchEditorTemplate = SwitchEditor;

  @Template() repeatEditorTemplate: JSXSwitchEditorTemplate = SwitchEditor;

  @Template() descriptionEditorTemplate: JSXDescriptionEditorTemplate = DescriptionEditor;
}

@Component({ view: viewFunction })
export class EditForm extends
  JSXComponent<EditFormProps, 'allowUpdating' | 'appointmentData' | 'dataAccessors'>() {
  @Consumer(FormContext)
  formContextValue!: IFormContext;

  @InternalState()
  isAllDay?: boolean;

  /* istanbul ignore next - syntetic jest */
  @Effect({ run: 'once' })
  updateState(): void {
    if (this.isAllDay === undefined) {
      this.isAllDay = !!this.formContextValue.formData.allDay;
    }
  }

  startDateChange(date: Date): void {
    this.formContextValue.formData.startDate = date; // TODO update appointment
  }

  endDateChange(date: Date): void {
    this.formContextValue.formData.endDate = date; // TODO update appointment
  }

  startDateTimeZoneChange(timeZone: string): void {
    this.formContextValue.formData.startDateTimeZone = timeZone; // TODO update appointment
  }

  endDateTimeZoneChange(timeZone: string): void {
    this.formContextValue.formData.endDateTimeZone = timeZone; // TODO update appointment
  }

  allDayChange(value: boolean): void {
    this.isAllDay = value;

    this.formContextValue.formData.allDay = value; // TODO update appointment
  }

  repeatChange(value: boolean): void {
    this.formContextValue.formData.repeat = value; // TODO recurrenceEditor
  }

  descriptionChange(value: string): void {
    this.formContextValue.formData.description = value;
  }

  get formItems(): GroupItem[] {
    const { formData } = this.formContextValue;
    const StartDateTemplate = this.props.startDateEditorTemplate;
    const EndDateTemplate = this.props.endDateEditorTemplate;
    const TimeZoneTemplate = this.props.timeZoneEditorTemplate;
    const AllDayTemplate = this.props.allDayEditorTemplate;
    const RepeatTemplate = this.props.repeatEditorTemplate;
    const DescriptionTemplate = this.props.descriptionEditorTemplate;
    const { recurrenceRule } = this.formContextValue.formData;
    const isRecurrence = !!recurrenceRule;

    const { appointmentData } = this.props;
    const { firstDayOfWeek } = this.props;

    const {
      startDateTimeZone,
      endDateTimeZone,
    } = appointmentData;

    const allDay = !!this.isAllDay;

    return getFormLayoutConfig(
      this.props.dataAccessors.expr,
      formData,
      this.props.allowTimeZoneEditing,
      <StartDateTemplate
        value={appointmentData.startDate}
        dateChange={this.startDateChange}
        startDate={formData.startDate as FormDate}
        endDate={formData.endDate as FormDate}
        firstDayOfWeek={firstDayOfWeek}
        isAllDay={allDay}
      />,
      /* istanbul ignore next - syntetic jest */
      <EndDateTemplate
        value={this.props.appointmentData.endDate}
        dateChange={this.endDateChange}
        startDate={formData.startDate as FormDate}
        endDate={formData.endDate as FormDate}
        firstDayOfWeek={this.props.firstDayOfWeek}
        isAllDay={allDay}
      />,
      /* istanbul ignore next - syntetic jest */
      <TimeZoneTemplate
        value={startDateTimeZone}
        valueChange={this.startDateTimeZoneChange}
        date={this.props.appointmentData.startDate}
      />,
      /* istanbul ignore next - syntetic jest */
      <TimeZoneTemplate
        value={endDateTimeZone}
        valueChange={this.endDateTimeZoneChange}
        date={this.props.appointmentData.endDate}
      />,
      /* istanbul ignore next - syntetic jest */
      <AllDayTemplate
        value={allDay}
        valueChange={this.allDayChange}
      />,
      /* istanbul ignore next - syntetic jest */
      <RepeatTemplate
        value={isRecurrence}
        valueChange={this.repeatChange}
      />,
      /* istanbul ignore next - syntetic jest */
      <DescriptionTemplate
        value={this.props.appointmentData.description}
        valueChange={this.descriptionChange}
      />,
    );
  }
}
