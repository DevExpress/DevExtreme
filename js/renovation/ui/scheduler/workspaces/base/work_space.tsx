/* eslint-disable rulesdir/no-non-null-assertion */
/* eslint-disable class-methods-use-this */
import {
  Component,
  Consumer,
  Effect,
  ForwardRef,
  InternalState,
  JSXComponent,
  JSXTemplate,
  Ref,
  RefObject,
} from '@devextreme-generator/declarations';
import { subscribeToScrollEvent } from '../../../../utils/subscribe_to_event';
import { combineClasses } from '../../../../utils/combine_classes';
import {
  CorrectedVirtualScrollingState,
  DateHeaderCellData,
  DateHeaderData,
  DateHeaderDataGeneratorType,
  Group,
  GroupedViewData,
  GroupPanelData,
  TimePanelData,
  TimePanelDataGeneratorType,
  ViewCellData,
  ViewDataGeneratorType,
  ViewDataMap,
  ViewDataProviderOptions,
  ViewDataProviderType,
  VirtualScrollingDispatcherType,
  VirtualScrollingState,
  WorkSpaceGenerationOptions,
} from '../types';
import { OrdinaryLayout } from './ordinary_layout';
import { VirtualScrollingDispatcher } from '../../../../../ui/scheduler/workspaces/ui.scheduler.virtual_scrolling';
import ViewDataProvider from '../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import {
  createCellElementMetaData,
  createVirtualScrollingOptions,
  DATE_TABLE_MIN_CELL_WIDTH,
  getDateTableWidth,
} from './utils';
import { ViewRenderConfig, WorkSpaceProps } from '../props';
import { getViewRenderConfigByType } from './work_space_config';
import { HeaderPanelLayoutProps } from './header_panel/layout';
import { DateTableLayoutProps } from './date_table/layout';
import { TimePanelLayoutProps } from './time_panel/layout';
import { isGroupingByDate, isHorizontalGroupingApplied, isVerticalGroupingApplied } from '../utils';
import { CrossScrollingLayout } from './cross_scrolling_layout';
import { MainLayoutProps } from './main_layout_props';
import { GroupOrientation } from '../../types';
import { getViewDataGeneratorByViewType } from '../../../../../ui/scheduler/workspaces/view_model/utils';
import { calculateIsGroupedAllDayPanel } from '../../view_model/to_test/views/utils/base';
import { DateHeaderDataGenerator } from '../../../../../ui/scheduler/workspaces/view_model/date_header_data_generator';
import { TimePanelDataGenerator } from '../../../../../ui/scheduler/workspaces/view_model/time_panel_data_generator';
import { getGroupPanelData } from '../../view_model/group_panel/utils';
import { ScrollEventArgs, ScrollOffset } from '../../../scroll_view/common/types';
import type { dxSchedulerScrolling } from '../../../../../ui/scheduler';
import { getWindow } from '../../../../../core/utils/window';
import domAdapter from '../../../../../core/dom_adapter';
import { EffectReturn } from '../../../../utils/effect_return';
import { ConfigContext, ConfigContextValue } from '../../../../common/config_context';

interface VirtualScrollingSizes {
  cellHeight: number;
  cellWidth: number;
  viewWidth: number;
  viewHeight: number;
  scrollableWidth: number;
  windowHeight: number;
  windowWidth: number;
}

interface VirtualScrollingData {
  sizes: VirtualScrollingSizes;
  state: VirtualScrollingState;
}

const defaultVirtualScrollingMetaData = {
  cellHeight: 50,
  cellWidth: DATE_TABLE_MIN_CELL_WIDTH,
  viewWidth: 300,
  viewHeight: 300,
  scrollableWidth: 300,
  windowHeight: 300,
  windowWidth: 300,
};

const calculateDefaultVirtualScrollingState = (
  options: {
    virtualScrollingDispatcher: VirtualScrollingDispatcherType;
    scrolling: dxSchedulerScrolling;
    groups: Group[];
    completeViewDataMap: ViewCellData[][];
    isVerticalGrouping: boolean;
    schedulerHeight?: number | string | (() => number | string);
    schedulerWidth?: number | string | (() => number | string);
    rtlEnabled: boolean;
  },
): VirtualScrollingState => {
  const completeColumnCount = options.completeViewDataMap[0].length;
  const completeRowCount = options.completeViewDataMap.length;

  options.virtualScrollingDispatcher.setViewOptions(createVirtualScrollingOptions({
    cellHeight: defaultVirtualScrollingMetaData.cellHeight,
    cellWidth: defaultVirtualScrollingMetaData.cellWidth,
    schedulerHeight: options.schedulerHeight,
    schedulerWidth: options.schedulerWidth,
    viewHeight: defaultVirtualScrollingMetaData.viewHeight,
    viewWidth: defaultVirtualScrollingMetaData.viewWidth,
    scrolling: options.scrolling,
    scrollableWidth: defaultVirtualScrollingMetaData.scrollableWidth,
    groups: options.groups,
    isVerticalGrouping: options.isVerticalGrouping,
    completeRowCount,
    completeColumnCount,
    windowHeight: defaultVirtualScrollingMetaData.windowHeight,
    windowWidth: defaultVirtualScrollingMetaData.windowWidth,
    rtlEnabled: options.rtlEnabled,
  }));
  options.virtualScrollingDispatcher.createVirtualScrolling();
  options.virtualScrollingDispatcher.updateDimensions(true);

  return options.virtualScrollingDispatcher.getRenderState();
};

export const prepareGenerationOptions = (
  workSpaceProps: WorkSpaceGenerationOptions,
  renderConfig: ViewRenderConfig,
  isAllDayPanelVisible: boolean,
  virtualStartIndices: CorrectedVirtualScrollingState,
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
    startRowIndex: virtualStartIndices.startRowIndex,
    startCellIndex: virtualStartIndices.startCellIndex,
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
  widgetElementRef,

  isVerticalGrouping,
  isGroupedByDate,
  isStandaloneAllDayPanel,
  groupOrientation,

  groupPanelHeight,
  headerEmptyCellWidth,
  tablesWidth,
  classes,

  onScrollableScroll,

  props: {
    dataCellTemplate,
    dateCellTemplate,
    timeCellTemplate,
    resourceCellTemplate,

    groups,
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
    groupByDate={isGroupedByDate}
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

    onScroll={onScrollableScroll}

    className={classes}
    dateTableRef={dateTableRef}
    allDayPanelRef={allDayPanelRef}
    timePanelRef={timePanelRef}
    groupPanelRef={groupPanelRef}
    widgetElementRef={widgetElementRef}

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

  @InternalState()
  virtualScrolling: VirtualScrollingDispatcherType =
  (new VirtualScrollingDispatcher()) as unknown as VirtualScrollingDispatcherType;

  @InternalState()
  virtualScrollingData?: VirtualScrollingData;

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

  @ForwardRef()
  widgetElementRef!: RefObject<HTMLDivElement>;

  @Consumer(ConfigContext)
  config?: ConfigContextValue;

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

  get isGroupedByDate(): boolean {
    return isGroupingByDate(
      this.props.groups,
      this.groupOrientation,
      this.props.groupByDate,
    );
  }

  get layout(): JSXTemplate<
  MainLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData' | 'dateTableRef' | 'onScroll'
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
      isGroupedByDate: this.isGroupedByDate,
      isAllDayPanelVisible: this.isAllDayPanelVisible,
      viewType: type,
      interval: this.viewDataGenerator.getInterval(hoursInterval),
    });
  }

  get correctedVirtualScrollingState(): CorrectedVirtualScrollingState {
    let result = this.virtualScrollingData?.state;

    if (!result) {
      const {
        scrolling,
        schedulerHeight,
        schedulerWidth,
        groups,
      } = this.props;

      result = calculateDefaultVirtualScrollingState({
        virtualScrollingDispatcher: this.virtualScrolling,
        scrolling,
        groups,
        completeViewDataMap: this.completeViewDataMap,
        isVerticalGrouping: this.isVerticalGrouping,
        schedulerHeight,
        schedulerWidth,
        rtlEnabled: false, // Necessary for initialization
      });
    }

    return {
      startCellIndex: 0,
      startRowIndex: 0,
      ...result,
    };
  }

  get viewDataMap(): ViewDataMap {
    return this.viewDataGenerator.generateViewDataMap(
      this.completeViewDataMap,
      {
        ...this.correctedVirtualScrollingState,
        isVerticalGrouping: this.isVerticalGrouping,
        isAllDayPanelVisible: this.isAllDayPanelVisible,
      },
    );
  }

  get viewData(): GroupedViewData {
    const { groups } = this.props;
    const result = this.viewDataGenerator.getViewDataFromMap(
      this.completeViewDataMap,
      this.viewDataMap,
      {
        ...this.correctedVirtualScrollingState,
        isProvideVirtualCellsWidth: this.renderConfig.isProvideVirtualCellsWidth,
        isVerticalGrouping: this.isVerticalGrouping,
        isAllDayPanelVisible: this.isAllDayPanelVisible,
        isGroupedAllDayPanel: calculateIsGroupedAllDayPanel(
          groups, this.groupOrientation, this.isAllDayPanelVisible,
        ),
      },
    );

    return result;
  }

  get completeDateHeaderData(): DateHeaderCellData[][] {
    const {
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
        isGroupedByDate: this.isGroupedByDate,
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
    } = this.props;
    return this.dateHeaderDataGenerator.generateDateHeaderData(
      this.completeDateHeaderData,
      this.completeViewDataMap,
      {
        isGenerateWeekDaysHeaderData: this.renderConfig.isGenerateWeekDaysHeaderData,
        isProvideVirtualCellsWidth: this.renderConfig.isProvideVirtualCellsWidth,
        startDayHour,
        endDayHour,
        hoursInterval,
        groups,
        groupOrientation: this.groupOrientation,
        isGroupedByDate: this.isGroupedByDate,
        ...this.correctedVirtualScrollingState,
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
        isGroupedAllDayPanel: calculateIsGroupedAllDayPanel(
          this.props.groups, this.groupOrientation, this.isAllDayPanelVisible,
        ),
        isVerticalGrouping: this.isVerticalGrouping,
        isAllDayPanelVisible: this.isAllDayPanelVisible,
        ...this.correctedVirtualScrollingState,
      },
    );
  }

  get viewDataProvider(): ViewDataProviderType {
    const {
      intervalCount,
      groups,
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
        groupByDate: this.isGroupedByDate,
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
      this.correctedVirtualScrollingState,
    );

    viewDataProvider.setViewOptions(generationOptions);
    viewDataProvider.createGroupedDataMapProvider();

    return viewDataProvider;
  }

  get groupPanelData(): GroupPanelData {
    const {
      intervalCount,
      groups,
      startDayHour,
      endDayHour,
      currentDate,
      hoursInterval,
      type,
    } = this.props;

    const columnCountPerGroup = this.viewDataGenerator.getCellCount({
      intervalCount,
      hoursInterval,
      currentDate,
      startDayHour,
      endDayHour,
      viewType: type,
    });

    const groupPanelData = getGroupPanelData(
      groups,
      columnCountPerGroup,
      this.isGroupedByDate,
      this.isGroupedByDate ? 1 : columnCountPerGroup,
    );

    return groupPanelData;
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
      groups,
    } = this.props;

    return combineClasses({
      [this.renderConfig.className]: true,
      'dx-scheduler-work-space-count': intervalCount > 1,
      'dx-scheduler-work-space-odd-cells': !!this.isWorkSpaceWithOddCells,
      'dx-scheduler-work-space-all-day-collapsed': !allDayPanelExpanded && this.isAllDayPanelVisible,
      'dx-scheduler-work-space-all-day': this.isAllDayPanelVisible,
      'dx-scheduler-work-space-group-by-date': this.isGroupedByDate,
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

  @Effect({ run: 'always' })
  virtualScrollingMetaDataEffect(): void {
    const dateTableCell = this.dateTableRef.current!.querySelector('td:not(.dx-scheduler-virtual-cell)');
    const cellRect = dateTableCell!.getBoundingClientRect();
    const cellHeight = Math.floor(cellRect.height);
    const cellWidth = Math.floor(cellRect.width);

    const scrollableWidth = this.layoutRef.current!.getScrollableWidth();

    const widgetRect = this.widgetElementRef.current!.getBoundingClientRect();
    const viewHeight = widgetRect.height;
    const viewWidth = widgetRect.width;

    const windowHeight = getWindow().innerHeight;
    const windowWidth = getWindow().innerWidth;

    const nextSizes = {
      cellHeight,
      cellWidth,
      scrollableWidth,
      viewHeight,
      viewWidth,
      windowHeight,
      windowWidth,
    };

    const isNextMetaDataNotEqualToCurrent = !this.virtualScrollingData || Object.entries(nextSizes)
      .some(([key, value]) => value !== this.virtualScrollingData!.sizes[key]);

    if (isNextMetaDataNotEqualToCurrent) {
      const {
        scrolling,
        schedulerHeight,
        schedulerWidth,
        groups,
      } = this.props;
      const completeColumnCount = this.completeViewDataMap[0].length;
      const completeRowCount = this.completeViewDataMap.length;

      this.virtualScrolling.setViewOptions(createVirtualScrollingOptions({
        cellHeight: nextSizes.cellHeight,
        cellWidth: nextSizes.cellWidth,
        schedulerHeight,
        schedulerWidth,
        viewHeight: nextSizes.viewHeight,
        viewWidth: nextSizes.viewWidth,
        scrolling,
        scrollableWidth: nextSizes.scrollableWidth,
        groups,
        isVerticalGrouping: this.isVerticalGrouping,
        completeRowCount,
        completeColumnCount,
        windowHeight: nextSizes.windowHeight,
        windowWidth: nextSizes.windowWidth,
        rtlEnabled: !!this.config?.rtlEnabled,
      }));
      this.virtualScrolling.createVirtualScrolling();
      this.virtualScrolling.updateDimensions(true);

      this.virtualScrollingData = {
        state: this.virtualScrolling.getRenderState(),
        sizes: nextSizes,
      };
    }
  }

  @Effect()
  onWindowScrollEffect(): EffectReturn {
    if (this.virtualScrolling.isAttachWindowScrollEvent()) {
      return subscribeToScrollEvent(
        domAdapter.getDocument(),
        this.onWindowScroll,
      );
    }

    return undefined;
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
      groupOrientation,
      groupByDate,
      crossScrollingEnabled,
      firstDayOfWeek,
      startDate,
      showAllDayPanel,
      allDayPanelExpanded,
      scrolling,
      cellDuration,

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
      const columnCount = this.viewDataMap.dateTableMap[0].length;

      const dateTableCellsMeta = this.createDateTableElementsMeta(columnCount);
      const allDayPanelCellsMeta = this.createAllDayPanelElementsMeta();

      onViewRendered({
        viewDataProvider: this.viewDataProvider,
        cellsMetaData: {
          dateTableCellsMeta,
          allDayPanelCellsMeta,
        },
        viewDataProviderValidationOptions: {
          intervalCount,
          currentDate,
          type: viewType,
          hoursInterval,
          startDayHour,
          endDayHour,
          groups,
          groupOrientation,
          groupByDate,
          crossScrollingEnabled,
          firstDayOfWeek,
          startDate,
          showAllDayPanel,
          allDayPanelExpanded,
          scrolling,
          cellDuration,
        },
      });
    }
  }

  createDateTableElementsMeta(totalCellCount: number): DOMRect[][] {
    const dateTableCells = this.dateTableRef.current!.querySelectorAll('td:not(.dx-scheduler-virtual-cell)');
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

  onWindowScroll(): void {
    const { scrollX, scrollY } = getWindow();

    this.onScroll({
      top: scrollY,
      left: scrollX,
    });
  }

  onScrollableScroll(event: ScrollEventArgs): void {
    if (this.props.scrolling.mode === 'virtual') {
      this.onScroll(event.scrollOffset);
    }
  }

  onScroll(scrollOffset: ScrollOffset): void {
    this.virtualScrolling.handleOnScrollEvent(scrollOffset);
    const nextState = this.virtualScrolling.getRenderState();

    const isUpdateState = Object.entries(nextState)
      .some(([key, value]) => value !== this.virtualScrollingData!.state[key]);

    if (isUpdateState) {
      this.virtualScrollingData = {
        state: nextState,
        sizes: this.virtualScrollingData!.sizes,
      };
    }
  }
}
