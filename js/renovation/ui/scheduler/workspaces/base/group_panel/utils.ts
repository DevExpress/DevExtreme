import {
  GroupRenderItem,
  Group,
  GroupItem,
} from '../../types.d';

const extendGroupItemsForGroupingByDate = (
  groupRenderItems: GroupRenderItem[][],
  columnCountPerGroup: number,
): GroupRenderItem[][] => [...new Array(columnCountPerGroup)]
  .reduce((currentGroupItems, _, index) => groupRenderItems.map((groupsRow, rowIndex) => {
    const currentRow = currentGroupItems[rowIndex] || [];

    return [
      ...currentRow,
      ...groupsRow.map((item, columnIndex) => ({
        ...item,
        key: `${item.key}_group_by_date_${index}`,
        isFirstGroupCell: columnIndex === 0,
        isLastGroupCell: columnIndex === groupsRow.length - 1,
      })),
    ];
  }), []);

export const getGroupsRenderData = (
  groups: Group[],
  columnCountPerGroup: number,
  groupByDate: boolean,
): GroupRenderItem[][] => {
  let repeatCount = 1;
  let groupRenderItems = groups.map((group: Group) => {
    const result = [] as GroupRenderItem[];
    const { name: resourceName, items, data } = group;

    for (let iterator = 0; iterator < repeatCount; iterator += 1) {
      result.push(...items.map(({ id, text, color }: GroupItem, index: number) => ({
        id,
        text,
        color,
        key: `${iterator}_${resourceName}_${id}`,
        resourceName,
        data: data?.[index],
      })));
    }

    repeatCount *= items.length;
    return result;
  });

  if (groupByDate) {
    groupRenderItems = extendGroupItemsForGroupingByDate(groupRenderItems, columnCountPerGroup);
  }

  return groupRenderItems;
};
