import { h } from 'preact';
import { shallow } from 'enzyme';
import {
  viewFunction as CellView,
} from '../../../../../../js/renovation/scheduler/workspaces/day/date_table/cell';

jest.mock('../../../../../../js/renovation/scheduler/workspaces/base/date_table/cell', () => ({
  ...require.requireActual('../../../../../../js/renovation/scheduler/workspaces/base/date_table/cell'),
  DateTableCellBase: (props) => <div {...props} />,
}));

describe('DayDateTableCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9, 9);
    const endDate = new Date(2020, 6, 9, 10);
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        endDate,
      },
    } as any) as any);

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(cell.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render day correctly', () => {
      const cell = render({});

      expect(cell.children())
        .toHaveLength(0);
    });
  });
});
