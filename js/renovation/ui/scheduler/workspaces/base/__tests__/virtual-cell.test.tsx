import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction as CellView } from '../virtual-cell';

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

    it('should combine `className` with predefined classes', () => {
      const cell = render({ props: { className: 'custom-class' } });

      expect(cell.hasClass('custom-class'))
        .toBe(true);
      expect(cell.hasClass('dx-scheduler-virtual-cell'))
        .toBe(true);
    });
  });
});
