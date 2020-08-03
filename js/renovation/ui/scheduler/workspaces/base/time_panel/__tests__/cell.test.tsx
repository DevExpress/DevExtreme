import { shallow } from 'enzyme';
import { viewFunction as CellView } from '../cell';

describe('TimePanelTableCell', () => {
  describe('Render', () => {
    const startDate = new Date(2020, 6, 9, 9);
    const text = 'Some Text';
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: {
        ...viewModel.props,
        startDate,
        text,
      },
    }) as any);

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(cell.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('should render time cell correctly', () => {
      const cell = render({ props: { className: 'test-class' } });

      expect(cell.children())
        .toHaveLength(1);

      expect(cell.childAt(0).text())
        .toBe(text);

      expect(cell.hasClass('dx-scheduler-time-panel-cell dx-scheduler-cell-sizes-vertical'))
        .toBe(true);

      expect(cell.hasClass('dx-scheduler-first-group-cell dx-scheduler-last-group-cell'))
        .toBe(true);

      expect(cell.hasClass('test-class'))
        .toBe(true);
    });
  });
});
