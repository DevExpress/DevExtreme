import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TableBodyView } from '../table_body';
import { DateTableRow as Row } from '../row';
import { AllDayPanelTableBody } from '../all_day_panel/table_body';
import * as utilsModule from '../../../utils';

const getKeyByDateAndGroup = jest.spyOn(utilsModule, 'getKeyByDateAndGroup');
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
        }], [{
          startDate: new Date(2020, 6, 9, 1),
          endDate: new Date(2020, 6, 9, 1, 30),
          groups: { id: 2 },
          groupIndex: 2,
          index: 5,
        }], [{
          startDate: new Date(2020, 6, 9, 2),
          endDate: new Date(2020, 6, 9, 2, 30),
          groups: { id: 3 },
          groupIndex: 3,
          index: 6,
        }]],
        allDayPanel: [{ startDate: new Date() }],
      }],
    };
    const cellTemplate = () => null;

    const render = (viewModel) => shallow(
      <TableBodyView
        {...viewModel}
        props={{
          viewData,
          cellTemplate,
          ...viewModel.props,
        }}
      />,
    );

    beforeEach(() => {
      getKeyByDateAndGroup.mockClear();
      getIsGroupedAllDayPanel.mockClear();
    });

    it('should render rows', () => {
      const rows = render({}).find(Row);

      expect(rows)
        .toHaveLength(3);
    });

    it('should render cells and pass correct props to them', () => {
      const dataCellTemplate = () => null;
      const tableBody = render({
        props: { dataCellTemplate },
      });

      const assert = (
        cells: any,
        index: number,
        isFirstCell: boolean,
        isLastCell: boolean,
      ): void => {
        const cell = cells.at(index);

        expect(cell.props())
          .toMatchObject({
            startDate: viewData.groupedData[0].dateTable[index][0].startDate,
            endDate: viewData.groupedData[0].dateTable[index][0].endDate,
            groups: viewData.groupedData[0].dateTable[index][0].groups,
            groupIndex: viewData.groupedData[0].dateTable[index][0].groupIndex,
            index: viewData.groupedData[0].dateTable[index][0].index,
            isFirstCell,
            isLastCell,
            dataCellTemplate,
          });
      };

      const cells = tableBody.find(cellTemplate);
      expect(cells)
        .toHaveLength(3);

      assert(cells, 0, true, false);
      assert(cells, 1, false, false);
      assert(cells, 2, false, true);
    });

    it('should call getKeyByDateAndGroup with correct parameters', () => {
      render({});

      expect(getKeyByDateAndGroup)
        .toHaveBeenCalledTimes(6);

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          1, viewData.groupedData[0].dateTable[0][0].startDate,
          viewData.groupedData[0].dateTable[0][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          2, viewData.groupedData[0].dateTable[0][0].startDate,
          viewData.groupedData[0].dateTable[0][0].groups,
        );

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          3, viewData.groupedData[0].dateTable[1][0].startDate,
          viewData.groupedData[0].dateTable[1][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          4, viewData.groupedData[0].dateTable[1][0].startDate,
          viewData.groupedData[0].dateTable[1][0].groups,
        );

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          5, viewData.groupedData[0].dateTable[2][0].startDate,
          viewData.groupedData[0].dateTable[2][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          6, viewData.groupedData[0].dateTable[2][0].startDate,
          viewData.groupedData[0].dateTable[2][0].groups,
        );
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
});
