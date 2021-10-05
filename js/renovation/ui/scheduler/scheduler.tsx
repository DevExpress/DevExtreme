/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Component,
  Effect,
  InternalState,
  JSXComponent,
  Method,
} from '@devextreme-generator/declarations';
import { TimeZoneCalculator } from './timeZoneCalculator/utils';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
// eslint-disable-next-line import/named
import dxScheduler, { Appointment } from '../../../ui/scheduler';
import { ViewProps, SchedulerProps } from './props';

import { Widget } from '../common/widget';
import { UserDefinedElement } from '../../../core/element'; // eslint-disable-line import/named
import DataSource from '../../../data/data_source';
import { getCurrentViewConfig, getCurrentViewProps } from './model/views';
import { CurrentViewConfigType } from './workspaces/props';
import {
  CellsMetaData, Group, ViewDataProviderType, ViewMetaData,
} from './workspaces/types';
import { WorkSpace } from './workspaces/base/work_space';
import { SchedulerToolbar } from './header/header';
import { getViewDataGeneratorByViewType } from '../../../ui/scheduler/workspaces/view_model/utils';
import { DataAccessorType } from './types';
import { createDataAccessors, createTimeZoneCalculator } from './common';
import { loadResources } from '../../../ui/scheduler/resources/utils';

export const viewFunction = ({
  restAttributes,
  loadedResources,
  currentViewConfig,
  onViewRendered,
  setCurrentDate,
  setCurrentView,
  startViewDate,
  props: {
    accessKey,
    activeStateEnabled,
    disabled,
    height,
    hint,
    hoverStateEnabled,
    rtlEnabled,
    tabIndex,
    visible,
    width,
    className,
    toolbar: toolbarItems,
    views,
    currentView,
    useDropDownViewSwitcher,
    customizeDateNavigatorText,
    min,
    max,
  },
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

    indicatorTime,
    allowMultipleCellSelection,
    allDayPanelExpanded,
    type,
  } = currentViewConfig;
  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      classes="dx-scheduler"
      accessKey={accessKey}
      activeStateEnabled={activeStateEnabled}
      disabled={disabled}
      focusStateEnabled={false}// TODO: waiting for a toolbar wrapper rerender fix
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
    >
      <div className="dx-scheduler-container">
        {toolbarItems.length !== 0
        && (
          <SchedulerToolbar
            items={toolbarItems}
            views={views}
            currentView={currentView}
            onCurrentViewUpdate={setCurrentView}
            currentDate={currentDate}
            onCurrentDateUpdate={setCurrentDate}
            startViewDate={startViewDate}
            min={min}
            max={max}
            intervalCount={intervalCount}
            firstDayOfWeek={firstDayOfWeek}
            useDropDownViewSwitcher={useDropDownViewSwitcher}
            customizationFunction={customizeDateNavigatorText}
          />
        )}
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
          groups={loadedResources}
          type={type}

          indicatorTime={indicatorTime}
          allowMultipleCellSelection={allowMultipleCellSelection}
          allDayPanelExpanded={allDayPanelExpanded}
          onViewRendered={onViewRendered}

          appointments={<div className="appointments" />} // Appointments go here
          allDayAppointments={<div className="all-day-appointments" />}
        />
      </div>
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

  @InternalState() resourcePromisesMap: Map<string, Promise<Group[]>> = new Map();

  @InternalState() loadedResources: Group[] = [];

  // https://github.com/DevExpress/devextreme-renovation/issues/754
  get currentViewProps(): Partial<ViewProps> {
    const { views, currentView } = this.props;

    return getCurrentViewProps(currentView, views);
  }

  get currentViewConfig(): CurrentViewConfigType {
    return getCurrentViewConfig(this.currentViewProps, this.props);
  }

  get dataAccessors(): DataAccessorType {
    return createDataAccessors(this.props);
  }

  get startViewDate(): Date {
    const type = this.props.currentView;
    const {
      currentDate,
      startDayHour,
      startDate,
      intervalCount,
      firstDayOfWeek,
    } = this.currentViewConfig;

    const options = {
      currentDate,
      startDayHour,
      startDate,
      intervalCount,
      firstDayOfWeek,
    };

    const viewDataGenerator = getViewDataGeneratorByViewType(type);
    const startViewDate = viewDataGenerator.getStartViewDate(options) as Date;

    return startViewDate;
  }

  get isVirtualScrolling(): boolean {
    return this.props.scrolling.mode === 'virtual'
      || this.currentViewProps.scrolling?.mode === 'virtual';
  }

  get timeZoneCalculator(): TimeZoneCalculator {
    return createTimeZoneCalculator(this.props.timeZone);
  }

  @Method()
  getComponentInstance(): dxScheduler {
    return this.instance;
  }

  @Method()
  addAppointment(appointment: Appointment): void {
    this.instance.addAppointment(appointment);
  }

  @Method()
  deleteAppointment(appointment: Appointment): void {
    this.instance.deleteAppointment(appointment);
  }

  @Method()
  updateAppointment(target: Appointment, appointment: Appointment): void {
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
  showAppointmentPopup(appointmentData?: Appointment, createNewAppointment?: boolean,
    currentAppointmentData?: Appointment): void {
    this.instance.showAppointmentPopup(appointmentData, createNewAppointment,
      currentAppointmentData);
  }

  @Method()
  showAppointmentTooltip(appointmentData: Appointment,
    target: string | UserDefinedElement, currentAppointmentData?: Appointment): void {
    this.instance.showAppointmentTooltip(appointmentData, target,
      currentAppointmentData);
  }

  @Effect({ run: 'once' })
  dispose(): DisposeEffectReturn {
    return () => { this.instance.dispose(); };
  }

  @Effect()
  loadGroupResources(): void {
    const { groups, resources } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (loadResources(groups, resources, this.resourcePromisesMap) as Promise<Group[]>)
      .then((loadedResources) => {
        this.loadedResources = loadedResources;
      });
  }

  onViewRendered(viewMetaData: ViewMetaData): void {
    this.viewDataProvider = viewMetaData.viewDataProvider;
    this.cellsMetaData = viewMetaData.cellsMetaData;
  }

  setCurrentView(view: string): void {
    this.props.currentView = view;
  }

  setCurrentDate(date: Date): void {
    this.props.currentDate = date;
  }
}
