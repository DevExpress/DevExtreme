import React from 'react';
import { shallow } from 'enzyme';
import { VERTICAL_GROUP_ORIENTATION } from '../../../../consts';
import { viewFunction as TableBodyView } from '../table_body';
import { Row } from '../../row';
import { AllDayPanelTableBody } from '../all_day_panel/table_body';
import * as utilsModule from '../../../utils';

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
          key: 3,
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
          key: 6,
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
          key: 9,
          text: 'test 3',
          today: false,
          otherMonth: false,
          firstDayOfMonth: false,
        }]],
        allDayPanel: [{ startDate: new Date(), key: '1' }],
        groupIndex: 1,
      }],
      leftVirtualCellWidth: 100,
      rightVirtualCellWidth: 200,
      leftVirtualCellCount: 2,
    };
    const cellTemplate = () => null;

    const render = (viewModel) => shallow(
      <TableBodyView
        {...viewModel}
        props={{
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
          .toMatchObject({
            className: 'dx-scheduler-date-table-row',
            leftVirtualCellWidth: 100,
            rightVirtualCellWidth: 200,
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
        .toBe('1');
      expect(rows.at(1).key())
        .toBe('4');
      expect(rows.at(2).key())
        .toBe('7');
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

    [true, false].forEach((shouldRender) => {
      it('should render AllDayPanelBody depending on getIsGroupedAllDayPanel result', () => {
        (getIsGroupedAllDayPanel as jest.Mock).mockReturnValue(shouldRender);
        const tableBody = render({});

        const allDayPanelTableBody = tableBody.find(AllDayPanelTableBody);
        expect(allDayPanelTableBody.exists())
          .toBe(shouldRender);

        expect(getIsGroupedAllDayPanel)
          .toHaveBeenCalledTimes(1);

        expect(getIsGroupedAllDayPanel)
          .toHaveBeenCalledWith(
            viewData,
            0,
          );
      });
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
        .toHaveBeenNthCalledWith(1, 3, VERTICAL_GROUP_ORIENTATION);
      expect(getKeyByGroup)
        .toHaveBeenNthCalledWith(2, 4, VERTICAL_GROUP_ORIENTATION);
    });
  });
});
