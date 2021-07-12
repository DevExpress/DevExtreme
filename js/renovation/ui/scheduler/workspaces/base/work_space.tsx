import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from '@devextreme-generator/declarations';
import {
  DataCellTemplateProps,
  DateHeaderData,
  DateTimeCellTemplateProps,
  Group,
  GroupedViewData,
  ResourceCellTemplateProps,
  TimePanelData,
} from '../types';
import { GroupOrientation } from '../../types';
import { OrdinaryLayout, OrdinaryLayoutProps } from './ordinary_layout';
import dateUtils from '../../../../../core/utils/date';
import type { dxSchedulerScrolling } from '../../../../../ui/scheduler';
import { HeaderPanelLayout, HeaderPanelLayoutProps } from './header_panel/layout';
import { DateTableLayoutBase, DateTableLayoutProps } from './date_table/layout';
import { TimePaneLayoutProps } from './time_panel/layout';

export const viewFunction = ({
  dateHeaderData,
  viewData,
  timePanelData,
  layout: Layout,
  isAllDayPanelVisible,

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
  },
}: WorkSpaceBase): JSX.Element => (
  <Layout
    viewData={viewData}
    dateHeaderData={dateHeaderData}
    timePanelData={timePanelData}
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
  />
);

@ComponentBindings()
export class WorkSpaceBaseProps {
  // -------------------
  // Public templates
  // -------------------

  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  // -----------------
  // Public props
  // -----------------

  @OneWay() intervalCount = 1;

  @OneWay() groups: Group[] = [];

  @OneWay() groupByDate = false;

  @OneWay() groupOrientation: GroupOrientation = 'horizontal';

  @OneWay() crossScrollingEnabled = false;

  @OneWay() startDayHour = 0;

  @OneWay() endDayHour = 24;

  @OneWay() firstDayOfWeek = 0;

  @OneWay() currentDate!: Date;

  @OneWay() startDate?: Date;

  @OneWay() hoursInterval = 0.5;

  @OneWay() showAllDayPanel = false;

  @OneWay() allDayPanelExpanded = false;

  @OneWay() allowMultipleCellSelection = true;

  @OneWay() indicatorTime = new Date();

  @OneWay() indicatorUpdateInterval = 5 * dateUtils.dateToMilliseconds('minute');

  @OneWay() shadeUntilCurrentTime = true;

  @OneWay() selectedCellData = [];

  @OneWay() scrolling: dxSchedulerScrolling = {
    mode: 'standard',
  };

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
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class WorkSpaceBase extends JSXComponent<WorkSpaceBaseProps, 'currentDate'>() {
  get layout(): JSXTemplate<
  OrdinaryLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData'
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
      cellCountInGroupRow: 1,
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
      cellCountInGroupRow: 0,
      leftVirtualCellCount: 0,
      rightVirtualCellCount: 0,
      topVirtualRowCount: 0,
      bottomVirtualRowCount: 0,
    };
  }
}
