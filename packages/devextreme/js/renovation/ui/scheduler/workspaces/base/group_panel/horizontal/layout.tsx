/* eslint-disable @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-return */
import {
  Component, ComponentBindings, ForwardRef, Fragment, JSXComponent, RefObject,
} from '@devextreme-generator/declarations';
import { Row } from './row';
import { GroupPanelLayoutProps } from '../group_panel_layout_props';
import { GroupRenderItem } from '../../../../../../../__internal/scheduler/__migration/types';

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

@ComponentBindings()
export class HorizontalGroupPanelLayoutProps extends GroupPanelLayoutProps {
  @ForwardRef() elementRef?: RefObject<HTMLDivElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class GroupPanelHorizontalLayout extends JSXComponent(HorizontalGroupPanelLayoutProps) {
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
