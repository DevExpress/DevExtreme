import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import { PublicTemplate } from '@ts/scheduler/r1/components/templates/index';
import type { ResourceCellTemplateProps } from '@ts/scheduler/r1/components/types';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import { getResourceCellTemplateData } from '../../utils/group_panel_tree';
import type { GroupPanelCellProps } from './group_panel_props';
import { GroupPanelCellDefaultProps } from './group_panel_props';

export interface GroupPanelHorizontalCellProps extends GroupPanelCellProps {
  isFirstGroupCell: boolean;
  isLastGroupCell: boolean;
  colSpan: number;
  rowSpan?: number;
  isLastColumn?: boolean;
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
      rowSpan,
      color,
      data,
      id,
      index,
      text,
      className,
      isFirstGroupCell,
      isLastGroupCell,
      isLastColumn,
      resourceIndex,
      isLeaf,
      path,
    } = this.props;
    const classes = combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      'dx-scheduler-group-header-inner-column': isLastColumn === false,
      [className ?? '']: Boolean(className),
    });

    const scope = colSpan > 1 ? 'colgroup' : 'col';

    return (
      <th
        className={classes}
        colSpan={colSpan}
        rowSpan={rowSpan && rowSpan > 1 ? rowSpan : undefined}
        title={text}
        scope={scope}
        role="columnheader"
      >
        <div className="dx-scheduler-group-header-content">
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
