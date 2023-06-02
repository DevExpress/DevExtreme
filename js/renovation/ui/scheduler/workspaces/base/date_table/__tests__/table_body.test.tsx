import React from 'react';
import { shallow } from 'enzyme';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../consts';
import { DateTableBody, DateTableBodyProps, viewFunction as TableBodyView } from '../table_body';
import { Row } from '../../row';
import { AllDayPanelTableBody } from '../all_day_panel/table_body';
import * as combineClassesUtils from '../../../../../../utils/combine_classes';

const combineClasses = jest.spyOn(combineClassesUtils, 'combineClasses');

describe('DateTableBody', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [{
          cells: [{
            startDate: new Date(2020, 6, 9, 0),
            endDate: new Date(2020, 6, 9, 0, 30),
            groups: { id: 1 },
            groupIndex: 1,
            index: 4,
            isFirstGroupCell: true,
            isLastGroupCell: false,
            key: 3,
            text: 'test 1',
            today: true,
            otherMonth: true,
            firstDayOfMonth: true,
            isSelected: true,
            isFocused: false,
          }],
          key: 0,
        }, {
          cells: [{
            startDate: new Date(2020, 6, 9, 1),
            endDate: new Date(2020, 6, 9, 1, 30),
            groups: { id: 2 },
            groupIndex: 2,
            index: 5,
            isFirstGroupCell: false,
            isLastGroupCell: false,
            key: 6,
            text: 'test 2',
            today: false,
            otherMonth: false,
            firstDayOfMonth: true,
            isSelected: true,
            isFocused: true,
          }],
          key: 1,
        }, {
          cells: [{
            startDate: new Date(2020, 6, 9, 2),
            endDate: new Date(2020, 6, 9, 2, 30),
            groups: { id: 3 },
            groupIndex: 3,
            index: 6,
            isFirstGroupCell: false,
            isLastGroupCell: true,
            key: 9,
            text: 'test 3',
            today: false,
            otherMonth: false,
            firstDayOfMonth: false,
            isSelected: false,
            isFocused: false,
          }],
          key: 2,
        }],
        allDayPanel: [{ startDate: new Date(), key: '1' }],
        groupIndex: 1,
        key: '1',
        isGroupedAllDayPanel: true,
      }],
      leftVirtualCellWidth: 100,
      rightVirtualCellWidth: 200,
      leftVirtualCellCount: 2,
      rightVirtualCellCount: 21,
    };
    const cellTemplate = () => null;

    const render = (viewModel) => shallow(
      <TableBodyView
        rowClasses="dx-scheduler-date-table-row"
        {...viewModel}
        props={{
          ...new DateTableBodyProps(),
          viewData,
          cellTemplate,
          groupOrientation: VERTICAL_GROUP_ORIENTATION,
          ...viewModel.props,
        }}
      /> as any,
    );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render rows and pass correct props to them', () => {
      const rows = render({}).find(Row);

      expect(rows)
        .toHaveLength(3);

      rows.forEach((row) => {
        expect(row.props())
          .toEqual({
            className: 'dx-scheduler-date-table-row',
            leftVirtualCellWidth: 100,
            rightVirtualCellWidth: 200,
            leftVirtualCellCount: 2,
            rightVirtualCellCount: 21,
            children: expect.anything(),
            isHeaderRow: false,
          });
      });
    });

    it('should render cells and pass correct props to them', () => {
      const dataCellTemplate = () => null;
      const tableBody = render({
        props: { dataCellTemplate },
      });

      const assert = (
        cells: any,
        rowIndex: number,
      ): void => {
        const cell = cells.at(rowIndex);
        const data = viewData.groupedData[0].dateTable[rowIndex].cells[0];
        const {
          startDate,
          endDate,
          groups,
          groupIndex,
          index,
          text,
          today,
          otherMonth,
          firstDayOfMonth,
          isFirstGroupCell,
          isLastGroupCell,
          key,
          isFocused,
          isSelected,
        } = data;

        expect(cell.props())
          .toMatchObject({
            startDate,
            endDate,
            groups,
            groupIndex,
            index,
            text,
            today,
            otherMonth,
            firstDayOfMonth,
            isFirstGroupCell,
            isLastGroupCell,
            dataCellTemplate,
            isFocused,
            isSelected,
          });
        expect(cell.key())
          .toBe(key.toString());
      };

      const cells = tableBody.find(cellTemplate);
      expect(cells)
        .toHaveLength(3);

      assert(cells, 0);
      assert(cells, 1);
      assert(cells, 2);
    });

    it('should pass correct keys to rows depending on "leftVirtualCellCount"', () => {
      const tableBody = render({});

      const rows = tableBody.find(Row);

      expect(rows.length)
        .toBe(3);

      expect(rows.at(0).key())
        .toBe('0');
      expect(rows.at(1).key())
        .toBe('1');
      expect(rows.at(2).key())
        .toBe('2');
    });

    it('should render AllDayPanelBody and pass correct arguments to it', () => {
      const dataCellTemplate = () => null;
      const tableBody = render({
        props: {
          dataCellTemplate,
        },
      });

      const allDayPanelTableBody = tableBody.find(AllDayPanelTableBody);
      expect(allDayPanelTableBody.exists())
        .toBe(true);

      expect(allDayPanelTableBody.props())
        .toMatchObject({
          viewData: viewData.groupedData[0].allDayPanel,
          dataCellTemplate,
          isVerticalGroupOrientation: true,
          leftVirtualCellWidth: 100,
          rightVirtualCellWidth: 200,
        });

      expect(allDayPanelTableBody.props())
        .toMatchObject({
          viewData: viewData.groupedData[0].allDayPanel,
          dataCellTemplate,
          isVerticalGroupOrientation: true,
        });
    });

    [true, false].forEach((isGroupedAllDayPanel) => {
      it(`should render AllDayPanelBody correctly when isGroupedAllDayPanel=${isGroupedAllDayPanel}`, () => {
        const testViewData = {
          ...viewData,
          groupedData: [{
            ...viewData.groupedData[0],
            isGroupedAllDayPanel,
          }],
        };

        const tableBody = render({ props: { viewData: testViewData } });

        const allDayPanelTableBody = tableBody.find(AllDayPanelTableBody);
        expect(allDayPanelTableBody.exists())
          .toBe(isGroupedAllDayPanel);
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('rowClasses', () => {
        it('should call combine classes with correct parameters', () => {
          const tableBody = new DateTableBody({
            addVerticalSizesClassToRows: true,
          } as any);

          expect(tableBody.rowClasses)
            .toBe('dx-scheduler-date-table-row dx-scheduler-cell-sizes-vertical');

          expect(combineClasses)
            .toHaveBeenCalledWith({
              'dx-scheduler-date-table-row': true,
              'dx-scheduler-cell-sizes-vertical': true,
            });
        });
      });
    });
  });
});
