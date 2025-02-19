import type { InfernoEffect } from '@devextreme/runtime/inferno';
import { createReRenderEffect, InfernoWrapperComponent } from '@devextreme/runtime/inferno';
import type { RefObject } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';

import { VERTICAL_GROUP_ORIENTATION } from '../../const';
import type { Group, GroupOrientation } from '../../types';
import { isVerticalGroupingApplied } from '../../utils/index';
import type { DefaultProps } from '../types';
import { GroupPanelHorizontal } from './group_panel_horizontal';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';
import { GroupPanelVertical } from './group_panel_vertical';

export interface GroupPanelProps extends GroupPanelBaseProps {
  groups: Group[];
  groupOrientation: GroupOrientation;
  elementRef?: RefObject<HTMLDivElement>;
}

export const GroupPanelDefaultProps: DefaultProps<GroupPanelProps> = {
  ...GroupPanelBaseDefaultProps,
  groups: [],
  groupOrientation: VERTICAL_GROUP_ORIENTATION,
};

export class GroupPanel extends InfernoWrapperComponent<GroupPanelProps> {
  // eslint-disable-next-line class-methods-use-this
  createEffects(): InfernoEffect[] {
    return [createReRenderEffect()];
  }

  render(): JSX.Element {
    const {
      className,
      viewContext,
      elementRef,
      groupPanelData,
      height,
      resourceCellTemplate,
      groupOrientation,
      groups,
      styles,
    } = this.props;
    const ResourceCellTemplateComponent = getTemplate(
      resourceCellTemplate,
    );
    const isVerticalLayout = isVerticalGroupingApplied(groups, groupOrientation);

    const Layout = isVerticalLayout ? GroupPanelVertical : GroupPanelHorizontal;

    return (
    // @ts-ignore
     <Layout
       viewContext={viewContext}
       height={height}
       resourceCellTemplate={ResourceCellTemplateComponent}
       className={className}
       groupPanelData={groupPanelData}
       elementRef={elementRef}
       styles={styles}
       groups={GroupPanelDefaultProps.groups}
       groupOrientation={GroupPanelDefaultProps.groupOrientation}
       groupByDate={GroupPanelDefaultProps.groupByDate}
     />
    );
  }
}

GroupPanel.defaultProps = GroupPanelDefaultProps;
