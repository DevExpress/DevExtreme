import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../../../../../../js/renovation/scheduler/workspaces/month/date_table/layout';
import { Row } from '../../../../../../js/renovation/scheduler/workspaces/base/row';
import {
  MonthDateTableCell as Cell,
} from '../../../../../../js/renovation/scheduler/workspaces/month/date_table/cell';

jest.mock('../../../../../../js/renovation/scheduler/workspaces/base/row', () => ({
  Row: () => null,
}));
jest.mock('../../../../../../js/renovation/scheduler/workspaces/month/date_table/cell', () => ({
  MonthDateTableCell: () => null,
}));

describe('MonthDateTableLayout', () => {
  describe('Render', () => {
    const viewCellsData = [[
      { startDate: new Date(2020, 6, 9), endDate: new Date(2020, 6, 10), today: true },
      { startDate: new Date(2020, 6, 10), endDate: new Date(2020, 6, 11), today: false },
    ], [
      { startDate: new Date(2020, 6, 11), endDate: new Date(2020, 6, 12), today: false },
      { startDate: new Date(2020, 6, 12), endDate: new Date(2020, 6, 13), today: false },
    ]];
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: { ...viewModel.props, viewCellsData },
    } as any) as any);

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
      expect(rows.at(0).hasClass('dx-scheduler-date-table-row'))
        .toBe(true);
      expect(rows.at(1).hasClass('dx-scheduler-date-table-row'))
        .toBe(true);
    });

    it('should render cells and pass correct props to them', () => {
      const layout = render({});

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(4);

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: viewCellsData[0][0].startDate,
          endDate: viewCellsData[0][0].endDate,
          today: viewCellsData[0][0].today,
        });
      expect(cells.at(1).props())
        .toMatchObject({
          startDate: viewCellsData[0][1].startDate,
          endDate: viewCellsData[0][1].endDate,
          today: viewCellsData[0][1].today,
        });
      expect(cells.at(2).props())
        .toMatchObject({
          startDate: viewCellsData[1][0].startDate,
          endDate: viewCellsData[1][0].endDate,
          today: viewCellsData[1][0].today,
        });
      expect(cells.at(3).props())
        .toMatchObject({
          startDate: viewCellsData[1][1].startDate,
          endDate: viewCellsData[1][1].endDate,
          today: viewCellsData[1][1].today,
        });
    });
  });
});
