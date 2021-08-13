import {
  Component,
  Effect,
  ForwardRef,
  JSXComponent,
  JSXTemplate,
  RefObject,
} from '@devextreme-generator/declarations';
import {
  DateHeaderData,
  GroupedViewData,
  GroupPanelData,
  TimePanelData,
  ViewDataProviderType,
} from '../types';
import { OrdinaryLayout, OrdinaryLayoutProps } from './ordinary_layout';

import ViewDataProvider from '../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import {
  createCellElementMetaData, getTotalCellCount,
} from './utils';
import { ViewRenderConfig, WorkSpaceProps } from '../props';
import { getViewRenderConfigByType } from './work_space_config';

const prepareGenerationOptions = (
  workSpaceProps: WorkSpaceProps,
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
    intervalCount,
  },

  renderConfig: {
    headerPanelTemplate,
    dateTableTemplate,
    timePanelTemplate,

    className,
    isAllDayPanelSupported,
    isRenderDateHeader,
  },
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
    intervalCount={intervalCount}

    headerPanelTemplate={headerPanelTemplate}
    dateTableTemplate={dateTableTemplate}
    timePanelTemplate={timePanelTemplate}

    isAllDayPanelCollapsed={!allDayPanelExpanded}
    isAllDayPanelSupported={isAllDayPanelSupported}
    isAllDayPanelVisible={isAllDayPanelVisible}
    isRenderDateHeader={isRenderDateHeader}

    className={className}
    dateTableRef={dateTableRef}
    allDayPanelRef={allDayPanelRef}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class WorkSpace extends JSXComponent<WorkSpaceProps, 'currentDate' | 'onViewRendered'>() {
  @ForwardRef()
  dateTableRef!: RefObject<HTMLTableElement>;

  @ForwardRef()
  allDayPanelRef!: RefObject<HTMLTableElement>;

  get renderConfig(): ViewRenderConfig {
    return getViewRenderConfigByType(this.props.type, this.props.intervalCount);
  }

  get layout(): JSXTemplate<
  OrdinaryLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData' | 'dateTableRef'
  > {
    return this.props.crossScrollingEnabled
      ? OrdinaryLayout // TODO: CrossScrollingLayout
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
    const { type } = this.props;

    // TODO: convert ViewdataProvider to TS
    const viewDataProvider = (new ViewDataProvider(type) as unknown) as ViewDataProviderType;

    const generationOptions = prepareGenerationOptions(
      this.props, this.renderConfig, this.isAllDayPanelVisible,
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
