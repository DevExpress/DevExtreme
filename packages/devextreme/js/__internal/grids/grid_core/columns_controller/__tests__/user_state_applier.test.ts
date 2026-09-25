import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import type {
  AddedColumn,
  Column,
  SavedColumnState,
  UserStateApplierOptions,
  UserStateApplyResult,
} from '../types';
import { UserStateApplier } from '../user_state_applier';

const createPlainColumn = (options: AddedColumn): Column => (
  typeof options === 'string' ? { dataField: options } : { ...options }
);

const dataColumn = (dataField: string, options: Partial<Column> = {}): Column => ({
  name: dataField,
  dataField,
  ...options,
});

const savedColumn = (
  dataField: string,
  options: Partial<SavedColumnState> = {},
): SavedColumnState => ({
  name: dataField,
  dataField,
  ...options,
});

const applyState = (options: Partial<UserStateApplierOptions>): UserStateApplyResult => (
  new UserStateApplier({
    columns: [],
    columnsUserState: [],
    ignoreColumnOptionNames: [],
    hasUserState: true,
    createColumn: createPlainColumn,
    ...options,
  }).apply()
);

describe('UserStateApplier', () => {
  describe('when every column has an entry', () => {
    it('should apply the entries found by name', () => {
      const { columns } = applyState({
        hasUserState: false,
        columns: [dataColumn('id', { width: 100 }), dataColumn('name', { width: 100 })],
        columnsUserState: [savedColumn('name', { width: 20 }), savedColumn('id', { width: 10 })],
      });

      expect(columns.map(({ width }) => width)).toEqual([10, 20]);
    });

    it('should keep the column objects in their order', () => {
      const idColumn = dataColumn('id');
      const nameColumn = dataColumn('name');

      const { columns } = applyState({
        columns: [idColumn, nameColumn],
        columnsUserState: [savedColumn('name'), savedColumn('id')],
      });

      expect(columns).toHaveLength(2);
      expect(columns[0]).toBe(idColumn);
      expect(columns[1]).toBe(nameColumn);
    });
  });

  describe('when a column has no entry and the state is not set explicitly', () => {
    it('should apply no entries', () => {
      const { columns } = applyState({
        hasUserState: false,
        columns: [dataColumn('id', { width: 100 }), dataColumn('name', { width: 100 })],
        columnsUserState: [savedColumn('id', { width: 10 })],
      });

      expect(columns.map(({ width }) => width)).toEqual([100, 100]);
    });
  });

  describe('when a column has no entry and the state is set explicitly', () => {
    it('should apply the found entries', () => {
      const { columns } = applyState({
        hasUserState: true,
        columns: [dataColumn('id', { width: 100 }), dataColumn('name', { width: 100 })],
        columnsUserState: [savedColumn('id', { width: 10 })],
      });

      expect(columns.map(({ width }) => width)).toEqual([10, 100]);
    });
  });

  describe('when a field is ignored', () => {
    it('should keep the column value', () => {
      const { columns } = applyState({
        ignoreColumnOptionNames: ['width'],
        columns: [dataColumn('id', { width: 100, visible: true })],
        columnsUserState: [savedColumn('id', { width: 10, visible: false })],
      });

      expect(columns[0]).toMatchObject({ width: 100, visible: false });
    });
  });

  describe('when the entries have initialIndex', () => {
    it('should put the columns in the order of the entries', () => {
      const { columns } = applyState({
        columns: [dataColumn('id'), dataColumn('name')],
        columnsUserState: [
          savedColumn('name', { initialIndex: 1 }),
          savedColumn('id', { initialIndex: 0 }),
        ],
      });

      expect(columns.map(({ dataField }) => dataField)).toEqual(['name', 'id']);
    });
  });

  describe('when columns share a name', () => {
    it('should match them with the entries in order', () => {
      const { columns } = applyState({
        columns: [dataColumn('id'), dataColumn('id')],
        columnsUserState: [savedColumn('id', { width: 10 }), savedColumn('id', { width: 20 })],
      });

      expect(columns.map(({ width }) => width)).toEqual([10, 20]);
    });
  });

  describe('when an entry has an added column', () => {
    it('should create the column and apply the entry to it', () => {
      const createColumn = jest.fn(createPlainColumn);
      const added = { dataField: 'name', caption: 'Name' };

      const { columns } = applyState({
        createColumn,
        columns: [dataColumn('id')],
        columnsUserState: [savedColumn('id'), savedColumn('name', { width: 20, added })],
      });

      expect(createColumn).toHaveBeenCalledWith(added);
      expect(columns).toHaveLength(2);
      expect(columns[1]).toMatchObject({ caption: 'Name', width: 20 });
    });

    it('should create the columns in the order of the entries', () => {
      const createColumn = jest.fn(createPlainColumn);

      applyState({
        createColumn,
        columnsUserState: [savedColumn('b', { added: 'b' }), savedColumn('a', { added: 'a' })],
      });

      expect(createColumn.mock.calls).toEqual([['b'], ['a']]);
    });

    it('should apply the entry even when the other entries are not applied', () => {
      const { columns } = applyState({
        hasUserState: false,
        columns: [dataColumn('id', { width: 100 })],
        columnsUserState: [savedColumn('name', { width: 20, added: 'name' })],
      });

      expect(columns.map(({ width }) => width)).toEqual([100, 20]);
    });
  });

  describe('when an added column has the name of another column', () => {
    it('should create it when the other column took the first entry', () => {
      const createColumn = jest.fn(createPlainColumn);

      const { columns } = applyState({
        createColumn,
        columns: [dataColumn('id')],
        columnsUserState: [savedColumn('id'), savedColumn('id', { added: 'id' })],
      });

      expect(createColumn).toHaveBeenCalledTimes(1);
      expect(columns).toHaveLength(2);
    });

    it('should not create it when a column with this name is left without an entry', () => {
      const createColumn = jest.fn(createPlainColumn);

      const { columns } = applyState({
        createColumn,
        columns: [dataColumn('id'), dataColumn('id')],
        columnsUserState: [savedColumn('id', { added: 'id' })],
      });

      expect(createColumn).not.toHaveBeenCalled();
      expect(columns).toHaveLength(2);
    });

    it('should duplicate a column that was added at runtime and then declared', () => {
      const { columns } = applyState({
        columns: [dataColumn('id')],
        columnsUserState: [savedColumn('id', { added: 'id' })],
      });

      expect(columns).toHaveLength(2);
    });
  });

  describe('when an added column is a band column', () => {
    it('should report the added bands', () => {
      const { hasAddedBands } = applyState({
        columnsUserState: [
          savedColumn('band', { added: { caption: 'Band', columns: ['id', 'name'] } }),
        ],
      });

      expect(hasAddedBands).toBe(true);
    });
  });

  describe('when no added column is a band column', () => {
    it('should report no added bands', () => {
      const { hasAddedBands } = applyState({
        columnsUserState: [savedColumn('name', { added: 'name' })],
      });

      expect(hasAddedBands).toBe(false);
    });
  });
});
