import React from 'react';
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
  (MockDxDataGrid as any).getInstance = () => mockDataGridMethods;
  return MockDxDataGrid;
});

const createWidget = () => {
  const component = new DataGrid({});
  component.widgetRef = {} as HTMLDivElement;
  return component;
};

describe('DataGrid', () => {
  describe('View', () => {
    it('default render', () => {
      const widgetRef = React.createRef();
      const props = {
        props: new DataGridProps(),
        widgetRef,
        restAttributes: { 'rest-attributes': 'true' },
      } as any as Partial<DataGrid>;
      const tree = mount(<DataGridView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        rootElementRef: widgetRef,
        componentProps: props.props,
        componentType: LegacyDataGrid,
        'rest-attributes': 'true',
      });
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

          component[methodName]();

          expect(mockDataGridMethods[methodName]).toHaveBeenCalled();
        });

        it(`${methodName} if widget is not initialized`, () => {
          const component = createWidget();

          component[methodName]();

          expect.assertions(0);
        });
      });
  });
});
