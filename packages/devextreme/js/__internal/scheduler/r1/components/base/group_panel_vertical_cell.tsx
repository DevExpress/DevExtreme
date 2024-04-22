import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';

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
    const CellTemplateComponent = getTemplate(cellTemplate);

    return (
      <div className={`dx-scheduler-group-header ${className}`}>
        {
          CellTemplateComponent
            ? CellTemplateComponent({
              data: {
                data,
                id,
                color,
                text,
              },
              index,
            })
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
