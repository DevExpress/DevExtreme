import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import DataSourceClass from '@js/data/data_source';
import errors from '@js/ui/widget/ui.errors';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
  getMirroredAdapter,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { InternalGrid } from '@ts/grids/grid_core/m_types';

import { DataSourceController } from '../data_source_controller';

const DATA = [
  { id: 1, parentId: 0, value: 'a' },
  { id: 2, parentId: 1, value: 'b' },
];

const OTHER_DATA = [
  { id: 3, parentId: 0, value: 'c' },
];

const getControllerNames = (instance: unknown): string[] => Object
  .keys((instance as InternalGrid)._controllers);

describe('dataSource module registration', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('is reachable from DataGrid', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getController('dataSource')).toBeInstanceOf(DataSourceController);
  });

  it('owns the getDataSource widget method', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getDataSource()).toBeInstanceOf(DataSourceClass);
    expect(instance.getDataSource())
      .toBe(instance.getController('dataSource').getDataSource());
  });

  it('owns the keyOf widget method', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA, keyExpr: 'id' });

    expect(instance.keyOf(DATA[1])).toBe(2);
    expect(instance.keyOf(DATA[1]))
      .toBe(instance.getController('dataSource').keyOf(DATA[1]));
  });

  it('owns the totalCount widget method', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.totalCount()).toBe(DATA.length);
    expect(instance.totalCount())
      .toBe(instance.getController('dataSource').totalCount());
  });

  it('owns the pageCount widget method', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA, paging: { pageSize: 1 } });

    expect(instance.pageCount()).toBe(DATA.length);
    expect(instance.pageCount())
      .toBe(instance.getController('dataSource').pageCount());
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
    const adapter = getMirroredAdapter(instance);

    expect(adapter).toBeTruthy();
    expect(dataSourceController.hasAdapter()).toBe(true);
    expect(dataSourceController.getAdapter()).toBe(adapter);
  });

  it('follows the rebuilt adapter when the dataSource option changes', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');
    const firstAdapter = dataSourceController.getAdapter();

    instance.option('dataSource', OTHER_DATA);
    await flushAsync();

    expect(dataSourceController.getAdapter()).not.toBe(firstAdapter);
    expect(dataSourceController.getAdapter()).toBe(getMirroredAdapter(instance));
  });

  it('releases the adapter when the dataSource option is cleared', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    instance.option('dataSource', undefined);
    await flushAsync();

    expect(dataSourceController.hasAdapter()).toBe(false);
    expect(dataSourceController.getAdapter()).toBeNull();
    expect(getMirroredAdapter(instance)).toBeNull();
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
    expect(dataSourceController.getAdapter()).toBe(getMirroredAdapter(instance));
  });

  it('still holds the same adapter after a refresh', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    const refreshed = instance.refresh();
    await flushAsync();
    await refreshed;

    expect(dataSourceController.hasAdapter()).toBe(true);
    expect(dataSourceController.getAdapter()).toBe(getMirroredAdapter(instance));
  });

  it('releases the adapter on dispose', async () => {
    const { $container, instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    instance.dispose();
    $container.remove();

    expect(getMirroredAdapter(instance)).toBeNull();
    expect(dataSourceController.hasAdapter()).toBe(false);
  });
});

describe('dataSource controller reads delegate to the adapter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('delegates key', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });

    expect(instance.getController('dataSource').key()).toBe('id');
  });

  it('unwraps one hop for getDataSource', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    expect(dataSourceController.getDataSource()).toBeInstanceOf(DataSourceClass);
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

  it('answers key and keyOf from the store when the store is keyed', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA, keyExpr: 'id' });
    const dataSourceController = instance.getController('dataSource');

    expect(dataSourceController.key()).toBe('id');
    expect(dataSourceController.keyOf(DATA[1])).toBe(2);
  });

  it('answers key and keyOf from the store when the store has no key', async () => {
    const { instance } = await createDataGrid({ dataSource: DATA, keyExpr: undefined });
    const dataSourceController = instance.getController('dataSource');

    expect(dataSourceController.key()).toBeUndefined();
    // A keyless ArrayStore identifies a row by the object itself.
    expect(dataSourceController.keyOf(DATA[1])).toBe(DATA[1]);
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
