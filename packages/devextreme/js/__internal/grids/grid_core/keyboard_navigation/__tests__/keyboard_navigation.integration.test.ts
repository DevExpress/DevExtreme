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

  describe('from focused expand command cell with batch editing (T1322130)', () => {
    const DATA_SOURCE = [
      { id: 1, name: 'Item 1', group: 'A' },
      { id: 2, name: 'Item 2', group: 'A' },
      { id: 3, name: 'Item 3', group: 'B' },
      { id: 4, name: 'Item 4', group: 'B' },
      { id: 5, name: 'Item 5', group: 'C' },
    ];

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

        const controller = getKeyboardNavigationController(instance);
        const prevRowIndex = controller._focusedCellPosition.rowIndex;

        expect(() => {
          triggerKeyDown(instance, key);
          jest.runAllTimers();
        }).not.toThrow();

        const currentRowIndex = controller._focusedCellPosition.rowIndex;

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

    it.each<{ mode: SelectionMode, key: KeyboardNavKey }>([
      { mode: 'multiple', key: 'upArrow' },
      { mode: 'multiple', key: 'downArrow' },
      { mode: 'single', key: 'upArrow' },
      { mode: 'single', key: 'downArrow' },
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
});
