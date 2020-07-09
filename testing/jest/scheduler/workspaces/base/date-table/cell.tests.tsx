import { h } from 'preact';
import { shallow } from 'enzyme';
import {
  DateTableCellBase as Cell,
  viewFunction as CellView,
} from '../../../../../../js/renovation/scheduler/workspaces/base/date-table/cell';

describe('DateTableCellBase', () => {
  describe('Render', () => {
    const render = (viewModel) => shallow(CellView({
      ...viewModel,
      props: { ...viewModel.props },
    } as any) as any);

    it('should pass correct class', () => {
      const cell = render({ classes: 'test' });

      expect(cell.is('.test'))
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

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        it('should combine predefined classes with custom className', () => {
          const cell = new Cell({
            className: 'test',
          });

          expect(cell.classes)
            .toEqual('dx-scheduler-date-table-cell dx-scheduler-cell-sizes-horizontal dx-scheduler-cell-sizes-vertical test');
        });

        it('should return predefined classes if className is undefined', () => {
          const cell = new Cell({});

          expect(cell.classes)
            .toEqual('dx-scheduler-date-table-cell dx-scheduler-cell-sizes-horizontal dx-scheduler-cell-sizes-vertical');
        });
      });
    });
  });
});
