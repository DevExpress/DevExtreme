import { mount } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';
import { DateTableRow as Row } from '../../../base/date_table/row';
import { DayDateTableCell as Cell } from '../cell';
import { getKeyByDateAndGroup } from '../../../utils';

import { Table } from '../../../base/table';
import { VirtualTable } from '../../../base/virtual_table';

jest.mock('../../../utils', () => ({
  ...require.requireActual('../../../utils'),
  getKeyByDateAndGroup: jest.fn(),
}));

describe('DayDateTableLayout', () => {
  describe('Render', () => {
    const viewData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: 1 }],
          [{ startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1), groups: 2 }],
        ],
      }],
    };

    const render = (viewModel) => mount(LayoutView({
      ...viewModel,
      props: { ...viewModel.props, viewData },
    } as any) as any);

    afterEach(() => jest.resetAllMocks());

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(layout.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render table correctly', () => {
      const layout = render({});

      expect(layout.is(Table))
        .toBe(true);

      const rows = layout.find(Row);

      expect(rows)
        .toHaveLength(2);
    });

    it('should render virtual table correctly', () => {
      const layout = render({ props: { isVirtual: true } });

      expect(layout.is(VirtualTable))
        .toBe(true);

      const rows = layout.find(Row);

      expect(rows)
        .toHaveLength(2);
    });

    it('should render cells and pass correct props to them', () => {
      const layout = render({});

      const cells = layout.find(Cell);
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
