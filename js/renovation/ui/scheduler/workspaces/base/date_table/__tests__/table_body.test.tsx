import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TableBodyView, DateTableBody } from '../table_body';
import { Row } from '../../row';
import { AllDayPanelTableBody } from '../all_day_panel/table_body';
import * as utilsModule from '../../../utils';
import { DateTableCellBase } from '../cell';
import { MonthDateTableCell } from '../../../month/date_table/cell';

const getIsGroupedAllDayPanel = jest.spyOn(utilsModule, 'getIsGroupedAllDayPanel').mockImplementation(() => true);
const getKeyByGroup = jest.spyOn(utilsModule, 'getKeyByGroup');

describe('DateTableBody', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [[{
          startDate: new Date(2020, 6, 9, 0),
          endDate: new Date(2020, 6, 9, 0, 30),
          groups: { id: 1 },
          groupIndex: 1,
          index: 4,
          isFirstGroupCell: true,
          isLastGroupCell: false,
          key: '1',
        }], [{
          startDate: new Date(2020, 6, 9, 1),
          endDate: new Date(2020, 6, 9, 1, 30),
          groups: { id: 2 },
          groupIndex: 2,
          index: 5,
          isFirstGroupCell: false,
          isLastGroupCell: false,
          key: '2',
        }], [{
          startDate: new Date(2020, 6, 9, 2),
          endDate: new Date(2020, 6, 9, 2, 30),
          groups: { id: 3 },
          groupIndex: 3,
          index: 6,
          isFirstGroupCell: false,
          isLastGroupCell: true,
          key: '3',
        }]],
        allDayPanel: [{ startDate: new Date(), key: '1' }],
        groupIndex: 1,
      }],
    };
    const cellTemplate = () => null;

    const render = (viewModel) => shallow(
      <TableBodyView
        cell={DateTableCellBase}
        {...viewModel}
        props={{
          viewData,
          cellTemplate,
          ...viewModel.props,
        }}
      />,
    );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should render rows', () => {
      const rows = render({}).find(Row);

      expect(rows)
        .toHaveLength(3);

      expect(rows.at(0).hasClass('dx-scheduler-date-table-row'))
        .toBe(true);
      expect(rows.at(1).hasClass('dx-scheduler-date-table-row'))
        .toBe(true);
      expect(rows.at(2).hasClass('dx-scheduler-date-table-row'))
        .toBe(true);
    });

    it('should render cells and pass correct props to them', () => {
      const dataCellTemplate = () => null;
      const tableBody = render({
        props: { dataCellTemplate },
      });

      const assert = (
        cells: any,
        index: number,
        isFirstGroupCell: boolean,
        isLastGroupCell: boolean,
      ): void => {
        const cell = cells.at(index);

        expect(cell.props())
          .toMatchObject({
            startDate: viewData.groupedData[0].dateTable[index][0].startDate,
            endDate: viewData.groupedData[0].dateTable[index][0].endDate,
            groups: viewData.groupedData[0].dateTable[index][0].groups,
            groupIndex: viewData.groupedData[0].dateTable[index][0].groupIndex,
            index: viewData.groupedData[0].dateTable[index][0].index,
            isFirstGroupCell,
            isLastGroupCell,
            dataCellTemplate,
          });
        expect(cell.key())
          .toBe(viewData.groupedData[0].dateTable[index][0].key);
      };

      const cells = tableBody.find(DateTableCellBase);
      expect(cells)
        .toHaveLength(3);

      assert(cells, 0, true, false);
      assert(cells, 1, false, false);
      assert(cells, 2, false, true);
    });

    it('should render AllDayPanelBody correctly and call getIsGroupedAllDayPanel', () => {
      const dataCellTemplate = () => null;
      const tableBody = render({
        props: { dataCellTemplate },
      });

      const allDayPanelTableBody = tableBody.find(AllDayPanelTableBody);
      expect(allDayPanelTableBody.exists())
        .toBe(true);

      expect(allDayPanelTableBody.props())
        .toMatchObject({
          viewData: viewData.groupedData[0].allDayPanel,
          dataCellTemplate,
          isVerticalGroupOrientation: true,
        });

      expect(getIsGroupedAllDayPanel)
        .toHaveBeenCalledTimes(1);
      expect(getIsGroupedAllDayPanel)
        .toHaveBeenCalledWith(
          viewData,
          0,
        );
    });

    it('should not render AllDayPanelBody when getIsGroupedAllDayPanel returns false', () => {
      (getIsGroupedAllDayPanel as jest.Mock).mockReturnValue(false);
      const tableBody = render({});

      const allDayPanelTableBody = tableBody.find(AllDayPanelTableBody);
      expect(allDayPanelTableBody.exists())
        .toBe(false);
    });

    it('should provide correct key to a groups\'s Fragment depending on groupIndex', () => {
      render({
        props: {
          viewData: {
            groupedData: [{
              dateTable: [],
              groupIndex: 3,
            }, {
              dateTable: [],
              groupIndex: 4,
            }],
            leftVirtualCellWidth: 100,
            rightVirtualCellWidth: 200,
            leftVirtualCellCount: 2,
          },
        },
      });

      expect(getKeyByGroup)
        .toHaveBeenCalledTimes(2);
      expect(getKeyByGroup)
        .toHaveBeenNthCalledWith(1, 3);
      expect(getKeyByGroup)
        .toHaveBeenNthCalledWith(2, 4);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cell', () => {
        it('should return MonthDateTableCell when view type is month', () => {
          const layout = new DateTableBody({ viewType: 'month' });

          expect(layout.cell)
            .toBe(MonthDateTableCell);
        });

        it('should return DateTableCellBase when view type is not month', () => {
          const layout = new DateTableBody({ viewType: 'day' });

          expect(layout.cell)
            .toBe(DateTableCellBase);
        });
      });
    });
  });
});
