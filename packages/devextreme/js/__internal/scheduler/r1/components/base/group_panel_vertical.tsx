import { BaseInfernoComponent, normalizeStyles } from '@ts/core/r1/runtime/inferno/index';

import { extendGroupItemsForGroupingByDate, flattenGroupPanelTreeToLeafRows, renderUtils } from '../../utils/index';
import type { GroupPanelProps } from './group_panel';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVerticalCell } from './group_panel_vertical_cell';
import { GroupPanelVerticalNode } from './group_panel_vertical_node';
import { GroupPanelVerticalRow } from './group_panel_vertical_row';

const HIERARCHICAL_GROUP_FLEX_CONTAINER_CLASS = 'dx-scheduler-group-flex-container-hierarchical';
const TIMELINE_GROUP_TABLE_CLASS = 'dx-scheduler-group-table';

const getTimelineGroupPanelRows = (
  groupPanelData: GroupPanelProps['groupPanelData'],
  groupByDate: boolean,
): GroupPanelProps['groupPanelData']['groupPanelItems'] => {
  let rows = flattenGroupPanelTreeToLeafRows(
    groupPanelData.groupTree,
    groupPanelData.baseColSpan,
  );

  if (groupByDate) {
    rows = extendGroupItemsForGroupingByDate(rows, groupPanelData.columnCountPerGroup);
  }

  return rows;
};

const renderGroupPanelContent = (
  groupPanelData: GroupPanelProps['groupPanelData'],
  resourceCellTemplate: GroupPanelProps['resourceCellTemplate'],
  isTimelineGroupTable: boolean,
  isHierarchical: boolean,
  groupByDate: boolean,
): JSX.Element | JSX.Element[] => {
  if (isTimelineGroupTable) {
    return getTimelineGroupPanelRows(groupPanelData, groupByDate)
      .map((group) => <GroupPanelVerticalRow
        key={group[group.length - 1].key}
        groupItems={group}
        cellTemplate={resourceCellTemplate}
      />);
  }

  if (isHierarchical) {
    return groupPanelData.groupTree
      .map((node, index) => <GroupPanelVerticalNode
        key={node.key}
        node={node}
        index={index}
        cellTemplate={resourceCellTemplate}
      />);
  }

  return (
    <div className="dx-scheduler-group-row">
      {
        groupPanelData.groupTree.map((node, index) => <GroupPanelVerticalCell
          key={node.key}
          text={node.text}
          id={node.id}
          data={node.data}
          index={index}
          color={node.color}
          cellTemplate={resourceCellTemplate}
        />)
      }
    </div>
  );
};

export class GroupPanelVertical extends BaseInfernoComponent<GroupPanelProps> {
  render(): JSX.Element {
    const {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate,
      height,
      styles,
      groupByDate,
    } = this.props;
    const style = normalizeStyles(renderUtils.addHeightToStyle(height, styles));
    const isTimelineGroupTable = className === TIMELINE_GROUP_TABLE_CLASS;
    const isHierarchical = !isTimelineGroupTable && groupPanelData.maxDepth > 1;
    const flexContainerClassName = isHierarchical
      ? `dx-scheduler-group-flex-container ${HIERARCHICAL_GROUP_FLEX_CONTAINER_CLASS}`
      : 'dx-scheduler-group-flex-container';
    const groupPanelContent = renderGroupPanelContent(
      groupPanelData,
      resourceCellTemplate,
      isTimelineGroupTable,
      isHierarchical,
      groupByDate,
    );

    return (
      <div
        ref={elementRef}
        className={className}
        style={style}
      >
        <div className={flexContainerClassName}>
          {groupPanelContent}
        </div>
      </div>
    );
  }
}

GroupPanelVertical.defaultProps = GroupPanelBaseDefaultProps;
