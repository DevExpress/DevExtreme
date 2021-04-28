import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as CellView, VirtualCell } from '../virtual_cell';
import { addWidthToStyle } from '../../utils';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getGroupCellClasses: jest.fn(),
}));

jest.mock('../../utils', () => ({
  addWidthToStyle: jest.fn(() => 'style'),
}));

describe('VirtualCell', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(CellView({
      ...viewModel,
      props: { ...viewModel.props },
    }));

    it('should pass style to the root component', () => {
      const cell = render({ style: { with: '31px' } });

      expect(cell.prop('style'))
        .toEqual({ with: '31px' });
    });

    it('should pass colSpan to the root component', () => {
      const cell = render({ props: { colSpan: 34 } });

      expect(cell.prop('colSpan'))
        .toBe(34);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('style', () => {
        it('should call addWidthToStyle with proper parameters', () => {
          const style = { width: '100px', height: '200px' };
          const row = new VirtualCell({ width: 500 });
          row.restAttributes = { style };

          expect(row.style)
            .toBe('style');

          expect(addWidthToStyle)
            .toHaveBeenCalledWith(500, style);
        });
      });
    });
  });
});
