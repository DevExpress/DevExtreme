import { jest } from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';
import type { Controllers, Views } from '@ts/grids/grid_core/m_types';
import { TreeListModel } from '@ts/grids/tree_list/__tests__/__mock__/model/tree_list';

export interface TreeListInstance extends TreeList {
  getController: <T extends keyof Controllers>(name: T) => Controllers[T];
  getView: <T extends keyof Views>(name: T) => Views[T];
}

export const SELECTORS = {
  treeListContainer: '#treeListContainer',
};

export const TREELIST_CONTAINER_ID = 'treeListContainer';

export const createTreeList = async (
  options: TreeListProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: TreeListModel;
  instance: TreeListInstance;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', TREELIST_CONTAINER_ID)
    .appendTo(document.body);

  const treeListOptions: TreeListProperties = {
    keyExpr: 'id',
    ...options,
  };

  const instance = new TreeList(
    $container.get(0) as HTMLDivElement,
    treeListOptions,
  ) as TreeListInstance;
  const component = new TreeListModel($container.get(0) as HTMLElement);

  jest.runAllTimers();

  resolve({
    $container,
    component,
    instance,
  });
});

export const beforeTest = (): void => {
  fx.off = true;
  jest.useFakeTimers();
};

export const afterTest = (): void => {
  const $container = $(SELECTORS.treeListContainer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const treeList = ($container as any).dxTreeList('instance') as TreeList;

  treeList?.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
  fx.off = false;
};
