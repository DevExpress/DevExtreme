import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import type { GroupPanelCellProps } from './group_panel_props';
import { GroupPanelCellDefaultProps } from './group_panel_props';

export interface GroupPanelHorizontalCellProps extends GroupPanelCellProps {
  isFirstGroupCell: boolean;
  isLastGroupCell: boolean;
  colSpan: number;
}

export const GroupPanelHorizontalCellDefaultProps = {
  ...GroupPanelCellDefaultProps,
  isFirstGroupCell: false,
  isLastGroupCell: false,
  colSpan: 1,
};

export class GroupPanelHorizontalCell extends BaseInfernoComponent<GroupPanelHorizontalCellProps> {
  render(): JSX.Element {
    const {
      cellTemplate,
      colSpan,
      color,
      data,
      id,
      index,
      text,
      className,
      isFirstGroupCell,
      isLastGroupCell,
    } = this.props;
    const classes = combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      [className ?? '']: !!className,
    });
    const CellTemplateComponent = getTemplate(cellTemplate);

    return (
      <th
        className={classes}
        colSpan={colSpan}
      >
        <div className="dx-scheduler-group-header-content">
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
                <div>
                  {text}
                </div>
              )
          }
        </div>
      </th>
    );
  }
}

GroupPanelHorizontalCell.defaultProps = GroupPanelHorizontalCellDefaultProps;
