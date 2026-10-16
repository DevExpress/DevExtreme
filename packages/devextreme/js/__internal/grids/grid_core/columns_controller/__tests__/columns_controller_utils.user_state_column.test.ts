import {
  describe,
  expect,
  it,
} from '@jest/globals';

import { isUserStateColumn } from '../columns_controller_utils';

describe('isUserStateColumn', () => {
  describe('when the name and the data field are the same', () => {
    it('should match', () => {
      expect(isUserStateColumn(
        { name: 'id', dataField: 'id' },
        { name: 'id', dataField: 'id' },
      )).toBe(true);
    });
  });

  describe('when the column has no name', () => {
    it('should match the entry name with the data field', () => {
      expect(isUserStateColumn({ dataField: 'id' }, { name: 'id', dataField: 'id' })).toBe(true);
    });

    it('should not match an entry with another data field', () => {
      expect(isUserStateColumn({ dataField: 'id' }, { name: 'id', dataField: 'code' }))
        .toBe(false);
    });
  });

  describe('when the column has a name', () => {
    it('should match an entry with another data field', () => {
      expect(isUserStateColumn(
        { name: 'id', dataField: 'idA' },
        { name: 'id', dataField: 'idB' },
      )).toBe(true);
    });

    it('should not match an entry with another name', () => {
      expect(isUserStateColumn(
        { name: 'id', dataField: 'id' },
        { name: 'code', dataField: 'id' },
      )).toBe(false);
    });
  });

  describe('when neither has a name or a data field', () => {
    it('should match', () => {
      expect(isUserStateColumn({}, {})).toBe(true);
    });
  });

  describe('when the column or the entry is missing', () => {
    it('should not match', () => {
      expect(isUserStateColumn(undefined, { name: 'id' })).toBe(false);
      expect(isUserStateColumn({ name: 'id' }, undefined)).toBe(false);
    });
  });
});
