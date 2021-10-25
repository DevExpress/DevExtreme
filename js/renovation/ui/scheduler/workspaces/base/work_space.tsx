/* eslint-disable class-methods-use-this */
import {
  Component,
  Effect,
  ForwardRef,
  InternalState,
  JSXComponent,
  JSXTemplate,
  RefObject,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';
import {
  DateHeaderData,
  GroupedViewData,
  GroupPanelData,
  TimePanelData,
  ViewDataProviderType,
} from '../types';
import { OrdinaryLayout } from './ordinary_layout';

import ViewDataProvider from '../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import {
  createCellElementMetaData, getTotalCellCount,
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

export const prepareGenerationOptions = (
  workSpaceProps: Partial<WorkSpaceProps>,
  renderConfig: ViewRenderConfig,
  isAllDayPanelVisible: boolean,
): unknown => {
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
  // dateHeaderData,
  // viewData,
  // timePanelData,
  groupPanelData,
  layout: Layout,
  isAllDayPanelVisible,
  isRenderHeaderEmptyCell,
  viewDataProvider,

  dateTableRef,
  allDayPanelRef,
  timePanelRef,
  groupPanelRef,

  isVerticalGrouping,
  isStandaloneAllDayPanel,
  groupOrientation,

  groupPanelHeight,
  headerEmptyCellWidth,
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
    viewData={viewDataProvider.viewData}
    dateHeaderData={viewDataProvider.dateHeaderData}
    timePanelData={viewDataProvider.timePanelData}
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

  @ForwardRef()
  dateTableRef!: RefObject<HTMLTableElement>;

  @ForwardRef()
  allDayPanelRef!: RefObject<HTMLTableElement>;

  @ForwardRef()
  timePanelRef!: RefObject<HTMLTableElement>;

  @ForwardRef()
  groupPanelRef!: RefObject<HTMLDivElement>;

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

  // TODO: implement using ViewDataGenerator, now it returns fake data
  // eslint-disable-next-line class-methods-use-this
  get viewData(): GroupedViewData {
    return {
      groupedData: [{
        dateTable: [[{
          startDate: new Date(),
          endDate: new Date(),
          index: 0,
          isFirstGroupCell: true,
          isLastGroupCell: true,
          key: 0,
          groupIndex: 0,
        }]],
        groupIndex: 0,
      }],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      topVirtualRowCount: 0,
      bottomVirtualRowCount: 0,
    };
  }

  // TODO: implement using ViewDataGenerator, now it returns fake data
  // eslint-disable-next-line class-methods-use-this
  get dateHeaderData(): DateHeaderData {
    return {
      dataMap: [[]],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      leftVirtualCellWidth: 0,
      rightVirtualCellWidth: 0,
    };
  }

  // TODO: implement using ViewDataGenerator, now it returns fake data
  // eslint-disable-next-line class-methods-use-this
  get timePanelData(): TimePanelData {
    return {
      groupedData: [],
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      topVirtualRowCount: 0,
      bottomVirtualRowCount: 0,
    };
  }

  // TODO: rework
  get viewDataProvider(): ViewDataProviderType {
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

    // TODO: convert ViewdataProvider to TS
    const viewDataProvider = (new ViewDataProvider(type) as unknown) as ViewDataProviderType;

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
    viewDataProvider.update(generationOptions, true);

    return viewDataProvider;
  }

  get groupPanelData(): GroupPanelData {
    const generationOptions = prepareGenerationOptions(
      this.props, this.renderConfig, this.isAllDayPanelVisible,
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

  @Effect()
  onViewRendered(): void {
    const {
      onViewRendered,
      intervalCount,
      currentDate,
      type,
      hoursInterval,
      startDayHour,
      endDayHour,
      groups,
    } = this.props;

    const cellCount = this.viewDataProvider.getCellCount({
      intervalCount,
      currentDate,
      viewType: type,
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
