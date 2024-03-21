import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import { createComponentVNode, createVNode } from 'inferno';

import type { GroupPanelRowProps } from './group_panel_props';
import { GroupPanelRowDefaultProps } from './group_panel_props';
import { GroupPanelVerticalCell } from './group_panel_vertical_cell';

export class GroupPanelVerticalRow extends BaseInfernoComponent<GroupPanelRowProps> {
  render(): VNode {
    const {
      className,
      groupItems,
      cellTemplate,
    } = this.props;
    const cellTemplateComponent = getTemplate(cellTemplate);

    return createVNode(
      1,
      'div',
      'dx-scheduler-group-row '.concat(className),
      groupItems.map((item, index) => {
        const {
          color,
          data,
          id,
          key,
          text,
        } = item;
        return createComponentVNode(2, GroupPanelVerticalCell, {
          text,
          id,
          data,
          index,
          color,
          cellTemplate: cellTemplateComponent,
        }, key);
      }),
      0,
    );
  }
}

GroupPanelVerticalRow.defaultProps = GroupPanelRowDefaultProps;
