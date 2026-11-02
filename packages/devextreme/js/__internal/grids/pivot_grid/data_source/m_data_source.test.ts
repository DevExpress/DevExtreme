import { describe, expect, it } from '@jest/globals';
import CustomStore from '@js/data/custom_store';

import { PivotGridDataSource } from './m_data_source';

describe('PivotGridDataSource', () => {
  describe('getFieldValues', () => {
    it('should reject when the store fails to load field values (T1337212)', async () => {
      const loadError = new Error('Load failed');
      let shouldFail = false;
      const dataSource = new PivotGridDataSource({
        remoteOperations: true,
        store: new CustomStore({
          load: (): Promise<unknown> => (shouldFail
            ? Promise.reject(loadError)
            : Promise.resolve({ data: [] })),
        }),
        fields: [{ dataField: 'region', area: 'row' }],
      });
      await dataSource.load();
      shouldFail = true;

      const result = await new Promise((resolve) => {
        dataSource.getFieldValues(0, false, undefined)
          .done(() => resolve('resolved'))
          .fail((error) => resolve(error));
      });

      expect(result).toBe(loadError);
    });
  });
});
