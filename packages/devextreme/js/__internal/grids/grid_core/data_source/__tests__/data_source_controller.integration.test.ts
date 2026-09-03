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
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { Controllers, InternalGrid } from '@ts/grids/grid_core/m_types';

import { DataSourceController } from '../data_source_controller';

const TREELIST_CONTAINER_ID = 'treeListContainer';

const DATA = [
  { id: 1, parentId: 0, value: 'a' },
  { id: 2, parentId: 1, value: 'b' },
];

const OTHER_DATA = [
  { id: 3, parentId: 0, value: 'c' },
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

  it('leaves the getDataSource public method on DataController', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getDataSource()).toBe(instance.getController('data').getDataSource());
  });

  it('sits at the bottom of the controller order', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(getControllerNames(instance)[0]).toBe('dataSource');
  });
});

describe('dataSource controller holds the adapter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('holds the same adapter object as DataController', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');
    const adapter = instance.getController('data')._dataSource;

    expect(adapter).toBeTruthy();
    expect(dataSourceController.hasAdapter()).toBe(true);
    expect(dataSourceController.getAdapter()).toBe(adapter);
  });

  it('follows the rebuilt adapter when the dataSource option changes', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');
    const dataController = instance.getController('data');
    const firstAdapter = dataSourceController.getAdapter();

    instance.option('dataSource', OTHER_DATA);
    await flushAsync();

    expect(dataSourceController.getAdapter()).not.toBe(firstAdapter);
    expect(dataSourceController.getAdapter()).toBe(dataController._dataSource);
  });

  it('releases the adapter when the dataSource option is cleared', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    instance.option('dataSource', undefined);
    await flushAsync();

    expect(instance.getController('data')._dataSource).toBeNull();
    expect(dataSourceController.hasAdapter()).toBe(false);
    expect(dataSourceController.getAdapter()).toBeNull();
    expect(dataSourceController.getDataSource()).toBeNull();
    expect(dataSourceController.store()).toBeUndefined();
  });

  it('recovers after the dataSource option is set again', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    instance.option('dataSource', undefined);
    await flushAsync();
    instance.option('dataSource', OTHER_DATA);
    await flushAsync();

    expect(dataSourceController.hasAdapter()).toBe(true);
    expect(dataSourceController.getAdapter()).toBe(instance.getController('data')._dataSource);
  });

  it('still holds the same adapter after a refresh', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    const refreshed = instance.refresh();
    await flushAsync();
    await refreshed;

    expect(dataSourceController.hasAdapter()).toBe(true);
    expect(dataSourceController.getAdapter()).toBe(instance.getController('data')._dataSource);
  });

  it('releases the adapter on dispose', async () => {
    const { $container, instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');
    const dataController = instance.getController('data');

    instance.dispose();
    $container.remove();

    expect(dataController._dataSource).toBeNull();
    expect(dataSourceController.hasAdapter()).toBe(false);
  });

  it('holds the adapter in TreeList too', () => {
    const { $container, instance } = createTreeList({ dataSource: DATA });

    try {
      const dataSourceController = instance.getController('dataSource');

      expect(dataSourceController.hasAdapter()).toBe(true);
      expect(dataSourceController.getAdapter()).toBe(instance.getController('data')._dataSource);
    } finally {
      disposeTreeList($container);
    }
  });
});

describe('dataSource controller reads delegate to the adapter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('delegates store', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getController('dataSource').store())
      .toBe(instance.getController('data').store());
  });

  it('delegates key', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getController('dataSource').key()).toBe('id');
  });

  it('unwraps one hop for getDataSource', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    expect(dataSourceController.getDataSource())
      .toBe(instance.getController('data').getDataSource());
    expect(dataSourceController.getDataSource())
      .not.toBe(dataSourceController.getAdapter());
  });

  it('delegates remoteOperations instead of falling back to an empty object', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');
    const adapter = dataSourceController.getAdapter();

    expect(dataSourceController.remoteOperations()).toBe(adapter?.remoteOperations());
  });

  it('delegates getDataIndexGetter', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(typeof instance.getController('dataSource').getDataIndexGetter()).toBe('function');
  });
});
