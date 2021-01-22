import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import {
  DateTimeCellTemplateProps,
  ViewCellData,
} from '../../types.d';
import { isHorizontalGroupOrientation } from '../../utils';
import { HeaderPanelCell } from './cell';
import { GroupPanel } from '../group_panel/group_panel';
import { GroupPanelProps } from '../group_panel/group_panel_props';

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
    <Row className="dx-scheduler-header-row">
      {dateHeaderMap[0].map(({
        startDate,
        endDate,
        today,
        groups: cellGroups,
        groupIndex,
        isFirstGroupCell,
        isLastGroupCell,
        index,
        key,
        text,
      }) => (
        <HeaderPanelCell
          startDate={startDate}
          endDate={endDate}
          groups={isHorizontalGrouping ? cellGroups : undefined}
          groupIndex={isHorizontalGrouping ? groupIndex : undefined}
          today={today}
          index={index}
          text={text}
          isFirstGroupCell={isFirstGroupCell}
          isLastGroupCell={isLastGroupCell}
          dateCellTemplate={dateCellTemplate}
          key={key}
        />
      ))}
    </Row>
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
  @OneWay() dateHeaderMap: ViewCellData[][] = [];

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
