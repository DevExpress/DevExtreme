import {
  Component,
  JSXComponent,
  // Method,
} from '@devextreme-generator/declarations';

import { SchedulerProps } from './props';

// import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
// import { UserDefinedElement } from '../../../core/element'; // eslint-disable-line import/named
// import DataSource from '../../../data/data_source';

export const viewFunction = (viewModel: Scheduler): JSX.Element => {
  const { restAttributes } = viewModel;
  return (
    <Widget
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    />
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Scheduler extends JSXComponent(SchedulerProps) {
  // eslint-disable-next-line class-methods-use-this
  // get cssClasses(): string {
  //   return combineClasses({
  //     'dx-form': true,
  //   });
  // }
  // @Method()
  // addAppointment(appointment: any): void {

  // }

  // @Method()
  // deleteAppointment(appointment: any): void {

  // }

  // @Method()
  // getDataSource(): DataSource {
  //   return new DataSource([]); // TODO
  // }

  // @Method()
  // getEndViewDate(): Date {
  //   return new Date(); // TODO
  // }

  // @Method()
  // getStartViewDate(): Date {
  //   return new Date(); // TODO
  // }

  // @Method()
  // hideAppointmentPopup(saveChanges?: boolean): void {

  // }

  // @Method()
  // hideAppointmentTooltip(): void {

  // }

  // @Method()
  // scrollTo(date: Date, group?: object, allDay?: boolean): void {

  // }

  // @Method()
  // scrollToTime(hours: number, minutes: number, date?: Date): void {

  // }

  // @Method()
  // showAppointmentPopup(appointmentData?: any, createNewAppointment?: boolean,
  // currentAppointmentData?: any): void {

  // }

  // @Method()
  // showAppointmentTooltip(appointmentData: any, target: string | UserDefinedElement,
  // currentAppointmentData?: any): void {

  // }

  // @Method()
  // updateAppointment(target: any, appointment: any): void {

  // }
}
