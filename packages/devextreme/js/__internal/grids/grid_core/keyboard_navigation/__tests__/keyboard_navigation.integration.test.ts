import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import {
  afterTest,
  beforeTest,
  createDataGrid,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import type { NAV_KEYS } from './helpers/const';
import {
  getKeyboardNavigationController,
  triggerKeyDown,
  triggerPointerDown,
} from './helpers/utils';

type KeyboardNavKey = keyof typeof NAV_KEYS;
type SelectionMode = 'single' | 'multiple' | 'none';

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

    it.each<{ mode: SelectionMode, key: KeyboardNavKey }>([
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
    it.each<{ mode: SelectionMode, key: KeyboardNavKey }>([
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
});
