/* eslint-disable class-methods-use-this */
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
// eslint-disable-next-line import/named
import { Appointment } from '../../../ui/scheduler';
import { ViewProps, SchedulerProps } from './props';

import { Widget } from '../common/widget';
import { UserDefinedElement } from '../../../core/element'; // eslint-disable-line import/named
import DataSource from '../../../data/data_source';
import type { Options as DataSourceOptions } from '../../../data/data_source';
import { getCurrentViewConfig, getCurrentViewProps, getValidGroups } from './model/views';
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
import type { AppointmentDataItem, DataAccessorType, DataSourcePromise } from './types';
import {
  createDataAccessors, createTimeZoneCalculator, isViewDataProviderConfigValid,
} from './common';
import { getGroupCount, loadResources } from '../../../ui/scheduler/resources/utils';
import { getAppointmentsViewModel } from './view_model/appointments/appointments';
import { getAppointmentsConfig, getAppointmentsModel } from './model/appointments';
import {
  AppointmentsViewModelType,
  AppointmentViewModel,
  AppointmentClickData,
  AppointmentTemplateProps,
  OverflowIndicatorTemplateProps,
} from './appointment/types';
import { AppointmentLayout } from './appointment/layout';
import { AppointmentsConfigType } from './model/types';
import { AppointmentTooltip } from './appointment/tooltip/appointment_tooltip';
import { getViewRenderConfigByType } from './workspaces/base/work_space_config';
import { getPreparedDataItems, resolveDataItems } from './utils/data';
import { getFilterStrategy } from './utils/filtering/local';
import combineRemoteFilter from './utils/filtering/remote';

export const viewFunction = ({
  restAttributes,
  loadedResources,
  currentViewConfig,
  onViewRendered,
  setCurrentDate,
  setCurrentView,
  startViewDate,
  appointmentsViewModel,
  tooltipData,
  tooltipTarget,
  tooltipVisible,
  changeTooltipVisible,
  showTooltip,
  workSpaceKey,

  dataCellTemplate,
  dateCellTemplate,
  timeCellTemplate,
  resourceCellTemplate,
  appointmentTemplate,
  appointmentCollectorTemplate,

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
          schedulerHeight={height}
          schedulerWidth={width}

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
              appointmentTemplate={appointmentTemplate}
              overflowIndicatorTemplate={appointmentCollectorTemplate}
              onAppointmentClick={showTooltip}
            />
          )}

          appointments={(
            <AppointmentLayout
              appointments={appointmentsViewModel.regular}
              overflowIndicators={appointmentsViewModel.regularCompact}
              appointmentTemplate={appointmentTemplate}
              overflowIndicatorTemplate={appointmentCollectorTemplate}
              onAppointmentClick={showTooltip}
            />
          )}

          key={workSpaceKey}
        />
        <AppointmentTooltip
          visible={tooltipVisible}
          onVisibleChange={changeTooltipVisible}
          target={tooltipTarget}
          dataList={tooltipData}
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
  @InternalState() workSpaceViewModel?: ViewMetaData;

  @InternalState() resourcePromisesMap: Map<string, Promise<Group[]>> = new Map();

  @InternalState() loadedResources?: Group[];

  @InternalState() dataItems: Appointment[] = [];

  @InternalState() tooltipTarget!: HTMLElement;

  @InternalState() tooltipVisible = false;

  @InternalState() tooltipData: AppointmentViewModel[] = [];

  @InternalState() lastViewDateByEndDayHour?: Date;

  // https://github.com/DevExpress/devextreme-renovation/issues/754
  get currentViewProps(): Partial<ViewProps> {
    const { views, currentView } = this.props;

    return getCurrentViewProps(currentView, views);
  }

  get currentViewConfig(): CurrentViewConfigType {
    const {
      firstDayOfWeek, startDayHour, endDayHour, cellDuration, groupByDate, scrolling,
      dataCellTemplate, timeCellTemplate, resourceCellTemplate, dateCellTemplate,
      appointmentTemplate, appointmentCollectorTemplate, maxAppointmentsPerCell, currentDate,
      showAllDayPanel, showCurrentTimeIndicator, indicatorUpdateInterval, shadeUntilCurrentTime,
      crossScrollingEnabled, height, width, tabIndex, accessKey, focusStateEnabled,
    } = this.props;

    return getCurrentViewConfig(
      this.currentViewProps,
      {
        firstDayOfWeek,
        startDayHour,
        endDayHour,
        cellDuration,
        groupByDate,
        scrolling,
        dataCellTemplate,
        timeCellTemplate,
        resourceCellTemplate,
        dateCellTemplate,
        appointmentTemplate,
        appointmentCollectorTemplate,
        maxAppointmentsPerCell,
        showAllDayPanel,
        showCurrentTimeIndicator,
        indicatorUpdateInterval,
        shadeUntilCurrentTime,
        crossScrollingEnabled,
        height,
        width,
        tabIndex,
        accessKey,
        focusStateEnabled,
      },
      currentDate,
    );
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
    return createDataAccessors({
      startDateExpr: this.props.startDateExpr,
      endDateExpr: this.props.endDateExpr,
      startDateTimeZoneExpr: this.props.startDateTimeZoneExpr,
      endDateTimeZoneExpr: this.props.endDateTimeZoneExpr,
      allDayExpr: this.props.allDayExpr,
      textExpr: this.props.textExpr,
      descriptionExpr: this.props.descriptionExpr,
      recurrenceRuleExpr: this.props.recurrenceRuleExpr,
      recurrenceExceptionExpr: this.props.recurrenceExceptionExpr,
      resources: this.props.resources,
    });
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

    const validGroups = getValidGroups(this.props.groups, this.currentViewProps.groups);

    return getAppointmentsConfig(
      {
        adaptivityEnabled: this.props.adaptivityEnabled,
        rtlEnabled: this.props.rtlEnabled,
        resources: this.props.resources,
        timeZone: this.props.timeZone,
        groups: validGroups,
      },
      {
        startDayHour: this.currentViewConfig.startDayHour,
        endDayHour: this.currentViewConfig.endDayHour,
        currentDate: this.currentViewConfig.currentDate,
        scrolling: this.currentViewConfig.scrolling,
        intervalCount: this.currentViewConfig.intervalCount,
        hoursInterval: this.currentViewConfig.hoursInterval,
        showAllDayPanel: this.currentViewConfig.showAllDayPanel,
        firstDayOfWeek: this.currentViewConfig.firstDayOfWeek,
        type: this.currentViewConfig.type,
        cellDuration: this.currentViewConfig.cellDuration,
        maxAppointmentsPerCell: this.currentViewConfig.maxAppointmentsPerCell,
      },
      this.loadedResources,
      this.workSpaceViewModel!.viewDataProvider,
      renderConfig.isAllDayPanelSupported,
    );
  }

  get preparedDataItems(): AppointmentDataItem[] {
    return getPreparedDataItems(
      this.dataItems,
      this.dataAccessors,
      this.currentViewConfig.cellDuration,
      this.timeZoneCalculator,
    );
  }

  get filteredItems(): Appointment[] {
    if (!this.appointmentsConfig) {
      return [];
    }

    const filterStrategy = getFilterStrategy(
      this.appointmentsConfig.resources,
      this.appointmentsConfig.startDayHour,
      this.appointmentsConfig.endDayHour,
      this.appointmentsConfig.cellDurationInMinutes,
      this.appointmentsConfig.showAllDayPanel,
      this.appointmentsConfig.supportAllDayRow,
      this.appointmentsConfig.firstDayOfWeek,
      this.appointmentsConfig.viewType,
      this.appointmentsConfig.dateRange,
      this.appointmentsConfig.groupCount,
      this.appointmentsConfig.loadedResources,
      this.appointmentsConfig.isVirtualScrolling,
      this.timeZoneCalculator,
      this.dataAccessors,
      this.workSpaceViewModel!.viewDataProvider,
    );

    return filterStrategy.filter(this.preparedDataItems);
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
    const { currentView } = this.props;
    const { groupOrientation, intervalCount, crossScrollingEnabled } = this.currentViewConfig;

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

  get appointmentTemplate(): JSXTemplate<AppointmentTemplateProps> | undefined {
    return this.currentViewConfig.appointmentTemplate;
  }

  get appointmentCollectorTemplate(): JSXTemplate<OverflowIndicatorTemplateProps> | undefined {
    return this.currentViewConfig.appointmentCollectorTemplate;
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addAppointment(_appointment: Appointment): void {
    // TODO: implement
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteAppointment(_appointment: Appointment): void {
    // TODO: implement
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateAppointment(_target: Appointment, _appointment: Appointment): void {
    // TODO: implement
  }

  @Method()
  getDataSource(): DataSource {
    return this.internalDataSource;
  }

  @Method()
  getEndViewDate(): Date {
    return this.workSpaceViewModel!.viewDataProvider.getLastCellEndDate();
  }

  @Method()
  getStartViewDate(): Date {
    return this.startViewDate;
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hideAppointmentPopup(_saveChanges?: boolean): void {
    // TODO: implement
  }

  @Method()
  hideAppointmentTooltip(): void {
    this.hideTooltip();
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollTo(_date: Date, _group?: Record<string, unknown>, _allDay?: boolean): void {
    // TODO: implement
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollToTime(_hours: number, _minutes: number, _date?: Date): void {
    // TODO: implement
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showAppointmentPopup(_appointmentData?: Appointment, _createNewAppointment?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _currentAppointmentData?: Appointment): void {
    // TODO: implement
  }

  @Method()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showAppointmentTooltip(_appointmentData: Appointment,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _target: string | UserDefinedElement, _currentAppointmentData?: Appointment): void {
    // TODO: implement
  }

  @Effect()
  loadGroupResources(): void {
    const validGroups = getValidGroups(this.props.groups, this.currentViewProps.groups);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (loadResources(validGroups, this.props.resources, this.resourcePromisesMap) as Promise<Group[]>)
      .then((loadedResources) => {
        this.loadedResources = loadedResources;
      });
  }

  @Effect()
  loadDataSource(): void {
    if (
      !this.internalDataSource.isLoaded()
      && !this.internalDataSource.isLoading()
    ) {
      if (this.props.remoteFiltering && this.lastViewDateByEndDayHour) {
        const combinedFilter = combineRemoteFilter({
          dataAccessors: this.dataAccessors,
          dataSourceFilter: this.internalDataSource.filter(),
          min: this.startViewDate,
          max: this.lastViewDateByEndDayHour,
          dateSerializationFormat: this.props.dateSerializationFormat,
        });

        this.internalDataSource.filter(combinedFilter);
      }

      (this.internalDataSource.load() as DataSourcePromise)
        .done((loadOptions: Appointment[] | { data: Appointment[] }) => {
          this.dataItems = resolveDataItems(loadOptions);
        });
    }
  }

  onViewRendered(viewMetaData: ViewMetaData): void {
    this.workSpaceViewModel = viewMetaData;
    const { viewDataProvider } = viewMetaData;

    const lastViewDate = viewDataProvider.getLastViewDateByEndDayHour(
      this.currentViewConfig.endDayHour,
    );
    if (lastViewDate.getTime() !== this.lastViewDateByEndDayHour?.getTime()) {
      this.lastViewDateByEndDayHour = lastViewDate;
    }
  }

  setCurrentView(view: string): void {
    this.props.currentView = view;
  }

  setCurrentDate(date: Date): void {
    this.props.currentDate = date;
  }

  showTooltip(e: AppointmentClickData): void {
    this.tooltipData = e.data;
    this.tooltipTarget = e.target;
    this.changeTooltipVisible(true);
  }

  hideTooltip(): void {
    this.changeTooltipVisible(false);
  }

  changeTooltipVisible(value: boolean): void {
    this.tooltipVisible = value;
  }
}
