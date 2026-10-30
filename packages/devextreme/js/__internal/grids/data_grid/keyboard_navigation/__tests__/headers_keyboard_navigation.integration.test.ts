import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import eventsEngine from '@js/common/core/events/core/events_engine';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import type { Properties as DataGridProperties } from '@js/ui/data_grid';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  afterTest,
  beforeTest,
  createDataGrid,
  flushAsync,
} from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import {
  getHeadersKeyboardNavigationController,
  triggerHeadersKeyDown,
} from '@ts/grids/grid_core/keyboard_navigation/__tests__/helpers/utils';
import { KEY_CODES } from '@ts/grids/grid_core/keyboard_navigation/const';

const GROUPED: DataGridProperties = {
  dataSource: [
    { id: 1, group: 'A', value: 10 },
    { id: 2, group: 'B', value: 20 },
  ],
  keyExpr: 'id',
  columns: ['id', { dataField: 'group', groupIndex: 0 }, 'value'],
};

const GROUP_KEYS = { ctrlKey: true, which: KEY_CODES.G };
const UNGROUP_ALL_KEYS = { shiftKey: true, altKey: true, which: KEY_CODES.G };

const getGroupedDataFields = (instance: DataGridInstance): string[] => ['id', 'group', 'value']
  .filter((dataField) => isDefined(instance.columnOption(dataField, 'groupIndex')));

const focusHeaderCell = (cell: HTMLElement | null): void => {
  // @ts-expect-error - eventsEngine.trigger is not fully typed
  eventsEngine.trigger($(cell), 'focusin');
};

describe('DataGrid headers keyboard navigation — grouping keys', () => {
  beforeEach(beforeTest);
  afterEach(() => {
    afterTest();
    jest.restoreAllMocks();
  });

  it('Shift+Alt+G in a filter row editor ungroups all columns and focuses the first header cell', async () => {
    // JSDOM has no layout: without client rects the grid isn't :visible,
    // so no resizeCompleted fires to restore the focus
    jest.spyOn(Element.prototype, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
    const { instance, component } = await createDataGrid({
      ...GROUPED,
      filterRow: { visible: true },
    });
    const editor = component.getFilterRow().getFilterCell(1).getElement()
      ?.querySelector('input') ?? null;
    editor?.focus();

    triggerHeadersKeyDown(instance, 'g', editor, UNGROUP_ALL_KEYS);
    await flushAsync();

    expect(instance.getVisibleRows().map(({ rowType }) => rowType)).toEqual(['data', 'data']);
    expect(document.activeElement).toBe(component.getHeaderCell(0).getElement());
  });

  it('Shift+Alt+G keeps focus on the focused header column', async () => {
    const { instance, component } = await createDataGrid(GROUPED);
    const valueHeaderCell = component.getHeaderCell(2).getElement();
    focusHeaderCell(valueHeaderCell);

    triggerHeadersKeyDown(instance, 'g', valueHeaderCell, UNGROUP_ALL_KEYS);
    await flushAsync();

    expect(getGroupedDataFields(instance)).toEqual([]);
    expect(getHeadersKeyboardNavigationController(instance)._getFocusedCell().text()).toBe('Value');
  });

  it('Ctrl+G outside a header cell groups no column', async () => {
    const { instance, $container } = await createDataGrid(GROUPED);
    const headersElement = $container.find('.dx-datagrid-headers').get(0) ?? null;

    triggerHeadersKeyDown(instance, 'g', headersElement, GROUP_KEYS);
    await flushAsync();

    expect(getGroupedDataFields(instance)).toEqual(['group']);
  });
});
