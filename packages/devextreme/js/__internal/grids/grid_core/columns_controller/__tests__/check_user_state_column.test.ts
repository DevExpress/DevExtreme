import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { checkUserStateColumn } from '../m_columns_controller_utils';

describe('checkUserStateColumn', () => {
  describe('when the name and the data field are the same', () => {
    it('should match', () => {
      expect(checkUserStateColumn(
        { name: 'id', dataField: 'id' },
        { name: 'id', dataField: 'id' },
      )).toBe(true);
    });
  });

  describe('when the column has no name', () => {
    it('should match the entry name with the data field', () => {
      expect(checkUserStateColumn({ dataField: 'id' }, { name: 'id', dataField: 'id' })).toBe(true);
    });

    it('should not match an entry with another data field', () => {
      expect(checkUserStateColumn({ dataField: 'id' }, { name: 'id', dataField: 'code' }))
        .toBe(false);
    });
  });

  describe('when the column has a name', () => {
    it('should match an entry with another data field', () => {
      expect(checkUserStateColumn(
        { name: 'id', dataField: 'idA' },
        { name: 'id', dataField: 'idB' },
      )).toBe(true);
    });

    it('should not match an entry with another name', () => {
      expect(checkUserStateColumn(
        { name: 'id', dataField: 'id' },
        { name: 'code', dataField: 'id' },
      )).toBe(false);
    });
  });

  describe('when neither has a name or a data field', () => {
    it('should match', () => {
      expect(checkUserStateColumn({}, {})).toBe(true);
    });
  });

  describe('when the column or the entry is missing', () => {
    it('should not match', () => {
      expect(checkUserStateColumn(undefined, { name: 'id' })).toBe(false);
      expect(checkUserStateColumn({ name: 'id' }, undefined)).toBe(false);
    });
  });
});
