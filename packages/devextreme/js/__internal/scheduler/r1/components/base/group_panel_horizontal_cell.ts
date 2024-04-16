import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';
import type { VNode } from 'inferno';
import { createVNode } from 'inferno';

import { renderUtils } from '../../utils/index';
import type { GroupPanelCellProps } from './group_panel_props';
import { GroupPanelCellDefaultProps } from './group_panel_props';

export interface GroupPanelHorizontalCellProps extends GroupPanelCellProps {
  isFirstGroupCell: boolean;
  isLastGroupCell: boolean;
  colSpan: number;
}

const GroupPanelHorizontalCellDefaultProps = {
  ...GroupPanelCellDefaultProps,
  isFirstGroupCell: false,
  isLastGroupCell: false,
  colSpan: 1,
};

export class GroupPanelHorizontalCell extends BaseInfernoComponent<GroupPanelHorizontalCellProps> {
  render(): VNode {
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
    const cellTemplateComponent = getTemplate(cellTemplate);
    const classNames = renderUtils.combineClasses({
      'dx-scheduler-group-header': true,
      'dx-scheduler-first-group-cell': isFirstGroupCell,
      'dx-scheduler-last-group-cell': isLastGroupCell,
      [className]: !!className,
    });

    return createVNode(
      1,
      'th',
      classNames,
      createVNode(
        1,
        'div',
        'dx-scheduler-group-header-content',
        [!!cellTemplateComponent && cellTemplateComponent({
          data: {
            data,
            id,
            color,
            text,
          },
          index,
        }), !cellTemplateComponent && createVNode(1, 'div', null, text, 0)],
        0,
      ),
      2,
      {
        colSpan,
      },
    );
  }
}
GroupPanelHorizontalCell.defaultProps = GroupPanelHorizontalCellDefaultProps;
