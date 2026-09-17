import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  toPlainFilter,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const DATA = [
  { id: 1, stateId: 1 },
  { id: 2, stateId: 2 },
];

const STATES = [
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Bern' },
  { id: 3, name: 'Munich' },
];

const LOOKUP_COLUMN = {
  dataField: 'stateId',
  lookup: {
    dataSource: STATES,
    valueExpr: 'id',
    displayExpr: 'name',
  },
};

const createGrid = async (options: DataGridProperties): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid({ dataSource: DATA, ...options });

  return instance;
};

const getDataFieldFilter = (
  instance: DataGridInstance,
): unknown => toPlainFilter(instance.getCombinedFilter(true));

describe('Search over a lookup column', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the text matches a single lookup item', () => {
    it('should filter by the value of that item', async () => {
      const instance = await createGrid({
        searchPanel: { text: 'Munich' },
        columns: [LOOKUP_COLUMN],
      });

      expect(getDataFieldFilter(instance)).toEqual(['stateId', '=', 3]);
    });
  });

  describe('when the text matches several lookup items', () => {
    it('should combine their values with or', async () => {
      const instance = await createGrid({
        searchPanel: { text: 'Ber' },
        columns: [LOOKUP_COLUMN],
      });

      expect(getDataFieldFilter(instance)).toEqual([
        ['stateId', '=', 1], 'or', ['stateId', '=', 2],
      ]);
    });
  });

  describe('when the text matches no lookup item', () => {
    it('should produce a match-nothing filter', async () => {
      const instance = await createGrid({
        searchPanel: { text: 'Paris' },
        columns: [LOOKUP_COLUMN],
      });

      expect(getDataFieldFilter(instance)).toEqual(['!']);
    });
  });

  describe('when a plain column is searched alongside', () => {
    it('should combine the lookup values with the plain condition', async () => {
      const instance = await createGrid({
        dataSource: [{ id: 1, stateId: 1, name: 'Bert' }],
        searchPanel: { text: 'Ber' },
        columns: [LOOKUP_COLUMN, 'name'],
      });

      expect(getDataFieldFilter(instance)).toEqual([
        ['stateId', '=', 1], 'or', ['stateId', '=', 2], 'or', ['name', 'contains', 'Ber'],
      ]);
    });
  });

  describe('when the lookup column is not searchable', () => {
    it('should produce no condition for it', async () => {
      const instance = await createGrid({
        searchPanel: { text: 'Ber' },
        columns: [{ ...LOOKUP_COLUMN, allowSearch: false }],
      });

      expect(getDataFieldFilter(instance)).toEqual(['!']);
    });
  });
});
