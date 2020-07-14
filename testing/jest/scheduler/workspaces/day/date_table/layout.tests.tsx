import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../../../../../../js/renovation/scheduler/workspaces/day/date_table/layout';
import { DateTableRow as Row } from '../../../../../../js/renovation/scheduler/workspaces/base/date_table/row';
import {
  DayDateTableCell as Cell,
} from '../../../../../../js/renovation/scheduler/workspaces/day/date_table/cell';

jest.mock('../../../../../../js/renovation/scheduler/workspaces/base/date_table/row', () => ({
  ...require.requireActual('../../../../../../js/renovation/scheduler/workspaces/base/date_table/row'),
  Row: () => null,
}));
jest.mock('../../../../../../js/renovation/scheduler/workspaces/day/date_table/cell', () => ({
  DayDateTableCell: () => null,
}));

describe('DayDateTableLayout', () => {
  describe('Render', () => {
    const viewCellsData = [
      [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30) }],
      [{ startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1) }],
    ];
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: { ...viewModel.props, viewCellsData },
    } as any) as any);

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
        .toHaveLength(2);

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: viewCellsData[0][0].startDate,
          endDate: viewCellsData[0][0].endDate,
        });

      expect(cells.at(1).props())
        .toMatchObject({
          startDate: viewCellsData[1][0].startDate,
          endDate: viewCellsData[1][0].endDate,
        });
    });
  });
});
