import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { StoreChange } from '@js/data/store';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest, beforeTest, createDataGrid, flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

const ROW_INSERTED_ANIMATION_CLASS = 'dx-datagrid-row-inserted-animation';
const EDIT_ROW_CLASS = 'dx-edit-row';
const MASTER_DETAIL_ROW_CLASS = 'dx-master-detail-row';
const INVISIBLE_CLASS = 'dx-state-invisible';

// legacyMode isn't in the public type
const SEPARATE_FIXED_TABLE_OPTIONS = { columnFixing: { legacyMode: true } } as DataGridProperties;

interface TemplateArgs {
  model: { value: unknown };
  container: HTMLElement;
  onRendered?: () => void;
}

const createGrid = async (
  options: DataGridProperties = {},
  data = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }],
): Promise<DataGridInstance> => {
  const { instance } = await createDataGrid({
    dataSource: {
      store: { type: 'array', data, key: 'id' },
      pushAggregationTimeout: 0,
    },
    keyExpr: undefined,
    repaintChangesOnly: true,
    columns: ['id', 'name'],
    ...options,
  });

  return instance;
};

const push = async (instance: DataGridInstance, changes: StoreChange[]): Promise<void> => {
  instance.getDataSource().store().push(changes);
  await flushAsync();
};

const runAndFlush = async (action: () => PromiseLike<unknown>): Promise<void> => {
  const result = action();

  await flushAsync();
  await result;
};

const getTable = (instance: DataGridInstance, isFixedTable = false): HTMLElement => {
  const table = instance.getView('rowsView').getTableElement(isFixedTable)?.get(0);

  return table as HTMLElement;
};

const getRows = (instance: DataGridInstance, isFixedTable = false): HTMLElement[] => {
  const rowsView = instance.getView('rowsView');

  return rowsView._getRowElements($(getTable(instance, isFixedTable))).toArray() as HTMLElement[];
};

const getRowTexts = (rows: HTMLElement[]): (string | null)[] => rows.map((row) => row.textContent);

const getRowKeys = (rows: HTMLElement[]): (string | null)[] => rows
  .map((row) => (row as HTMLTableRowElement).cells[0].textContent);

const getOldIndices = (rows: HTMLElement[], rowsBefore: HTMLElement[]): number[] => rows
  .map((row) => rowsBefore.indexOf(row));

const emulateVisibilityByInvisibleClass = (): void => {
  jest.spyOn(Element.prototype, 'getClientRects')
    .mockImplementation(function getClientRects(this: Element): DOMRectList {
      const isShown = this.isConnected && !this.closest(`.${INVISIBLE_CLASS}`);

      return (isShown ? [new DOMRect()] : []) as unknown as DOMRectList;
    });
};

describe('RowsView content update with repaintChangesOnly', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('when a row is updated', () => {
    it('should update the changed cells of the rendered row', async () => {
      const instance = await createGrid();
      const rowsBefore = getRows(instance);

      await push(instance, [{ type: 'update', key: 2, data: { name: 'B' } }]);

      const rows = getRows(instance);

      expect(getRowTexts(rows)).toEqual(['1a', '2B', '3c']);
      expect(getOldIndices(rows, rowsBefore)).toEqual([0, 1, 2]);
    });

    it('should replace the row when the change has no changed cells', async () => {
      const instance = await createGrid({
        editing: { mode: 'row', allowUpdating: true },
      });
      const rowsBefore = getRows(instance);

      instance.editRow(1);
      await flushAsync();

      const rows = getRows(instance);

      expect(getOldIndices(rows, rowsBefore)).toEqual([0, -1, 2]);
      expect(rows[1].classList).toContain(EDIT_ROW_CLASS);
    });

    describe('when the row visibility changes', () => {
      beforeEach(emulateVisibilityByInvisibleClass);

      afterEach(() => {
        jest.mocked(Element.prototype.getClientRects).mockRestore();
      });

      it('should hide and show the rendered row instead of replacing it', async () => {
        const instance = await createGrid({
          masterDetail: {
            enabled: true,
            template: (container): void => {
              $(container).text('detail');
            },
          },
        });

        await runAndFlush(() => instance.expandRow(2));

        const detailRow = getRows(instance)[2];

        expect(detailRow.classList).toContain(MASTER_DETAIL_ROW_CLASS);

        await runAndFlush(() => instance.collapseRow(2));

        expect(getRows(instance)[2]).toBe(detailRow);
        expect(detailRow.classList).toContain(INVISIBLE_CLASS);

        await runAndFlush(() => instance.expandRow(2));

        expect(getRows(instance)[2]).toBe(detailRow);
        expect(detailRow.classList).not.toContain(INVISIBLE_CLASS);
        expect(detailRow.textContent).toBe('detail');
      });
    });
  });

  describe('when a row is inserted', () => {
    it('should insert the row before the row at its index', async () => {
      const instance = await createGrid();
      const rowsBefore = getRows(instance);

      await push(instance, [{ type: 'insert', index: 1, data: { id: 10, name: 'x' } }]);

      const rows = getRows(instance);

      expect(getRowTexts(rows)).toEqual(['1a', '10x', '2b', '3c']);
      expect(getOldIndices(rows, rowsBefore)).toEqual([0, -1, 1, 2]);
    });

    it('should insert the row after the last row when its index is past the rows', async () => {
      const instance = await createGrid();
      const rowsBefore = getRows(instance);

      await push(instance, [{ type: 'insert', index: 3, data: { id: 10, name: 'x' } }]);

      const rows = getRows(instance);

      expect(getRowTexts(rows)).toEqual(['1a', '2b', '3c', '10x']);
      expect(getOldIndices(rows, rowsBefore)).toEqual([0, 1, 2, -1]);
    });

    it('should prepend the row to the table body when the table has no rows', async () => {
      const instance = await createGrid({
        editing: { mode: 'row', allowAdding: true },
      }, []);

      await runAndFlush(() => instance.addRow());

      const rows = getRows(instance);
      const tableBody = rows[0].parentElement;

      expect(rows).toHaveLength(1);
      expect(rows[0].classList).toContain(EDIT_ROW_CLASS);
      expect(tableBody?.tagName).toBe('TBODY');
      expect(tableBody?.parentElement).toBe(getTable(instance));
      expect(tableBody?.firstElementChild).toBe(rows[0]);
    });

    it('should prepend a <tbody> row to the table when the table has no rows', async () => {
      const instance = await createGrid({
        editing: { mode: 'row', allowAdding: true },
        dataRowTemplate: (container): void => {
          $(container).append($('<tbody>').addClass('dx-row dx-data-row'));
        },
      }, []);

      await runAndFlush(() => instance.addRow());

      const rows = getRows(instance);

      expect(rows).toHaveLength(1);
      expect(rows[0].tagName).toBe('TBODY');
      expect(rows[0].classList).toContain(EDIT_ROW_CLASS);
      expect(rows[0].parentElement).toBe(getTable(instance));
    });

    it('should mark the inserted row when highlightChanges is enabled', async () => {
      const instance = await createGrid({ highlightChanges: true });

      await push(instance, [{ type: 'insert', index: 1, data: { id: 10, name: 'x' } }]);

      const rows = getRows(instance);

      expect(rows[1].classList).toContain(ROW_INSERTED_ANIMATION_CLASS);
      expect(rows[0].classList).not.toContain(ROW_INSERTED_ANIMATION_CLASS);
    });

    it('should not mark the inserted row when highlightChanges is disabled', async () => {
      const instance = await createGrid();

      await push(instance, [{ type: 'insert', index: 1, data: { id: 10, name: 'x' } }]);

      expect(getRows(instance)[1].classList).not.toContain(ROW_INSERTED_ANIMATION_CLASS);
    });

    it('should not mark a row inserted by a change that is not a live update', async () => {
      const instance = await createGrid({
        highlightChanges: true,
        editing: { mode: 'row', allowAdding: true, newRowPosition: 'first' },
      });
      const rowsBefore = getRows(instance);

      await runAndFlush(() => instance.addRow());

      const rows = getRows(instance);

      expect(getOldIndices(rows, rowsBefore)).toEqual([-1, 0, 1, 2]);
      expect(rows[0].classList).toContain(EDIT_ROW_CLASS);
      expect(rows[0].classList).not.toContain(ROW_INSERTED_ANIMATION_CLASS);
    });
  });

  describe('when a row is removed', () => {
    it('should remove the row and keep the other rows', async () => {
      const instance = await createGrid();
      const rowsBefore = getRows(instance);

      await push(instance, [{ type: 'remove', key: 2 }]);

      const rows = getRows(instance);

      expect(getRowTexts(rows)).toEqual(['1a', '3c']);
      expect(getOldIndices(rows, rowsBefore)).toEqual([0, 2]);
      expect(rowsBefore[1].isConnected).toBe(false);
    });
  });

  describe('when several rows change at once', () => {
    const changes: StoreChange[] = [
      { type: 'insert', index: 0, data: { id: 20, name: 'p' } },
      { type: 'remove', key: 2 },
      { type: 'update', key: 3, data: { name: 'C' } },
      { type: 'insert', index: 2, data: { id: 21, name: 'q' } },
    ];

    it('should apply the changes in order', async () => {
      const instance = await createGrid();
      const rowsBefore = getRows(instance);

      await push(instance, changes);

      const rows = getRows(instance);

      expect(getRowTexts(rows)).toEqual(['20p', '1a', '21q', '3C']);
      expect(getOldIndices(rows, rowsBefore)).toEqual([-1, 0, -1, 2]);
    });

    it('should apply the changes to both tables when columns are fixed', async () => {
      const instance = await createGrid({
        columns: [{ dataField: 'id', fixed: true }, 'name'],
        ...SEPARATE_FIXED_TABLE_OPTIONS,
      });
      const rowsBefore = getRows(instance);
      const fixedRowsBefore = getRows(instance, true);

      expect(getTable(instance, true)).not.toBe(getTable(instance));

      await push(instance, changes);

      const rows = getRows(instance);
      const fixedRows = getRows(instance, true);

      expect(getRowTexts(rows)).toEqual(['20p', '1a', '21q', '3C']);
      expect(getRowKeys(fixedRows)).toEqual(['20', '1', '21', '3']);
      expect(getOldIndices(rows, rowsBefore)).toEqual([-1, 0, -1, 2]);
      expect(getOldIndices(fixedRows, fixedRowsBefore)).toEqual([-1, 0, -1, 2]);
    });

    it('should apply the changes to both tables once async templates are rendered', async () => {
      const pendingTemplates: (() => void)[] = [];
      const renderPendingTemplates = (): void => {
        while (pendingTemplates.length) {
          pendingTemplates.shift()?.();
          jest.runAllTimers();
        }
      };
      const instance = await createGrid({
        columns: [
          { dataField: 'id', fixed: true },
          { dataField: 'name', cellTemplate: 'nameTemplate' },
        ],
        ...SEPARATE_FIXED_TABLE_OPTIONS,
        templatesRenderAsynchronously: true,
        integrationOptions: {
          templates: {
            nameTemplate: {
              render({ model, container, onRendered }: TemplateArgs): void {
                pendingTemplates.push(() => {
                  container.append(String(model.value));
                  onRendered?.();
                });
              },
            },
          },
        },
      } as DataGridProperties);

      renderPendingTemplates();
      await push(instance, changes);

      expect(getRowKeys(getRows(instance))).toEqual(['1', '2', '3']);

      renderPendingTemplates();

      expect(getRowKeys(getRows(instance))).toEqual(['20', '1', '21', '3']);
      expect(getRowKeys(getRows(instance, true))).toEqual(['20', '1', '21', '3']);
    });
  });
});
