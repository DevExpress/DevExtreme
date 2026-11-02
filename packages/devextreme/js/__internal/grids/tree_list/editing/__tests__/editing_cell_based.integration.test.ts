import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import eventsEngine from '@ts/events/core/events_engine';
import { flushAsync } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from '../../__tests__/__mock__/helpers/utils';

const DATA = [
  {
    id: 1, parentId: 0, name: 'Parent', note: 'A',
  },
  {
    id: 2, parentId: 1, name: 'Child', note: 'B',
  },
];

describe('TreeList cell-based editing', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should close the cell on a click on the expand icon of the edited row', async () => {
    const { $container, instance } = await createTreeList({
      dataSource: DATA,
      columns: ['name', 'note'],
      editing: {
        mode: 'cell',
        allowUpdating: true,
      },
    });
    instance.editCell(0, 'note');
    await flushAsync();
    const expandIcon = $container.find('.dx-data-row').eq(0).find('.dx-treelist-icon-container').get(0);

    eventsEngine.trigger(expandIcon, 'dxpointerdown');
    eventsEngine.trigger(expandIcon, 'dxpointerup');
    eventsEngine.trigger(expandIcon, 'dxclick');
    await flushAsync();

    expect(instance.option('editing.editColumnName')).toBeUndefined();
  });
});
