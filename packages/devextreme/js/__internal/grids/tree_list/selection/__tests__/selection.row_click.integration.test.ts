import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import eventsEngine from '@ts/events/core/events_engine';
import { flushAsync } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from '../../__tests__/__mock__/helpers/utils';
import type { TreeListModel } from '../../__tests__/__mock__/model/tree_list';

const DATA = [
  { id: 1, parentId: 0, name: 'Parent' },
  { id: 2, parentId: 1, name: 'Child' },
];

const EXPAND_ICON_SELECTOR = '.dx-treelist-collapsed';
const INDENT_SELECTOR = '.dx-treelist-empty-space';
const TEXT_CONTENT_SELECTOR = '.dx-treelist-text-content';
const SELECT_CHECKBOX_SELECTOR = '.dx-select-checkbox';

const setupTreeList = (
  options: TreeListProperties,
): ReturnType<typeof createTreeList> => createTreeList({
  dataSource: DATA,
  columns: ['name'],
  ...options,
});

const click = (element: Element): void => {
  eventsEngine.trigger(element, 'dxpointerdown');
  eventsEngine.trigger(element, 'dxpointerup');
  eventsEngine.trigger(element, 'dxclick');
};

const findInFirstColumn = (
  component: TreeListModel,
  selector: string,
  rowIndex = 0,
): Element => {
  const element = component.getDataCell(rowIndex, 0).getElement()?.querySelector(selector);

  if (!element) {
    throw new Error(`${selector} is not rendered in row ${rowIndex}`);
  }

  return element;
};

const isRowClickHandled = (onRowClick: jest.Mock): boolean | undefined => {
  const [{ handled }] = onRowClick.mock.calls[0] as [{ handled?: boolean }];

  return handled;
};

describe('TreeList selection: row clicks', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  it('should select the row on a click on the cell text', async () => {
    const onRowClick = jest.fn();
    const { component, instance } = await setupTreeList({
      selection: { mode: 'single' },
      onRowClick,
    });

    click(findInFirstColumn(component, TEXT_CONTENT_SELECTOR));
    await flushAsync();

    expect(instance.getSelectedRowKeys()).toEqual([1]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(isRowClickHandled(onRowClick)).toBe(true);
  });

  it('should select the row on a click on the indent', async () => {
    const { component, instance } = await setupTreeList({
      selection: { mode: 'single' },
      expandedRowKeys: [1],
    });

    click(findInFirstColumn(component, INDENT_SELECTOR, 1));
    await flushAsync();

    expect(instance.getSelectedRowKeys()).toEqual([2]);
  });

  it('should expand the row without selecting it on a click on the expand icon', async () => {
    const onRowClick = jest.fn();
    const { component, instance } = await setupTreeList({
      selection: { mode: 'single' },
      onRowClick,
    });

    click(findInFirstColumn(component, EXPAND_ICON_SELECTOR));
    await flushAsync();

    expect(instance.isRowExpanded(1)).toBe(true);
    expect(instance.getSelectedRowKeys()).toEqual([]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(isRowClickHandled(onRowClick)).toBeUndefined();
  });

  it('should select the row without running the row click on a click on the select checkbox', async () => {
    const onRowClick = jest.fn();
    const { component, instance } = await setupTreeList({
      selection: { mode: 'multiple' },
      onRowClick,
    });

    click(findInFirstColumn(component, SELECT_CHECKBOX_SELECTOR));
    await flushAsync();

    expect(instance.getSelectedRowKeys()).toEqual([1]);
    expect(onRowClick).toHaveBeenCalledTimes(0);
  });
});
