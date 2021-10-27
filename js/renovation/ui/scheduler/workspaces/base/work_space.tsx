/* eslint-disable class-methods-use-this */
import {
  Component,
  Effect,
  ForwardRef,
  InternalState,
  JSXComponent,
  JSXTemplate,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';
import {
  DateHeaderCellData,
  DateHeaderData,
  DateHeaderDataGeneratorType,
  GroupedViewData,
  GroupPanelData,
  TimePanelData,
  TimePanelDataGeneratorType,
  ViewCellData,
  ViewDataGeneratorType,
  ViewDataMap,
  ViewDataProviderOptions,
  ViewDataProviderType,
  WorkSpaceGenerationOptions,
} from '../types';
import { OrdinaryLayout } from './ordinary_layout';

import ViewDataProvider from '../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import {
  createCellElementMetaData, getDateTableWidth, getTotalCellCount,
} from './utils';
import { ViewRenderConfig, WorkSpaceProps } from '../props';
import { getViewRenderConfigByType } from './work_space_config';
import { HeaderPanelLayoutProps } from './header_panel/layout';
import { DateTableLayoutProps } from './date_table/layout';
import { TimePanelLayoutProps } from './time_panel/layout';
import { isHorizontalGroupingApplied, isVerticalGroupingApplied } from '../utils';
import { CrossScrollingLayout } from './cross_scrolling_layout';
import { MainLayoutProps } from './main_layout_props';
import { GroupOrientation } from '../../types';
import { getViewDataGeneratorByViewType } from '../../../../../ui/scheduler/workspaces/view_model/utils';
import { calculateIsGroupedAllDayPanel } from '../../view_model/to_test/views/utils/base';
import { DateHeaderDataGenerator } from '../../../../../ui/scheduler/workspaces/view_model/date_header_data_generator';
import { TimePanelDataGenerator } from '../../../../../ui/scheduler/workspaces/view_model/time_panel_data_generator';

export const prepareGenerationOptions = (
  workSpaceProps: WorkSpaceGenerationOptions,
  renderConfig: ViewRenderConfig,
  isAllDayPanelVisible: boolean,
): ViewDataProviderOptions => {
  const {
    intervalCount,
    groups,
    groupByDate,
    groupOrientation,
    startDayHour,
    endDayHour,
    currentDate,
    startDate,
    firstDayOfWeek,
    hoursInterval,
    type,
    cellDuration,
  } = workSpaceProps;
  const {
    headerCellTextFormat,
    getDateForHeaderText,
    isProvideVirtualCellsWidth,
    isRenderTimePanel,
    isGenerateWeekDaysHeaderData,
  } = renderConfig;

  return {
    startRowIndex: 0,
    startCellIndex: 0,
    groupOrientation,
    groupByDate,
    groups,
    isProvideVirtualCellsWidth,
    isAllDayPanelVisible,
    selectedCells: undefined,
    focusedCell: undefined,
    headerCellTextFormat,
    getDateForHeaderText,
    startDayHour,
    endDayHour,
    cellDuration,
    viewType: type,
    intervalCount,
    hoursInterval,
    currentDate,
    startDate,
    firstDayOfWeek,

    isGenerateTimePanelData: isRenderTimePanel,
    isGenerateWeekDaysHeaderData,
  };
};

export const viewFunction = ({
  dateHeaderData,
  viewData,
  timePanelData,
  groupPanelData,
  layout: Layout,
  isAllDayPanelVisible,
  isRenderHeaderEmptyCell,

  dateTableRef,
  allDayPanelRef,
  timePanelRef,
  groupPanelRef,
  layoutRef,

  isVerticalGrouping,
  isStandaloneAllDayPanel,
  groupOrientation,

  groupPanelHeight,
  headerEmptyCellWidth,
  tablesWidth,
  classes,

  props: {
    dataCellTemplate,
    dateCellTemplate,
    timeCellTemplate,
    resourceCellTemplate,

    groups,
    groupByDate,
    allDayPanelExpanded,
    intervalCount,

    appointments,
    allDayAppointments,
  },

  renderConfig: {
    isRenderDateHeader,
    scrollingDirection,
    groupPanelClassName,
  },
  headerPanelTemplate,
  dateTableTemplate,
  timePanelTemplate,
}: WorkSpace): JSX.Element => (
  <Layout
    ref={layoutRef}

    viewData={viewData}
    dateHeaderData={dateHeaderData}
    timePanelData={timePanelData}
    groupPanelData={groupPanelData}
    dataCellTemplate={dataCellTemplate}
    dateCellTemplate={dateCellTemplate}
    timeCellTemplate={timeCellTemplate}
    resourceCellTemplate={resourceCellTemplate}

    groups={groups}
    groupByDate={groupByDate}
    groupOrientation={groupOrientation}
    groupPanelClassName={groupPanelClassName}

    intervalCount={intervalCount}

    headerPanelTemplate={headerPanelTemplate}
    dateTableTemplate={dateTableTemplate}
    timePanelTemplate={timePanelTemplate}

    isAllDayPanelCollapsed={!allDayPanelExpanded}
    isAllDayPanelVisible={isAllDayPanelVisible}
    isRenderDateHeader={isRenderDateHeader}
    isRenderHeaderEmptyCell={isRenderHeaderEmptyCell}
    isRenderGroupPanel={isVerticalGrouping}
    isStandaloneAllDayPanel={isStandaloneAllDayPanel}

    scrollingDirection={scrollingDirection}
    groupPanelHeight={groupPanelHeight}
    headerEmptyCellWidth={headerEmptyCellWidth}
    tablesWidth={tablesWidth}

    className={classes}
    dateTableRef={dateTableRef}
    allDayPanelRef={allDayPanelRef}
    timePanelRef={timePanelRef}
    groupPanelRef={groupPanelRef}

    appointments={appointments}
    allDayAppointments={allDayAppointments}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class WorkSpace extends JSXComponent<WorkSpaceProps, 'currentDate' | 'onViewRendered'>() {
  @InternalState()
  groupPanelHeight: number | undefined;

  @InternalState()
  headerEmptyCellWidth: number | undefined;

  @InternalState()
  tablesWidth: number | undefined;

  @ForwardRef()
  dateTableRef!: RefObject<HTMLTableElement>;

  @ForwardRef()
  allDayPanelRef!: RefObject<HTMLTableElement>;

  @ForwardRef()
  timePanelRef!: RefObject<HTMLTableElement>;

  @ForwardRef()
  groupPanelRef!: RefObject<HTMLDivElement>;

  // Bug in generators: https://github.com/DevExpress/devextreme-renovation/issues/792
  // We should use RefObject<CrossScrollingLayout | OrdinaryLayout> here
  @Ref()
  layoutRef!: RefObject<CrossScrollingLayout>;

  get renderConfig(): ViewRenderConfig {
    return getViewRenderConfigByType(
      this.props.type,
      this.props.crossScrollingEnabled,
      this.props.intervalCount,
      this.props.groups,
      this.props.groupOrientation,
    );
  }

  get groupOrientation(): GroupOrientation {
    const { groupOrientation } = this.props;
    const { defaultGroupOrientation } = this.renderConfig;

    return groupOrientation ?? defaultGroupOrientation;
  }

  get isVerticalGrouping(): boolean {
    return isVerticalGroupingApplied(this.props.groups, this.groupOrientation);
  }

  get isHorizontalGrouping(): boolean {
    return isHorizontalGroupingApplied(this.props.groups, this.groupOrientation);
  }

  get layout(): JSXTemplate<
  MainLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData' | 'dateTableRef'
  > {
    return this.renderConfig.isCreateCrossScrolling
      ? CrossScrollingLayout
      : OrdinaryLayout;
  }

  get isAllDayPanelVisible(): boolean {
    const { showAllDayPanel } = this.props;
    const { isAllDayPanelSupported } = this.renderConfig;

    return isAllDayPanelSupported && showAllDayPanel;
  }

  get viewDataGenerator(): ViewDataGeneratorType {
    // TODO: convert to TS
    return getViewDataGeneratorByViewType(this.props.type) as ViewDataGeneratorType;
  }

  get dateHeaderDataGenerator(): DateHeaderDataGeneratorType {
    // TODO: convert to TS
    return new DateHeaderDataGenerator(this.viewDataGenerator) as DateHeaderDataGeneratorType;
  }

  get timePanelDataGenerator(): TimePanelDataGeneratorType {
    // TODO: convert to TS
    return (
      (new TimePanelDataGenerator(this.viewDataGenerator) as unknown) as TimePanelDataGeneratorType
    );
  }

  // TODO: WA because memoization does not work in React.
  // It should be inside Scheduler.tsx (and already is)
  get startViewDate(): Date {
    const {
      currentDate,
      startDayHour,
      startDate,
      intervalCount,
      firstDayOfWeek,
      type,
    } = this.props;

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

  get completeViewDataMap(): ViewCellData[][] {
    const {
      currentDate,
      startDate,
      startDayHour,
      endDayHour,
      groupByDate,
      groups,
      intervalCount,
      firstDayOfWeek,
      hoursInterval,
      cellDuration,
      type,
    } = this.props;

    return this.viewDataGenerator.getCompleteViewDataMap({
      currentDate,
      startDate,
      startDayHour,
      endDayHour,
      groupByDate,
      groups,
      intervalCount,
      firstDayOfWeek,
      hoursInterval,
      cellDuration,
      startViewDate: this.startViewDate,
      groupOrientation: this.groupOrientation,
      isVerticalGrouping: this.isVerticalGrouping,
      isHorizontalGrouping: this.isHorizontalGrouping,
      isGroupedByDate: groupByDate, // TODO: validate grouping by date
      isAllDayPanelVisible: this.isAllDayPanelVisible,
      viewType: type,
      interval: this.viewDataGenerator.getInterval(hoursInterval),
    });
  }

  get viewDataMap(): ViewDataMap {
    return this.viewDataGenerator.generateViewDataMap(
      this.completeViewDataMap,
      {
        startRowIndex: 0,
        startCellIndex: 0,
        isVerticalGrouping: this.isVerticalGrouping,
        isAllDayPanelVisible: this.isAllDayPanelVisible,
      },
    );
  }

  get viewData(): GroupedViewData {
    const { groups } = this.props;

    return this.viewDataGenerator.getViewDataFromMap(
      this.completeViewDataMap,
      this.viewDataMap,
      {
        topVirtualRowHeight: 0,
        bottomVirtualRowHeight: 0,
        leftVirtualCellWidth: 0,
        rightVirtualCellWidth: 0,
        startRowIndex: 0,
        startCellIndex: 0,
        isProvideVirtualCellsWidth: this.renderConfig.isProvideVirtualCellsWidth,
        isVerticalGrouping: this.isVerticalGrouping,
        isAllDayPanelVisible: this.isAllDayPanelVisible,
        isGroupedAllDayPanel: calculateIsGroupedAllDayPanel(
          groups, this.groupOrientation, this.isAllDayPanelVisible,
        ),
      },
    );
  }

  get completeDateHeaderData(): DateHeaderCellData[][] {
    const {
      groupByDate,
      groups,
      startDayHour,
      endDayHour,
      hoursInterval,
      intervalCount,
      currentDate,
      type: viewType,
    } = this.props;

    return this.dateHeaderDataGenerator.getCompleteDateHeaderMap(
      {
        isGenerateWeekDaysHeaderData: this.renderConfig.isGenerateWeekDaysHeaderData,
        isGroupedByDate: groupByDate, // TODO: validate grouping by date
        groups,
        groupOrientation: this.groupOrientation,
        isHorizontalGrouping: this.isHorizontalGrouping,
        startDayHour,
        endDayHour,
        hoursInterval,
        intervalCount,
        headerCellTextFormat: this.renderConfig.headerCellTextFormat,
        getDateForHeaderText: this.renderConfig.getDateForHeaderText,
        interval: this.viewDataGenerator.getInterval(hoursInterval),
        startViewDate: this.startViewDate,
        currentDate,
        viewType,

        today: new Date(), // TODO
      },
      this.completeViewDataMap,
    );
  }

  get dateHeaderData(): DateHeaderData {
    const {
      startDayHour,
      endDayHour,
      hoursInterval,
      groups,
      groupByDate,
    } = this.props;
    return this.dateHeaderDataGenerator.generateDateHeaderData(
      this.completeDateHeaderData,
      this.completeViewDataMap,
      {
        isGenerateWeekDaysHeaderData: this.renderConfig.isGenerateWeekDaysHeaderData,
        cellWidth: 0, // TODO: implement virtual scrolling
        isProvideVirtualCellsWidth: this.renderConfig.isProvideVirtualCellsWidth,
        startDayHour,
        endDayHour,
        hoursInterval,
        startCellIndex: 0,
        // cellCount: TODO: add virtual scrolling
        groups,
        groupOrientation: this.groupOrientation,
        isGroupedByDate: groupByDate, // TODO :validate grouping by date
      },
    );
  }

  get completeTimePanelData(): ViewCellData[] | undefined {
    if (!this.renderConfig.isRenderTimePanel) {
      return undefined;
    }

    const {
      cellDuration,
      startDayHour,
      endDayHour,
      intervalCount,
      currentDate,
      type,
      hoursInterval,
    } = this.props;

    return this.timePanelDataGenerator.getCompleteTimePanelMap(
      {
        startViewDate: this.startViewDate,
        cellDuration,
        startDayHour,
        endDayHour,
        isVerticalGrouping: this.isVerticalGrouping,
        intervalCount,
        currentDate,
        viewType: type,
        hoursInterval,
      },
      this.completeViewDataMap,
    );
  }

  get timePanelData(): TimePanelData | undefined {
    if (!this.completeTimePanelData) {
      return undefined;
    }

    return this.timePanelDataGenerator.generateTimePanelData(
      this.completeTimePanelData,
      {
        startRowIndex: 0,
        // rowCount?: TODO: add virtualization
        topVirtualRowHeight: 0,
        bottomVirtualRowHeight: 0,
        isGroupedAllDayPanel: calculateIsGroupedAllDayPanel(
          this.props.groups, this.groupOrientation, this.isAllDayPanelVisible,
        ),
        isVerticalGrouping: this.isVerticalGrouping,
        isAllDayPanelVisible: this.isAllDayPanelVisible,
      },
    );
  }

  get viewDataProvider(): ViewDataProviderType {
    const {
      intervalCount,
      groups,
      groupByDate, // TODO: validate grouping by date
      startDayHour,
      endDayHour,
      currentDate,
      startDate,
      firstDayOfWeek,
      hoursInterval,
      type,
      cellDuration,
    } = this.props;
    const viewDataProvider = (new ViewDataProvider(type) as unknown) as ViewDataProviderType;

    viewDataProvider.completeViewDataMap = this.completeViewDataMap;
    viewDataProvider.viewDataMap = this.viewDataMap;
    viewDataProvider.viewData = this.viewData;

    const generationOptions = prepareGenerationOptions(
      {
        intervalCount,
        groups,
        groupByDate,
        groupOrientation: this.groupOrientation,
        startDayHour,
        endDayHour,
        currentDate,
        startDate,
        firstDayOfWeek,
        hoursInterval,
        type,
        cellDuration,
      },
      this.renderConfig,
      this.isAllDayPanelVisible,
    );

    viewDataProvider.setViewOptions(generationOptions);
    viewDataProvider.createGroupedDataMapProvider();

    return viewDataProvider;
  }

  get groupPanelData(): GroupPanelData {
    const {
      intervalCount,
      groups,
      groupByDate,
      startDayHour,
      endDayHour,
      currentDate,
      startDate,
      firstDayOfWeek,
      hoursInterval,
      type,
      cellDuration,
    } = this.props;

    const generationOptions = prepareGenerationOptions(
      {
        intervalCount,
        groups,
        groupByDate,
        groupOrientation: this.groupOrientation,
        startDayHour,
        endDayHour,
        currentDate,
        startDate,
        firstDayOfWeek,
        hoursInterval,
        type,
        cellDuration,
      },
      this.renderConfig,
      this.isAllDayPanelVisible,
    );

    return this.viewDataProvider.getGroupPanelData(generationOptions);
  }

  get headerPanelTemplate(): JSXTemplate<HeaderPanelLayoutProps, 'dateHeaderData'> {
    const { headerPanelTemplate } = this.renderConfig;
    return headerPanelTemplate;
  }

  get dateTableTemplate(): JSXTemplate<DateTableLayoutProps> {
    const { dateTableTemplate } = this.renderConfig;
    return dateTableTemplate;
  }

  get timePanelTemplate(): JSXTemplate<TimePanelLayoutProps> | undefined {
    const { timePanelTemplate } = this.renderConfig;
    return timePanelTemplate;
  }

  get isRenderHeaderEmptyCell(): boolean {
    return this.isVerticalGrouping || !!this.timePanelTemplate;
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get isWorkSpaceWithOddCells(): boolean {
    return false; // TODO
  }

  get classes(): string {
    const {
      intervalCount,
      allDayPanelExpanded,
      groupByDate,
      groups,
    } = this.props;

    return combineClasses({
      [this.renderConfig.className]: true,
      'dx-scheduler-work-space-count': intervalCount > 1,
      'dx-scheduler-work-space-odd-cells': !!this.isWorkSpaceWithOddCells,
      'dx-scheduler-work-space-all-day-collapsed': !allDayPanelExpanded && this.isAllDayPanelVisible,
      'dx-scheduler-work-space-all-day': this.isAllDayPanelVisible,
      'dx-scheduler-work-space-group-by-date': groupByDate,
      'dx-scheduler-work-space-grouped': groups.length > 0,
      'dx-scheduler-work-space-vertical-grouped': this.isVerticalGrouping
        && this.renderConfig.defaultGroupOrientation !== 'vertical',
      'dx-scheduler-work-space-horizontal-grouped': isHorizontalGroupingApplied(groups, this.groupOrientation)
        && this.renderConfig.defaultGroupOrientation === 'vertical',
      'dx-scheduler-group-column-count-one': this.isVerticalGrouping && groups.length === 1,
      'dx-scheduler-group-column-count-two': this.isVerticalGrouping && groups.length === 2,
      'dx-scheduler-group-column-count-three': this.isVerticalGrouping && groups.length === 3,
      'dx-scheduler-work-space-both-scrollbar': this.props.crossScrollingEnabled,
      'dx-scheduler-work-space': true,
    });
  }

  get isStandaloneAllDayPanel(): boolean {
    const {
      groups,
    } = this.props;

    return !isVerticalGroupingApplied(groups, this.groupOrientation) && this.isAllDayPanelVisible;
  }

  get isCalculateTablesWidth(): boolean {
    return this.props.crossScrollingEnabled && this.renderConfig.defaultGroupOrientation !== 'vertical';
  }

  @Effect({ run: 'always' })
  groupPanelHeightEffect(): void {
    this.groupPanelHeight = this.dateTableRef.current?.getBoundingClientRect().height;
  }

  @Effect({ run: 'always' })
  headerEmptyCellWidthEffect(): void {
    const timePanelWidth = this.timePanelRef.current?.getBoundingClientRect().width ?? 0;
    const groupPanelWidth = this.groupPanelRef.current?.getBoundingClientRect().width ?? 0;

    this.headerEmptyCellWidth = timePanelWidth + groupPanelWidth;
  }

  @Effect({ run: 'always' })
  tablesWidthEffect(): void {
    if (this.isCalculateTablesWidth) {
      const {
        intervalCount,
        currentDate,
        type: viewType,
        hoursInterval,
        startDayHour,
        endDayHour,
        groups,
      } = this.props;

      this.tablesWidth = getDateTableWidth(
        this.layoutRef.current!.getScrollableWidth(),
        this.dateTableRef.current!,
        this.viewDataProvider,
        {
          intervalCount,
          currentDate,
          viewType,
          hoursInterval,
          startDayHour,
          endDayHour,
          groups,
          groupOrientation: this.groupOrientation,
        },
      );
    }
  }

  @Effect()
  onViewRendered(): void {
    const {
      intervalCount,
      currentDate,
      type: viewType,
      hoursInterval,
      startDayHour,
      endDayHour,
      groups,
      onViewRendered,
    } = this.props;

    const tableWidths = getDateTableWidth(
      this.layoutRef.current!.getScrollableWidth(),
      this.dateTableRef.current!,
      this.viewDataProvider,
      {
        intervalCount,
        currentDate,
        viewType,
        hoursInterval,
        startDayHour,
        endDayHour,
        groups,
        groupOrientation: this.groupOrientation,
      },
    );

    if (!this.isCalculateTablesWidth || tableWidths === this.tablesWidth) {
      const cellCount = this.viewDataProvider.getCellCount({
        intervalCount,
        currentDate,
        viewType,
        hoursInterval,
        startDayHour,
        endDayHour,
      });
      const totalCellCount = getTotalCellCount(cellCount, this.groupOrientation, groups);

      const dateTableCellsMeta = this.createDateTableElementsMeta(totalCellCount);
      const allDayPanelCellsMeta = this.createAllDayPanelElementsMeta();

      onViewRendered({
        viewDataProvider: this.viewDataProvider,
        cellsMetaData: {
          dateTableCellsMeta,
          allDayPanelCellsMeta,
        },
      });
    }
  }

  createDateTableElementsMeta(totalCellCount: number): DOMRect[][] {
    const dateTableCells = this.dateTableRef.current!.querySelectorAll('td');
    const dateTableRect = this.dateTableRef.current!.getBoundingClientRect();
    const dateTableCellsMeta: DOMRect[][] = [];

    dateTableCells.forEach((cellElement, index) => {
      if (index % totalCellCount === 0) {
        dateTableCellsMeta.push([]);
      }

      const cellRect = cellElement.getBoundingClientRect();
      const validCellRect = createCellElementMetaData(
        dateTableRect,
        cellRect,
      );

      dateTableCellsMeta[dateTableCellsMeta.length - 1].push(validCellRect);
    });

    return dateTableCellsMeta;
  }

  createAllDayPanelElementsMeta(): DOMRect[] {
    if (!this.allDayPanelRef.current) {
      return [];
    }

    const allDayPanelCells = this.allDayPanelRef.current.querySelectorAll('td');
    const allDayPanelRect = this.allDayPanelRef.current.getBoundingClientRect();
    const allDayPanelCellsMeta: DOMRect[] = [];

    allDayPanelCells.forEach((cellElement) => {
      const cellRect = cellElement.getBoundingClientRect();

      allDayPanelCellsMeta.push(createCellElementMetaData(
        allDayPanelRect,
        cellRect,
      ));
    });

    return allDayPanelCellsMeta;
  }
}
