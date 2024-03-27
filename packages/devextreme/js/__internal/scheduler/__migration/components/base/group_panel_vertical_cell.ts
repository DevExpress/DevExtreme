import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import { createVNode } from 'inferno';

import type { GroupPanelCellProps } from './group_panel_props';
import { GroupPanelCellDefaultProps } from './group_panel_props';

export class GroupPanelVerticalCell extends BaseInfernoComponent<GroupPanelCellProps> {
  render(): VNode {
    const {
      className,
      data,
      id,
      color,
      text,
      index,
      cellTemplate,
    } = this.props;
    const cellTemplateComponent = getTemplate(cellTemplate);

    return createVNode(
      1,
      'div',
      'dx-scheduler-group-header '.concat(className),
      [!!cellTemplateComponent && cellTemplateComponent({
        data: {
          data,
          id,
          color,
          text,
        },
        index,
      }), !cellTemplateComponent && createVNode(
        1,
        'div',
        'dx-scheduler-group-header-content',
        text,
        0,
      )],
      0,
    );
  }
}

GroupPanelVerticalCell.defaultProps = GroupPanelCellDefaultProps;
