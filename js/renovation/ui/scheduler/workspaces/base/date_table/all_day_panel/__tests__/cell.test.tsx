import { shallow } from 'enzyme';
import { viewFunction as CellView } from '../cell';

describe('AllDayPanelCell', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: { ...viewModel.props },
    } as any) as any);

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(cell.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render correctly', () => {
      const cell = render({ props: { className: 'test-class' } });

      expect(cell.children())
        .toHaveLength(0);

      expect(cell.hasClass('dx-scheduler-all-day-table-cell dx-scheduler-cell-sizes-horizontal'))
        .toBe(true);
      expect(cell.hasClass('dx-scheduler-first-group-cell dx-scheduler-last-group-cell'))
        .toBe(true);

      expect(cell.hasClass('test-class'))
        .toBe(true);
    });
  });
});
