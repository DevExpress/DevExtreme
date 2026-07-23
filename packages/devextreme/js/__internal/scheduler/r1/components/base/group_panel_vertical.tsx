import { BaseInfernoComponent, normalizeStyles } from '@ts/core/r1/runtime/inferno/index';

import { renderUtils } from '../../utils/index';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVerticalCell } from './group_panel_vertical_cell';
import { GroupPanelVerticalNode } from './group_panel_vertical_node';
import { GroupPanelVerticalRow } from './group_panel_vertical_row';

const HIERARCHICAL_GROUP_FLEX_CONTAINER_CLASS = 'dx-scheduler-group-flex-container-hierarchical';

const renderGroupPanelContent = (
  groupPanelData: GroupPanelBaseProps['groupPanelData'],
  resourceCellTemplate: GroupPanelBaseProps['resourceCellTemplate'],
  isTimelineLayout: boolean,
  isHierarchical: boolean,
): JSX.Element | JSX.Element[] => {
  if (isTimelineLayout) {
    return groupPanelData.groupPanelItems
      .map((group) => <GroupPanelVerticalRow
        key={group[0].key}
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
    <div className="dx-scheduler-group-row" role="row">
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

export class GroupPanelVertical extends BaseInfernoComponent<GroupPanelBaseProps> {
  render(): JSX.Element {
    const {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate,
      height,
      styles,
      verticalLayout,
    } = this.props;
    const style = normalizeStyles(renderUtils.addHeightToStyle(height, styles));
    const isTimelineLayout = verticalLayout === 'timeline';
    const isHierarchical = !isTimelineLayout && groupPanelData.maxDepth > 1;
    const flexContainerClassName = isHierarchical
      ? `dx-scheduler-group-flex-container ${HIERARCHICAL_GROUP_FLEX_CONTAINER_CLASS}`
      : 'dx-scheduler-group-flex-container';
    const groupPanelContent = renderGroupPanelContent(
      groupPanelData,
      resourceCellTemplate,
      isTimelineLayout,
      isHierarchical,
    );

    return (
      <div
        ref={elementRef}
        className={className}
        style={style}
      >
        <div className={flexContainerClassName} role="grid">
          {groupPanelContent}
        </div>
      </div>
    );
  }
}

GroupPanelVertical.defaultProps = GroupPanelBaseDefaultProps;
