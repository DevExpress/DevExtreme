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
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: 1 }],
          [{ startDate: new Date(2020, 6, 9, 1), endDate: new Date(2020, 6, 9, 1, 30), groups: 2 }],
          [{ startDate: new Date(2020, 6, 9, 2), endDate: new Date(2020, 6, 9, 2, 30), groups: 3 }],
        ],
      }],
    };
    const cellTemplate = () => null;

    const render = (viewModel) => shallow(<TableBodyView {...{
      ...viewModel,
      props: {
        viewData,
        cellTemplate,
        ...viewModel.props,
      },
    }}
    />);

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
      const tableBody = render({});
      const assert = (
        cells: any,
        index: number,
        isFirstCell: boolean,
        isLastCell: boolean,
      ): void => {
        const cell = cells.at(index);

        expect(cell.prop('isFirstCell'))
          .toBe(isFirstCell);
        expect(cell.prop('isLastCell'))
          .toBe(isLastCell);
        expect(cell.props())
          .toMatchObject({
            startDate: viewData.groupedData[0].dateTable[index][0].startDate,
            endDate: viewData.groupedData[0].dateTable[index][0].endDate,
            groups: viewData.groupedData[0].dateTable[index][0].groups,
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

    it('should call `getIsGroupedAllDayPanel` with correct parameters', () => {
      (getIsGroupedAllDayPanel as jest.Mock).mockReturnValue(true);

      const tableBody = render({});

      expect(tableBody.find(AllDayPanelTableBody).exists())
        .toBe(true);

      expect(utilsModule.getIsGroupedAllDayPanel)
        .toHaveBeenCalledTimes(1);

      expect(utilsModule.getIsGroupedAllDayPanel)
        .toHaveBeenNthCalledWith(
          1,
          viewData,
        );
    });
  });
});
