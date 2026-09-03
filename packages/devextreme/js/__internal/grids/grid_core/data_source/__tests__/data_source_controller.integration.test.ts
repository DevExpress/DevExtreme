import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { Controllers, InternalGrid } from '@ts/grids/grid_core/m_types';

import { DataSourceController } from '../data_source_controller';

const TREELIST_CONTAINER_ID = 'treeListContainer';

const DATA = [
  { id: 1, parentId: 0, value: 'a' },
  { id: 2, parentId: 1, value: 'b' },
];

interface TreeListInstance extends TreeList {
  getController: <T extends keyof Controllers>(name: T) => Controllers[T];
}

const createTreeList = (
  options: TreeListProperties = {},
): { $container: dxElementWrapper; instance: TreeListInstance } => {
  const $container = $('<div>')
    .attr('id', TREELIST_CONTAINER_ID)
    .appendTo(document.body);

  const instance = new TreeList(
    $container.get(0) as HTMLDivElement,
    { keyExpr: 'id', parentIdExpr: 'parentId', ...options },
  ) as TreeListInstance;

  jest.runAllTimers();

  return { $container, instance };
};

const disposeTreeList = ($container: dxElementWrapper): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (($container as any).dxTreeList('instance') as TreeList | undefined)?.dispose();
  $container.remove();
};

const getControllerNames = (instance: unknown): string[] => Object
  .keys((instance as InternalGrid)._controllers);

describe('dataSource module registration', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('is reachable from DataGrid', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getController('dataSource')).toBeInstanceOf(DataSourceController);
  });

  it('is reachable from TreeList', () => {
    const { $container, instance } = createTreeList({ dataSource: DATA });

    try {
      expect(instance.getController('dataSource')).toBeInstanceOf(DataSourceController);
    } finally {
      disposeTreeList($container);
    }
  });

  it('holds no adapter yet, because DataController does not wire it', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getController('dataSource').hasAdapter()).toBe(false);
  });

  it('leaves the getDataSource public method on DataController', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getDataSource()).toBe(instance.getController('data').getDataSource());
  });

  it('sits at the bottom of the controller order', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(getControllerNames(instance)[0]).toBe('dataSource');
  });
});
