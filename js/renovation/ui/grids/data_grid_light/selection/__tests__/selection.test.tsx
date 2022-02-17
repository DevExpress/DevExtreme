import React from 'react';
import { mount } from 'enzyme';
import {
  ClearSelection, IsSelected, SelectableCount, SelectAll, SelectedCount, SetSelected,
} from '../plugins';
import {
  Selection, SelectionProps, viewFunction as SelectionView,
} from '../selection';
import {
  Items, KeyExprPlugin, VisibleColumns, VisibleItems,
} from '../../data_grid_light';
import { RowClassesGetter, RowPropertiesGetter } from '../../widgets/row_base';
import { RowClick } from '../../views/table_content';

describe('Selection', () => {
  describe('View', () => {
    it('should be empty', () => {
      const tree = mount(<SelectionView />);
      expect(tree.html()).toEqual('<div></div>');
    });
  });

  describe('Effects', () => {
    describe('watchKeyExpr', () => {
      it('should update keyExpr', () => {
        const selection = new Selection({});
        selection.plugins.set(KeyExprPlugin, 'some someId');
        selection.watchKeyExpr();

        expect(selection.keyExpr).toEqual('some someId');
      });
    });

    describe('addVisibleColumnsHandler', () => {
      it('should add checkboxes column (mode: single)', () => {
        const selection = new Selection({
          mode: 'single',
        });
        selection.addVisibleColumnsHandler();

        const visibleColumns = selection.plugins.getValue(VisibleColumns);
        expect(visibleColumns).toMatchObject([{
          cellTemplate: expect.any(Function),
        }]);
      });

      it('should add checkboxes column and select all checkbox (mode: multilpe)', () => {
        const selection = new Selection({
          mode: 'multiple',
          allowSelectAll: true,
        });
        selection.addVisibleColumnsHandler();

        const visibleColumns = selection.plugins.getValue(VisibleColumns);
        expect(visibleColumns).toMatchObject([{
          cellTemplate: expect.any(Function),
          headerTemplate: expect.any(Function),
        }]);
      });

      it('should not add checkboxes (mode: none)', () => {
        const selection = new Selection({
          mode: 'none',
        });
        selection.addVisibleColumnsHandler();

        const visibleColumns = selection.plugins.getValue(VisibleColumns);
        expect(visibleColumns).toEqual([]);
      });
    });

    describe('extendDataRowAttributes', () => {
      it('should add aria-selected', () => {
        const selection = new Selection({
          selectedRowKeys: [1],
        });
        selection.keyExpr = 'someId';
        selection.extendDataRowAttributes();

        const attrGetter = selection.plugins.getValue(RowPropertiesGetter)!;
        expect(attrGetter({ data: { someId: 1 }, rowType: 'data' })).toEqual({
          'aria-selected': true,
        });
        expect(attrGetter({ data: { someId: 2 }, rowType: 'data' })).toEqual({});
      });
    });

    describe('extendDataRowClasses', () => {
      it('should add aria-selected', () => {
        const selection = new Selection({
          selectedRowKeys: [1],
        });
        selection.keyExpr = 'someId';
        selection.extendDataRowClasses();

        const classesGetter = selection.plugins.getValue(RowClassesGetter)!;
        expect(classesGetter({ data: { someId: 1 }, rowType: 'data' })).toEqual({
          'dx-selection': true,
        });
        expect(classesGetter({ data: { someId: 2 }, rowType: 'data' })).toEqual({});
      });
    });

    describe('setRowClickEvent', () => {
      it('should invert selection', () => {
        const selection = new Selection(new SelectionProps());
        selection.keyExpr = 'someId';

        selection.setRowClickEvent();
        const invert = selection.plugins.getValue(RowClick)!;

        expect(selection.props.selectedRowKeys).toEqual([]);
        invert({ data: { someId: 1 }, rowType: 'data' });
        expect(selection.props.selectedRowKeys).toEqual([1]);
        invert({ data: { someId: 1 }, rowType: 'data' });
        expect(selection.props.selectedRowKeys).toEqual([]);
      });
    });

    describe('addPluginMethods', () => {
      it('should set methods', () => {
        const selection = new Selection({});
        selection.addPluginMethods();

        expect(selection.plugins.getValue(SetSelected)).toBe(selection.setSelected);
        expect(selection.plugins.getValue(IsSelected)).toBe(selection.isSelected);
        expect(selection.plugins.getValue(ClearSelection)).toBe(selection.clearSelection);
        expect(selection.plugins.getValue(SelectAll)).toBe(selection.selectAll);
      });
    });

    describe('addPluginValues', () => {
      it('should set methods', () => {
        const selection = new Selection(new SelectionProps());
        selection.addPluginValues();

        expect(selection.plugins.getValue(SelectedCount)).toBe(0);
        expect(selection.plugins.getValue(SelectableCount)).toBe(0);
      });
    });
  });

  describe('Methods', () => {
    describe('clearSelection', () => {
      it('should clear selectedRowKeys', () => {
        const selection = new Selection({
          selectedRowKeys: [1, 2, 3],
        });

        selection.clearSelection();
        expect(selection.props.selectedRowKeys).toHaveLength(0);
      });
    });

    describe('selectAll', () => {
      const items = [
        { someId: 1 },
        { someId: 2 },
        { someId: 3 },
        { someId: 4 },
      ];
      const visibleItems = items.slice(1, 3);

      const selection = new Selection({});
      selection.keyExpr = 'someId';
      selection.plugins.set(Items, items);
      selection.plugins.extend(VisibleItems, -1, () => visibleItems);

      it('should work in "allPages" mode', () => {
        selection.props.selectAllMode = 'allPages';
        selection.selectAll();

        expect(selection.props.selectedRowKeys).toEqual([1, 2, 3, 4]);
      });

      it('should work in "page" mode', () => {
        selection.props.selectAllMode = 'page';
        selection.selectAll();

        expect(selection.props.selectedRowKeys).toEqual([2, 3]);
      });
    });

    describe('isSelected', () => {
      it('should work', () => {
        const selection = new Selection({
          selectedRowKeys: [2, 3],
        });
        selection.keyExpr = 'someId';

        expect(selection.isSelected({ someId: 1 })).toEqual(false);
        expect(selection.isSelected({ someId: 2 })).toEqual(true);
        expect(selection.isSelected({ someId: 3 })).toEqual(true);
        expect(selection.isSelected({ someId: 4 })).toEqual(false);
      });
    });

    describe('setSelected', () => {
      it('should work with "multiple" mode', () => {
        const selection = new Selection({
          mode: 'multiple',
          selectedRowKeys: [],
        });
        selection.keyExpr = 'someId';

        selection.setSelected({ someId: 1 }, true);
        selection.setSelected({ someId: 2 }, true);
        expect(selection.props.selectedRowKeys).toEqual([1, 2]);

        selection.setSelected({ someId: 1 }, false);
        expect(selection.props.selectedRowKeys).toEqual([2]);
      });

      it('should work with "single" mode', () => {
        const selection = new Selection({
          mode: 'single',
          selectedRowKeys: [],
        });
        selection.keyExpr = 'someId';

        selection.setSelected({ someId: 1 }, true);
        selection.setSelected({ someId: 2 }, true);
        expect(selection.props.selectedRowKeys).toEqual([2]);

        selection.setSelected({ someId: 2 }, false);
        expect(selection.props.selectedRowKeys).toEqual([]);
      });
    });

    describe('selectableCount', () => {
      const items = [
        { key: 1, data: { someId: 1 }, rowType: 'data' },
        { key: 2, data: { someId: 2 }, rowType: 'data' },
        { key: 3, data: { someId: 3 }, rowType: 'data' },
        { key: 4, data: { someId: 4 }, rowType: 'data' },
      ];
      const visibleItems = items.slice(1, 3);

      const selection = new Selection({});
      selection.keyExpr = 'someId';
      selection.plugins.set(Items, items);
      selection.plugins.extend(VisibleItems, -1, () => visibleItems);

      it('should work in "allPages" mode', () => {
        selection.props.selectAllMode = 'allPages';
        expect(selection.selectableCount()).toEqual(4);
      });

      it('should work in "page" mode', () => {
        selection.props.selectAllMode = 'page';
        expect(selection.selectableCount()).toEqual(2);
      });
    });
  });
});
