import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import { isObject } from '@js/core/utils/type';
import CustomStore from '@js/data/custom_store';
import { Deferred } from '@ts/core/utils/deferred';
import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { EditingChange, ProcessedChanges, SaveResult } from '@ts/grids/grid_core/editing/types';

interface EditingControllerInternals {
  _processChanges: (changes: EditingChange[]) => ProcessedChanges;
}

interface ActionCall {
  data?: unknown;
  oldData?: unknown;
  newData?: unknown;
  key?: unknown;
  cancel?: unknown;
}

type InsertFunction = (values: RawItemData) => PromiseLike<RawItemData>;
type UpdateFunction = (key: unknown, values: RawItemData) => PromiseLike<unknown>;
type RemoveFunction = (key: unknown) => PromiseLike<void>;

interface TestStore {
  store: CustomStore;
  insert: jest.Mock<InsertFunction>;
  update: jest.Mock<UpdateFunction>;
  remove: jest.Mock<RemoveFunction>;
}

type GridInstance = Awaited<ReturnType<typeof createDataGrid>>['instance'];

const getData = (): RawItemData[] => [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

// resolves synchronously, as CustomStore does for a function that returns a plain value
const resolved = <T>(value: T): PromiseLike<T> => Deferred<T>().resolve(value).promise();

const createStore = (functions: {
  insert?: InsertFunction;
  update?: UpdateFunction;
  remove?: RemoveFunction;
} = {}): TestStore => {
  const insert = jest.fn<InsertFunction>(
    functions.insert ?? ((values): PromiseLike<RawItemData> => resolved(values)),
  );
  const update = jest.fn<UpdateFunction>(
    functions.update ?? ((): PromiseLike<undefined> => resolved(undefined)),
  );
  const remove = jest.fn<RemoveFunction>(
    functions.remove ?? ((): PromiseLike<undefined> => resolved(undefined)),
  );
  const store = new CustomStore({
    key: 'id',
    load: (): PromiseLike<RawItemData[]> => resolved(getData()),
    insert,
    update,
    remove,
  });

  return {
    store, insert, update, remove,
  };
};

const createGrid = async (
  store: CustomStore,
  options: Parameters<typeof createDataGrid>[0] = {},
): Promise<GridInstance> => {
  const { instance } = await createDataGrid({
    keyExpr: undefined,
    dataSource: store,
    columns: ['id', 'name'],
    ...options,
    editing: {
      mode: 'batch',
      allowAdding: true,
      allowUpdating: true,
      allowDeleting: true,
      refreshMode: 'repaint',
      ...options.editing,
    },
  });
  await flushAsync();

  return instance;
};

// a copy, because saving with refreshMode 'repaint' pushes the changes into the same row objects
const snapshot = (value: unknown): unknown => (isObject(value) ? { ...value } : value);

const recordAction = (calls: ActionCall[]) => (e: ActionCall): void => {
  calls.push({
    data: snapshot(e.data),
    oldData: snapshot(e.oldData),
    newData: snapshot(e.newData),
    key: e.key,
    cancel: e.cancel,
  });
};

const recordSaved = (savedChanges: EditingChange[][]) => (
  e: { changes: EditingChange[] },
): void => {
  savedChanges.push(e.changes);
};

const recordError = (errors: unknown[]) => (e: { error?: Error }): void => {
  errors.push(e.error?.message);
};

const save = async (instance: GridInstance): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  instance.saveEditData();
  await flushAsync();
};

const getChanges = (instance: GridInstance): EditingChange[] => instance
  .option('editing.changes') as EditingChange[];

const processChanges = (instance: GridInstance, changes: EditingChange[]): ProcessedChanges => {
  const editingController = instance.getController('editing') as unknown as EditingControllerInternals;

  return editingController._processChanges(changes);
};

describe('EditingController saving', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('saveEditData', () => {
    it('should pass an update to onRowUpdating and the store, then to onSaved', async () => {
      const calls: ActionCall[] = [];
      const savedChanges: EditingChange[][] = [];
      const { store, update } = createStore();
      const instance = await createGrid(store, {
        onRowUpdating: recordAction(calls),
        onSaved: recordSaved(savedChanges),
      });

      instance.cellValue(0, 'name', 'A2');
      await save(instance);

      expect(calls).toEqual([{
        data: undefined,
        oldData: { id: 1, name: 'A' },
        newData: { name: 'A2' },
        key: 1,
        cancel: false,
      }]);
      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(1, { name: 'A2' });
      expect(savedChanges).toEqual([[{ type: 'update', key: 1, data: { name: 'A2' } }]]);
      expect(getChanges(instance)).toEqual([]);
    });

    it('should pass a removal to onRowRemoving and the store, then to onSaved', async () => {
      const calls: ActionCall[] = [];
      const savedChanges: EditingChange[][] = [];
      const { store, remove } = createStore();
      const instance = await createGrid(store, {
        onRowRemoving: recordAction(calls),
        onSaved: recordSaved(savedChanges),
      });

      instance.deleteRow(1);
      await save(instance);

      expect(calls).toEqual([{
        data: { id: 2, name: 'B' },
        oldData: undefined,
        newData: undefined,
        key: 2,
        cancel: false,
      }]);
      expect(remove).toHaveBeenCalledTimes(1);
      expect(remove).toHaveBeenCalledWith(2);
      expect(savedChanges).toEqual([[{ type: 'remove', key: 2 }]]);
      expect(getChanges(instance)).toEqual([]);
    });

    it('should pass an insert to onRowInserting and the store, and take the key and data from the server', async () => {
      const calls: ActionCall[] = [];
      const savedChanges: EditingChange[][] = [];
      const serverData = { id: 10, name: 'C (server)' };
      const { store, insert } = createStore({ insert: () => resolved(serverData) });
      const instance = await createGrid(store, {
        onRowInserting: recordAction(calls),
        onSaved: recordSaved(savedChanges),
      });

      instance.option('editing.changes', [{ type: 'insert', key: 'new', data: { name: 'C' } }]);
      await save(instance);

      expect(calls).toEqual([{
        data: { name: 'C' },
        oldData: undefined,
        newData: undefined,
        key: undefined,
        cancel: false,
      }]);
      expect(insert).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledWith({ name: 'C' });
      expect(savedChanges).toEqual([[
        expect.objectContaining({ type: 'insert', key: 10, data: serverData }),
      ]]);
      expect(getChanges(instance)).toEqual([]);
      expect(instance.getController('editing').getInternalStateSize()).toBe(0);
    });

    it('should send the data an onRow*ing handler changed to the store', async () => {
      const { store, insert, update } = createStore();
      const instance = await createGrid(store, {
        onRowInserting: (e): void => { e.data = { name: 'C (handler)' }; },
        onRowUpdating: (e): void => { e.newData = { name: 'A (handler)' }; },
      });

      instance.cellValue(0, 'name', 'A2');
      instance.option('editing.changes', [
        ...getChanges(instance),
        { type: 'insert', key: 'new', data: { name: 'C' } },
      ]);
      await save(instance);

      expect(update).toHaveBeenCalledWith(1, { name: 'A (handler)' });
      expect(insert).toHaveBeenCalledWith({ name: 'C (handler)' });
    });

    it('should keep the key and data of a change when the store returns the object it was sent', async () => {
      const savedChanges: EditingChange[][] = [];
      const { store } = createStore();
      const instance = await createGrid(store, {
        onRowInserting: (e): void => { e.data = { name: 'C (handler)' }; },
        onRowUpdating: (e): void => { e.newData = { name: 'A (handler)' }; },
        onSaved: recordSaved(savedChanges),
      });
      const push = jest.spyOn(instance.getController('dataSource'), 'push');

      instance.cellValue(0, 'name', 'A2');
      instance.option('editing.changes', [
        ...getChanges(instance),
        { type: 'insert', key: 'new', data: { name: 'C' } },
      ]);
      await save(instance);

      expect(push).toHaveBeenCalledWith([
        { type: 'update', key: 1, data: { name: 'A (handler)' } },
        { type: 'insert', data: { name: 'C (handler)' }, index: 0 },
      ]);
      expect(savedChanges).toEqual([[
        { type: 'update', key: 1, data: { name: 'A2' } },
        expect.objectContaining({ type: 'insert', key: 'new', data: { name: 'C' } }),
      ]]);
    });

    it('should save several changes in their order and push the store results to the data source', async () => {
      const savedChanges: EditingChange[][] = [];
      const { store, insert, update } = createStore({
        insert: () => resolved({ id: 10, name: 'C (server)' }),
        update: () => resolved({ id: 1, name: 'A (server)' }),
      });
      const instance = await createGrid(store, { onSaved: recordSaved(savedChanges) });
      const push = jest.spyOn(instance.getController('dataSource'), 'push');

      instance.cellValue(0, 'name', 'A2');
      instance.deleteRow(1);
      instance.option('editing.changes', [
        ...getChanges(instance),
        { type: 'insert', key: 'new', data: { name: 'C' } },
      ]);
      await save(instance);

      expect(update).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith([
        { type: 'update', key: 1, data: { id: 1, name: 'A (server)' } },
        { type: 'remove', key: 2 },
        { type: 'insert', data: { id: 10, name: 'C (server)' }, index: 0 },
      ]);
      expect(savedChanges).toEqual([[
        { type: 'update', key: 1, data: { id: 1, name: 'A (server)' } },
        { type: 'remove', key: 2 },
        expect.objectContaining({ type: 'insert', key: 10, data: { id: 10, name: 'C (server)' } }),
      ]]);
      expect(getChanges(instance)).toEqual([]);
    });

    it('should finish saving when the store resolves after saveEditData returns', async () => {
      const savedChanges: EditingChange[][] = [];
      const storeUpdate = Deferred<unknown>();
      const { store } = createStore({ update: () => storeUpdate.promise() });
      const instance = await createGrid(store, { onSaved: recordSaved(savedChanges) });
      const push = jest.spyOn(instance.getController('dataSource'), 'push');

      instance.cellValue(0, 'name', 'A2');
      await save(instance);

      expect(savedChanges).toEqual([]);

      storeUpdate.resolve({ id: 1, name: 'A (server)' });
      await flushAsync();

      expect(push).toHaveBeenCalledWith([{ type: 'update', key: 1, data: { id: 1, name: 'A (server)' } }]);
      expect(savedChanges).toEqual([[{ type: 'update', key: 1, data: { id: 1, name: 'A (server)' } }]]);
      expect(getChanges(instance)).toEqual([]);
    });

    it('should wait for every pending save before finishing', async () => {
      const savedChanges: EditingChange[][] = [];
      const storeUpdate = Deferred<unknown>();
      const storeRemove = Deferred<undefined>();
      const storeInsert = Deferred<RawItemData>();
      const { store } = createStore({
        update: () => storeUpdate.promise(),
        remove: () => storeRemove.promise(),
        insert: () => storeInsert.promise(),
      });
      const instance = await createGrid(store, { onSaved: recordSaved(savedChanges) });

      instance.cellValue(0, 'name', 'A2');
      instance.deleteRow(1);
      instance.option('editing.changes', [
        ...getChanges(instance),
        { type: 'insert', key: 'new', data: { name: 'C' } },
      ]);
      await save(instance);
      storeUpdate.resolve(undefined);
      storeInsert.resolve({ id: 10, name: 'C' });
      await flushAsync();

      expect(savedChanges).toEqual([]);

      storeRemove.resolve(undefined);
      await flushAsync();

      expect(savedChanges).toHaveLength(1);
      expect(getChanges(instance)).toEqual([]);
    });

    it('should fire onSaved with no changes when there is nothing to save', async () => {
      const savedChanges: EditingChange[][] = [];
      const { store } = createStore();
      const instance = await createGrid(store, { onSaved: recordSaved(savedChanges) });

      await save(instance);

      expect(savedChanges).toEqual([[]]);
    });

    it('should keep a change and not call the store when onRow*ing cancels it', async () => {
      const savedChanges: EditingChange[][] = [];
      const { store, update } = createStore();
      const instance = await createGrid(store, {
        onRowUpdating: (e): void => { e.cancel = true; },
        onSaved: recordSaved(savedChanges),
      });

      instance.cellValue(0, 'name', 'A2');
      await save(instance);

      expect(update).not.toHaveBeenCalled();
      expect(savedChanges).toEqual([]);
      expect(getChanges(instance)).toEqual([{ type: 'update', key: 1, data: { name: 'A2' } }]);
    });

    it('should keep a change and not call the store when onRow*ing cancels it with a promise', async () => {
      const savedChanges: EditingChange[][] = [];
      const { store, update } = createStore();
      const cancel = Deferred<boolean>();
      const instance = await createGrid(store, {
        onRowUpdating: (e): void => { e.cancel = cancel.promise(); },
        onSaved: recordSaved(savedChanges),
      });

      instance.cellValue(0, 'name', 'A2');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.saveEditData();
      cancel.resolve(true);
      await flushAsync();

      expect(update).not.toHaveBeenCalled();
      expect(savedChanges).toEqual([]);
      expect(getChanges(instance)).toEqual([{ type: 'update', key: 1, data: { name: 'A2' } }]);
    });

    it('should save a change when onRow*ing resolves its cancel promise with false', async () => {
      const { store, update } = createStore();
      const cancel = Deferred<boolean>();
      const instance = await createGrid(store, {
        onRowUpdating: (e): void => { e.cancel = cancel.promise(); },
      });

      instance.cellValue(0, 'name', 'A2');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.saveEditData();

      expect(update).not.toHaveBeenCalled();

      cancel.resolve(false);
      await flushAsync();

      expect(update).toHaveBeenCalledWith(1, { name: 'A2' });
      expect(getChanges(instance)).toEqual([]);
    });

    it('should not save anything when onSaving cancels', async () => {
      const calls: ActionCall[] = [];
      const savedChanges: EditingChange[][] = [];
      const { store, update } = createStore();
      const instance = await createGrid(store, {
        onSaving: (e): void => { e.cancel = true; },
        onRowUpdating: recordAction(calls),
        onSaved: recordSaved(savedChanges),
      });

      instance.cellValue(0, 'name', 'A2');
      await save(instance);

      expect(calls).toEqual([]);
      expect(update).not.toHaveBeenCalled();
      expect(savedChanges).toEqual([]);
      expect(getChanges(instance)).toEqual([{ type: 'update', key: 1, data: { name: 'A2' } }]);
    });

    it('should keep a failed change, report the error and save the others', async () => {
      const errors: unknown[] = [];
      const { store, remove } = createStore({
        update: () => Deferred().reject(new Error('Update failed')).promise(),
      });
      const instance = await createGrid(store, { onDataErrorOccurred: recordError(errors) });

      instance.cellValue(0, 'name', 'A2');
      instance.deleteRow(1);
      await save(instance);

      expect(remove).toHaveBeenCalledWith(2);
      expect(errors).toEqual(['Update failed']);
      expect(getChanges(instance)).toEqual([{ type: 'update', key: 1, data: { name: 'A2' } }]);
    });
  });

  describe('_processChanges', () => {
    it('should copy each processed change, start a save only for a known type, and leave a key-less insert untouched', async () => {
      const { store, insert, update } = createStore();
      const instance = await createGrid(store);
      const updateChange: EditingChange = { type: 'update', key: 1, data: { name: 'A2' } };
      const changeWithoutType = { key: 2 } as EditingChange;
      const insertWithoutKey: EditingChange = { type: 'insert', key: undefined, data: { name: 'C' } };
      const changes = [updateChange, changeWithoutType, insertWithoutKey];

      const { pendingSaves } = processChanges(instance, changes);

      expect(pendingSaves).toHaveLength(1);
      expect(update).toHaveBeenCalledTimes(1);
      expect(insert).not.toHaveBeenCalled();
      expect(changes[0]).not.toBe(updateChange);
      expect(changes[0]).toEqual(updateChange);
      expect(changes[1]).not.toBe(changeWithoutType);
      expect(changes[1]).toEqual(changeWithoutType);
      expect(changes[2]).toBe(insertWithoutKey);
    });

    it('should collect save results and data changes once the store resolves', async () => {
      const storeUpdate = Deferred<unknown>();
      const { store } = createStore({ update: () => storeUpdate.promise() });
      const instance = await createGrid(store);
      const changes: EditingChange[] = [{ type: 'update', key: 1, data: { name: 'A2' } }];

      const { pendingSaves, saveResults, dataChanges } = processChanges(instance, changes);

      expect(pendingSaves).toHaveLength(1);
      expect(pendingSaves[0].state()).toBe('pending');
      expect(saveResults).toEqual([]);
      expect(dataChanges).toEqual([]);

      const saveResultsWhenSaved: SaveResult[] = [];
      pendingSaves[0].done(() => { saveResultsWhenSaved.push(...saveResults); });
      storeUpdate.resolve({ id: 1, name: 'A (server)' });

      expect(pendingSaves[0].state()).toBe('resolved');
      expect(saveResultsWhenSaved).toEqual([{ key: 1, result: { id: 1, name: 'A (server)' } }]);
      expect(saveResults).toEqual([{ key: 1, result: { id: 1, name: 'A (server)' } }]);
      expect(dataChanges).toEqual([{ type: 'update', key: 1, data: { id: 1, name: 'A (server)' } }]);
      expect(changes[0]).toEqual({ type: 'update', key: 1, data: { id: 1, name: 'A (server)' } });
    });

    it('should give the inserted change copy the key and data from the server', async () => {
      const serverData = { id: 10, name: 'C (server)' };
      const { store } = createStore({ insert: () => resolved(serverData) });
      const instance = await createGrid(store);
      const insert: EditingChange = { type: 'insert', key: 'new', data: { name: 'C' } };
      const changes = [insert];

      const { saveResults, dataChanges } = processChanges(instance, changes);

      expect(saveResults).toEqual([{ key: 'new', result: serverData }]);
      expect(dataChanges).toEqual([{ type: 'insert', data: serverData, index: 0 }]);
      expect(changes[0]).toEqual({ type: 'insert', key: 10, data: serverData });
      expect(insert).toEqual({ type: 'insert', key: 'new', data: { name: 'C' } });
    });

    it('should collect the removed key', async () => {
      const { store } = createStore();
      const instance = await createGrid(store);
      const changes = [{ type: 'remove', key: 2 } as EditingChange];

      const { saveResults, dataChanges } = processChanges(instance, changes);

      expect(saveResults).toEqual([{ key: 2, result: 2 }]);
      expect(dataChanges).toEqual([{ type: 'remove', key: 2 }]);
    });

    it('should collect a cancel result and no data change when onRow*ing cancels', async () => {
      const { store, remove } = createStore();
      const instance = await createGrid(store, {
        onRowRemoving: (e): void => { e.cancel = true; },
      });
      const changes = [{ type: 'remove', key: 2 } as EditingChange];

      const { pendingSaves, saveResults, dataChanges } = processChanges(instance, changes);

      expect(pendingSaves).toHaveLength(1);
      expect(saveResults).toEqual([]);

      await flushAsync();

      expect(remove).not.toHaveBeenCalled();
      expect(pendingSaves[0].state()).toBe('resolved');
      expect(saveResults).toEqual([{ key: 2, result: 'cancel' }]);
      expect(dataChanges).toEqual([]);
    });

    it('should collect the error and resolve the pending save when the store fails', async () => {
      const error = new Error('Update failed');
      const { store } = createStore({ update: () => Deferred().reject(error).promise() });
      const instance = await createGrid(store);
      const changes: EditingChange[] = [{ type: 'update', key: 1, data: { name: 'A2' } }];

      const { pendingSaves, saveResults, dataChanges } = processChanges(instance, changes);

      expect(pendingSaves[0].state()).toBe('resolved');
      expect(saveResults).toEqual([{ key: 1, result: error }]);
      expect(dataChanges).toEqual([]);
    });
  });
});
