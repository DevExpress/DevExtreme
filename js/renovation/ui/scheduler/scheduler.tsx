/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Component,
  Effect,
  InternalState,
  JSXComponent,
  JSXTemplate,
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
import { WorkSpaceProps, CurrentViewConfigType } from './workspaces/props';
import { WorkSpaceWeek } from './workspaces/week/work_space';
import { CellsMetaData, ViewDataProviderType, ViewMetaData } from './workspaces/types';

export const viewFunction = ({
  restAttributes,
  workSpace: WorkSpace,
  currentViewConfig,
  onViewRendered,
}: Scheduler): JSX.Element => {
  const {
    firstDayOfWeek,
    startDayHour,
    endDayHour,
    cellDuration,
    groupByDate,
    scrolling,
    currentDate,
    intervalCount,
    groupOrientation,
    startDate,
    showAllDayPanel,
    showCurrentTimeIndicator,
    indicatorUpdateInterval,
    shadeUntilCurrentTime,
    crossScrollingEnabled,
    hoursInterval,
    groups,

    indicatorTime,
    allowMultipleCellSelection,
    allDayPanelExpanded,

  } = currentViewConfig;
  return (
    <Widget
      classes="dx-scheduler"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    >
      <WorkSpace
        firstDayOfWeek={firstDayOfWeek}
        startDayHour={startDayHour}
        endDayHour={endDayHour}
        cellDuration={cellDuration}
        groupByDate={groupByDate}
        scrolling={scrolling}
        currentDate={currentDate}
        intervalCount={intervalCount}
        groupOrientation={groupOrientation}
        startDate={startDate}
        showAllDayPanel={showAllDayPanel}
        showCurrentTimeIndicator={showCurrentTimeIndicator}
        indicatorUpdateInterval={indicatorUpdateInterval}
        shadeUntilCurrentTime={shadeUntilCurrentTime}
        crossScrollingEnabled={crossScrollingEnabled}
        hoursInterval={hoursInterval}
        groups={groups}

        indicatorTime={indicatorTime}
        allowMultipleCellSelection={allowMultipleCellSelection}
        allDayPanelExpanded={allDayPanelExpanded}
        onViewRendered={onViewRendered}
      />
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Scheduler extends JSXComponent(SchedulerProps) {
  @InternalState() instance!: dxScheduler;

  @InternalState() viewDataProvider!: ViewDataProviderType;

  @InternalState() cellsMetaData!: CellsMetaData;

  // https://github.com/DevExpress/devextreme-renovation/issues/754
  get currentViewProps(): Partial<ViewProps> {
    const { views, currentView } = this.props;

    return getCurrentViewProps(currentView, views);
  }

  get currentViewConfig(): CurrentViewConfigType {
    return getCurrentViewConfig(this.currentViewProps, this.props);
  }

  // eslint-disable-next-line class-methods-use-this
  get workSpace(): JSXTemplate<WorkSpaceProps, 'currentDate' | 'onViewRendered'> {
    return WorkSpaceWeek;
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

  onViewRendered(viewMetaData: ViewMetaData): void {
    this.viewDataProvider = viewMetaData.viewDataProvider;
    this.cellsMetaData = viewMetaData.cellsMetaData;
  }
}
