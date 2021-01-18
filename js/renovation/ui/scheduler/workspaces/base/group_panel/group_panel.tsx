import {
  Component,
  JSXComponent,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { isVerticalGroupOrientation } from '../../utils';
import { GroupPanelProps } from './group_panel_props';
import { GroupPanelVerticalLayout } from './vertical/layout';
import { GroupPanelHorizontalLayout } from './horizontal/layout';
import { GroupPanelLayoutProps } from './group_panel_layout_props';
import {
  GroupRenderItem,
  Group,
  GroupItem,
} from '../../types.d';

const getGroupsRenderData = (
  groups: Group[],
  columnCountPerGroup: number,
  groupByDate: boolean,
): GroupRenderItem[][] => {
  let repeatCount = 1;
  let groupRenderItems = groups.map((group: Group) => {
    const result = [] as GroupRenderItem[];
    const { name: resourceName, items, data } = group;

    for (let i = 0; i < repeatCount; i += 1) {
      result.push(...items.map(({ id, text, color }: GroupItem, index: number) => ({
        id,
        text,
        color,
        key: `${i}_${resourceName}_${id}`,
        resourceName,
        data: data?.[index],
      })));
    }

    repeatCount *= items.length;
    return result;
  });

  if (groupByDate) {
    groupRenderItems = [...(new Array(columnCountPerGroup))]
      .reduce((currentGroupItems, _, index) => {
        if (index === 0) {
          return currentGroupItems;
        }

        return currentGroupItems.map((groupsRow, rowIndex) => [
          ...groupsRow,
          ...groupRenderItems[rowIndex].map((item) => ({
            ...item,
            key: `${item.key}_group_by_date_${index}`,
          })),
        ]);
      }, groupRenderItems);
  }

  return groupRenderItems;
};

export const viewFunction = ({
  layout: Layout,
  groupsRenderData,
  props: {
    groups,
    groupByDate,
    height,
    baseColSpan,
    className,
    resourceCellTemplate,
  },
}: GroupPanel): JSX.Element => (
  <Layout
    groups={groups}
    height={height}
    resourceCellTemplate={resourceCellTemplate}
    groupByDate={groupByDate}
    className={className}
    groupsRenderData={groupsRenderData}
    baseColSpan={baseColSpan}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class GroupPanel extends JSXComponent(GroupPanelProps) {
  get layout(): JSXTemplate<GroupPanelLayoutProps> {
    const { groupOrientation } = this.props;

    return isVerticalGroupOrientation(groupOrientation)
      ? GroupPanelVerticalLayout
      : GroupPanelHorizontalLayout;
  }

  get groupsRenderData(): GroupRenderItem[][] {
    const { groups, columnCountPerGroup, groupByDate } = this.props;

    return getGroupsRenderData(groups, columnCountPerGroup, groupByDate);
  }
}
