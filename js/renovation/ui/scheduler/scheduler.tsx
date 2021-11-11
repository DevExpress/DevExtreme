/* eslint-disable rulesdir/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Component,
  Effect,
  InternalState,
  JSXComponent,
  JSXTemplate,
  Method,
} from '@devextreme-generator/declarations';
import { TimeZoneCalculator } from './timeZoneCalculator/utils';
import { DisposeEffectReturn } from '../../utils/effect_return';
// eslint-disable-next-line import/named
import dxScheduler, { Appointment } from '../../../ui/scheduler';
import { ViewProps, SchedulerProps } from './props';

import { Widget } from '../common/widget';
import { UserDefinedElement } from '../../../core/element'; // eslint-disable-line import/named
import DataSource from '../../../data/data_source';
import type { Options as DataSourceOptions } from '../../../data/data_source';
import { getCurrentViewConfig, getCurrentViewProps } from './model/views';
import { CurrentViewConfigType } from './workspaces/props';
import {
  DataCellTemplateProps,
  DateTimeCellTemplateProps,
  Group,
  ResourceCellTemplateProps,
  ViewMetaData,
} from './workspaces/types';
import { WorkSpace } from './workspaces/base/work_space';
import { SchedulerToolbar } from './header/header';
import { getViewDataGeneratorByViewType } from '../../../ui/scheduler/workspaces/view_model/utils';
import type { DataAccessorType, DataSourcePromise } from './types';
import {
  createDataAccessors, createTimeZoneCalculator, filterAppointments, isViewDataProviderConfigValid,
} from './common';
import { getGroupCount, loadResources } from '../../../ui/scheduler/resources/utils';
import { getAppointmentsViewModel } from './view_model/appointments/appointments';
import { getAppointmentsConfig, getAppointmentsModel } from './model/appointments';
import { AppointmentsViewModelType } from './appointment/types';
import { AppointmentLayout } from './appointment/layout';
import { AppointmentsConfigType } from './model/types';
import { getViewRenderConfigByType } from './workspaces/base/work_space_config';

export const viewFunction = ({
  restAttributes,
  loadedResources,
  currentViewConfig,
  onViewRendered,
  setCurrentDate,
  setCurrentView,
  startViewDate,
  appointmentsViewModel,
  workSpaceKey,

  dataCellTemplate,
  dateCellTemplate,
  timeCellTemplate,
  resourceCellTemplate,

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
    focusStateEnabled,
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
      classes="dx-scheduler dx-scheduler-native"
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
            viewType={type}
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

          dataCellTemplate={dataCellTemplate}
          timeCellTemplate={timeCellTemplate}
          dateCellTemplate={dateCellTemplate}
          resourceCellTemplate={resourceCellTemplate}

          allDayAppointments={(
            <AppointmentLayout
              isAllDay
              appointments={appointmentsViewModel.allDay}
              overflowIndicators={appointmentsViewModel.allDayCompact}
            />
          )}

          appointments={(
            <AppointmentLayout
              appointments={appointmentsViewModel.regular}
              overflowIndicators={appointmentsViewModel.regularCompact}
            />
          )}

          key={workSpaceKey}
        />
      </div>
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class Scheduler extends JSXComponent(SchedulerProps) {
  @InternalState() instance!: dxScheduler;

  @InternalState() workSpaceViewModel?: ViewMetaData;

  @InternalState() resourcePromisesMap: Map<string, Promise<Group[]>> = new Map();

  @InternalState() loadedResources?: Group[];

  @InternalState() dataItems: Appointment[] = [];

  // https://github.com/DevExpress/devextreme-renovation/issues/754
  get currentViewProps(): Partial<ViewProps> {
    const { views, currentView } = this.props;

    return getCurrentViewProps(currentView, views);
  }

  get currentViewConfig(): CurrentViewConfigType {
    return getCurrentViewConfig(this.currentViewProps, this.props);
  }

  get isValidViewDataProvider(): boolean {
    const {
      intervalCount,
      currentDate,
      type,
      hoursInterval,
      startDayHour,
      endDayHour,
      groupOrientation,
      groupByDate,
      crossScrollingEnabled,
      firstDayOfWeek,
      startDate,
      showAllDayPanel,
      allDayPanelExpanded,
      scrolling,
      cellDuration,
    } = this.currentViewConfig;

    return isViewDataProviderConfigValid(
      this.workSpaceViewModel?.viewDataProviderValidationOptions,
      {
        intervalCount: intervalCount ?? 1,
        currentDate,
        type,
        hoursInterval,
        startDayHour,
        endDayHour,
        groupOrientation,
        groupByDate,
        crossScrollingEnabled,
        firstDayOfWeek,
        startDate,
        showAllDayPanel,
        allDayPanelExpanded,
        scrolling,
        cellDuration,
        groups: this.loadedResources,
      },
    );
  }

  get dataAccessors(): DataAccessorType {
    return createDataAccessors(this.props);
  }

  get startViewDate(): Date {
    const {
      currentDate,
      startDayHour,
      startDate,
      intervalCount,
      firstDayOfWeek,
      type,
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

  get internalDataSource(): DataSource { // TODO make helper function
    if (this.props.dataSource instanceof DataSource) {
      return this.props.dataSource;
    }

    if (this.props.dataSource instanceof Array) {
      return new DataSource({
        store: {
          type: 'array',
          data: this.props.dataSource,
        },
        paginate: false,
      } as DataSourceOptions);
    }

    return new DataSource(this.props.dataSource as DataSourceOptions);
  }

  get appointmentsConfig(): AppointmentsConfigType | undefined {
    if (!this.isValidViewDataProvider || !this.loadedResources) {
      return undefined;
    }

    const renderConfig = getViewRenderConfigByType(
      this.currentViewConfig.type,
      this.currentViewConfig.crossScrollingEnabled,
      this.currentViewConfig.intervalCount,
      this.loadedResources,
      this.currentViewConfig.groupOrientation,
    );

    return getAppointmentsConfig(
      this.props, // TODO extract props for performace
      this.currentViewConfig, // TODO extract props for performace
      this.loadedResources,
      this.workSpaceViewModel!.viewDataProvider,
      renderConfig.isAllDayPanelSupported,
    );
  }

  get filteredItems(): Appointment[] {
    return filterAppointments(
      this.appointmentsConfig,
      this.dataItems,
      this.dataAccessors,
      this.timeZoneCalculator,
      this.loadedResources!,
      this.workSpaceViewModel?.viewDataProvider,
    );
  }

  get appointmentsViewModel(): AppointmentsViewModelType {
    if (!this.appointmentsConfig || this.filteredItems.length === 0) {
      return {
        allDay: [],
        allDayCompact: [],
        regular: [],
        regularCompact: [],
      };
    }

    const model = getAppointmentsModel(
      this.appointmentsConfig,
      this.workSpaceViewModel!.viewDataProvider,
      this.timeZoneCalculator,
      this.dataAccessors,
      this.workSpaceViewModel!.cellsMetaData,
    );

    return getAppointmentsViewModel(
      model,
      this.filteredItems,
    );
  }

  // TODO: This is a WA because we need to clean workspace completely to set table sizes correctly
  // We need to remove this after we refactor crossScrolling to set table sizes through CSS, not JS
  get workSpaceKey(): string {
    const { currentView, crossScrollingEnabled } = this.props;
    const { groupOrientation, intervalCount } = this.currentViewConfig;

    if (!crossScrollingEnabled) {
      return '';
    }

    const groupCount = getGroupCount(this.loadedResources ?? []);

    return `${currentView}_${groupOrientation}_${intervalCount}_${groupCount}`;
  }

  // TODO: 4 getters below are a WA for Vue generator
  get dataCellTemplate(): JSXTemplate<DataCellTemplateProps> | undefined {
    return this.currentViewConfig.dataCellTemplate;
  }

  get dateCellTemplate(): JSXTemplate<DateTimeCellTemplateProps> | undefined {
    return this.currentViewConfig.dateCellTemplate;
  }

  get timeCellTemplate(): JSXTemplate<DateTimeCellTemplateProps> | undefined {
    return this.currentViewConfig.timeCellTemplate;
  }

  get resourceCellTemplate(): JSXTemplate<ResourceCellTemplateProps> | undefined {
    return this.currentViewConfig.resourceCellTemplate;
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
    const { groups: schedulerGroups, resources } = this.props;
    const { groups: currentViewProps } = this.currentViewProps;

    const validGroups = currentViewProps ?? schedulerGroups;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (loadResources(validGroups, resources, this.resourcePromisesMap) as Promise<Group[]>)
      .then((loadedResources) => {
        this.loadedResources = loadedResources;
      });
  }

  @Effect()
  loadDataSource(): void {
    if (!this.internalDataSource.isLoaded() && !this.internalDataSource.isLoading()) {
      (this.internalDataSource.load() as DataSourcePromise)
        .done((items: Appointment[]) => {
          this.dataItems = items;
        });
    }
  }

  onViewRendered(viewMetaData: ViewMetaData): void {
    this.workSpaceViewModel = viewMetaData;
  }

  setCurrentView(view: string): void {
    this.props.currentView = view;
  }

  setCurrentDate(date: Date): void {
    this.props.currentDate = date;
  }
}
