import {
  AddSelectionColumnToVisibleColumns,
  AddSelectionToRowClasses,
  AddSelectionToRowProperties,
  AllowSelectAllValue,
  ClearSelection,
  IsSelected,
  SelectableCount,
  SelectableItems,
  SelectAll,
  SelectAllCheckboxTemplate,
  SelectAllModeValue,
  SelectedCount,
  SelectedRowKeys,
  SelectionCheckboxTemplate,
  SelectionModeValue,
  SetSelected,
  SetSelectedRowKeys,
  ToggleSelected,
} from '../plugins';
import {
  LocalData, KeyExprPlugin, VisibleColumns, LocalVisibleItems,
} from '../../plugins';
import { Plugins } from '../../../../../utils/plugin/context';
import { generateData } from '../../__tests__/test_data';

describe('Selection', () => {
  describe('Selectors', () => {
    const plugins = new Plugins();
    plugins.extend(VisibleColumns, -1, () => []);

    const selectionCheckboxTemplate = jest.fn();
    const selectAllCheckboxTemplate = jest.fn();

    beforeEach(() => {
      plugins.set(KeyExprPlugin, 'id');
      plugins.set(SelectionModeValue, 'single');
      plugins.set(AllowSelectAllValue, false);
      plugins.set(SelectionCheckboxTemplate, selectionCheckboxTemplate);
      plugins.set(SelectAllCheckboxTemplate, selectAllCheckboxTemplate);
    });

    describe('AddSelectionColumnToVisibleColumns', () => {
      it('should add checkboxes column (mode: single)', () => {
        plugins.set(SelectionModeValue, 'single');
        plugins.set(AllowSelectAllValue, false);

        expect(plugins.getValue(AddSelectionColumnToVisibleColumns)).toEqual([{
          cellTemplate: selectionCheckboxTemplate,
        }]);
      });

      it('should add checkboxes column and select all checkbox (mode: multilpe)', () => {
        plugins.set(SelectionModeValue, 'multiple');
        plugins.set(AllowSelectAllValue, true);

        expect(plugins.getValue(AddSelectionColumnToVisibleColumns)).toEqual([{
          cellTemplate: selectionCheckboxTemplate,
          headerTemplate: selectAllCheckboxTemplate,
        }]);
      });

      it('should not add checkboxes (mode: none)', () => {
        plugins.set(SelectionModeValue, 'none');

        expect(plugins.getValue(AddSelectionColumnToVisibleColumns)).toEqual([]);
      });
    });

    describe('AddSelectionToRowProperties', () => {
      it('should add aria-selected', () => {
        plugins.set(SelectedRowKeys, [1]);

        const attrGetter = plugins.getValue(AddSelectionToRowProperties)!;
        expect(attrGetter({ data: { id: 1 }, rowType: 'data' })).toEqual({
          'aria-selected': true,
        });
        expect(attrGetter({ data: { id: 2 }, rowType: 'data' })).toEqual({});
      });
    });

    describe('AddSelectionToRowClasses', () => {
      it('should add aria-selected', () => {
        plugins.set(SelectedRowKeys, [1]);

        const classesGetter = plugins.getValue(AddSelectionToRowClasses)!;
        expect(classesGetter({ data: { id: 1 }, rowType: 'data' })).toEqual({
          'dx-selection': true,
        });
        expect(classesGetter({ data: { id: 2 }, rowType: 'data' })).toEqual({});
      });
    });

    describe('SelectedCount', () => {
      it('should be selectedRowKeys count', () => {
        plugins.set(SelectedRowKeys, [1, 2]);

        expect(plugins.getValue(SelectedCount)).toBe(2);
      });
    });

    describe('SelectableCount', () => {
      it('should be selectableItems count', () => {
        plugins.set(SelectableItems, generateData(5));

        expect(plugins.getValue(SelectableCount)).toBe(5);
      });
    });
  });

  describe('Actions', () => {
    const plugins = new Plugins();

    beforeEach(() => {
      plugins.set(KeyExprPlugin, 'id');
      plugins.set(SelectionModeValue, 'single');
      plugins.set(AllowSelectAllValue, false);
    });

    describe('ClearSelection', () => {
      it('should clear selectedRowKeys', () => {
        const setSelectedRowKeysMock = jest.fn();
        plugins.set(SetSelectedRowKeys, setSelectedRowKeysMock);

        plugins.callAction(ClearSelection);

        expect(setSelectedRowKeysMock).toHaveBeenCalledWith([]);
      });
    });

    describe('selectAll', () => {
      const items = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ];
      const visibleItems = items.slice(2, 4);

      plugins.set(LocalData, items);
      const disposeVisibleItems = plugins.extend(LocalVisibleItems, -1, () => visibleItems);

      afterAll(() => {
        disposeVisibleItems();
      });

      it('should work in "allPages" mode', () => {
        const setSelectedRowKeysMock = jest.fn();
        plugins.set(SelectAllModeValue, 'allPages');
        plugins.set(SetSelectedRowKeys, setSelectedRowKeysMock);

        plugins.callAction(SelectAll);

        expect(setSelectedRowKeysMock).toHaveBeenCalledWith([1, 2, 3, 4]);
      });

      it('should work in "page" mode', () => {
        const setSelectedRowKeysMock = jest.fn();
        plugins.set(SelectAllModeValue, 'page');
        plugins.set(SetSelectedRowKeys, setSelectedRowKeysMock);

        plugins.callAction(SelectAll);

        expect(setSelectedRowKeysMock).toHaveBeenCalledWith([3, 4]);
      });
    });

    describe('IsSelected', () => {
      it('should work', () => {
        plugins.set(SelectedRowKeys, [2, 3]);

        expect(plugins.callAction(IsSelected, { id: 1 })).toEqual(false);
        expect(plugins.callAction(IsSelected, { id: 2 })).toEqual(true);
        expect(plugins.callAction(IsSelected, { id: 3 })).toEqual(true);
        expect(plugins.callAction(IsSelected, { id: 4 })).toEqual(false);
      });
    });

    describe('SetSelected', () => {
      beforeEach(() => {
        plugins.set(SelectedRowKeys, []);
        plugins.set(SetSelectedRowKeys, (keys) => {
          plugins.set(SelectedRowKeys, keys);
        });
      });

      it('should work with "multiple" mode', () => {
        plugins.set(SelectionModeValue, 'multiple');

        plugins.callAction(SetSelected, { id: 1 }, true);
        plugins.callAction(SetSelected, { id: 2 }, true);
        expect(plugins.getValue(SelectedRowKeys)).toEqual([1, 2]);

        plugins.callAction(SetSelected, { id: 1 }, false);
        expect(plugins.getValue(SelectedRowKeys)).toEqual([2]);
      });

      it('should work with "single" mode', () => {
        plugins.set(SelectionModeValue, 'single');

        plugins.callAction(SetSelected, { id: 1 }, true);
        plugins.callAction(SetSelected, { id: 2 }, true);
        expect(plugins.getValue(SelectedRowKeys)).toEqual([2]);

        plugins.callAction(SetSelected, { id: 1 }, false);
        expect(plugins.getValue(SelectedRowKeys)).toEqual([2]);
      });
    });

    describe('ToggleSelected', () => {
      beforeEach(() => {
        plugins.set(SelectionModeValue, 'multiple');
        plugins.set(SetSelectedRowKeys, (keys) => {
          plugins.set(SelectedRowKeys, keys);
        });
      });

      it('should select unselected item', () => {
        plugins.set(SelectedRowKeys, []);
        plugins.callAction(ToggleSelected, { id: 1 });
        plugins.callAction(ToggleSelected, { id: 2 });
        expect(plugins.getValue(SelectedRowKeys)).toEqual([1, 2]);
      });

      it('should unselect selected item', () => {
        plugins.set(SelectedRowKeys, [1, 2]);

        plugins.callAction(ToggleSelected, { id: 1 });
        expect(plugins.getValue(SelectedRowKeys)).toEqual([2]);
      });

      it('should not select item if mode is none', () => {
        plugins.set(SelectionModeValue, 'none');
        plugins.set(SelectedRowKeys, []);
        plugins.callAction(ToggleSelected, { id: 1 });
        expect(plugins.getValue(SelectedRowKeys)).toEqual([]);
      });
    });

    describe('SelectableCount', () => {
      const items = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ];
      const visibleItems = items.slice(2, 4);

      plugins.set(LocalData, items);
      const disposeVisibleItems = plugins.extend(LocalVisibleItems, -1, () => visibleItems);

      afterAll(() => {
        disposeVisibleItems();
      });

      it('should work in "allPages" mode', () => {
        plugins.set(SelectAllModeValue, 'allPages');
        expect(plugins.getValue(SelectableCount)).toEqual(4);
      });

      it('should work in "page" mode', () => {
        plugins.set(SelectAllModeValue, 'page');
        expect(plugins.getValue(SelectableCount)).toEqual(2);
      });
    });
  });
});
