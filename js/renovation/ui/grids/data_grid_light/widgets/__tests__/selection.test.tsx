import React from 'react';
import { mount } from 'enzyme';
import {
  Selection, SelectionProps, viewFunction as SelectionView,
} from '../selection';
import {
  DataSource, KeyExprPlugin, VisibleColumns, VisibleItems,
} from '../../data_grid_light';
import { DataRowClassesGetter, DataRowPropertiesGetter } from '../data_row';
import { RowClick } from '../../views/table_content';

describe('Paging', () => {
  describe('View', () => {
    it('should be empty', () => {
      const tree = mount(<SelectionView />);
      expect(tree.html()).toEqual(null);
    });
  });

  describe('Effects', () => {
    describe('watchKeyExpr', () => {
      it('should update keyExpr', () => {
        const selection = new Selection({});
        selection.plugins.set(KeyExprPlugin, 'some id');
        selection.watchKeyExpr();

        expect(selection.keyExpr).toEqual('some id');
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
        selection.keyExpr = 'id';
        selection.extendDataRowAttributes();

        const attrGetter = selection.plugins.getValue(DataRowPropertiesGetter);
        expect(attrGetter({ id: 1 })).toEqual({
          'aria-selected': true,
        });
        expect(attrGetter({ id: 2 })).toEqual({});
      });
    });

    describe('extendDataRowClasses', () => {
      it('should add aria-selected', () => {
        const selection = new Selection({
          selectedRowKeys: [1],
        });
        selection.keyExpr = 'id';
        selection.extendDataRowClasses();

        const classesGetter = selection.plugins.getValue(DataRowClassesGetter);
        expect(classesGetter({ id: 1 })).toEqual({
          'dx-selection': true,
        });
        expect(classesGetter({ id: 2 })).toEqual({});
      });
    });

    describe('setRowClickEvent', () => {
      it('should invert selection', () => {
        const selection = new Selection(new SelectionProps());
        selection.keyExpr = 'id';

        selection.setRowClickEvent();
        const invert = selection.plugins.getValue(RowClick);

        expect(selection.props.selectedRowKeys).toEqual([]);
        invert({ id: 1 });
        expect(selection.props.selectedRowKeys).toEqual([1]);
        invert({ id: 1 });
        expect(selection.props.selectedRowKeys).toEqual([]);
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
      const dataSource = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const visibleItems = dataSource.slice(1, 3);

      const selection = new Selection({});
      selection.keyExpr = 'id';
      selection.plugins.set(DataSource, dataSource);
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
        selection.keyExpr = 'id';

        expect(selection.isSelected({ id: 1 })).toEqual(false);
        expect(selection.isSelected({ id: 2 })).toEqual(true);
        expect(selection.isSelected({ id: 3 })).toEqual(true);
        expect(selection.isSelected({ id: 4 })).toEqual(false);
      });
    });

    describe('setSelected', () => {
      it('should work with "multiple" mode', () => {
        const selection = new Selection({
          mode: 'multiple',
          selectedRowKeys: [],
        });
        selection.keyExpr = 'id';

        selection.setSelected({ id: 1 }, true);
        selection.setSelected({ id: 2 }, true);
        expect(selection.props.selectedRowKeys).toEqual([1, 2]);

        selection.setSelected({ id: 1 }, false);
        expect(selection.props.selectedRowKeys).toEqual([2]);
      });

      it('should work with "single" mode', () => {
        const selection = new Selection({
          mode: 'single',
          selectedRowKeys: [],
        });
        selection.keyExpr = 'id';

        selection.setSelected({ id: 1 }, true);
        selection.setSelected({ id: 2 }, true);
        expect(selection.props.selectedRowKeys).toEqual([2]);

        selection.setSelected({ id: 2 }, false);
        expect(selection.props.selectedRowKeys).toEqual([]);
      });
    });

    describe('selectableCount', () => {
      const dataSource = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const visibleItems = dataSource.slice(1, 3);

      const selection = new Selection({});
      selection.keyExpr = 'id';
      selection.plugins.set(DataSource, dataSource);
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
