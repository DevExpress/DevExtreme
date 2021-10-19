import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction, AppointmentTooltip, AppointmentTooltipProps } from '../appointment_tooltip';

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

  describe('Behavior', () => {
    describe('Methods', () => {
      describe('updateVisible', () => {
        it('should call "onVisibleChange" prop', () => {
          const mockCallback = jest.fn();
          const tooltip: any = new AppointmentTooltip({
            ...new AppointmentTooltipProps(),
            visible: true,
          });

          tooltip.props.onVisibleChange = mockCallback;

          tooltip.updateVisible(false);

          expect(mockCallback).toBeCalledTimes(1);
          expect(mockCallback).toHaveBeenCalledWith(false);
        });
      });
    });
  });
});
