import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import { getTemplate } from '@ts/core/r1/utils/index';

import type { GroupRenderItem } from '../../types';
import { GroupPanelHorizontalRow } from './group_panel_horizontal_row';
import type { GroupPanelBaseProps } from './group_panel_props';
import { GroupPanelBaseDefaultProps } from './group_panel_props';

export class GroupPanelHorizontal extends BaseInfernoComponent<GroupPanelBaseProps> {
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

  componentWillUpdate(nextProps: GroupPanelBaseProps): void {
    if (this.props.groupPanelData !== nextProps.groupPanelData) {
      this._groupPanelItems = null;
    }
  }

  render(): JSX.Element {
    const {
      resourceCellTemplate,
    } = this.props;
    const groupPanelItems = this.getGroupPanelItems();
    const ResourceCellTemplateComponent = getTemplate(resourceCellTemplate);

    return (
      <>
        {
          // @ts-ignore
          groupPanelItems.map((group) => <GroupPanelHorizontalRow
              key={group[0].key}
              groupItems={group}
              cellTemplate={ResourceCellTemplateComponent}
            />)
        }
      </>
    );
  }
}

GroupPanelHorizontal.defaultProps = GroupPanelBaseDefaultProps;
