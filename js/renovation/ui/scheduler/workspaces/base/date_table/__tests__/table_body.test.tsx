import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TableBodyView } from '../table_body';
import { DateTableRow as Row } from '../row';
import * as utilsModule from '../../../utils';

const getKeyByDateAndGroup = jest.spyOn(utilsModule, 'getKeyByDateAndGroup');

describe('DateTableBody', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: 1 }],
          [{ startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1), groups: 2 }],
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

    beforeEach(() => getKeyByDateAndGroup.mockClear());

    it('should render rows', () => {
      const rows = render({}).find(Row);

      expect(rows)
        .toHaveLength(2);
    });

    it('should render cells and pass correct props to them', () => {
      const tableBody = render({});

      const cells = tableBody.find(cellTemplate);
      expect(cells)
        .toHaveLength(2);

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: viewData.groupedData[0].dateTable[0][0].startDate,
          endDate: viewData.groupedData[0].dateTable[0][0].endDate,
          groups: viewData.groupedData[0].dateTable[0][0].groups,
        });

      expect(cells.at(1).props())
        .toMatchObject({
          startDate: viewData.groupedData[0].dateTable[1][0].startDate,
          endDate: viewData.groupedData[0].dateTable[1][0].endDate,
          groups: viewData.groupedData[0].dateTable[1][0].groups,
        });
    });

    it('should call getKeyByDateAndGroup with correct parameters', () => {
      render({});

      expect(getKeyByDateAndGroup)
        .toHaveBeenCalledTimes(4);

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
    });
  });
});
