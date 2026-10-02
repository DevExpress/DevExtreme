import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import type { NAV_KEYS } from './helpers/const';
import {
  getKeyboardNavigationController,
  triggerKeyDown,
  triggerPointerDown,
} from './helpers/utils';

type KeyboardNavKey = keyof typeof NAV_KEYS;
type SelectionMode = 'single' | 'multiple' | 'none';

interface AsyncTemplateArgs {
  model: { value: unknown };
  container: HTMLElement;
  onRendered?: () => void;
}

describe('Keyboard Navigation', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  const DATA_SOURCE = [
    { id: 1, name: 'Item 1', group: 'A' },
    { id: 2, name: 'Item 2', group: 'A' },
    { id: 3, name: 'Item 3', group: 'B' },
    { id: 4, name: 'Item 4', group: 'B' },
    { id: 5, name: 'Item 5', group: 'C' },
  ];

  describe('from focused expand command cell with batch editing (T1322130)', () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const createGridWithGrouping = (selectionMode: SelectionMode) => createDataGrid({
      dataSource: DATA_SOURCE,
      columns: ['name', { dataField: 'group', groupIndex: 0 }],
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
      selection: {
        mode: selectionMode,
      },
      scrolling: {
        mode: 'virtual',
      },
      grouping: {
        autoExpandAll: true,
      },
      keyboardNavigation: {
        enabled: true,
      },
    });

    // Grid structure with autoExpandAll: true:
    // Row 0: Group "A" (expanded)
    // Row 1: Data (Item 1)
    // Row 2: Data (Item 2)
    // Row 3: Group "B" (expanded)
    // Row 4: Data (Item 3)
    // Row 5: Data (Item 4)
    // Row 6: Group "C" (expanded)
    // Row 7: Data (Item 5)

    it.each<{ mode: SelectionMode; key: KeyboardNavKey }>([
      { mode: 'multiple', key: 'upArrow' },
      { mode: 'multiple', key: 'downArrow' },
      { mode: 'single', key: 'upArrow' },
      { mode: 'single', key: 'downArrow' },
    ])(
      'should not throw an error, while pressing $key (selection.mode: $mode)',
      async ({ key, mode }) => {
        const { instance, component } = await createGridWithGrouping(mode);

        const groupRow = component.getGroupRow(1);
        const expandCell = groupRow.getExpandCell();

        triggerPointerDown(expandCell);
        jest.runAllTimers();

        const keyboardNavController = getKeyboardNavigationController(instance);
        const prevRowIndex = keyboardNavController._focusedCellPosition.rowIndex;

        expect(() => {
          triggerKeyDown(instance, key);
          jest.runAllTimers();
        }).not.toThrow();

        const currentRowIndex = keyboardNavController._focusedCellPosition.rowIndex;

        switch (key) {
          case 'upArrow':
            expect(currentRowIndex).toBeLessThan(prevRowIndex);
            break;
          case 'downArrow':
            expect(currentRowIndex).toBeGreaterThan(prevRowIndex);
            break;
          default:
            throw new Error(`Unsupported key: ${key}`);
        }
      },
    );

    // NOTE: { mode: 'single', key: 'downArrow' } is excluded because
    // the _scrollBy fallback in _upDownKeysHandler only fires for upArrow,
    // so single+downArrow at boundary never throws an error.
    it.each<{ mode: SelectionMode; key: KeyboardNavKey }>([
      { mode: 'multiple', key: 'upArrow' },
      { mode: 'multiple', key: 'downArrow' },
      { mode: 'single', key: 'upArrow' },
    ])(
      'should not throw an error, while pressing $key on boundary rows (selection.mode: $mode)',
      async ({ key, mode }) => {
        const { instance, component } = await createGridWithGrouping(mode);

        let groupRowIndex: number | null = null;
        switch (key) {
          case 'upArrow':
            groupRowIndex = 0; // First group row index
            break;
          case 'downArrow':
            groupRowIndex = component.getGroupRows().length - 1; // Last group row index
            break;
          default:
            throw new Error(`Unsupported key: ${key}`);
        }

        const groupRow = component.getGroupRow(groupRowIndex);
        const expandCell = groupRow.getExpandCell();

        triggerPointerDown(expandCell);
        jest.runAllTimers();

        expect(() => {
          triggerKeyDown(instance, key);
          jest.runAllTimers();
        }).not.toThrow();
      },
    );
  });

  describe('from focused expand command cell (T1322440)', () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const createGridWithGrouping = () => createDataGrid({
      dataSource: DATA_SOURCE,
      columns: ['name', { dataField: 'group', groupIndex: 0 }],
      editing: {
        allowUpdating: true,
        allowDeleting: true,
      },
      selection: {
        mode: 'multiple',
      },
      grouping: {
        autoExpandAll: false,
      },
      keyboardNavigation: {
        enabled: true,
      },
    });

    // Grid structure with autoExpandAll: false:
    // Row 0: Group "A" (collapsed)
    // Row 1: Group "B" (collapsed)
    // Row 2: Group "C" (collapsed)

    it('should allow to focus the last group row', async () => {
      const { instance, component } = await createGridWithGrouping();

      const visibleGroupRows = component.getGroupRows();
      const startGroupRowIndex = visibleGroupRows.length - 2; // Group "B"
      const groupRow = component.getGroupRow(startGroupRowIndex);
      const expandCell = groupRow.getExpandCell();

      triggerPointerDown(expandCell); // expand the group row
      jest.runAllTimers();

      triggerPointerDown(expandCell); // and collapse it again to keep the expand cell focused
      jest.runAllTimers();

      expect(() => {
        triggerKeyDown(instance, 'downArrow');
        jest.runAllTimers();
      }).not.toThrow();

      const keyboardNavController = getKeyboardNavigationController(instance);
      const finishGroupRowIndex = visibleGroupRows.length - 1; // Group "C"

      expect(keyboardNavController._focusedCellPosition.rowIndex).toBe(finishGroupRowIndex);
    });
  });

  describe('editing a new row when allowUpdating is false (T1332312)', () => {
    type CreatedGrid = Awaited<ReturnType<typeof createDataGrid>>;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const createGridWithNewRow = (startEditAction: 'click' | 'dblClick' = 'click') => createDataGrid({
      dataSource: DATA_SOURCE,
      columns: ['name'],
      editing: {
        mode: 'batch',
        allowUpdating: false,
        allowAdding: true,
        startEditAction,
      },
      keyboardNavigation: {
        enabled: true,
      },
    });

    // Adds a new row, leaves editing, then focuses the new row's cell without editing it.
    const focusNewRowCell = async ({ instance, component }: CreatedGrid): Promise<number> => {
      await instance.addRow();
      await flushAsync();
      instance.closeEditCell();
      jest.runAllTimers();

      const newRowIndex = instance.getVisibleRows().findIndex((row) => row.isNewRow);
      const cell = component.getDataCell(newRowIndex, 0).getElement() as HTMLElement;

      triggerPointerDown(cell);
      jest.runAllTimers();

      return newRowIndex;
    };

    it('should enter cell edit mode on Enter for a new row', async () => {
      const grid = await createGridWithNewRow();
      const newRowIndex = await focusNewRowCell(grid);

      expect(grid.component.getDataCell(newRowIndex, 0).isEditCell).toBe(false);

      triggerKeyDown(grid.instance, 'enter');
      jest.runAllTimers();

      expect(grid.component.getDataCell(newRowIndex, 0).isEditCell).toBe(true);
    });

    it('should enter cell edit mode on Enter for a new row even when startEditAction is dblClick', async () => {
      const grid = await createGridWithNewRow('dblClick');
      const newRowIndex = await focusNewRowCell(grid);

      triggerKeyDown(grid.instance, 'enter');
      jest.runAllTimers();

      expect(grid.component.getDataCell(newRowIndex, 0).isEditCell).toBe(true);
    });

    it('should NOT enter cell edit mode on Enter for an existing row', async () => {
      const grid = await createGridWithNewRow();
      jest.runAllTimers();

      const cell = grid.component.getDataCell(0, 0).getElement() as HTMLElement;
      triggerPointerDown(cell);
      jest.runAllTimers();

      triggerKeyDown(grid.instance, 'enter');
      jest.runAllTimers();

      expect(grid.component.getDataCell(0, 0).isEditCell).toBe(false);
    });
  });

  describe('focused cell position on a changesOnly repaint', () => {
    const ROWS = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const createGridWithRows = async (keyboardEnabled = true) => {
      const dataSource = ROWS.map((row) => ({ ...row }));
      const grid = await createDataGrid({
        dataSource,
        columns: ['id', 'name'],
        keyboardNavigation: {
          enabled: keyboardEnabled,
        },
      });
      await flushAsync();

      const refocus = jest.spyOn(grid.instance.getController('editorFactory'), 'refocus');

      return {
        ...grid,
        dataSource,
        refocus,
        keyboardNav: getKeyboardNavigationController(grid.instance),
      };
    };

    const repaintChangesOnly = async (instance: DataGridInstance): Promise<void> => {
      instance.refresh(true).catch(() => {});
      await flushAsync();
    };

    it('should shift the focused cell down when a row is inserted above it', async () => {
      const {
        dataSource, instance, keyboardNav, refocus, component,
      } = await createGridWithRows();

      triggerPointerDown(component.getDataCell(0, 1).getElement() as HTMLElement);
      jest.runAllTimers();

      expect(keyboardNav._focusedCellPosition).toEqual({ rowIndex: 0, columnIndex: 1 });
      refocus.mockClear();

      dataSource.unshift({ id: 0, name: 'Item 0' });
      await repaintChangesOnly(instance);

      expect(keyboardNav._focusedCellPosition).toEqual({ rowIndex: 1, columnIndex: 1 });
      expect(refocus).toHaveBeenCalled();
    });

    it('should keep the focused cell when a row is inserted below it', async () => {
      const {
        dataSource, instance, keyboardNav, refocus, component,
      } = await createGridWithRows();

      triggerPointerDown(component.getDataCell(0, 1).getElement() as HTMLElement);
      jest.runAllTimers();

      expect(keyboardNav._focusedCellPosition).toEqual({ rowIndex: 0, columnIndex: 1 });
      refocus.mockClear();

      dataSource.push({ id: 4, name: 'Item 4' });
      await repaintChangesOnly(instance);

      expect(keyboardNav._focusedCellPosition).toEqual({ rowIndex: 0, columnIndex: 1 });
      expect(refocus).not.toHaveBeenCalled();
    });

    it('should shift the focused cell up when a row above it is removed', async () => {
      const {
        dataSource, instance, keyboardNav, refocus, component,
      } = await createGridWithRows();

      triggerPointerDown(component.getDataCell(1, 1).getElement() as HTMLElement);
      jest.runAllTimers();

      expect(keyboardNav._focusedCellPosition).toEqual({ rowIndex: 1, columnIndex: 1 });
      refocus.mockClear();

      dataSource.shift();
      await repaintChangesOnly(instance);

      expect(keyboardNav._focusedCellPosition).toEqual({ rowIndex: 0, columnIndex: 1 });
      expect(refocus).toHaveBeenCalled();
    });

    it('should correct the focused cell even when keyboard navigation is disabled', async () => {
      const { dataSource, instance, keyboardNav } = await createGridWithRows(false);

      // No pointer handlers while kbn disabled, so seed the position directly
      keyboardNav._focusedCellPosition = { rowIndex: 0, columnIndex: 1 };

      dataSource.unshift({ id: 0, name: 'Item 0' });
      await repaintChangesOnly(instance);

      expect(keyboardNav._focusedCellPosition).toEqual({ rowIndex: 1, columnIndex: 1 });
    });
  });

  describe('Navigation keys with virtual scrolling while the scrolled-in rows wait for async templates (T1336240)', () => {
    const ROWS_KEYED_BY_INDEX = Array.from({ length: 200 }, (_, index) => ({ id: index, name: `Row ${index}` }));
    const FOCUSED_ROW_KEY = 5;
    const NEXT_ROW_KEY = FOCUSED_ROW_KEY + 1;
    const PREVIOUS_ROW_KEY = FOCUSED_ROW_KEY - 1;
    const SCROLL_TOP = 60;

    const getRowKey = (element: Element | null): number | undefined => {
      const row = element?.closest<HTMLTableRowElement>('tr.dx-data-row');

      return row ? Number(row.cells[0].textContent) : undefined;
    };

    const getRowKeys = ($container: dxElementWrapper, selector: string): (number | undefined)[] => {
      const container = $container.get(0) as HTMLElement;

      return Array.from(container.querySelectorAll(`.dx-datagrid-rowsview ${selector}`), getRowKey);
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const focusRowAndScrollDown = async (focusedRowEnabled: boolean, columnIndex = 1) => {
      const pendingTemplates: (() => void)[] = [];
      const renderPendingTemplates = (): void => {
        while (pendingTemplates.length) {
          pendingTemplates.shift()?.();
          jest.runAllTimers();
        }
      };

      const grid = await createDataGrid({
        dataSource: ROWS_KEYED_BY_INDEX,
        height: 400,
        focusedRowEnabled,
        scrolling: { mode: 'virtual', renderAsync: true },
        columns: ['id', { dataField: 'name', cellTemplate: 'asyncTemplate' }],
        templatesRenderAsynchronously: true,
        integrationOptions: {
          templates: {
            asyncTemplate: {
              render({ model, container, onRendered }: AsyncTemplateArgs): void {
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

      const cell = grid.component.getDataCell(FOCUSED_ROW_KEY, columnIndex);
      triggerPointerDown(cell.getElement() as HTMLElement);
      jest.runAllTimers();

      const dataController = grid.instance.getController('data');
      // @ts-expect-error
      dataController.setViewportPosition(SCROLL_TOP);
      jest.runAllTimers();

      expect(dataController.getRowIndexOffset()).toBeGreaterThan(0);
      expect(getRowKeys(grid.$container, 'tr.dx-data-row')[0]).toBe(0);

      return { ...grid, renderPendingTemplates };
    };

    it('should not move focus above the focused row while the rows are rendering', async () => {
      const { instance } = await focusRowAndScrollDown(true);

      triggerKeyDown(instance, 'downArrow', document.activeElement);
      jest.runAllTimers();

      expect(getRowKey(document.activeElement)).toBeGreaterThanOrEqual(FOCUSED_ROW_KEY);
    });

    it.each([true, false])(
      'should keep focus on the row of focusedRowIndex while the rows are rendering (focusedRowEnabled: %s)',
      async (focusedRowEnabled) => {
        const { instance } = await focusRowAndScrollDown(focusedRowEnabled);

        triggerKeyDown(instance, 'downArrow', document.activeElement);
        jest.runAllTimers();

        expect(getRowKey(document.activeElement)).toBe(instance.option('focusedRowIndex'));
      },
    );

    it.each<{ keyName: KeyboardNavKey; focusedRowEnabled: boolean; expectedRowKey: number }>([
      { keyName: 'downArrow', focusedRowEnabled: true, expectedRowKey: NEXT_ROW_KEY },
      { keyName: 'downArrow', focusedRowEnabled: false, expectedRowKey: NEXT_ROW_KEY },
      { keyName: 'upArrow', focusedRowEnabled: true, expectedRowKey: PREVIOUS_ROW_KEY },
      { keyName: 'upArrow', focusedRowEnabled: false, expectedRowKey: PREVIOUS_ROW_KEY },
    ])(
      'should focus the adjacent row on $keyName once the rows are rendered (focusedRowEnabled: $focusedRowEnabled)',
      async ({ keyName, focusedRowEnabled, expectedRowKey }) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(focusedRowEnabled);

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();
        renderPendingTemplates();

        expect(instance.option('focusedRowIndex')).toBe(expectedRowKey);
        expect(getRowKey(document.activeElement)).toBe(expectedRowKey);
      },
    );

    interface HorizontalNavigationCase {
      keyName: KeyboardNavKey;
      startColumnIndex: number;
      expectedColumnIndex: number;
      focusedRowEnabled: boolean;
    }

    const HORIZONTAL_NAVIGATION_CASES = [
      { keyName: 'rightArrow', startColumnIndex: 0, expectedColumnIndex: 1 },
      { keyName: 'leftArrow', startColumnIndex: 1, expectedColumnIndex: 0 },
      { keyName: 'end', startColumnIndex: 0, expectedColumnIndex: 1 },
      { keyName: 'home', startColumnIndex: 1, expectedColumnIndex: 0 },
    ].flatMap((navigationCase) => [true, false].map((focusedRowEnabled) => ({
      ...navigationCase,
      focusedRowEnabled,
    }))) as HorizontalNavigationCase[];

    it.each<HorizontalNavigationCase>(HORIZONTAL_NAVIGATION_CASES)(
      'should keep focus in the focused row on $keyName while the rows are rendering (focusedRowEnabled: $focusedRowEnabled)',
      async ({ keyName, startColumnIndex, focusedRowEnabled }) => {
        const { instance } = await focusRowAndScrollDown(focusedRowEnabled, startColumnIndex);

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();

        expect(instance.option('focusedRowIndex')).toBe(FOCUSED_ROW_KEY);
        expect(getRowKey(document.activeElement)).toBe(FOCUSED_ROW_KEY);
      },
    );

    it.each<HorizontalNavigationCase>(HORIZONTAL_NAVIGATION_CASES)(
      'should focus the cell in column $expectedColumnIndex on $keyName once the rows are rendered (focusedRowEnabled: $focusedRowEnabled)',
      async ({
        keyName, startColumnIndex, expectedColumnIndex, focusedRowEnabled,
      }) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(
          focusedRowEnabled,
          startColumnIndex,
        );

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();
        renderPendingTemplates();

        expect(instance.option('focusedRowIndex')).toBe(FOCUSED_ROW_KEY);
        expect(instance.option('focusedColumnIndex')).toBe(expectedColumnIndex);
        expect(getRowKey(document.activeElement)).toBe(FOCUSED_ROW_KEY);
        expect(document.activeElement?.closest('td')?.cellIndex).toBe(expectedColumnIndex);
      },
    );

    it('should keep focusedRowIndex on Ctrl+downArrow pressed while the rows are rendering (focusedRowEnabled: false)', async () => {
      const { instance, renderPendingTemplates } = await focusRowAndScrollDown(false);

      triggerKeyDown(instance, 'downArrow', document.activeElement, { ctrlKey: true });
      jest.runAllTimers();
      renderPendingTemplates();

      expect(instance.option('focusedRowIndex')).toBe(FOCUSED_ROW_KEY);
    });

    it('should highlight the row of focusedRowKey while the rows are rendering', async () => {
      const { instance, $container } = await focusRowAndScrollDown(true);

      triggerKeyDown(instance, 'downArrow', document.activeElement);
      jest.runAllTimers();

      expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([instance.option('focusedRowKey')]);
    });

    it('should highlight only the next row once the rows are rendered', async () => {
      const { instance, $container, renderPendingTemplates } = await focusRowAndScrollDown(true);

      triggerKeyDown(instance, 'downArrow', document.activeElement);
      jest.runAllTimers();
      renderPendingTemplates();

      expect(instance.option('focusedRowKey')).toBe(NEXT_ROW_KEY);
      expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([NEXT_ROW_KEY]);
    });
  });

  describe('Focus after the rows are re-rendered with async templates', () => {
    const PAGE_SIZE = 3;
    const ROWS = Array.from({ length: PAGE_SIZE * 2 }, (_, index) => ({ id: index, name: `Row ${index}` }));
    const FOCUSED_COLUMN_INDEX = 1;

    const getFocusedCell = (): { rowKey: number; columnIndex: number } | undefined => {
      const cell = document.activeElement?.closest('td');
      const row = cell?.closest<HTMLTableRowElement>('tr.dx-data-row');

      return cell && row
        ? { rowKey: Number(row.cells[0].textContent), columnIndex: cell.cellIndex }
        : undefined;
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const createGridWithFocusedCell = async () => {
      const pendingTemplates: (() => void)[] = [];
      const renderPendingTemplates = (): void => {
        while (pendingTemplates.length) {
          pendingTemplates.shift()?.();
          jest.runAllTimers();
        }
      };

      const grid = await createDataGrid({
        dataSource: ROWS,
        paging: { pageSize: PAGE_SIZE },
        columns: ['id', { dataField: 'name', cellTemplate: 'asyncTemplate' }],
        templatesRenderAsynchronously: true,
        integrationOptions: {
          templates: {
            asyncTemplate: {
              render({ model, container, onRendered }: AsyncTemplateArgs): void {
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

      const cell = grid.component.getDataCell(0, FOCUSED_COLUMN_INDEX);
      triggerPointerDown(cell.getElement() as HTMLElement);
      jest.runAllTimers();

      return { ...grid, renderPendingTemplates };
    };

    interface ReRenderCase {
      action: string;
      act: (instance: DataGridInstance) => Promise<void> | void;
      expectedRowKey: number;
    }

    it.each<ReRenderCase>([
      {
        action: 'refresh',
        act: (instance): Promise<void> => instance.refresh(),
        expectedRowKey: 0,
      },
      {
        action: 'repaint',
        act: (instance): void => { instance.repaint(); },
        expectedRowKey: 0,
      },
      {
        action: 'pageDown',
        act: (instance): void => { triggerKeyDown(instance, 'pageDown', document.activeElement); },
        expectedRowKey: PAGE_SIZE,
      },
    ])(
      'should focus the cell in row $expectedRowKey after $action once the new rows are rendered',
      async ({ act, expectedRowKey }) => {
        const { instance, renderPendingTemplates } = await createGridWithFocusedCell();

        const acting = act(instance);
        jest.runAllTimers();
        renderPendingTemplates();
        await acting;

        expect(getFocusedCell()).toEqual({
          rowKey: expectedRowKey,
          columnIndex: FOCUSED_COLUMN_INDEX,
        });
      },
    );
  });
});
