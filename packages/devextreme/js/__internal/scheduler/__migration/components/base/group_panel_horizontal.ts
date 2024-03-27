import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { RefObject } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import {
  createComponentVNode,
  createFragment,
} from 'inferno';

import type { GroupRenderItem } from '../../types';
import { GroupPanelHorizontalRow } from './group_panel_horizontal_row';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';

export interface GroupPanelHorizontalProps extends GroupPanelBaseProps {
  elementRef?: RefObject<HTMLDivElement>;
}

export class GroupPanelHorizontal extends BaseInfernoComponent<GroupPanelHorizontalProps> {
  private _groupPanelItems: GroupRenderItem[][] | null = null;

  getGroupPanelItems(): GroupRenderItem[][] {
    if (this._groupPanelItems !== null) {
      return this._groupPanelItems;
    }

    const {
      groupPanelData: {
        baseColSpan,
        groupPanelItems,
      },
    } = this.props;

    const colSpans: number[] = groupPanelItems.reduceRight<number[]>((
      currentColSpans,
      groupsRow,
      idx,
    ) => {
      const nextColSpans = currentColSpans;
      const currentLevelGroupCount = groupsRow.length;
      const previousColSpan = idx === groupPanelItems.length - 1
        ? baseColSpan
        : currentColSpans[idx + 1];
      const previousLevelGroupCount = idx === groupPanelItems.length - 1
        ? currentLevelGroupCount
        : groupPanelItems[idx + 1].length;
      const groupCountDiff = previousLevelGroupCount / currentLevelGroupCount;
      nextColSpans[idx] = groupCountDiff * previousColSpan;
      return nextColSpans;
    }, [...new Array(groupPanelItems.length)]);

    this._groupPanelItems = groupPanelItems.map((groupsRenderRow, index) => {
      const colSpan = colSpans[index];
      return groupsRenderRow.map((groupItem) => ({
        ...groupItem,
        colSpan,
      }));
    });

    return this._groupPanelItems;
  }

  componentWillUpdate(nextProps: GroupPanelHorizontalProps): void {
    if (this.props.groupPanelData !== nextProps.groupPanelData) {
      this._groupPanelItems = null;
    }
  }

  render(): VNode {
    const {
      resourceCellTemplate,
    } = this.props;
    const resourceCellTemplateComponent = getTemplate(resourceCellTemplate);
    const groupPanelItems = this.getGroupPanelItems();

    return createFragment(groupPanelItems.map((
      group,
    ) => createComponentVNode(2, GroupPanelHorizontalRow, {
      groupItems: group,
      cellTemplate: resourceCellTemplateComponent,
    }, group[0].key)), 0);
  }
}

GroupPanelHorizontal.defaultProps = GroupPanelBaseDefaultProps;
