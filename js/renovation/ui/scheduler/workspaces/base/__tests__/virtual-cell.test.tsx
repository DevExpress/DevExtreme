import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as CellView, VirtualCell } from '../virtual_cell';
import { addWidthToStyle } from '../../utils';
import { HeaderCell } from '../header_cell';
import { OrdinaryCell } from '../ordinary_cell';

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
      cellComponent: OrdinaryCell,
      ...viewModel,
      props: {
        ...viewModel.props,
      },
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
          const cell = new VirtualCell({ width: 500 });
          cell.restAttributes = { style };

          expect(cell.style)
            .toBe('style');

          expect(addWidthToStyle)
            .toHaveBeenCalledWith(500, style);
        });
      });

      describe('cellComponent', () => {
        it('should return HeaderCell if isHeaderCell is true', () => {
          const row = new VirtualCell({ isHeaderCell: true });

          expect(row.cellComponent)
            .toBe(HeaderCell);
        });

        it('should return OrdinaryCell if isHeaderCell is false', () => {
          const row = new VirtualCell({ isHeaderCell: false });

          expect(row.cellComponent)
            .toBe(OrdinaryCell);
        });
      });
    });
  });
});
