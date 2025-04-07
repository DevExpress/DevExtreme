import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { PublicTemplate } from '@ts/scheduler/r1/components/templates/index';
import type { ResourceCellTemplateProps } from '@ts/scheduler/r1/components/types';

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
    } = this.props;

    return (
      <div className={`dx-scheduler-group-header ${className}`}>
        {
          cellTemplate
            ? <PublicTemplate
              template={cellTemplate}
              templateProps={{
                data: {
                  data,
                  id,
                  color,
                  text,
                },
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
