import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  {
    id: 1, name: 'Alex', age: 15, city: 'Berlin',
  },
  {
    id: 2, name: 'Dan', age: 20, city: 'Munich',
  },
];

const FILTERED_COLUMNS: DataGridProperties['columns'] = [
  { dataField: 'name', filterValue: 'Alex' },
  'age',
];

const createGrid = async (options: DataGridProperties): Promise<{
  instance: DataGridInstance;
  reload: jest.Spied<() => unknown>;
}> => {
  const { instance } = await createDataGrid({ dataSource: DATA, ...options });
  const reload = jest.spyOn(instance.getController('data'), 'reload');

  return { instance, reload };
};

describe('DataController reload on an outdated filter', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should reload when a filtered column is deleted', async () => {
    const { instance, reload } = await createGrid({ columns: FILTERED_COLUMNS });

    instance.deleteColumn('name');
    await flushAsync();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('should not reload when a column without a filter is deleted', async () => {
    const { instance, reload } = await createGrid({ columns: FILTERED_COLUMNS });

    instance.deleteColumn('age');
    await flushAsync();

    expect(reload).not.toHaveBeenCalled();
  });

  it('should reload when a filtered column is added', async () => {
    const { instance, reload } = await createGrid({ columns: ['name', 'age'] });

    instance.addColumn({ dataField: 'city', filterValue: 'Berlin' });
    await flushAsync();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('should not reload when a column without a filter is added', async () => {
    const { instance, reload } = await createGrid({ columns: ['name', 'age'] });

    instance.addColumn({ dataField: 'city' });
    await flushAsync();

    expect(reload).not.toHaveBeenCalled();
  });

  it('should not reload when the columns are updated without a filter change', async () => {
    const { instance, reload } = await createGrid({ columns: FILTERED_COLUMNS });

    instance.columnOption('age', 'width', 100);
    await flushAsync();

    expect(reload).not.toHaveBeenCalled();
  });
});
