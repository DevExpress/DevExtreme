import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import eventsEngine from '@ts/events/core/events_engine';

import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '../../__tests__/__mock__/helpers/utils';

const createGrid = (
  options: DataGridProperties,
): ReturnType<typeof createDataGrid> => createDataGrid({
  dataSource: [
    { id: 1, name: 'Anna' },
    { id: 2, name: 'Berta' },
  ],
  columns: ['name'],
  ...options,
});

const click = (element: Element): void => {
  eventsEngine.trigger(element, 'dxpointerdown');
  eventsEngine.trigger(element, 'dxpointerup');
  eventsEngine.trigger(element, 'dxclick');
};

const isRowClickHandled = (onRowClick: jest.Mock): boolean | undefined => {
  const [{ handled }] = onRowClick.mock.calls[0] as [{ handled?: boolean }];

  return handled;
};

describe('DataGrid selection: row clicks', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should select the row on a click on a data cell', async () => {
    const onRowClick = jest.fn();
    const { component, instance } = await createGrid({
      selection: { mode: 'single' },
      onRowClick,
    });

    click(component.getDataCell(0, 0).getElement() as Element);
    await flushAsync();

    expect(instance.getSelectedRowKeys()).toEqual([1]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(isRowClickHandled(onRowClick)).toBe(true);
  });

  it('should run the row click without selecting the row when checkboxes are always shown', async () => {
    const onRowClick = jest.fn();
    const { component, instance } = await createGrid({
      selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
      onRowClick,
    });

    click(component.getDataCell(0, 1).getElement() as Element);
    await flushAsync();

    expect(instance.getSelectedRowKeys()).toEqual([]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(isRowClickHandled(onRowClick)).toBeUndefined();
  });

  it('should select the row without running the row click on a click on the select cell', async () => {
    const onRowClick = jest.fn();
    const { component, instance } = await createGrid({
      selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
      onRowClick,
    });

    click(component.getDataCell(0, 0).getElement() as Element);
    await flushAsync();

    expect(instance.getSelectedRowKeys()).toEqual([1]);
    expect(onRowClick).toHaveBeenCalledTimes(0);
  });
});
