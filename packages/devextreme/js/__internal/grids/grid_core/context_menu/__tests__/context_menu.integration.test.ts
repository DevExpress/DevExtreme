import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { ContextMenuPreparingEvent } from '@js/ui/data_grid';

import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';

describe('ContextMenu', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should pass the triggering event to onContextMenuPreparing', async () => {
    const onContextMenuPreparing = jest.fn<(e: ContextMenuPreparingEvent) => void>();
    const { component } = await createDataGrid({
      dataSource: [{ id: 1, name: 'Name 1' }],
      columns: ['id', 'name'],
      onContextMenuPreparing,
    });
    const cellElement = component.getDataCell(0, 1).getElement() as HTMLElement;

    cellElement.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 15,
      clientY: 25,
    }));

    const { event } = onContextMenuPreparing.mock.calls[0][0];

    expect(event).toMatchObject({ target: cellElement, pageX: 15, pageY: 25 });
  });
});
