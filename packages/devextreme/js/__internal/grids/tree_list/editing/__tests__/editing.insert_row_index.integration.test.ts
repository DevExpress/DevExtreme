import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { flushAsync } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from '../../__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, parentId: 0 },
  { id: 2, parentId: 1 },
  { id: 3, parentId: 0 },
];

describe('TreeList adds a child row in form edit mode', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  // In form mode the edited row is typed 'detail', so the parent row is followed by a detail row
  // with another key.
  it('shows the new row under its parent while another child row is being edited', async () => {
    const { instance } = await createTreeList({
      dataSource: DATA,
      expandedRowKeys: [1],
      editing: { mode: 'form', allowAdding: true, allowUpdating: true },
      columns: ['id'],
    });
    await flushAsync();

    instance.editRow(instance.getRowIndexByKey(2));
    await flushAsync();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    instance.addRow(1);
    await flushAsync();

    const rows = instance.getController('data').items();

    expect(rows.map((row) => (row.isNewRow ? 'new' : row.key))).toEqual([1, 'new', 2, 3]);
    expect(rows[1].isEditing).toBe(true);
  });
});
