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

    it('it should be render', () => {
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

  describe('Logic', () => {
    describe('Getters', () => {
      describe('target', () => {
        it('should return correct element', () => {
          const current = 'current';
          const tooltip = new AppointmentTooltip({
            ...new AppointmentTooltipProps(),
            target: {
              current,
            } as any,
          });

          expect(tooltip.target).toEqual(current);
        });

        it('should not fail if "target" prop is undefined', () => {
          const tooltip = new AppointmentTooltip({
            ...new AppointmentTooltipProps(),
            target: undefined as any,
          });

          expect(() => tooltip.target).not.toThrow();
        });
      });
    });
  });
});
