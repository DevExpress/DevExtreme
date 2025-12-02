import type { InfernoEffect } from '@ts/core/r1/runtime/inferno/index';
import { createReRenderEffect, InfernoWrapperComponent } from '@ts/core/r1/runtime/inferno/index';
import type { RefObject } from '@ts/core/r1/types';

import { VERTICAL_GROUP_ORIENTATION } from '../../../constants';
import type { Group, GroupOrientation } from '../../../types';
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
    const isVerticalLayout = isVerticalGroupingApplied(groups.length, groupOrientation);

    const Layout = isVerticalLayout ? GroupPanelVertical : GroupPanelHorizontal;

    return (
     <Layout
       viewContext={viewContext}
       height={height}
       resourceCellTemplate={resourceCellTemplate}
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
