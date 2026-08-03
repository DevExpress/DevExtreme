import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import { PublicTemplate } from '@ts/scheduler/r1/components/templates/index';
import type { ResourceCellTemplateProps } from '@ts/scheduler/r1/components/types';

import { getResourceCellTemplateData } from '../../utils/group_panel_tree';
import type { GroupPanelCellProps } from './group_panel_props';
import { GroupPanelCellDefaultProps } from './group_panel_props';

export class GroupPanelVerticalCell extends BaseInfernoComponent<GroupPanelCellProps> {
  render(): JSX.Element {
    const {
      className,
      data,
      id,
      color,
      text,
      index,
      cellTemplate,
      resourceIndex,
      isLeaf,
      path,
    } = this.props;

    return (
      <div className={`dx-scheduler-group-header ${className ?? ''}`}>
        {
          cellTemplate
            ? <PublicTemplate
              template={cellTemplate}
              templateProps={{
                data: getResourceCellTemplateData({
                  id, text, color, data, resourceIndex, isLeaf, path,
                }),
                index,
              } as ResourceCellTemplateProps}
            />
            : (
              <div className="dx-scheduler-group-header-content">
                {text}
              </div>
            )
        }
      </div>
    );
  }
}

GroupPanelVerticalCell.defaultProps = GroupPanelCellDefaultProps;
