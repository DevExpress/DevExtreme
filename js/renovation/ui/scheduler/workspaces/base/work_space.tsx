import {
  Component,
  ComponentBindings,
  Effect,
  ForwardRef,
  JSXComponent,
  JSXTemplate,
  OneWay,
  RefObject,
  Template,
} from '@devextreme-generator/declarations';
import {
  DateHeaderData,
  GroupedViewData,
  TimePanelData,
  ViewDataProviderType,
} from '../types';
import { OrdinaryLayout, OrdinaryLayoutProps } from './ordinary_layout';
import { HeaderPanelLayout, HeaderPanelLayoutProps } from './header_panel/layout';
import { DateTableLayoutBase, DateTableLayoutProps } from './date_table/layout';
import { TimePaneLayoutProps } from './time_panel/layout';

import ViewDataProvider from '../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import {
  createCellElementMetaData,
  getHiddenInterval, getRowCountWithAllDayRow, getTotalCellCount, getTotalRowCount,
} from './utils';
import { WorkSpaceProps } from '../props';

type GetDateForHeaderText = (index: number, date: Date) => Date;

export const viewFunction = ({
  // dateHeaderData,
  // viewData,
  // timePanelData,
  layout: Layout,
  isAllDayPanelVisible,
  viewDataProvider,
  dateTableRef,
  allDayPanelRef,

  props: {
    dataCellTemplate,
    dateCellTemplate,
    timeCellTemplate,
    resourceCellTemplate,

    groups,
    groupByDate,
    groupOrientation,
    allDayPanelExpanded,
    isAllDayPanelSupported,

    headerPanelTemplate,
    dateTableTemplate,
    timePanelTemplate,

    className,
  },
}: WorkSpaceBase): JSX.Element => (
  <Layout
    viewData={viewDataProvider.viewData}
    dateHeaderData={viewDataProvider.dateHeaderData}
    timePanelData={viewDataProvider.timePanelData}
    dataCellTemplate={dataCellTemplate}
    dateCellTemplate={dateCellTemplate}
    timeCellTemplate={timeCellTemplate}
    resourceCellTemplate={resourceCellTemplate}

    groups={groups}
    groupByDate={groupByDate}
    groupOrientation={groupOrientation}

    headerPanelTemplate={headerPanelTemplate}
    dateTableTemplate={dateTableTemplate}
    timePanelTemplate={timePanelTemplate}

    isAllDayPanelCollapsed={!allDayPanelExpanded}
    isAllDayPanelSupported={isAllDayPanelSupported}
    isAllDayPanelVisible={isAllDayPanelVisible}

    className={className}
    dateTableRef={dateTableRef}
    allDayPanelRef={allDayPanelRef}
  />
);

@ComponentBindings()
export class WorkSpaceBaseProps extends WorkSpaceProps {
  // ---------------------
  // Internal for workspaces templates
  // ---------------------

  @Template() headerPanelTemplate: JSXTemplate<HeaderPanelLayoutProps, 'dateHeaderData'> = HeaderPanelLayout;

  @Template() dateTableTemplate: JSXTemplate<DateTableLayoutProps> = DateTableLayoutBase;

  @Template() timePanelTemplate?: JSXTemplate<TimePaneLayoutProps>;

  // ---------------------
  // Internal for work-spaces props
  // ---------------------

  @OneWay() isAllDayPanelSupported = false;

  @OneWay() groupPanelClassName?: 'dx-scheduler-work-space-vertical-group-table' | 'dx-scheduler-group-table';

  @OneWay() isWorkWeekView = false;

  @OneWay() type: 'day' | 'week' | 'workWeek' | 'month'
  | 'timelineDay' | 'timelineWeek' | 'timelineWorkWeek' | 'timelineMonth' | 'agenda' = 'week';

  @OneWay() headerCellTextFormat?: string | ((date: Date) => string);

  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class WorkSpaceBase extends JSXComponent<WorkSpaceBaseProps, 'currentDate' | 'onViewRendered'>() {
  @ForwardRef()
  dateTableRef!: RefObject<HTMLTableElement>;

  @ForwardRef()
  allDayPanelRef!: RefObject<HTMLTableElement>;

  get layout(): JSXTemplate<
  OrdinaryLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData' | 'dateTableRef'
  > {
    return this.props.crossScrollingEnabled
      ? OrdinaryLayout // TODO: CrossScrollingLayout
      : OrdinaryLayout;
  }

  get isAllDayPanelVisible(): boolean {
    const {
      isAllDayPanelSupported,
      showAllDayPanel,
    } = this.props;

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
      groupOrientation,
      startDayHour,
      endDayHour,
      currentDate,
      startDate,
      firstDayOfWeek,
      hoursInterval,
      type,
      isWorkWeekView,
      headerCellTextFormat,
    } = this.props;

    // TODO: convert ViewdataProvider to TS
    const viewDataProvider = (new ViewDataProvider(type) as unknown) as ViewDataProviderType;
    const getDateForHeaderText: GetDateForHeaderText = (_, date) => date;

    const cellCount = viewDataProvider.getCellCount({
      intervalCount,
      currentDate,
      viewType: type,
      hoursInterval,
      startDayHour,
      endDayHour,
    });
    const rowCount = viewDataProvider.getRowCount({
      intervalCount,
      currentDate,
      viewType: type,
      hoursInterval,
      startDayHour,
      endDayHour,
    });
    const totalCellCount = getTotalCellCount(cellCount, groupOrientation, groups);
    const totalRowCount = getTotalRowCount(
      rowCount, groupOrientation, groups, this.isAllDayPanelVisible,
    );
    const hiddenInterval = getHiddenInterval(hoursInterval, rowCount);

    const generationOptions = {
      cellCount: totalCellCount,
      totalCellCount,
      rowCount: totalRowCount,
      totalRowCount,
      rowCountWithAllDayRow: getRowCountWithAllDayRow(rowCount, this.isAllDayPanelVisible),
      rowCountBase: rowCount,
      columnCountBase: cellCount,
      startRowIndex: 0,
      startCellIndex: 0,
      groupOrientation,
      groupByDate,
      groups,
      isProvideVirtualCellsWidth: false,
      isAllDayPanelVisible: this.isAllDayPanelVisible,
      selectedCells: undefined,
      focusedCell: undefined,
      headerCellTextFormat,
      getDateForHeaderText,
      startDayHour,
      endDayHour,
      cellDuration: hoursInterval * 60,
      viewType: type,
      intervalCount,
      hoursInterval,
      currentDate,
      startDate,
      firstDayOfWeek,

      isWorkView: isWorkWeekView,
      columnsInDay: 1,
      hiddenInterval,
      tableAllDay: false,
      isGenerateTimePanelData: true,
    };

    viewDataProvider.update(generationOptions, true);

    return viewDataProvider;
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
      groupOrientation,
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
    const totalCellCount = getTotalCellCount(cellCount, groupOrientation, groups);

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

  createDateTableElementsMeta(totalCellCount: number): ClientRect[][] {
    const dateTableCells = this.dateTableRef.current!.querySelectorAll('td');
    const dateTableRect = this.dateTableRef.current!.getBoundingClientRect();
    const dateTableCellsMeta: ClientRect[][] = [];

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

  createAllDayPanelElementsMeta(): ClientRect[] {
    if (!this.allDayPanelRef.current) {
      return [];
    }

    const allDayPanelCells = this.allDayPanelRef.current.querySelectorAll('td');
    const allDayPanelRect = this.allDayPanelRef.current.getBoundingClientRect();
    const allDayPanelCellsMeta: ClientRect[] = [];

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
