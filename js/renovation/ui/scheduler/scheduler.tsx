/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Component,
  Effect,
  InternalState,
  JSXComponent,
  Method,
} from '@devextreme-generator/declarations';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
// eslint-disable-next-line import/named
import dxScheduler, { dxSchedulerAppointment } from '../../../ui/scheduler';
import { SchedulerProps } from './props';

import { Widget } from '../common/widget';
import { UserDefinedElement } from '../../../core/element'; // eslint-disable-line import/named
import DataSource from '../../../data/data_source';

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
  @InternalState()
  instance!: dxScheduler;

  @Method()
  getComponentInstance(): dxScheduler {
    return this.instance;
  }

  @Method()
  addAppointment(appointment: dxSchedulerAppointment): void {
    this.instance.addAppointment(appointment);
  }

  @Method()
  deleteAppointment(appointment: dxSchedulerAppointment): void {
    this.instance.deleteAppointment(appointment);
  }

  @Method()
  updateAppointment(target: dxSchedulerAppointment, appointment: dxSchedulerAppointment): void {
    this.instance.updateAppointment(target, appointment);
  }

  @Method()
  getDataSource(): DataSource {
    return this.instance.getDataSource();
  }

  @Method()
  getEndViewDate(): Date {
    return this.instance.getEndViewDate();
  }

  @Method()
  getStartViewDate(): Date {
    return this.instance.getStartViewDate();
  }

  @Method()
  hideAppointmentPopup(saveChanges?: boolean): void {
    this.instance.hideAppointmentPopup(saveChanges);
  }

  @Method()
  hideAppointmentTooltip(): void {
    this.instance.hideAppointmentTooltip();
  }

  @Method()
  scrollTo(date: Date, group?: Record<string, unknown>, allDay?: boolean): void {
    this.instance.scrollTo(date, group, allDay);
  }

  @Method()
  scrollToTime(hours: number, minutes: number, date?: Date): void {
    this.instance.scrollToTime(hours, minutes, date);
  }

  @Method()
  showAppointmentPopup(appointmentData?: dxSchedulerAppointment, createNewAppointment?: boolean,
    currentAppointmentData?: dxSchedulerAppointment): void {
    this.instance.showAppointmentPopup(appointmentData, createNewAppointment,
      currentAppointmentData);
  }

  @Method()
  showAppointmentTooltip(appointmentData: dxSchedulerAppointment,
    target: string | UserDefinedElement, currentAppointmentData?: dxSchedulerAppointment): void {
    this.instance.showAppointmentTooltip(appointmentData, target,
      currentAppointmentData);
  }

  @Effect({ run: 'once' })
  dispose(): DisposeEffectReturn {
    return () => { this.instance.dispose(); };
  }
}
