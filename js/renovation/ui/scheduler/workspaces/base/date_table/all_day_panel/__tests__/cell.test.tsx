import { shallow } from 'enzyme';
import { viewFunction as CellView, AllDayPanelCell } from '../cell';

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

      expect(cell.hasClass('test-class'))
        .toBe(true);
    });

    it('should contain classes', () => {
      const cell = render({ classes: 'test-class' });

      expect(cell.children())
        .toHaveLength(0);

      expect(cell.hasClass('test-class'))
        .toBe(true);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        it('Should have default classes', () => {
          const layout = new AllDayPanelCell({ });

          expect(layout.classes)
            .toEqual('dx-scheduler-all-day-table-cell dx-scheduler-cell-sizes-horizontal');
        });

        it('Should have first group class', () => {
          const layout = new AllDayPanelCell({ isFirstGroupCell: true });

          expect(layout.classes)
            .toContain('dx-scheduler-first-group-cell');
        });

        it('Should have last group class', () => {
          const layout = new AllDayPanelCell({ isLastGroupCell: true });

          expect(layout.classes)
            .toContain('dx-scheduler-last-group-cell');
        });
      });
    });
  });
});
