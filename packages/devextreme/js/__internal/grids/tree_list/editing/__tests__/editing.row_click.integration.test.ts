import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { Properties as TreeListProperties } from '@js/ui/tree_list';
import eventsEngine from '@ts/events/core/events_engine';
import { flushAsync } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';
import { TARGET_COMPONENT_NAME } from '@ts/grids/grid_core/editing/const';

import {
  afterTest,
  beforeTest,
  createTreeList,
} from '../../__tests__/__mock__/helpers/utils';
import type { TreeListModel } from '../../__tests__/__mock__/model/tree_list';

const DATA = [
  {
    id: 1, parentId: 0, name: 'Parent', note: 'A',
  },
  {
    id: 2, parentId: 1, name: 'Child', note: 'B',
  },
];

const EXPAND_ICON_SELECTOR = '.dx-treelist-collapsed';
const INDENT_SELECTOR = '.dx-treelist-empty-space';
const TEXT_CONTENT_SELECTOR = '.dx-treelist-text-content';
const SELECT_CHECKBOX_SELECTOR = '.dx-select-checkbox';

const setupTreeList = (
  startEditAction: 'click' | 'dblClick',
  options: TreeListProperties = {},
): ReturnType<typeof createTreeList> => createTreeList({
  dataSource: DATA,
  columns: ['name', 'note'],
  editing: {
    mode: 'batch',
    allowUpdating: true,
    startEditAction,
  },
  ...options,
});

const click = (element: Element): void => {
  eventsEngine.trigger(element, 'dxpointerdown');
  eventsEngine.trigger(element, 'dxpointerup');
  eventsEngine.trigger(element, 'dxclick');
};

const dblClick = (element: Element): void => {
  eventsEngine.trigger(element, 'dxdblclick');
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

const isEventMarkedWith = (handler: jest.Mock, component: unknown): boolean => {
  const [{ event }] = handler.mock.calls[0] as [{ event: Record<string, unknown> }];

  return event[TARGET_COMPONENT_NAME] === component;
};

describe('TreeList editing: row clicks', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('click (startEditAction: click)', () => {
    it('should expand the row without starting editing on a click on the expand icon', async () => {
      const onRowClick = jest.fn();
      const { component, instance } = await setupTreeList('click', { onRowClick });

      click(findInFirstColumn(component, EXPAND_ICON_SELECTOR));
      await flushAsync();

      expect(instance.isRowExpanded(1)).toBe(true);
      expect(instance.option('editing.editColumnName')).toBeUndefined();
      expect(onRowClick).toHaveBeenCalledTimes(1);
      expect(isEventMarkedWith(onRowClick, instance)).toBe(false);
    });

    it('should run the row click without starting editing on a click on the indent', async () => {
      const onRowClick = jest.fn();
      const { component, instance } = await setupTreeList('click', {
        expandedRowKeys: [1],
        onRowClick,
      });

      click(findInFirstColumn(component, INDENT_SELECTOR, 1));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
      expect(onRowClick).toHaveBeenCalledTimes(1);
    });

    it('should start editing on a click on the cell text next to the expand icon', async () => {
      const onRowClick = jest.fn();
      const { component } = await setupTreeList('click', { onRowClick });

      click(findInFirstColumn(component, TEXT_CONTENT_SELECTOR));
      await flushAsync();

      expect(component.getDataCell(0, 0).isEditCell).toBe(true);
      expect(onRowClick).not.toHaveBeenCalled();
    });

    it('should mark the event with the component on a click on a read-only cell', async () => {
      const onRowClick = jest.fn();
      const { component, instance } = await setupTreeList('click', {
        columns: ['name', { dataField: 'note', allowEditing: false }],
        onRowClick,
      });

      click(component.getDataCell(0, 1).getElement() as Element);
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
      expect(onRowClick).toHaveBeenCalledTimes(1);
      expect(isEventMarkedWith(onRowClick, instance)).toBe(true);
    });

    it('should neither start editing nor run the row click on a click on the select checkbox', async () => {
      const onRowClick = jest.fn();
      const { component, instance } = await setupTreeList('click', {
        onRowClick,
        selection: { mode: 'multiple' },
      });

      click(findInFirstColumn(component, SELECT_CHECKBOX_SELECTOR));
      await flushAsync();

      expect(instance.isRowSelected(1)).toBe(true);
      expect(instance.option('editing.editColumnName')).toBeUndefined();
      expect(onRowClick).not.toHaveBeenCalled();
    });
  });

  describe('double-click (startEditAction: dblClick)', () => {
    it('should not start editing on a double-click on the expand icon', async () => {
      const onRowDblClick = jest.fn();
      const { component, instance } = await setupTreeList('dblClick', { onRowDblClick });

      dblClick(findInFirstColumn(component, EXPAND_ICON_SELECTOR));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
      expect(onRowDblClick).toHaveBeenCalledTimes(1);
    });

    it('should start editing on a double-click on the cell text next to the expand icon', async () => {
      const onRowDblClick = jest.fn();
      const { component } = await setupTreeList('dblClick', { onRowDblClick });

      dblClick(findInFirstColumn(component, TEXT_CONTENT_SELECTOR));
      await flushAsync();

      expect(component.getDataCell(0, 0).isEditCell).toBe(true);
      expect(onRowDblClick).not.toHaveBeenCalled();
    });

    it('should neither start editing nor run the row double-click on a double-click on the select checkbox', async () => {
      const onRowDblClick = jest.fn();
      const { component, instance } = await setupTreeList('dblClick', {
        onRowDblClick,
        selection: { mode: 'multiple' },
      });

      dblClick(findInFirstColumn(component, SELECT_CHECKBOX_SELECTOR));
      await flushAsync();

      expect(instance.option('editing.editColumnName')).toBeUndefined();
      expect(onRowDblClick).not.toHaveBeenCalled();
    });
  });
});
