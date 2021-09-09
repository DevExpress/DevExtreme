import {
  Component, Fragment, JSXComponent,
} from '@devextreme-generator/declarations';
import { GroupRenderItem } from '../../../types.d';
import { Row } from './row';
import { GroupPanelLayoutProps } from '../group_panel_layout_props';

export const viewFunction = ({
  props: {
    resourceCellTemplate,
  },
  groupPanelItems,
}: GroupPanelHorizontalLayout): JSX.Element => (
  <Fragment>
    {groupPanelItems.map((group: GroupRenderItem[]) => (
      <Row
        groupItems={group}
        cellTemplate={resourceCellTemplate}
        key={group[0].key}
      />
    ))}
  </Fragment>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelHorizontalLayout extends JSXComponent(GroupPanelLayoutProps) {
  get groupPanelItems(): GroupRenderItem[][] {
    const { groupPanelData } = this.props;
    const { baseColSpan, groupPanelItems } = groupPanelData;

    const colSpans = groupPanelItems.reduceRight((currentColSpans, groupsRow, index): number[] => {
      const nextColSpans = currentColSpans;
      const currentLevelGroupCount = groupsRow.length;

      const previousColSpan = index === groupPanelItems.length - 1
        ? baseColSpan
        : currentColSpans[index + 1];
      const previousLevelGroupCount = index === groupPanelItems.length - 1
        ? currentLevelGroupCount
        : groupPanelItems[index + 1].length;
      const groupCountDiff = previousLevelGroupCount / currentLevelGroupCount;

      nextColSpans[index] = groupCountDiff * previousColSpan;

      return nextColSpans;
    }, [...new Array(groupPanelItems.length)]);

    return groupPanelItems.map((groupsRenderRow, index) => {
      const colSpan = colSpans[index];

      return groupsRenderRow.map((groupItem) => ({
        ...groupItem,
        colSpan,
      }));
    });
  }
}
