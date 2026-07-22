import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';
import { TreeListModel } from '@ts/grids/tree_list/__tests__/__mock__/model/tree_list';

const TREELIST_CONTAINER_ID = 'treeListContainer';

const flushAsync = async (): Promise<void> => {
  jest.runAllTimers();
  await Promise.resolve();
};

const createTreeList = (
  options: TreeListProperties = {},
): { component: TreeListModel; instance: TreeList } => {
  const $container = $('<div>')
    .attr('id', TREELIST_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new TreeList($container.get(0) as HTMLDivElement, options);
  const component = new TreeListModel($container.get(0) as HTMLElement);

  jest.runAllTimers();

  return { component, instance };
};

describe('TreeList editing parentIdExpr column', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    const $container = $(`#${TREELIST_CONTAINER_ID}`);

    (TreeList.getInstance($container.get(0) as HTMLElement) as TreeList)?.dispose();
    $container.remove();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // T1307499
  it('should keep the new row visible after editing the parentId column with setCellValue', async () => {
    const { component, instance } = createTreeList({
      dataSource: [{ id: 1, parentId: 0, text: 'item 1' }],
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      editing: {
        allowAdding: true,
      },
      columns: ['id', {
        dataField: 'parentId',
        setCellValue(newData, value): void {
          newData.parentId = value;
        },
      }, 'text'],
    });

    await instance.addRow();
    await flushAsync();

    const newRowIndex = instance.getVisibleRows().findIndex((row) => row.isNewRow);

    expect(newRowIndex).toBeGreaterThanOrEqual(0);
    expect(component.getDataRows()).toHaveLength(2);

    instance.cellValue(newRowIndex, 'parentId', 1);
    await flushAsync();

    expect(instance.getVisibleRows().some((row) => row.isNewRow)).toBe(true);
    expect(component.getDataRows()).toHaveLength(2);
  });
});
