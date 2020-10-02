import React, { createRef } from 'react';
import { mount } from 'enzyme';
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import each from 'jest-each';
import { DataGrid, viewFunction as DataGridView } from '../data_grid';
import { DataGridProps } from '../props';
import LegacyDataGrid from '../../../../ui/data_grid/ui.data_grid';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';

const mockDispose = jest.fn();
const mockOption = jest.fn();

const mockDataGridMethods = {
  dispose: mockDispose,
  option: mockOption,
};

jest.mock('../../../../ui/data_grid/ui.data_grid', () => {
  const MockDxDataGrid = jest.fn().mockImplementation(() => mockDataGridMethods);
  return MockDxDataGrid;
});

const createWidget = () => {
  const component = new DataGrid({});
  return component;
};

describe('DataGrid', () => {
  describe('View', () => {
    it('default render', () => {
      const domComponentRef: any = createRef();
      const props = {
        props: new DataGridProps(),
        domComponentRef,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<DataGrid>;
      const tree = mount(<DataGridView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps: props.props,
        componentType: LegacyDataGrid,
        'rest-attributes': 'true',
      });
      expect(tree.find(DomComponentWrapper).instance()).toBe(domComponentRef.current);
    });
  });

  describe('Logic', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    each`
      methodName
      ${'beginCustomLoading'}
      ${'byKey'}
      ${'cancelEditData'}
      ${'cellValue'}
      ${'clearFilter'}
      ${'clearSelection'}
      ${'clearSorting'}
      ${'closeEditCell'}
      ${'collapseAdaptiveDetailRow'}
      ${'columnCount'}
      ${'columnOption'}
      ${'deleteColumn'}
      ${'deleteRow'}
      ${'deselectAll'}
      ${'deselectRows'}
      ${'editCell'}
      ${'editRow'}
      ${'endCustomLoading'}
      ${'expandAdaptiveDetailRow'}
      ${'filter'}
      ${'focus'}
      ${'getCellElement'}
      ${'getCombinedFilter'}
      ${'getDataSource'}
      ${'getKeyByRowIndex'}
      ${'getRowElement'}
      ${'getRowIndexByKey'}
      ${'getScrollable'}
      ${'getVisibleColumnIndex'}
      ${'hasEditData'}
      ${'hideColumnChooser'}
      ${'isAdaptiveDetailRowExpanded'}
      ${'isRowFocused'}
      ${'isRowSelected'}
      ${'keyOf'}
      ${'navigateToRow'}
      ${'pageCount'}
      ${'pageIndex'}
      ${'pageSize'}
      ${'refresh'}
      ${'repaintRows'}
      ${'saveEditData'}
      ${'searchByText'}
      ${'selectAll'}
      ${'selectRows'}
      ${'selectRowsByIndexes'}
      ${'showColumnChooser'}
      ${'undeleteRow'}
      ${'updateDimensions'}
      ${'addColumn'}
      ${'addRow'}
      ${'clearGrouping'}
      ${'collapseAll'}
      ${'collapseRow'}
      ${'expandAll'}
      ${'expandRow'}
      ${'exportToExcel'}
      ${'getSelectedRowKeys'}
      ${'getSelectedRowsData'}
      ${'getTotalSummaryValue'}
      ${'getVisibleColumns'}
      ${'getVisibleRows'}
      ${'isRowExpanded'}
      ${'totalCount'}
      ${'getController'}
    `
      .describe('Methods', ({
        methodName,
      }) => {
        it(methodName, () => {
          mockDataGridMethods[methodName] = jest.fn();
          const component = createWidget();
          component.domComponentRef = { getInstance: () => mockDataGridMethods } as any;

          component[methodName]();

          expect(mockDataGridMethods[methodName]).toHaveBeenCalled();
        });

        it(`${methodName} if widget is not initialized`, () => {
          const component = createWidget();
          component.domComponentRef = { getInstance: () => null } as any;
          component[methodName]();

          expect.assertions(0);
        });
      });
  });
});
