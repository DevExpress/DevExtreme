import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction } from '../appointment_tooltip';

describe('Appointment tooltip', () => {
  describe('Render', () => {
    const render = (viewModel = {} as any): ShallowWrapper => shallow(
      viewFunction({
        ...viewModel,
        props: {
          visible: true,
          ...viewModel.props,
        },
      }),
    );

    it('should be correct rendered without errors', () => {
      expect(() => render()).not.toThrow();
    });
  });
});
