import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as CellView, VirtualCell } from '../virtual-cell';
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

    it('should spread restAttributes', () => {
      const cell = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(cell.prop('customAttribute'))
        .toBe('customAttribute');
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('classes', () => {
        [{
          className: 'custom-class',
          expectedResult: 'dx-scheduler-virtual-cell custom-class',
        }, {
          className: '',
          expectedResult: 'dx-scheduler-virtual-cell',
        }].forEach(({ className, expectedResult }) => {
          it(`should return correct parameters if className=${className}`, () => {
            const virtualCell = new VirtualCell({
              className,
            });

            expect(virtualCell.classes)
              .toEqual(expectedResult);
          });
        });
      });

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
