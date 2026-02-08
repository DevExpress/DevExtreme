import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../__tests__/__mock__/helpers/utils';

const SELECTORS = {
  detailCell: 'dx-master-detail-cell',
  detailContainer: 'dx-datagrid-master-detail-container',
};

describe('GridCore master_detail', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('master detail container', () => {
    it('container is td element', async () => {
      let containerElement: HTMLElement | undefined;

      await createDataGrid({
        columns: ['field1', 'field2'],
        dataSource: [{ field1: 'value1', field2: 'value2' }],
        masterDetail: {
          enabled: true,
          autoExpandAll: true,
          template: (container) => {
            containerElement = container;
          },
        },
      });

      expect(containerElement?.tagName).toBe('TD');
      expect(containerElement?.classList).toContain(SELECTORS.detailCell);
    });

    it('container is div element when sticky columns enabled', async () => {
      let containerElement: HTMLElement | undefined;

      await createDataGrid({
        columns: [{ dataField: 'field1', fixed: true }, 'field2'],
        dataSource: [{ field1: 'value1', field2: 'value2' }],
        masterDetail: {
          enabled: true,
          autoExpandAll: true,
          template: (container) => {
            containerElement = container;
          },
        },
      });

      expect(containerElement?.parentElement?.tagName).toBe('TD');
      expect(containerElement?.parentElement?.classList).toContain(SELECTORS.detailCell);
      expect(containerElement?.tagName).toBe('DIV');
      expect(containerElement?.classList).toContain(SELECTORS.detailContainer);
    });
  });
});
