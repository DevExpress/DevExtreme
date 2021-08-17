import {
  Component,
  ComponentBindings,
  Effect,
  ForwardRef,
  InternalState,
  JSXComponent,
  JSXTemplate,
  OneWay,
  RefObject,
  Template,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../utils/combine_classes';
import { Widget } from '../../../common/widget';
import { Scrollable } from '../../../scroll_view/scrollable';
import {
  DateHeaderData,
  DateTimeCellTemplateProps,
  Group,
  GroupPanelData,
  ResourceCellTemplateProps,
  TimePanelData,
} from '../types';
import { isHorizontalGroupingApplied, isVerticalGroupingApplied } from '../utils';
import { DateTableLayoutProps } from './date_table/layout';
import { GroupPanel } from './group_panel/group_panel';
import { HeaderPanelLayoutProps } from './header_panel/layout';
import { LayoutProps } from './layout_props';
import { TimePaneLayoutProps } from './time_panel/layout';
import { AllDayPanelTitle } from './date_table/all_day_panel/title';
import { AllDayPanelLayout } from './date_table/all_day_panel/layout';
import { ScrollableDirection } from '../../../scroll_view/types';

export const viewFunction = ({
  classes,
  isRenderGroupPanel,
  isStandaloneAllDayPanel,
  isSetAllDayTitleClass,
  groupPanelHeight,

  props: {
    headerPanelTemplate: HeaderPanel,
    dateTableTemplate: DateTable,
    timePanelTemplate: TimePanel,

    viewData,
    timePanelData,
    dateHeaderData,
    groupPanelData,
    groupOrientation,
    isRenderDateHeader,
    groups,
    groupByDate,
    groupPanelClassName,
    isAllDayPanelSupported,
    scrollingDirection,

    dataCellTemplate,
    timeCellTemplate,
    dateCellTemplate,
    resourceCellTemplate,

    dateTableRef,
    allDayPanelRef,
  },
}: OrdinaryLayout): JSX.Element => (
  <Widget
    className={classes}
  >
    {isAllDayPanelSupported && (
      <AllDayPanelTitle
        visible={isStandaloneAllDayPanel}
        isSetTitleClass={isSetAllDayTitleClass}
      />
    )}
    <table className="dx-scheduler-header-panel">
      <HeaderPanel
        dateHeaderData={dateHeaderData}
        groupPanelData={groupPanelData}
        timeCellTemplate={timeCellTemplate}
        dateCellTemplate={dateCellTemplate}
        isRenderDateHeader={isRenderDateHeader}

        groupOrientation={groupOrientation}
        groupByDate={groupByDate}
        groups={groups}
        resourceCellTemplate={resourceCellTemplate}
      />
    </table>
    {isAllDayPanelSupported && (
      <AllDayPanelLayout
        visible={isStandaloneAllDayPanel}
        viewData={viewData}
        dataCellTemplate={dataCellTemplate}
        tableRef={allDayPanelRef}
      />
    )}
    <Scrollable
      useKeyboard={false}
      bounceEnabled={false}
      direction={scrollingDirection}
      className="dx-scheduler-date-table-scrollable"
    >
      {isRenderGroupPanel && (
        <GroupPanel
          groupPanelData={groupPanelData}
          className={groupPanelClassName}
          groupOrientation={groupOrientation}
          groupByDate={groupByDate}
          groups={groups}
          resourceCellTemplate={resourceCellTemplate}
          height={groupPanelHeight}
        />
      )}
      {!!TimePanel && (
        <TimePanel
          timePanelData={timePanelData}
          timeCellTemplate={timeCellTemplate}
          groupOrientation={groupOrientation}
        />
      )}
      <DateTable
        tableRef={dateTableRef}
        viewData={viewData}
        groupOrientation={groupOrientation}
        dataCellTemplate={dataCellTemplate}
      />
    </Scrollable>
  </Widget>
);

@ComponentBindings()
export class OrdinaryLayoutProps extends LayoutProps {
  @Template() headerPanelTemplate!: JSXTemplate<HeaderPanelLayoutProps, 'dateHeaderData'>;

  @Template() dateTableTemplate!: JSXTemplate<DateTableLayoutProps>;

  @Template() timePanelTemplate?: JSXTemplate<TimePaneLayoutProps>;

  @Template() resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @OneWay() timePanelData: TimePanelData = {
    groupedData: [],
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  };

  @OneWay() dateHeaderData!: DateHeaderData;

  @OneWay() groupPanelData: GroupPanelData = {
    groupPanelItems: [],
    baseColSpan: 1,
  };

  @OneWay() intervalCount = 1;

  @OneWay() className = '';

  @OneWay() isRenderDateHeader = true;

  @OneWay() groups: Group[] = [];

  @OneWay() groupByDate = false;

  @OneWay() groupPanelClassName:
  'dx-scheduler-work-space-vertical-group-table' | 'dx-scheduler-group-table'
  = 'dx-scheduler-work-space-vertical-group-table';

  @OneWay() isWorkSpaceWithOddCells?: boolean;

  @OneWay() isAllDayPanelCollapsed = true;

  @OneWay() isAllDayPanelSupported = false;

  @OneWay() isAllDayPanelVisible = false;

  @OneWay() scrollingDirection?: ScrollableDirection;

  @ForwardRef() dateTableRef!: RefObject<HTMLTableElement>;

  @ForwardRef() allDayPanelRef?: RefObject<HTMLTableElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class OrdinaryLayout extends JSXComponent<
OrdinaryLayoutProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData' | 'dateTableRef'
>() {
  @InternalState()
  groupPanelHeight: number | undefined;

  get classes(): string {
    const {
      className,
      intervalCount,
      isWorkSpaceWithOddCells,
      isAllDayPanelCollapsed,
      isAllDayPanelVisible,
      groupByDate,
      groups,
      groupOrientation,
    } = this.props;

    return combineClasses({
      [className]: !!className,
      'dx-scheduler-work-space-count': intervalCount > 1,
      'dx-scheduler-work-space-odd-cells': !!isWorkSpaceWithOddCells,
      'dx-scheduler-work-space-all-day-collapsed': isAllDayPanelCollapsed && isAllDayPanelVisible,
      'dx-scheduler-work-space-all-day': isAllDayPanelVisible,
      'dx-scheduler-work-space-group-by-date': groupByDate,
      'dx-scheduler-work-space-grouped': groups.length > 0,
      'dx-scheduler-work-space-vertical-grouped': isVerticalGroupingApplied(groups, groupOrientation),
      'dx-scheduler-group-row-count-one': isHorizontalGroupingApplied(groups, groupOrientation)
        && groups.length === 1,
      'dx-scheduler-group-row-count-two': isHorizontalGroupingApplied(groups, groupOrientation)
        && groups.length === 2,
      'dx-scheduler-group-row-count-three': isHorizontalGroupingApplied(groups, groupOrientation)
        && groups.length === 3,
      'dx-scheduler-group-column-count-one': isVerticalGroupingApplied(groups, groupOrientation)
        && groups.length === 1,
      'dx-scheduler-group-column-count-two': isVerticalGroupingApplied(groups, groupOrientation)
        && groups.length === 2,
      'dx-scheduler-group-column-count-three': isVerticalGroupingApplied(groups, groupOrientation)
        && groups.length === 3,
      'dx-scheduler-work-space': true,
    });
  }

  get isRenderGroupPanel(): boolean {
    const {
      groups, groupOrientation,
    } = this.props;

    return isVerticalGroupingApplied(groups, groupOrientation);
  }

  get isStandaloneAllDayPanel(): boolean {
    const {
      groups,
      groupOrientation,
      isAllDayPanelVisible,
    } = this.props;

    return !isVerticalGroupingApplied(groups, groupOrientation) && isAllDayPanelVisible;
  }

  get isSetAllDayTitleClass(): boolean {
    const { groups, groupOrientation } = this.props;

    return !isVerticalGroupingApplied(groups, groupOrientation);
  }

  @Effect()
  groupPanelHeightEffect(): void {
    this.groupPanelHeight = this.props.dateTableRef.current?.getBoundingClientRect().height;
  }
}
