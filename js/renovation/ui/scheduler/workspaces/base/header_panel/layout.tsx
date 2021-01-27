import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from 'devextreme-generator/component_declaration/common';
import {
  DateHeaderCellData,
  DateTimeCellTemplateProps,
} from '../../types.d';
import { isHorizontalGroupOrientation } from '../../utils';
import { GroupPanel } from '../group_panel/group_panel';
import { GroupPanelProps } from '../group_panel/group_panel_props';
import { DateHeaderLayout } from './date_header/layout';

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderMap,
    groupByDate,
    groups,
    groupOrientation,
    groupPanelCellBaseColSpan,
    columnCountPerGroup,
    isRenderDateHeader,
    useTimeCellTemplate,
    resourceCellTemplate,
    dateCellTemplate,
    timeCellTemplate,
  },
}: HeaderPanelLayout): JSX.Element => (
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
      <DateHeaderLayout
        dateHeaderMap={dateHeaderMap}
        groupOrientation={groupOrientation}
        groups={groups}
        useTimeCellTemplate={useTimeCellTemplate}
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

@ComponentBindings()
export class HeaderPanelLayoutProps extends GroupPanelProps {
  @OneWay() dateHeaderMap: DateHeaderCellData[][] = [];

  @OneWay() isRenderDateHeader = true;

  @OneWay() groupPanelCellBaseColSpan = 1;

  @OneWay() useTimeCellTemplate = false;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class HeaderPanelLayout extends JSXComponent(HeaderPanelLayoutProps) {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups } = this.props;

    return isHorizontalGroupOrientation(groups, groupOrientation);
  }
}
