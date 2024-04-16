import { BaseInfernoComponent, normalizeStyles } from '@devextreme/runtime/inferno';
import type { RefObject } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/r1/utils/index';
import type { VNode } from 'inferno';
import { createComponentVNode, createVNode } from 'inferno';

import { renderUtils } from '../../utils/index';
import type { GroupPanelProps } from './group_panel';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVerticalRow } from './group_panel_vertical_row';

export interface VerticalGroupPanelDefaultProps extends GroupPanelProps {
  elementRef?: RefObject<HTMLDivElement>;
}

export class GroupPanelVertical extends BaseInfernoComponent<VerticalGroupPanelDefaultProps> {
  render(): VNode {
    const {
      className,
      elementRef,
      groupPanelData,
      resourceCellTemplate,
      height,
      styles,
    } = this.props;
    const resourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    const style = normalizeStyles(renderUtils.addHeightToStyle(height, styles));

    return createVNode(
      1,
      'div',
      className,
      createVNode(
        1,
        'div',
        'dx-scheduler-group-flex-container',
        groupPanelData.groupPanelItems
          .map((group) => createComponentVNode(2, GroupPanelVerticalRow, {
            groupItems: group,
            cellTemplate: resourceCellTemplateComponent,
          }, group[0].key)),
        0,
      ),
      2,
      {
        style,
      },
      null,
      elementRef,
    );
  }
}

GroupPanelVertical.defaultProps = GroupPanelBaseDefaultProps;
