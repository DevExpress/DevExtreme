import React from 'react';
import { shallow } from 'enzyme';
import { DateTableBody, viewFunction as TableBodyView } from '../table_body';
import { Row } from '../../row';
import { AllDayPanelTableBody } from '../all_day_panel/table_body';
import * as utilsModule from '../../../utils';
import { DateTableCellBase } from '../cell';

const getIsGroupedAllDayPanel = jest.spyOn(utilsModule, 'getIsGroupedAllDayPanel').mockImplementation(() => true);

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
          text: 'test 1',
          today: true,
          otherMonth: true,
          firstDayOfMonth: true,
        }], [{
          startDate: new Date(2020, 6, 9, 1),
          endDate: new Date(2020, 6, 9, 1, 30),
          groups: { id: 2 },
          groupIndex: 2,
          index: 5,
          isFirstGroupCell: false,
          isLastGroupCell: false,
          key: '2',
          text: 'test 2',
          today: false,
          otherMonth: false,
          firstDayOfMonth: true,
        }], [{
          startDate: new Date(2020, 6, 9, 2),
          endDate: new Date(2020, 6, 9, 2, 30),
          groups: { id: 3 },
          groupIndex: 3,
          index: 6,
          isFirstGroupCell: false,
          isLastGroupCell: true,
          key: '3',
          text: 'test 3',
          today: false,
          otherMonth: false,
          firstDayOfMonth: false,
        }]],
        allDayPanel: [{ startDate: new Date(), key: '1' }],
      }],
    };
    const cellTemplate = () => null;

    const render = (viewModel) => shallow(
      <TableBodyView
        cell={cellTemplate}
        {...viewModel}
        props={{
          viewData,
          ...viewModel.props,
        }}
      />,
    );

    beforeEach(() => {
      getIsGroupedAllDayPanel.mockClear();
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
        rowIndex: number,
      ): void => {
        const cell = cells.at(rowIndex);
        const data = viewData.groupedData[0].dateTable[rowIndex][0];
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
          });
        expect(cell.key())
          .toBe(key);
      };

      const cells = tableBody.find(cellTemplate);
      expect(cells)
        .toHaveLength(3);

      assert(cells, 0);
      assert(cells, 1);
      assert(cells, 2);
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
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cell', () => {
        it('should return default Cell if a template is not provided', () => {
          const dateTableBody = new DateTableBody({});
          const { cell } = dateTableBody;

          expect(cell)
            .toBe(DateTableCellBase);
        });

        it('should return cellTemplate if it is provided', () => {
          const cellTemplate = () => null;
          const dateTableBody = new DateTableBody({ cellTemplate });
          const { cell } = dateTableBody;

          expect(cell)
            .toBe(cellTemplate);
        });
      });
    });
  });
});
