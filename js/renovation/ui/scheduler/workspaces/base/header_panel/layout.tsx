import {
  Component,
  ComponentBindings,
  Effect,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from 'devextreme-generator/component_declaration/common';
import {
  DateHeaderData,
  DateTimeCellTemplateProps,
} from '../../types.d';
import { isHorizontalGroupOrientation } from '../../utils';
import { GroupPanel } from '../group_panel/group_panel';
import { GroupPanelProps } from '../group_panel/group_panel_props';
import { DateHeaderLayout, DateHeaderLayoutProps } from './date_header/layout';
import HeaderPanel from '../../../../../component_wrapper/scheduler_header_panel';

let dateHeader = null;

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderData,
    groupByDate,
    groups,
    groupOrientation,
    groupPanelCellBaseColSpan,
    columnCountPerGroup,
    isRenderDateHeader,
    resourceCellTemplate,
    dateCellTemplate,
    timeCellTemplate,
    dateHeaderTemplate: DateHeader,
  },
}: HeaderPanelLayout): JSX.Element => {
  // const isTrue = dateHeaderData === dateHeader;
  console.log(dateHeaderData);
  // console.log('////////////');
  dateHeader = dateHeaderData;

  return (
    <thead>
      {isHorizontalGrouping && !groupByDate && (
      <GroupPanel
        groups={groups}
        groupByDate={groupByDate}
        groupOrientation={groupOrientation}
        baseColSpan={groupPanelCellBaseColSpan}
        columnCountPerGroup={columnCountPerGroup}
        resourceCellTemplate={resourceCellTemplate}
      />
      )}
      {isRenderDateHeader && (
      <DateHeader
        groupByDate={groupByDate}
        dateHeaderData={dateHeaderData}
        groupOrientation={groupOrientation}
        groups={groups}
        dateCellTemplate={dateCellTemplate}
        timeCellTemplate={timeCellTemplate}
      />
      )}
      {groupByDate && (
      <GroupPanel
        groups={groups}
        groupByDate={groupByDate}
        groupOrientation={groupOrientation}
        baseColSpan={groupPanelCellBaseColSpan}
        columnCountPerGroup={columnCountPerGroup}
        resourceCellTemplate={resourceCellTemplate}
      />
      )}
    </thead>
  );
};

@ComponentBindings()
export class HeaderPanelLayoutProps extends GroupPanelProps {
  @OneWay() dateHeaderData!: DateHeaderData;

  @OneWay() isRenderDateHeader = true;

  @OneWay() groupPanelCellBaseColSpan = 1;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() dateHeaderTemplate: JSXTemplate<DateHeaderLayoutProps, 'dateHeaderData'> = DateHeaderLayout;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true, component: HeaderPanel },
})
export class HeaderPanelLayout extends JSXComponent<HeaderPanelLayoutProps, 'dateHeaderData'>() {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups } = this.props;

    return isHorizontalGroupOrientation(groups, groupOrientation);
  }

  @Effect({ run: 'always' })
  someEffect() {
    console.log('effect');
  }
}
