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
  groupsRenderData,
}: GroupPanelHorizontalLayout): JSX.Element => (
  <Fragment>
    {groupsRenderData.map((group: GroupRenderItem[]) => (
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
  get groupsRenderData(): GroupRenderItem[][] {
    const { groupsRenderData, baseColSpan } = this.props;

    const colSpans = groupsRenderData.reduceRight((currentColSpans, groupsRow, index) => {
      const nextColSpans = currentColSpans;
      const currentLevelGroupCount = groupsRow.length;

      const previousColSpan = index === groupsRenderData.length - 1
        ? baseColSpan
        : currentColSpans[index + 1];
      const previousLevelGroupCount = index === groupsRenderData.length - 1
        ? currentLevelGroupCount
        : groupsRenderData[index + 1].length;
      const groupCountDiff = previousLevelGroupCount / currentLevelGroupCount;

      nextColSpans[index] = groupCountDiff * previousColSpan;

      return nextColSpans;
    }, [...new Array(groupsRenderData.length)]);

    return groupsRenderData.map((groupsRenderRow, index) => {
      const colSpan = colSpans[index];

      return groupsRenderRow.map((groupItem) => ({
        ...groupItem,
        colSpan,
      }));
    });
  }
}
