import {
  Component,
  // Effect,
  InternalState,
  JSXComponent,
  Method,
} from '@devextreme-generator/declarations';

// import { DisposeEffectReturn } from '../../utils/effect_return';
import dxScheduler from '../../../ui/scheduler';
import { SchedulerProps } from './props';

// import { combineClasses } from '../../utils/combine_classes';
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
  // eslint-disable-next-line class-methods-use-this
  // get cssClasses(): string {
  //   return combineClasses({
  //     'dx-form': true,
  //   });
  // }

  @InternalState()
  instance!: dxScheduler;

  @Method()
  getComponentInstance(): dxScheduler {
    return this.instance;
  }

  @Method()
  addAppointment(appointment: any): void {
    this.instance.addAppointment(appointment);
  }

  @Method()
  deleteAppointment(appointment: any): void {
    this.instance.deleteAppointment(appointment);
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
  scrollTo(date: Date, group?: any, allDay?: boolean): void {
    this.instance.scrollTo(date, group, allDay);
  }

  @Method()
  scrollToTime(hours: number, minutes: number, date?: Date): void {
    this.instance.scrollToTime(hours, minutes, date);
  }

  @Method()
  showAppointmentPopup(appointmentData?: any, createNewAppointment?: boolean,
    currentAppointmentData?: any): void {
    this.instance.showAppointmentPopup(appointmentData, createNewAppointment,
      currentAppointmentData);
  }

  @Method()
  showAppointmentTooltip(appointmentData: any, target: string | UserDefinedElement,
    currentAppointmentData?: any): void {
    this.instance.showAppointmentTooltip(appointmentData, target,
      currentAppointmentData);
  }

  @Method()
  updateAppointment(target: any, appointment: any): void {
    this.instance.updateAppointment(target, appointment);
  }

  // @Effect({ run: 'once' })
  // dispose(): DisposeEffectReturn {
  //   return () => { this.instance.dispose(); };
  // }
}
