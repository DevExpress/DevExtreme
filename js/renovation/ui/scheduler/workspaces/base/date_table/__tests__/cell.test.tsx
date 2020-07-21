import { h } from 'preact';
import { shallow } from 'enzyme';
import {
  viewFunction as CellView,
} from '../cell';

describe('DateTableCellBase', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: { ...viewModel.props },
    } as any) as any);

    it('should combine `className` with predefined classes', () => {
      const cell = render({ props: { className: 'test' } });

      expect(cell.hasClass('test'))
        .toBe(true);
      expect(cell.hasClass('dx-scheduler-date-table-cell'))
        .toBe(true);
      expect(cell.hasClass('dx-scheduler-cell-sizes-horizontal'))
        .toBe(true);
      expect(cell.hasClass('dx-scheduler-cell-sizes-vertical'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(cell.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render children', () => {
      const cell = render({ props: { children: <div className="child" /> } });

      expect(cell.find('.child').exists())
        .toBe(true);
    });
  });
});
