import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import { triggerHeadersKeyDown } from './helpers/utils';

describe('Headers keyboard navigation', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('Ctrl+Left outside a header cell moves no column', async () => {
    const { instance, $container } = await createDataGrid({
      dataSource: [{ id: 1, value: 10 }],
      keyExpr: 'id',
      columns: ['id', 'value'],
      allowColumnReordering: true,
    });
    const headersElement = $container.find('.dx-datagrid-headers').get(0) ?? null;

    triggerHeadersKeyDown(instance, 'leftArrow', headersElement, { ctrlKey: true });
    await flushAsync();

    expect(instance.getVisibleColumns().map(({ dataField }) => dataField)).toEqual(['id', 'value']);
  });
});
