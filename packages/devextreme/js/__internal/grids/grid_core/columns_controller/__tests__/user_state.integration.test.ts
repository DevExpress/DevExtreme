import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import errors from '@js/ui/widget/ui.errors';
import {
  afterTest as afterTreeListTest,
  beforeTest as beforeTreeListTest,
  createTreeList,
} from '@ts/grids/tree_list/__tests__/__mock__/helpers/utils';

import type { DataGridInstance } from '../../__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '../../__tests__/__mock__/helpers/utils';
import type { Column, ColumnUserState } from '../types';

type StateField = keyof ColumnUserState;

const SAVED_ENTRY: ColumnUserState = {
  dataField: 'b',
  name: 'b',
  visibleIndex: 0,
  visible: false,
  width: 123,
  sortOrder: 'desc',
  sortIndex: 0,
  groupIndex: 0,
  fixed: true,
  fixedPosition: 'right',
  filterValue: 5,
  selectedFilterOperation: '>',
  filterValues: [5],
  filterType: 'exclude',
};

const SAVED_ENTRY_A: ColumnUserState = { dataField: 'a', name: 'a', visibleIndex: 1 };

const FIELD_GROUPS = {
  sorting: ['sortOrder', 'sortIndex'],
  visible: ['visible'],
  width: ['width'],
  grouping: ['groupIndex'],
  fixing: ['fixed', 'fixedPosition'],
  filterRow: ['filterValue', 'selectedFilterOperation'],
  headerFilter: ['filterValues', 'filterType'],
} as Record<string, readonly StateField[]>;

type FieldGroup = keyof typeof FIELD_GROUPS;

const ALL_GROUPS = Object.keys(FIELD_GROUPS);

const DATA = [{ id: 1, a: 1, b: 2 }];

const getColumns = (instance: DataGridInstance): Column[] => instance
  .getController('columns')
  .getColumns() as Column[];

const getColumn = (
  instance: DataGridInstance,
  dataField: string,
): Column => getColumns(instance)
  .find((column) => column.dataField === dataField) as Column;

const pickGroupFields = (column: ColumnUserState): Partial<ColumnUserState> => {
  const result: Partial<ColumnUserState> = {};

  ALL_GROUPS.forEach((group) => {
    FIELD_GROUPS[group].forEach((field) => {
      result[field] = column[field];
    });
  });

  return result;
};

const expectedGroupFields = (
  before: ColumnUserState,
  restoredGroups: FieldGroup[],
): Partial<ColumnUserState> => {
  const result: Partial<ColumnUserState> = {};

  ALL_GROUPS.forEach((group) => {
    FIELD_GROUPS[group].forEach((field) => {
      result[field] = restoredGroups.includes(group) ? SAVED_ENTRY[field] : before[field];
    });
  });

  return result;
};

const entryWithout = (...fields: StateField[]): ColumnUserState => Object.fromEntries(
  Object.entries(SAVED_ENTRY).filter(([field]) => !fields.some((omitted) => omitted === field)),
) as ColumnUserState;

const pickEntryFields = (...groups: FieldGroup[]): ColumnUserState => entryWithout(
  ...ALL_GROUPS
    .filter((group) => !groups.includes(group))
    .flatMap((group) => FIELD_GROUPS[group]),
);

const restoreColumn = async (
  gridOptions: DataGridProperties = {},
  entry: ColumnUserState = SAVED_ENTRY,
): Promise<{
  instance: DataGridInstance;
  before: Column;
  after: Column;
}> => {
  const { instance } = await createDataGrid({
    dataSource: DATA,
    columns: ['a', 'b'],
    ...gridOptions,
  });
  const before = { ...getColumn(instance, 'b') };

  instance.state({ columns: [SAVED_ENTRY_A, entry] });
  jest.runAllTimers();

  const after = getColumn(instance, 'b');

  return { instance, before, after };
};

describe('ColumnsController user state', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when the state is restored with default grid options', () => {
    // groupIndex is restored because grouping.contextMenuEnabled is true by default in DataGrid
    it('should restore only the sorting and the grouping', async () => {
      const { before, after } = await restoreColumn();

      expect(pickGroupFields(after)).toEqual(expectedGroupFields(before, ['sorting', 'grouping']));
    });

    it('should restore the visible index', async () => {
      const { instance } = await restoreColumn();

      expect(getColumn(instance, 'b').visibleIndex).toBe(0);
      expect(getColumn(instance, 'a').visibleIndex).toBe(1);
    });
  });

  describe('when one grid option enables a field', () => {
    const noContextMenu = { grouping: { contextMenuEnabled: false } };

    it.each<{ title: string; options: DataGridProperties; restored: FieldGroup[] }>([
      { title: 'columnChooser.enabled', options: { columnChooser: { enabled: true } }, restored: ['sorting', 'grouping', 'visible'] },
      { title: 'allowColumnResizing', options: { allowColumnResizing: true }, restored: ['sorting', 'grouping', 'width'] },
      { title: 'columnFixing.enabled', options: { columnFixing: { enabled: true } }, restored: ['sorting', 'grouping', 'fixing'] },
      { title: 'grouping.contextMenuEnabled is false', options: noContextMenu, restored: ['sorting'] },
      { title: 'groupPanel.visible', options: { ...noContextMenu, groupPanel: { visible: true } }, restored: ['sorting', 'grouping'] },
      {
        title: 'groupPanel.visible without allowColumnDragging',
        options: { ...noContextMenu, groupPanel: { visible: true, allowColumnDragging: false } },
        restored: ['sorting'],
      },
      { title: 'filterRow.visible', options: { filterRow: { visible: true } }, restored: ['sorting', 'grouping', 'filterRow'] },
      { title: 'headerFilter.visible', options: { headerFilter: { visible: true } }, restored: ['sorting', 'grouping', 'headerFilter'] },
      { title: 'sorting.mode is none', options: { sorting: { mode: 'none' } }, restored: ['grouping'] },
    ])('should restore $restored when $title', async ({ options, restored }) => {
      const { before, after } = await restoreColumn(options);

      expect(pickGroupFields(after)).toEqual(expectedGroupFields(before, restored));
    });

    it.each<{ title: string; group: 'filterRow' | 'headerFilter' }>([
      { title: 'filter row', group: 'filterRow' },
      { title: 'header filter', group: 'headerFilter' },
    ])('should restore the $title pair when filterPanel.visible', async ({ group }) => {
      const entry = pickEntryFields('sorting', group);
      const { after } = await restoreColumn({ filterPanel: { visible: true } }, entry);

      FIELD_GROUPS[group].forEach((field) => {
        expect(after[field]).toEqual(entry[field]);
      });
    });
  });

  describe('when commonColumnSettings enables a field instead of the grid option', () => {
    it.each<{ title: string; options: DataGridProperties; restored: FieldGroup[] }>([
      {
        title: 'allowResizing',
        options: { commonColumnSettings: { allowResizing: true } } as DataGridProperties,
        restored: ['sorting', 'grouping', 'width'],
      },
      {
        title: 'allowGrouping',
        options: {
          grouping: { contextMenuEnabled: false },
          commonColumnSettings: { allowGrouping: true },
        } as DataGridProperties,
        restored: ['sorting', 'grouping'],
      },
      {
        title: 'allowFixing',
        options: { commonColumnSettings: { allowFixing: true } } as DataGridProperties,
        restored: ['sorting', 'grouping', 'fixing'],
      },
    ])('should restore $restored when $title', async ({ options, restored }) => {
      const { before, after } = await restoreColumn(options);

      expect(pickGroupFields(after)).toEqual(expectedGroupFields(before, restored));
    });
  });

  describe('when stateStoring.ignoreColumnOptionNames is set', () => {
    it('should ignore only the listed fields and skip the grid options rule', async () => {
      const { before, after } = await restoreColumn({
        // @ts-expect-error private option
        stateStoring: { ignoreColumnOptionNames: ['width'] },
      });

      expect(pickGroupFields(after)).toEqual(
        expectedGroupFields(before, ALL_GROUPS.filter((group) => group !== 'width')),
      );
    });

    it('should restore every field when it is an empty array', async () => {
      const { before, after } = await restoreColumn({
        // @ts-expect-error private option
        stateStoring: { ignoreColumnOptionNames: [] },
      });

      expect(pickGroupFields(after)).toEqual(expectedGroupFields(before, ALL_GROUPS));
    });
  });

  describe('when a field is missing in the saved entry', () => {
    // A regular field is overwritten even when the entry has no value for it
    it('should set a regular field to undefined', async () => {
      const { after } = await restoreColumn(
        { columnChooser: { enabled: true } },
        entryWithout('visible'),
      );

      expect(after.visible).toBeUndefined();
    });

    it('should keep the column own value of a "15.1" field', async () => {
      const { after } = await restoreColumn(
        {
          columnFixing: { enabled: true },
          headerFilter: { visible: true },
          columns: ['a', {
            dataField: 'b', fixed: true, fixedPosition: 'left', filterValues: [1], filterType: 'include',
          }],
        },
        entryWithout('fixed', 'fixedPosition', 'filterValues', 'filterType'),
      );

      expect(after.fixed).toBe(true);
      expect(after.fixedPosition).toBe('left');
      expect(after.filterValues).toEqual([1]);
      expect(after.filterType).toBe('include');
    });
  });

  describe('when both the column and the saved entry have a dataType', () => {
    it('should keep the column own dataType', async () => {
      const { after } = await restoreColumn(
        { columns: ['a', { dataField: 'b', dataType: 'string' }] },
        { ...SAVED_ENTRY, dataType: 'number' },
      );

      expect(after.dataType).toBe('string');
    });
  });

  describe('when the saved entry has a selectedFilterOperation', () => {
    it('should move the column own value to defaultSelectedFilterOperation', async () => {
      const { after } = await restoreColumn({
        filterRow: { visible: true },
        columns: ['a', { dataField: 'b', selectedFilterOperation: '=' }],
      });

      expect(after.selectedFilterOperation).toBe('>');
      expect(after.defaultSelectedFilterOperation).toBe('=');
    });

    it('should set defaultSelectedFilterOperation to null when the column has no own value', async () => {
      const { after } = await restoreColumn({ filterRow: { visible: true } });

      expect(after.selectedFilterOperation).toBe('>');
      expect(after.defaultSelectedFilterOperation).toBeNull();
    });
  });

  describe('when a column was added at runtime', () => {
    it('should recreate the column on restore', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA, columns: ['a', 'b'] });

      instance.addColumn({ dataField: 'c' });
      jest.runAllTimers();
      const savedState = instance.state();

      instance.state(savedState);
      jest.runAllTimers();

      expect(getColumns(instance).map((column) => column.dataField)).toEqual(['a', 'b', 'c']);
      expect(getColumn(instance, 'c').visibleIndex).toBe(2);
    });
  });

  describe('when a runtime column has the same dataField as a declared one', () => {
    beforeEach(() => {
      jest.spyOn(errors, 'log').mockImplementation(jest.fn());
    });

    it('should keep both columns after restore', async () => {
      const { instance } = await createDataGrid({ dataSource: DATA, columns: ['a', 'b'] });

      instance.addColumn({ dataField: 'b' });
      jest.runAllTimers();
      const savedState = instance.state();

      instance.state(savedState);
      jest.runAllTimers();

      expect(getColumns(instance).map((column) => column.dataField)).toEqual(['a', 'b', 'b']);
    });
  });

  describe('when the dataSource is replaced without a state() call', () => {
    const changeColumnsAndReplaceData = async (
      newData: Record<string, unknown>[],
      callState = false,
    ): Promise<DataGridInstance> => {
      const { instance } = await createDataGrid({
        dataSource: DATA,
        columnChooser: { enabled: true },
        allowColumnResizing: true,
      });

      if (callState) {
        instance.state(instance.state());
        jest.runAllTimers();
      }

      instance.columnOption('a', 'width', 100);
      instance.columnOption('b', 'visible', false);
      jest.runAllTimers();

      instance.option('dataSource', newData);
      jest.runAllTimers();

      return instance;
    };

    it('should keep the runtime changes when the new data has the same fields', async () => {
      const instance = await changeColumnsAndReplaceData([{ id: 2, a: 3, b: 4 }]);

      expect(getColumn(instance, 'a').width).toBe(100);
      expect(getColumn(instance, 'b').visible).toBe(false);
    });

    it('should drop the runtime changes when the new data has an extra field', async () => {
      const instance = await changeColumnsAndReplaceData([{
        id: 2, a: 3, b: 4, c: 5,
      }]);

      expect(getColumn(instance, 'a').width).toBeUndefined();
      expect(getColumn(instance, 'b').visible).toBe(true);
    });

    it('should keep the runtime changes with an extra field after a state() call', async () => {
      const instance = await changeColumnsAndReplaceData([{
        id: 2, a: 3, b: 4, c: 5,
      }], true);

      expect(getColumn(instance, 'a').width).toBe(100);
      expect(getColumn(instance, 'b').visible).toBe(false);
    });
  });

  describe('when the restored state is read back', () => {
    it('should contain the restored values', async () => {
      const { instance } = await restoreColumn({
        // @ts-expect-error private option
        stateStoring: { ignoreColumnOptionNames: [] },
      });

      const savedColumn = instance.state().columns
        .find((column: ColumnUserState) => column.dataField === 'b') as ColumnUserState;

      expect(pickGroupFields(savedColumn)).toEqual(pickGroupFields(SAVED_ENTRY));
      expect(savedColumn.visibleIndex).toBe(0);
    });
  });
});

describe('TreeList user state restore', () => {
  beforeEach(beforeTreeListTest);
  afterEach(afterTreeListTest);

  describe('when the state is restored with default grid options', () => {
    // Unlike DataGrid, TreeList has no grouping, so groupIndex is not restored
    it('should restore the sorting and the visible index only', async () => {
      const { instance } = await createTreeList({
        dataSource: [{
          id: 1, parentId: 0, a: 1, b: 2,
        }],
        columns: ['a', 'b'],
      } as TreeListProperties);
      const getTreeListColumn = (dataField: string): Column => instance
        .getController('columns')
        .getColumns()
        .find((column) => column.dataField === dataField) as Column;
      const before = { ...getTreeListColumn('b') };

      instance.state({ columns: [SAVED_ENTRY_A, SAVED_ENTRY] });
      jest.runAllTimers();

      const after = getTreeListColumn('b');

      expect(pickGroupFields(after)).toEqual(expectedGroupFields(before, ['sorting']));
      expect(after.visibleIndex).toBe(0);
    });
  });
});
