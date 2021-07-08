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
  ResourceCellTemplateProps,
  TimePanelData,
} from '../types';
import { isHorizontalGroupOrientation, isVerticalGroupOrientation } from '../utils';
import { DateTableLayoutProps } from './date_table/layout';
import { GroupPanel } from './group_panel/group_panel';
import { HeaderPanelLayoutProps } from './header_panel/layout';
import { LayoutProps } from './layout_props';
import { TimePaneLayoutProps } from './time_panel/layout';
import { AllDayPanelTitle } from './date_table/all_day_panel/title';
import { AllDayPanelLayout } from './date_table/all_day_panel/layout';

export const viewFunction = ({
  classes,
  isRenderGroupPanel,
  isStandaloneAllDayPanel,
  isSetAllDayTitleClass,
  dateTableRef,
  groupPanelHeight,

  props: {
    headerPanelTemplate: HeaderPanel,
    dateTableTemplate: DateTable,
    timePanelTemplate: TimePanel,

    viewData,
    timePanelData,
    dateHeaderData,
    groupOrientation,
    isRenderDateHeader,
    groupPanelCellBaseColSpan,
    groups,
    groupByDate,
    columnCountPerGroup,
    groupPanelClassName,
    isAllDayPanelSupported,

    dataCellTemplate,
    timeCellTemplate,
    dateCellTemplate,
    resourceCellTemplate,
  },
}: LayoutBase): JSX.Element => (
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
        timeCellTemplate={timeCellTemplate}
        dateCellTemplate={dateCellTemplate}
        isRenderDateHeader={isRenderDateHeader}

        groupPanelCellBaseColSpan={groupPanelCellBaseColSpan}
        groupOrientation={groupOrientation}
        groupByDate={groupByDate}
        groups={groups}
        columnCountPerGroup={columnCountPerGroup}
        resourceCellTemplate={resourceCellTemplate}
      />
    </table>
    {isAllDayPanelSupported && (
      <AllDayPanelLayout
        visible={isStandaloneAllDayPanel}
        viewData={viewData}
        dataCellTemplate={dataCellTemplate}
      />
    )}
    <Scrollable
      useKeyboard={false}
      bounceEnabled={false}
      className="dx-scheduler-date-table-scrollable"
    >
      {isRenderGroupPanel && (
        <GroupPanel
          baseColSpan={groupPanelCellBaseColSpan}
          className={groupPanelClassName}
          groupOrientation={groupOrientation}
          groupByDate={groupByDate}
          groups={groups}
          columnCountPerGroup={columnCountPerGroup}
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
export class LayoutBaseProps extends LayoutProps {
  @Template() headerPanelTemplate!: JSXTemplate<HeaderPanelLayoutProps>;

  @Template() dateTableTemplate!: JSXTemplate<DateTableLayoutProps>;

  @Template() timePanelTemplate?: JSXTemplate<TimePaneLayoutProps>;

  @Template() resourceCellTemplate?: JSXTemplate<ResourceCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @OneWay() timePanelData: TimePanelData = {
    groupedData: [],
    cellCountInGroupRow: 0,
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  };

  @OneWay() dateHeaderData!: DateHeaderData;

  @OneWay() intervalCount = 1;

  @OneWay() className = '';

  @OneWay() isRenderDateHeader = true;

  @OneWay() groupPanelCellBaseColSpan = 1;

  @OneWay() groups: Group[] = [];

  @OneWay() groupByDate = false;

  @OneWay() columnCountPerGroup = 1;

  @OneWay() groupPanelClassName:
  'dx-scheduler-work-space-vertical-group-table' | 'dx-scheduler-group-table'
  = 'dx-scheduler-work-space-vertical-group-table';

  @OneWay() isWorkSpaceWithOddCells?: boolean;

  @OneWay() isAllDayPanelCollapsed = true;

  @OneWay() isAllDayPanelSupported = false;

  @OneWay() isAllDayPanelVisible = false;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class LayoutBase extends JSXComponent<
LayoutBaseProps, 'headerPanelTemplate' | 'dateTableTemplate' | 'dateHeaderData'
>() {
  @InternalState()
  groupPanelHeight: number | undefined;

  @ForwardRef()
  dateTableRef!: RefObject<HTMLTableElement>;

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
      'dx-scheduler-work-space-vertical-grouped': isVerticalGroupOrientation(groupOrientation, groups),
      'dx-scheduler-group-row-count-one': isHorizontalGroupOrientation(groups, groupOrientation)
        && groups.length === 1,
      'dx-scheduler-group-row-count-two': isHorizontalGroupOrientation(groups, groupOrientation)
        && groups.length === 2,
      'dx-scheduler-group-row-count-three': isHorizontalGroupOrientation(groups, groupOrientation)
        && groups.length === 3,
      'dx-scheduler-group-column-count-one': isVerticalGroupOrientation(groupOrientation, groups)
        && groups.length === 1,
      'dx-scheduler-group-column-count-two': isVerticalGroupOrientation(groupOrientation, groups)
        && groups.length === 2,
      'dx-scheduler-group-column-count-three': isVerticalGroupOrientation(groupOrientation, groups)
        && groups.length === 3,
      'dx-scheduler-work-space': true,
    });
  }

  get isRenderGroupPanel(): boolean {
    const {
      groups, groupOrientation,
    } = this.props;

    return isVerticalGroupOrientation(groupOrientation, groups);
  }

  get isStandaloneAllDayPanel(): boolean {
    const {
      groups,
      groupOrientation,
      isAllDayPanelVisible,
    } = this.props;

    return !isVerticalGroupOrientation(groupOrientation, groups) && isAllDayPanelVisible;
  }

  get isSetAllDayTitleClass(): boolean {
    const { groups, groupOrientation } = this.props;

    return !isVerticalGroupOrientation(groupOrientation, groups);
  }

  @Effect()
  groupPanelHeightEffect(): void {
    this.groupPanelHeight = this.dateTableRef.current?.getBoundingClientRect().height;
  }
}
