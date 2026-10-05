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

type GridWithPendingTemplates = Awaited<ReturnType<typeof createDataGrid>> & {
  renderPendingTemplates: () => void;
};

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

  const EDITING_OPTIONS: DataGridProperties = {
    editing: { mode: 'cell', allowUpdating: true, startEditAction: 'dblClick' },
    keyboardNavigation: { editOnKeyPress: true },
  };
  const SELECTION_OPTIONS: DataGridProperties = {
    selection: { mode: 'multiple', showCheckBoxesMode: 'none' },
  };

  const getRowKey = (element: Element | null): number | undefined => {
    const row = element?.closest<HTMLTableRowElement>('tr.dx-data-row');

    return row ? Number(row.cells[0].textContent) : undefined;
  };

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

  describe('Keys pressed with virtual scrolling while the scrolled-in rows wait for async templates (T1336240)', () => {
    const ROWS_KEYED_BY_INDEX = Array.from({ length: 200 }, (_, index) => ({ id: index, name: `Row ${index}` }));
    const FOCUSED_ROW_KEY = 5;
    const NEXT_ROW_KEY = FOCUSED_ROW_KEY + 1;
    const PREVIOUS_ROW_KEY = FOCUSED_ROW_KEY - 1;
    const SCROLL_TOP = 60;
    const OUTSIDE_INPUT_ID = 'outside-input';

    afterEach(() => {
      document.getElementById(OUTSIDE_INPUT_ID)?.remove();
    });

    const getRowKeys = ($container: dxElementWrapper, selector: string): (number | undefined)[] => {
      const container = $container.get(0) as HTMLElement;

      return Array.from(container.querySelectorAll(`.dx-datagrid-rowsview ${selector}`), getRowKey);
    };

    const focusRowAndScrollDown = async (
      focusedRowEnabled: boolean,
      columnIndex = 1,
      options: DataGridProperties = {},
    ): Promise<GridWithPendingTemplates> => {
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
        ...options,
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
      expect(getRowKey(document.activeElement)).toBe(FOCUSED_ROW_KEY);

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

    const VERTICAL_NAVIGATION_CASES = [
      { keyName: 'downArrow', expectedRowKey: NEXT_ROW_KEY },
      { keyName: 'upArrow', expectedRowKey: PREVIOUS_ROW_KEY },
    ].flatMap((navigationCase) => [true, false].map((focusedRowEnabled) => ({
      ...navigationCase,
      focusedRowEnabled,
    }))) as { keyName: KeyboardNavKey; expectedRowKey: number; focusedRowEnabled: boolean }[];

    it.each(VERTICAL_NAVIGATION_CASES)(
      'should ignore $keyName pressed while the rows are rendering (focusedRowEnabled: $focusedRowEnabled)',
      async ({ keyName, focusedRowEnabled }) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(focusedRowEnabled);

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();
        renderPendingTemplates();

        expect(instance.option('focusedRowIndex')).toBe(FOCUSED_ROW_KEY);
        expect(getRowKey(document.activeElement)).toBe(FOCUSED_ROW_KEY);
      },
    );

    it.each(VERTICAL_NAVIGATION_CASES)(
      'should focus the adjacent row on $keyName pressed once the rows are rendered (focusedRowEnabled: $focusedRowEnabled)',
      async ({ keyName, focusedRowEnabled, expectedRowKey }) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(focusedRowEnabled);

        renderPendingTemplates();
        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();

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
      'should keep the focused cell on $keyName pressed while the rows are rendering (focusedRowEnabled: $focusedRowEnabled)',
      async ({ keyName, startColumnIndex, focusedRowEnabled }) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(
          focusedRowEnabled,
          startColumnIndex,
        );
        const focusedColumnIndex = instance.option('focusedColumnIndex');
        const focusedCellIndex = document.activeElement?.closest('td')?.cellIndex;

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();
        renderPendingTemplates();

        expect(instance.option('focusedRowIndex')).toBe(FOCUSED_ROW_KEY);
        expect(instance.option('focusedColumnIndex')).toBe(focusedColumnIndex);
        expect(getRowKey(document.activeElement)).toBe(FOCUSED_ROW_KEY);
        expect(document.activeElement?.closest('td')?.cellIndex).toBe(focusedCellIndex);
      },
    );

    it.each<HorizontalNavigationCase>(HORIZONTAL_NAVIGATION_CASES)(
      'should focus the cell in column $expectedColumnIndex on $keyName pressed once the rows are rendered (focusedRowEnabled: $focusedRowEnabled)',
      async ({
        keyName, startColumnIndex, expectedColumnIndex, focusedRowEnabled,
      }) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(
          focusedRowEnabled,
          startColumnIndex,
        );

        renderPendingTemplates();
        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();

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

    it('should keep highlighting the focused row once the rows are rendered', async () => {
      const { instance, $container, renderPendingTemplates } = await focusRowAndScrollDown(true);

      triggerKeyDown(instance, 'downArrow', document.activeElement);
      jest.runAllTimers();
      renderPendingTemplates();

      expect(instance.option('focusedRowKey')).toBe(FOCUSED_ROW_KEY);
      expect(getRowKeys($container, 'tr.dx-row-focused')).toEqual([FOCUSED_ROW_KEY]);
    });

    it.each(['enter', 'F2', 'x'])(
      'should not start editing on %s pressed while the rows are rendering',
      async (keyName) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(
          false,
          1,
          EDITING_OPTIONS,
        );

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();
        renderPendingTemplates();

        expect(instance.getController('editing').isEditing()).toBe(false);
      },
    );

    it.each(['enter', 'F2', 'x'])(
      'should start editing the focused cell on %s pressed once the rows are rendered',
      async (keyName) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(
          false,
          1,
          EDITING_OPTIONS,
        );

        renderPendingTemplates();
        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();

        expect(instance.option('editing.editRowKey')).toBe(FOCUSED_ROW_KEY);
        expect(instance.option('editing.editColumnName')).toBe('name');
      },
    );

    it('should not select a row on space pressed while the rows are rendering', async () => {
      const { instance, renderPendingTemplates } = await focusRowAndScrollDown(
        false,
        1,
        SELECTION_OPTIONS,
      );

      triggerKeyDown(instance, 'space', document.activeElement);
      jest.runAllTimers();
      renderPendingTemplates();

      expect(instance.getSelectedRowKeys()).toEqual([]);
    });

    it('should select the focused row on space pressed once the rows are rendered', async () => {
      const { instance, renderPendingTemplates } = await focusRowAndScrollDown(
        false,
        1,
        SELECTION_OPTIONS,
      );

      renderPendingTemplates();
      triggerKeyDown(instance, 'space', document.activeElement);
      jest.runAllTimers();

      expect(instance.getSelectedRowKeys()).toEqual([FOCUSED_ROW_KEY]);
    });

    it('should ignore tab pressed while the rows are rendering', async () => {
      const { instance, renderPendingTemplates } = await focusRowAndScrollDown(false, 0);

      triggerKeyDown(instance, 'tab', document.activeElement);
      jest.runAllTimers();
      renderPendingTemplates();

      expect(instance.option('focusedRowIndex')).toBe(FOCUSED_ROW_KEY);
      expect(instance.option('focusedColumnIndex')).toBe(0);
    });

    it('should focus the next cell on tab pressed once the rows are rendered', async () => {
      const { instance, renderPendingTemplates } = await focusRowAndScrollDown(false, 0);

      renderPendingTemplates();
      triggerKeyDown(instance, 'tab', document.activeElement);
      jest.runAllTimers();

      expect(instance.option('focusedRowIndex')).toBe(FOCUSED_ROW_KEY);
      expect(instance.option('focusedColumnIndex')).toBe(1);
    });

    it.each([
      {
        place: 'an input outside the grid',
        getElement: (): HTMLElement => {
          const input = document.createElement('input');
          input.id = OUTSIDE_INPUT_ID;
          document.body.appendChild(input);
          return input;
        },
      },
      {
        place: 'a header cell',
        getElement: (): HTMLElement => {
          const headerCell = document.querySelector<HTMLElement>('.dx-header-row td') as HTMLElement;
          headerCell.setAttribute('tabindex', '0');
          return headerCell;
        },
      },
    ])(
      'should keep focus on $place it was moved to while the rows are rendering',
      async ({ getElement }) => {
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(false);

        triggerKeyDown(instance, 'downArrow', document.activeElement);
        jest.runAllTimers();
        const element = getElement();
        element.focus();
        renderPendingTemplates();

        expect(document.activeElement).toBe(element);
      },
    );

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const recordFocusChangingEvents = () => {
      const raisedEvents: string[] = [];
      const options: DataGridProperties = {
        onFocusedCellChanging: (): void => { raisedEvents.push('onFocusedCellChanging'); },
        onFocusedRowChanging: (): void => { raisedEvents.push('onFocusedRowChanging'); },
      };

      return { raisedEvents, options };
    };

    it.each([true, false])(
      'should not raise onFocusedCellChanging and onFocusedRowChanging for downArrow pressed while the rows are rendering (focusedRowEnabled: %s)',
      async (focusedRowEnabled) => {
        const { raisedEvents, options } = recordFocusChangingEvents();
        const { instance, renderPendingTemplates } = await focusRowAndScrollDown(
          focusedRowEnabled,
          1,
          options,
        );
        raisedEvents.length = 0;

        triggerKeyDown(instance, 'downArrow', document.activeElement);
        jest.runAllTimers();
        renderPendingTemplates();

        expect(raisedEvents).toEqual([]);
      },
    );

    it('should raise onFocusedCellChanging while handling downArrow pressed once the rows are rendered', async () => {
      const { raisedEvents, options } = recordFocusChangingEvents();
      const { instance, renderPendingTemplates } = await focusRowAndScrollDown(false, 1, options);
      renderPendingTemplates();
      raisedEvents.length = 0;

      triggerKeyDown(instance, 'downArrow', document.activeElement);

      expect(raisedEvents).toEqual(['onFocusedCellChanging']);
    });

    it.each(['downArrow', 'home', 'enter', 'space'])(
      'should prevent the default action and stop the propagation of %s pressed while the rows are rendering',
      async (keyName) => {
        const { instance } = await focusRowAndScrollDown(
          false,
          1,
          { ...EDITING_OPTIONS, ...SELECTION_OPTIONS },
        );

        const { preventDefault, stopPropagation } = triggerKeyDown(
          instance,
          keyName,
          document.activeElement,
        );

        expect(preventDefault).toHaveBeenCalled();
        expect(stopPropagation).toHaveBeenCalled();
      },
    );
  });

  describe('Keys pressed while an update of another row waits for async templates', () => {
    const ROWS = Array.from({ length: 200 }, (_, index) => ({ id: index, name: `Row ${index}`, price: index }));
    const FOCUSED_ROW_KEY = 5;
    const NEXT_ROW_KEY = FOCUSED_ROW_KEY + 1;
    const PREVIOUS_ROW_KEY = FOCUSED_ROW_KEY - 1;
    const UPDATED_ROW_KEY = 15;
    const LAST_COLUMN_INDEX = 2;
    const SCROLL_TOP = 60;

    type RowsChange = (instance: DataGridInstance) => void;

    const pushUpdate: RowsChange = (instance) => {
      instance.getDataSource().store().push([
        { type: 'update', key: UPDATED_ROW_KEY, data: { price: 1000 } },
      ]);
    };

    const createGrid = async (
      options: DataGridProperties = {},
    ): Promise<GridWithPendingTemplates> => {
      const pendingTemplates: (() => void)[] = [];
      const renderPendingTemplates = (): void => {
        while (pendingTemplates.length) {
          pendingTemplates.shift()?.();
          jest.runAllTimers();
        }
      };

      const grid = await createDataGrid({
        dataSource: ROWS.map((row) => ({ ...row })),
        repaintChangesOnly: true,
        columns: [
          'id',
          { dataField: 'name', cellTemplate: 'asyncTemplate' },
          { dataField: 'price', cellTemplate: 'asyncTemplate' },
        ],
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
        ...options,
      } as DataGridProperties);
      renderPendingTemplates();

      return { ...grid, renderPendingTemplates };
    };

    const focusCell = (
      { instance, component }: GridWithPendingTemplates,
      rowIndex: number,
      columnIndex: number,
    ): void => {
      const cell = component.getDataCell(rowIndex, columnIndex);
      triggerPointerDown(cell.getElement() as HTMLElement);
      jest.runAllTimers();

      expect(document.activeElement?.closest('tr')).toBe(instance.getRowElement(rowIndex)?.[0]);
    };

    const changeRows = (instance: DataGridInstance, change: RowsChange): void => {
      change(instance);
      jest.runAllTimers();

      expect(instance.getView('rowsView').isWaitingForAsyncTemplates()).toBe(true);
    };

    interface FocusedCellOptions {
      columnIndex?: number;
      options?: DataGridProperties;
    }

    const focusCellAndPushUpdate = async ({
      columnIndex = 1,
      options = {},
    }: FocusedCellOptions = {}): Promise<GridWithPendingTemplates> => {
      const grid = await createGrid(options);
      focusCell(grid, FOCUSED_ROW_KEY, columnIndex);
      changeRows(grid.instance, pushUpdate);

      return grid;
    };

    it.each([
      { keyName: 'downArrow', expectedRowKey: NEXT_ROW_KEY },
      { keyName: 'upArrow', expectedRowKey: PREVIOUS_ROW_KEY },
    ].flatMap((navigationCase) => [true, false].map((focusedRowEnabled) => ({
      ...navigationCase,
      focusedRowEnabled,
    }))))(
      'should focus the adjacent row on $keyName pressed while an update of another row is rendering (focusedRowEnabled: $focusedRowEnabled)',
      async ({ keyName, expectedRowKey, focusedRowEnabled }) => {
        const { instance } = await focusCellAndPushUpdate({ options: { focusedRowEnabled } });

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();

        expect(instance.option('focusedRowIndex')).toBe(expectedRowKey);
        expect(getRowKey(document.activeElement)).toBe(expectedRowKey);
      },
    );

    it('should keep focus on the cell it moved to once the update of another row is rendered', async () => {
      const { instance, renderPendingTemplates } = await focusCellAndPushUpdate();

      triggerKeyDown(instance, 'downArrow', document.activeElement);
      jest.runAllTimers();
      renderPendingTemplates();

      expect(getRowKey(document.activeElement)).toBe(NEXT_ROW_KEY);
      expect(document.activeElement?.closest('td')?.cellIndex).toBe(1);
    });

    it.each([
      { keyName: 'rightArrow', startColumnIndex: 0, expectedColumnIndex: 1 },
      { keyName: 'leftArrow', startColumnIndex: 1, expectedColumnIndex: 0 },
      { keyName: 'end', startColumnIndex: 0, expectedColumnIndex: LAST_COLUMN_INDEX },
      { keyName: 'home', startColumnIndex: LAST_COLUMN_INDEX, expectedColumnIndex: 0 },
    ])(
      'should focus the cell in column $expectedColumnIndex on $keyName pressed while an update of another row is rendering',
      async ({ keyName, startColumnIndex, expectedColumnIndex }) => {
        const { instance } = await focusCellAndPushUpdate({ columnIndex: startColumnIndex });

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();

        expect(instance.option('focusedColumnIndex')).toBe(expectedColumnIndex);
        expect(getRowKey(document.activeElement)).toBe(FOCUSED_ROW_KEY);
        expect(document.activeElement?.closest('td')?.cellIndex).toBe(expectedColumnIndex);
      },
    );

    it.each([
      {
        keys: 'tab',
        shiftKey: false,
        startColumnIndex: 0,
        expectedRowKey: FOCUSED_ROW_KEY,
        expectedColumnIndex: 1,
      },
      {
        keys: 'tab',
        shiftKey: false,
        startColumnIndex: LAST_COLUMN_INDEX,
        expectedRowKey: NEXT_ROW_KEY,
        expectedColumnIndex: 0,
      },
      {
        keys: 'shift+tab',
        shiftKey: true,
        startColumnIndex: 0,
        expectedRowKey: PREVIOUS_ROW_KEY,
        expectedColumnIndex: LAST_COLUMN_INDEX,
      },
    ])(
      'should focus the cell in row $expectedRowKey, column $expectedColumnIndex on $keys pressed in column $startColumnIndex while an update of another row is rendering',
      async ({
        shiftKey, startColumnIndex, expectedRowKey, expectedColumnIndex,
      }) => {
        const { instance } = await focusCellAndPushUpdate({ columnIndex: startColumnIndex });

        triggerKeyDown(instance, 'tab', document.activeElement, { shiftKey });
        jest.runAllTimers();

        expect(instance.option('focusedRowIndex')).toBe(expectedRowKey);
        expect(instance.option('focusedColumnIndex')).toBe(expectedColumnIndex);
        expect(getRowKey(document.activeElement)).toBe(expectedRowKey);
      },
    );

    it.each(['enter', 'F2', 'x'])(
      'should start editing the focused cell on %s pressed while an update of another row is rendering',
      async (keyName) => {
        const { instance } = await focusCellAndPushUpdate({ options: EDITING_OPTIONS });

        triggerKeyDown(instance, keyName, document.activeElement);
        jest.runAllTimers();

        expect(instance.option('editing.editRowKey')).toBe(FOCUSED_ROW_KEY);
        expect(instance.option('editing.editColumnName')).toBe('name');
      },
    );

    it('should select the focused row on space pressed while an update of another row is rendering', async () => {
      const { instance } = await focusCellAndPushUpdate({ options: SELECTION_OPTIONS });

      triggerKeyDown(instance, 'space', document.activeElement);
      jest.runAllTimers();

      expect(instance.getSelectedRowKeys()).toEqual([FOCUSED_ROW_KEY]);
    });

    interface RowsLayoutChangeCase {
      change: string;
      options: DataGridProperties;
      act: RowsChange;
    }

    it.each<RowsLayoutChangeCase>([
      {
        change: 'an inserted row',
        options: {},
        act: (instance): void => {
          instance.getDataSource().store().push([{
            type: 'insert',
            data: { id: ROWS.length, name: 'New row', price: 0 },
            index: UPDATED_ROW_KEY,
          }]);
        },
      },
      {
        change: 'an update that re-renders all rows',
        options: { repaintChangesOnly: false },
        act: pushUpdate,
      },
      {
        change: 'an update queued after a scroll',
        options: { height: 400, scrolling: { mode: 'virtual', renderAsync: true } },
        act: (instance): void => {
          // @ts-expect-error
          instance.getController('data').setViewportPosition(SCROLL_TOP);
          jest.runAllTimers();
          pushUpdate(instance);
        },
      },
    ])('should ignore downArrow pressed while $change is rendering', async ({ options, act }) => {
      const grid = await createGrid(options);
      focusCell(grid, FOCUSED_ROW_KEY, 1);
      changeRows(grid.instance, act);

      triggerKeyDown(grid.instance, 'downArrow', document.activeElement);
      jest.runAllTimers();
      grid.renderPendingTemplates();

      expect(grid.instance.option('focusedRowIndex')).toBe(FOCUSED_ROW_KEY);
      expect(getRowKey(document.activeElement)).toBe(FOCUSED_ROW_KEY);
    });

    it('should ignore downArrow pressed in a master row while its collapsed detail row is rendering', async () => {
      const grid = await createGrid({
        repaintChangesOnly: false,
        masterDetail: {
          enabled: true,
          template: (container: HTMLElement): void => { container.append('Detail'); },
        },
      });
      const expanding = grid.instance.expandRow(UPDATED_ROW_KEY);
      jest.runAllTimers();
      grid.renderPendingTemplates();
      await expanding;
      focusCell(grid, UPDATED_ROW_KEY, 1);
      changeRows(grid.instance, (instance): void => {
        instance.collapseRow(UPDATED_ROW_KEY).catch(() => {});
      });

      triggerKeyDown(grid.instance, 'downArrow', document.activeElement);
      jest.runAllTimers();
      grid.renderPendingTemplates();

      expect(grid.instance.option('focusedRowIndex')).toBe(UPDATED_ROW_KEY);
      expect(document.activeElement?.closest('tr')).toBe(grid.instance.getRowElement(UPDATED_ROW_KEY)?.[0]);
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
