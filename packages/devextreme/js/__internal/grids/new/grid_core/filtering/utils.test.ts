import {
  describe, expect, it,
} from '@jest/globals';

import { normalizeColumn } from '../columns_controller/columns_controller.mock';
import { normalizeFilterWithSelectors } from './utils';

describe('normalizeFilterWithSelectors', () => {
  const columns = [normalizeColumn({
    dataField: 'myColumn',
  })];

  const filter = ['myColumn', '=', 2];

  describe('when remoteOperations=true', () => {
    it('should return filter as is', () => {
      const res = normalizeFilterWithSelectors(filter, columns, true);
      expect(res).toStrictEqual(filter);
    });
  });
  describe('when remoteOperations=false', () => {
    it('should return replace column dataField with selector', () => {
      const res = normalizeFilterWithSelectors(filter, columns, false);

      expect(res).toStrictEqual([
        expect.any(Function),
        '=',
        2,
      ]);

      expect(res[0]({ myColumn: 100 })).toBe(100);
    });
  });
});
