import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';

import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '../../__tests__/__mock__/helpers/utils';
import { CHECKBOXES_HIDDEN_CLASS } from '../const';

describe('showCheckBoxesMode: onClick while new rows wait for async templates', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should hide the row checkboxes once the rows are rendered', async () => {
    const { instance } = await createDataGrid({
      dataSource: [{ id: 1 }, { id: 2 }],
      columns: [{ dataField: 'id', renderAsync: true }],
      templatesRenderAsynchronously: true,
      selection: { mode: 'multiple', showCheckBoxesMode: 'onClick' },
    } as DataGridProperties);

    await flushAsync();

    const table = instance.getView('rowsView').getTableElement()?.get(0);

    expect(table?.classList).toContain(CHECKBOXES_HIDDEN_CLASS);
  });
});
