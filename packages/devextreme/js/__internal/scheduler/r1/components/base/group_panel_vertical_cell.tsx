import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
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
      rowSpan,
    } = this.props;

    // Apply rowSpan as flex-grow for vertical layout
    const style = rowSpan ? { 'flex-grow': rowSpan } : undefined;

    return (
      <div
        className={`dx-scheduler-group-header ${className}`}
        style={style}
      >
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
