import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { applyColumnStateFields } from '../m_columns_controller_utils';
import type { Column, ColumnUserState } from '../types';

const dataColumn = (dataField: string, options: Partial<Column> = {}): Column => ({
  name: dataField,
  dataField,
  ...options,
});

const savedColumn = (
  dataField: string,
  options: Partial<ColumnUserState> = {},
): ColumnUserState => ({
  name: dataField,
  dataField,
  ...options,
});

describe('applyColumnStateFields', () => {
  describe('when there is no entry', () => {
    it('should leave the column as is', () => {
      const column = dataColumn('id', { width: 100 });

      applyColumnStateFields(column, undefined, []);

      expect(column).toStrictEqual(dataColumn('id', { width: 100 }));
    });
  });

  describe('when the entry has a field', () => {
    it('should take the saved value', () => {
      const column = dataColumn('id', { width: 100, visible: true });

      applyColumnStateFields(column, savedColumn('id', { width: 50, visible: false }), []);

      expect(column).toMatchObject({ width: 50, visible: false });
    });
  });

  describe('when the entry has no field', () => {
    it('should reset a regular field to undefined', () => {
      const column = dataColumn('id', { width: 100, visible: true });

      applyColumnStateFields(column, savedColumn('id'), []);

      expect(column.width).toBeUndefined();
      expect(column.visible).toBeUndefined();
    });

    it('should keep the fixing and header filter fields', () => {
      const column = dataColumn('id', {
        fixed: true, fixedPosition: 'right', filterValues: ['a'], filterType: 'exclude',
      });

      applyColumnStateFields(column, savedColumn('id'), []);

      expect(column).toMatchObject({
        fixed: true, fixedPosition: 'right', filterValues: ['a'], filterType: 'exclude',
      });
    });
  });

  describe('when the entry has a fixing field', () => {
    it('should take the saved value', () => {
      const column = dataColumn('id', { fixed: true });

      applyColumnStateFields(column, savedColumn('id', { fixed: false }), []);

      expect(column.fixed).toBe(false);
    });
  });

  describe('when both the column and the entry have a data type', () => {
    it('should keep the column data type', () => {
      const column = dataColumn('id', { dataType: 'number' });

      applyColumnStateFields(column, savedColumn('id', { dataType: 'string' }), []);

      expect(column.dataType).toBe('number');
    });
  });

  describe('when only the entry has a data type', () => {
    it('should take the saved data type', () => {
      const column = dataColumn('id');

      applyColumnStateFields(column, savedColumn('id', { dataType: 'string' }), []);

      expect(column.dataType).toBe('string');
    });
  });

  describe('when the entry has a filter operation', () => {
    it('should keep the previous operation as the default one', () => {
      const column = dataColumn('id', { selectedFilterOperation: '=' });

      applyColumnStateFields(column, savedColumn('id', { selectedFilterOperation: 'contains' }), []);

      expect(column).toMatchObject({
        selectedFilterOperation: 'contains',
        defaultSelectedFilterOperation: '=',
      });
    });

    it('should set the default operation to null when the column had none', () => {
      const column = dataColumn('id');

      applyColumnStateFields(column, savedColumn('id', { selectedFilterOperation: 'contains' }), []);

      expect(column.defaultSelectedFilterOperation).toBeNull();
    });
  });

  describe('when the entry has no filter operation', () => {
    it('should not set the default operation', () => {
      const column = dataColumn('id', { selectedFilterOperation: '=' });

      applyColumnStateFields(column, savedColumn('id'), []);

      expect(column).not.toHaveProperty('defaultSelectedFilterOperation');
    });
  });

  describe('when a field is ignored', () => {
    it('should keep the column value', () => {
      const column = dataColumn('id', { width: 100, fixed: true });

      applyColumnStateFields(column, savedColumn('id', { width: 50, fixed: false }), ['width', 'fixed']);

      expect(column).toMatchObject({ width: 100, fixed: true });
    });
  });
});
