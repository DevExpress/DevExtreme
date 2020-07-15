import { h } from 'preact';
import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../../../../../../js/renovation/scheduler/workspaces/month/date_table/layout';
import { DateTableRow as Row } from '../../../../../../js/renovation/scheduler/workspaces/base/date_table/row';
import { MonthDateTableCell as Cell } from '../../../../../../js/renovation/scheduler/workspaces/month/date_table/cell';
import { getKeyByDateAndGroup } from '../../../../../../js/renovation/scheduler/workspaces/utils';

jest.mock('../../../../../../js/renovation/scheduler/workspaces/base/date_table/row', () => ({
  ...require.requireActual('../../../../../../js/renovation/scheduler/workspaces/base/date_table/row'),
  DateTableRow: ({ children, ...restProps }) => <div {...restProps}>{children}</div>,
}));
jest.mock('../../../../../../js/renovation/scheduler/workspaces/month/date_table/cell', () => ({
  MonthDateTableCell: () => null,
}));
jest.mock('../../../../../../js/renovation/scheduler/workspaces/utils', () => ({
  getKeyByDateAndGroup: jest.fn(),
}));

describe('MonthDateTableLayout', () => {
  describe('Render', () => {
    const viewCellsData = {
      groupedData: [{
        dateTable: [[
          {
            startDate: new Date(2020, 6, 9),
            endDate: new Date(2020, 6, 10),
            today: true,
            groups: 1,
          },
          {
            startDate: new Date(2020, 6, 10),
            endDate: new Date(2020, 6, 11),
            today: false,
            groups: 2,
          },
        ], [
          {
            startDate: new Date(2020, 6, 11),
            endDate: new Date(2020, 6, 12),
            today: false,
            groups: 3,
          },
          {
            startDate: new Date(2020, 6, 12),
            endDate: new Date(2020, 6, 13),
            today: false,
            groups: 4,
          },
        ]],
      }],
    };
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: { ...viewModel.props, viewCellsData },
    } as any) as any);

    afterEach(() => jest.resetAllMocks());

    it('should combine `className` with predefined classes', () => {
      const layout = render({ props: { className: 'custom-class' } });

      expect(layout.hasClass('dx-scheduler-date-table'))
        .toBe(true);
      expect(layout.hasClass('custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(layout.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const layout = render({});

      expect(layout.find('table').exists())
        .toBe(true);
      expect(layout.find('tbody').exists())
        .toBe(true);

      const rows = layout.find(Row);
      expect(rows)
        .toHaveLength(2);
    });

    it('should render cells and pass correct props to them', () => {
      const layout = render({});

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(4);

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: viewCellsData.groupedData[0].dateTable[0][0].startDate,
          endDate: viewCellsData.groupedData[0].dateTable[0][0].endDate,
          today: viewCellsData.groupedData[0].dateTable[0][0].today,
          groups: viewCellsData.groupedData[0].dateTable[0][0].groups,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          startDate: viewCellsData.groupedData[0].dateTable[0][1].startDate,
          endDate: viewCellsData.groupedData[0].dateTable[0][1].endDate,
          today: viewCellsData.groupedData[0].dateTable[0][1].today,
          groups: viewCellsData.groupedData[0].dateTable[0][1].groups,
        });
      expect(cells.at(2).props())
        .toMatchObject({
          startDate: viewCellsData.groupedData[0].dateTable[1][0].startDate,
          endDate: viewCellsData.groupedData[0].dateTable[1][0].endDate,
          today: viewCellsData.groupedData[0].dateTable[1][0].today,
          groups: viewCellsData.groupedData[0].dateTable[1][0].groups,
        });
      expect(cells.at(3).props())
        .toMatchObject({
          startDate: viewCellsData.groupedData[0].dateTable[1][1].startDate,
          endDate: viewCellsData.groupedData[0].dateTable[1][1].endDate,
          today: viewCellsData.groupedData[0].dateTable[1][1].today,
          groups: viewCellsData.groupedData[0].dateTable[1][1].groups,
        });
    });

    it('should call getKeyByDateAndGroup with correct parameters', () => {
      render({});

      expect(getKeyByDateAndGroup)
        .toHaveBeenCalledTimes(6);

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          1, viewCellsData.groupedData[0].dateTable[0][0].startDate,
          viewCellsData.groupedData[0].dateTable[0][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          2, viewCellsData.groupedData[0].dateTable[0][0].startDate,
          viewCellsData.groupedData[0].dateTable[0][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          3, viewCellsData.groupedData[0].dateTable[0][1].startDate,
          viewCellsData.groupedData[0].dateTable[0][1].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          4, viewCellsData.groupedData[0].dateTable[1][0].startDate,
          viewCellsData.groupedData[0].dateTable[1][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          5, viewCellsData.groupedData[0].dateTable[1][0].startDate,
          viewCellsData.groupedData[0].dateTable[1][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          6, viewCellsData.groupedData[0].dateTable[1][1].startDate,
          viewCellsData.groupedData[0].dateTable[1][1].groups,
        );
    });
  });
});
