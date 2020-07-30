import { h } from 'preact';
import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as CellView } from '../cell';

jest.mock('../../../base/date_table/cell', () => ({
  ...require.requireActual('../../../base/date_table/cell'),
  DateTableCellBase: (props): JSX.Element => <div {...props} />,
}));

describe('DayDateTableCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9, 9);
    const endDate = new Date(2020, 6, 9, 10);
    const render = (viewModel): ShallowWrapper => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        endDate,
      },
    }));

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
