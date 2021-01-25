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
import { DateHeader } from './date_header/layout';

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderMap,
    dateCellTemplate,
    groupByDate,
    groups,
    groupOrientation,
    baseColSpan,
    columnCountPerGroup,
    isRenderDateHeader,
    resourceCellTemplate,
  },
}: HeaderPanel): JSX.Element => (
  <thead>
    {isHorizontalGrouping && !groupByDate && (
      <GroupPanel
        groups={groups}
        groupByDate={groupByDate}
        groupOrientation={groupOrientation}
        baseColSpan={baseColSpan}
        columnCountPerGroup={columnCountPerGroup}
        resourceCellTemplate={resourceCellTemplate}
      />
    )}
    {isRenderDateHeader && (
      <DateHeader
        dateHeaderMap={dateHeaderMap}
        dateCellTemplate={dateCellTemplate}
        groupOrientation={groupOrientation}
        groups={groups}
      />
    )}
    {groupByDate && (
      <GroupPanel
        groups={groups}
        groupByDate={groupByDate}
        groupOrientation={groupOrientation}
        baseColSpan={baseColSpan}
        columnCountPerGroup={columnCountPerGroup}
        resourceCellTemplate={resourceCellTemplate}
      />
    )}
  </thead>
);

@ComponentBindings()
export class HeaderPanelProps extends GroupPanelProps {
  @OneWay() dateHeaderMap: DateHeaderCellData[][] = [];

  @OneWay() isRenderDateHeader = true;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class HeaderPanel extends JSXComponent(HeaderPanelProps) {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups } = this.props;

    return isHorizontalGroupOrientation(groups, groupOrientation);
  }
}
