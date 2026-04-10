import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

import type { GroupRenderItem } from '../../../types';
import { GroupPanelHorizontalRow } from './group_panel_horizontal_row';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';

export class GroupPanelHorizontal extends BaseInfernoComponent<GroupPanelBaseProps> {
  private groupPanelItemsCache: GroupRenderItem[][] | null = null;

  getGroupPanelItems(): GroupRenderItem[][] {
    if (this.groupPanelItemsCache !== null) {
      return this.groupPanelItemsCache;
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

    this.groupPanelItemsCache = groupPanelItems.map((groupsRenderRow, index) => {
      const colSpan = colSpans[index];
      return groupsRenderRow.map((groupItem) => ({
        ...groupItem,
        colSpan,
      }));
    });

    return this.groupPanelItemsCache;
  }

  componentWillUpdate(nextProps: GroupPanelBaseProps): void {
    if (this.props.groupPanelData !== nextProps.groupPanelData) {
      this.groupPanelItemsCache = null;
    }
  }

  render(): JSX.Element {
    const {
      resourceCellTemplate,
    } = this.props;
    const groupPanelItems = this.getGroupPanelItems();

    return (
      <>
        {
          groupPanelItems.map((group) => <GroupPanelHorizontalRow
              key={group[0].key}
              groupItems={group}
              cellTemplate={resourceCellTemplate}
            />)
        }
      </>
    );
  }
}

GroupPanelHorizontal.defaultProps = GroupPanelBaseDefaultProps;
