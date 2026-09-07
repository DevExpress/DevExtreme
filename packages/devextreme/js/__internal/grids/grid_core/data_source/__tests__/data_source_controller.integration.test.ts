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
import DataSourceClass from '@js/data/data_source';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import TreeList from '@js/ui/tree_list';
import errors from '@js/ui/widget/ui.errors';
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

describe('dataSource controller resolves its own component adapter provider', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('builds a DataGrid adapter in DataGrid', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const adapter = instance.getController('dataSource').getAdapter();

    expect(adapter).toBeTruthy();
    expect('forEachNode' in (adapter as object)).toBe(false);
  });

  it('builds a TreeList adapter in TreeList', () => {
    const { $container, instance } = createTreeList({ dataSource: DATA });

    try {
      const adapter = instance.getController('dataSource').getAdapter();

      expect(adapter).toBeTruthy();
      expect('forEachNode' in (adapter as object)).toBe(true);
    } finally {
      disposeTreeList($container);
    }
  });
});

describe('dataSource controller owns the dataSource option reading', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('warns W1011 in DataGrid when keyExpr is combined with a non-array dataSource', async () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});

    try {
      await createDataGrid({ dataSource: { store: { type: 'array', data: DATA } }, keyExpr: 'id' });

      expect(log).toHaveBeenCalledWith('W1011');
    } finally {
      log.mockRestore();
    }
  });

  it('does not warn W1011 in DataGrid for an array dataSource', async () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});

    try {
      await createDataGrid({ dataSource: DATA, keyExpr: 'id' });

      expect(log).not.toHaveBeenCalledWith('W1011');
    } finally {
      log.mockRestore();
    }
  });

  it('does not warn W1011 in TreeList, where the override does not apply', () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});
    const { $container } = createTreeList({
      dataSource: { store: { type: 'array', data: DATA } },
      keyExpr: 'id',
    });

    try {
      expect(log).not.toHaveBeenCalledWith('W1011');
    } finally {
      log.mockRestore();
      disposeTreeList($container);
    }
  });

  it('builds a DataSource from the array option and keys it by keyExpr', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA, keyExpr: 'id' });

    expect(instance.getController('dataSource').key()).toBe('id');
  });
});

describe('dataSource controller owns adapter disposal', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('spares a DataSource the caller still owns when the grid is disposed', async () => {
    const shared = new DataSourceClass({ store: DATA, key: 'id' });
    const dispose = jest.spyOn(shared, 'dispose');
    const { $container, instance } = await createDataGrid({ dataSource: shared });

    instance.dispose();
    // afterTest reads the component off #gridContainer, so a disposed one must not linger.
    $container.remove();

    expect(dispose).not.toHaveBeenCalled();

    dispose.mockRestore();
    shared.dispose();
  });

  it('destroys a DataSource it built itself when the grid is disposed', async () => {
    const { $container, instance } = await createDataGrid({ dataSource: DATA, keyExpr: 'id' });
    const built = instance.getController('dataSource').getDataSource();

    if (!built) {
      throw new Error('expected the controller to have built a DataSource');
    }

    const dispose = jest.spyOn(built, 'dispose');

    instance.dispose();
    $container.remove();

    expect(dispose).toHaveBeenCalledTimes(1);

    dispose.mockRestore();
  });

  it('spares a shared DataSource when the dataSource option is replaced', async () => {
    const shared = new DataSourceClass({ store: DATA, key: 'id' });
    const dispose = jest.spyOn(shared, 'dispose');
    const { instance } = await createDataGrid({ dataSource: shared });

    instance.option('dataSource', OTHER_DATA);
    await flushAsync();

    expect(dispose).not.toHaveBeenCalled();

    dispose.mockRestore();
    shared.dispose();
  });

  it('leaves DataController and the controller agreeing that the adapter is gone', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA, keyExpr: 'id' });

    instance.option('dataSource', undefined);
    await flushAsync();

    expect(instance.getController('dataSource').hasAdapter()).toBe(false);
    expect(instance.getController('dataSource').getAdapter()).toBeNull();
  });
});
