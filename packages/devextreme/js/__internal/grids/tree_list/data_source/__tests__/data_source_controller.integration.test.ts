import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import errors from '@js/ui/widget/ui.errors';
import { getMirroredAdapter } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from '../../__tests__/__mock__/helpers/utils';
import { TreeListDataSourceController } from '../data_source_controller';

const DATA = [
  { id: 1, parentId: 0, value: 'a' },
  { id: 2, parentId: 1, value: 'b' },
];

describe('TreeList dataSource controller', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('is the TreeList subclass', async () => {
    const { instance } = await createTreeList({ dataSource: DATA });

    expect(instance.getController('dataSource'))
      .toBeInstanceOf(TreeListDataSourceController);
  });

  it('builds a TreeList adapter', async () => {
    const { instance } = await createTreeList({ dataSource: DATA });
    const adapter = instance.getController('dataSource').getAdapter();

    expect(adapter).toBeTruthy();
    expect('forEachNode' in (adapter as object)).toBe(true);
  });

  it('holds the same adapter object as DataController', async () => {
    const { instance } = await createTreeList({ dataSource: DATA });
    const dataSourceController = instance.getController('dataSource');

    expect(dataSourceController.hasAdapter()).toBe(true);
    expect(dataSourceController.getAdapter()).toBe(getMirroredAdapter(instance));
  });

  it('does not warn W1011, because the override does not apply to TreeList', async () => {
    const log = jest.spyOn(errors, 'log').mockImplementation(() => {});

    try {
      await createTreeList({
        dataSource: { store: { type: 'array', data: DATA } },
        keyExpr: 'id',
      });

      expect(log).not.toHaveBeenCalledWith('W1011');
    } finally {
      log.mockRestore();
    }
  });
});

describe('TreeList answers key and keyOf from the key expression', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  // The base controller answers both from the store, which has no key in either case here.
  it('falls back to the default key expression when nothing declares a key', async () => {
    const { instance } = await createTreeList({ dataSource: DATA, keyExpr: undefined });
    const dataSourceController = instance.getController('dataSource');

    expect(dataSourceController.key()).toBe('id');
    expect(dataSourceController.keyOf(DATA[1])).toBe(2);
  });

  it('parts company with the store key, which is what store-based callers still read', async () => {
    const { instance } = await createTreeList({ dataSource: DATA, keyExpr: undefined });
    const dataSourceController = instance.getController('dataSource');

    expect(dataSourceController.store()?.key()).toBeUndefined();
    expect(dataSourceController.key()).toBe('id');
  });

  it('uses the declared key expression when the store has no key', async () => {
    const { instance } = await createTreeList({
      dataSource: { store: { type: 'array', data: DATA } },
      keyExpr: 'value',
    });
    const dataSourceController = instance.getController('dataSource');

    expect(dataSourceController.key()).toBe('value');
    expect(dataSourceController.keyOf(DATA[1])).toBe('b');
  });
});
