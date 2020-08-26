import { shallow } from 'enzyme';
import {
  MonthHeaderPanelCell as Cell,
  viewFunction as CellView,
} from '../cell';
import dateLocalization from '../../../../../../../localization/date';

jest.mock('../../../../../../../localization/date', () => ({
  getDayNames: jest.fn(() => [0, 1, 2, 3, 4, 5, 6, 7]),
}));

describe('MonthHeaderPanelCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9);
    const endDate = new Date(2020, 6, 10);
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        endDate,
      },
    }) as any);

    it('should pass correct class', () => {
      const cell = render({ props: { className: 'test' } });

      expect(cell.hasClass('dx-scheduler-header-panel-cell'))
        .toBe(true);
      expect(cell.hasClass('dx-scheduler-cell-sizes-horizontal'))
        .toBe(true);
      expect(cell.hasClass('test'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(cell.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render week day correctly', () => {
      const cell = render({ weekDay: 'week day' });

      expect(cell.children())
        .toHaveLength(1);
      expect(cell.childAt(0).text())
        .toBe('week day');
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('weekDay', () => {
        it('should call getDayNames with correct parameter and choose correct day name', () => {
          const cell = new Cell({ startDate: new Date(2020, 6, 9), index: 0 });

          const { weekDay } = cell;
          expect(dateLocalization.getDayNames)
            .toHaveBeenCalledWith('abbreviated');
          expect(weekDay)
            .toBe(4);
        });
      });
    });
  });
});
