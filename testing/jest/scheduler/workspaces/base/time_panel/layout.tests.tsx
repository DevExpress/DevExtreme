import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../../../../../../js/renovation/scheduler/workspaces/base/time_panel/layout';
import { Row } from '../../../../../../js/renovation/scheduler/workspaces/base/row';
import {
  TimePanelCell as Cell,
} from '../../../../../../js/renovation/scheduler/workspaces/base/time_panel/cell';

jest.mock('../../../../../../js/renovation/scheduler/workspaces/base/row', () => ({
  ...require.requireActual('../../../../../../js/renovation/scheduler/workspaces/base/row'),
  Row: () => null,
}));
jest.mock('../../../../../../js/renovation/scheduler/workspaces/base/time_panel/cell', () => ({
  ...require.requireActual('../../../../../../js/renovation/scheduler/workspaces/base/time_panel/cell'),
  DayDateTableCell: () => null,
}));

describe('DayDateTableLayout', () => {
  describe('Render', () => {
    const viewCellsData = [
      [{ startDate: new Date(2020, 6, 9, 0), text: '0:00 AM' }],
      [{ startDate: new Date(2020, 6, 9, 1), text: '1:00 AM' }],
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
      const layout = render({ props: { className: 'test-class' } });

      const table = layout.find('table');

      expect(table.exists())
        .toBe(true);

      expect(table.hasClass('dx-scheduler-time-panel'))
        .toBe(true);

      const tbody = layout.find('tbody');

      expect(tbody.exists())
        .toBe(true);

      expect(tbody.hasClass(''))
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
          text: viewCellsData[0][0].text,
        });

      expect(cells.at(1).props())
        .toMatchObject({
          startDate: viewCellsData[1][0].startDate,
          text: viewCellsData[1][0].text,
        });
    });
  });
});
