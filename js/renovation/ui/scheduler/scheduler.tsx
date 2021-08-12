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
import { ViewProps, SchedulerProps } from './props';

import { Widget } from '../common/widget';
import { UserDefinedElement } from '../../../core/element'; // eslint-disable-line import/named
import DataSource from '../../../data/data_source';
import { getCurrentViewConfig, getCurrentViewProps } from './model/views';
import { WorkSpaceProps } from './workspaces/props';

export const viewFunction = ({
  restAttributes,
  props: {
    accessKey,
    activeStateEnabled,
    disabled,
    focusStateEnabled,
    height,
    hint,
    hoverStateEnabled,
    rtlEnabled,
    tabIndex,
    visible,
    width,
    className,
  },
}: Scheduler): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    classes="dx-scheduler"
    accessKey={accessKey}
    activeStateEnabled={activeStateEnabled}
    disabled={disabled}
    focusStateEnabled={focusStateEnabled}
    height={height}
    hint={hint}
    hoverStateEnabled={hoverStateEnabled}
    rtlEnabled={rtlEnabled}
    tabIndex={tabIndex}
    visible={visible}
    width={width}
    className={className}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Scheduler extends JSXComponent(SchedulerProps) {
  @InternalState()
  instance!: dxScheduler;

  // https://github.com/DevExpress/devextreme-renovation/issues/754
  get currentViewProps(): Partial<ViewProps> {
    const { views, currentView } = this.props;

    return getCurrentViewProps(currentView, views);
  }

  get currentViewConfig(): WorkSpaceProps {
    return getCurrentViewConfig(this.currentViewProps, this.props);
  }

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
