import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { RefObject } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import { createComponentVNode } from 'inferno';

import { VERTICAL_GROUP_ORIENTATION } from '../../const';
import type { Group, GroupOrientation } from '../../types';
import { isVerticalGroupingApplied } from '../../utils/index';
import { GroupPanelHorizontal } from './group_panel_horizontal';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVertical } from './group_panel_vertical';

export interface GroupPanelProps extends GroupPanelBaseProps {
  groups: Group[];
  groupOrientation: GroupOrientation;
  elementRef?: RefObject<HTMLDivElement>;
}

export const GroupPanelDefaultProps: GroupPanelProps = {
  ...GroupPanelBaseDefaultProps,
  groups: [],
  groupOrientation: VERTICAL_GROUP_ORIENTATION,
};

export class GroupPanel extends InfernoWrapperComponent<GroupPanelProps> {
  // eslint-disable-next-line class-methods-use-this
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): VNode {
    const {
      className,
      elementRef,
      groupPanelData,
      height,
      resourceCellTemplate,
      groupOrientation,
      groups,
      styles,
    } = this.props;
    const resourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    const isVerticalLayout = isVerticalGroupingApplied(groups, groupOrientation);

    return isVerticalLayout ? createComponentVNode(2, GroupPanelVertical, {
      height,
      resourceCellTemplate: resourceCellTemplateComponent,
      className,
      groupPanelData,
      elementRef,
      styles,
    }) : createComponentVNode(2, GroupPanelHorizontal, {
      height,
      resourceCellTemplate: resourceCellTemplateComponent,
      className,
      groupPanelData,
      elementRef,
      styles,
    });
  }
}
GroupPanel.defaultProps = GroupPanelDefaultProps;
