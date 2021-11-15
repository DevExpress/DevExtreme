import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction, AppointmentTooltip } from '../appointment_tooltip';

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

  describe('Logic', () => {
    describe('Fields', () => {
      describe('wrapperAttr', () => {
        it('should have correct class', () => {
          const tooltip = new AppointmentTooltip({} as any);

          expect(tooltip.wrapperAttr).toEqual({
            class: 'dx-scheduler-appointment-tooltip-wrapper',
          });
        });
      });
    });
  });
});
