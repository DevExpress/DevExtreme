import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as CellView, VirtualCell } from '../virtual-cell';
import * as combineClassesModule from '../../../../../utils/combine_classes';

const combineClasses = jest.spyOn(combineClassesModule, 'combineClasses');

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getGroupCellClasses: jest.fn(),
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
        it('should call "combineClasses" with correct parameters', () => {
          const virtualCell = new VirtualCell({
            className: 'custom-class',
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          virtualCell.className;

          expect(combineClasses)
            .toHaveBeenCalledTimes(1);
          expect(combineClasses)
            .toHaveBeenCalledWith({
              'custom-class': true,
              'dx-scheduler-virtual-cell': true,
            });
        });
      });
    });
  });
});
