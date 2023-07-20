import { shallow, ShallowWrapper } from 'enzyme';
import { AppointmentLayout, AppointmentLayoutProps, viewFunction } from '../layout';

const disposePointerDownMock = jest.fn();
const subscribeToDXPointerDownEventMock = jest.fn(() => disposePointerDownMock);
jest.mock('../../../../utils/subscribe_to_event', () => ({
  ...jest.requireActual('../../../../utils/subscribe_to_event'),
  subscribeToDXPointerDownEvent: jest.fn(
    (element, callback) => (subscribeToDXPointerDownEventMock as any)(element, callback),
  ),
}));

describe('AppointmentLayout', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(viewFunction({
      appointments: [],
      overflowIndicators: [],
      appointmentsContextValue: {},
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    }));

    it('it should be rendered correctly without items', () => {
      const layout = render({
        classes: 'some-classes',
      });

      expect(layout.hasClass('some-classes'))
        .toEqual(true);

      expect(layout.children())
        .toHaveLength(0);
    });

    it('it should have correct render props with reqular appointments', () => {
      const defaultViewModel = {
        geometry: {
          left: 1,
          top: 2,
          width: 10,
          height: 20,
          leftVirtualWidth: 1,
          topVirtualHeight: 2,
        },

        info: {
          appointment: {
            startDate: new Date('2021-08-05T10:00:00.000Z'),
            endDate: new Date('2021-08-05T12:00:00.000Z'),
          },
          sourceAppointment: {
            groupIndex: 1,
          },
        },
      };
      const appointmentTemplate = '<div class="test-template">Some template</div>';
      const viewModel0 = {
        ...defaultViewModel,
        key: '1-2-10-20',
        geometry: {
          ...defaultViewModel.geometry,
          left: 10,
        },
      };
      const viewModel1 = {
        ...defaultViewModel,
        key: '100-200-10-20',
        info: {
          ...defaultViewModel.info,
          sourceAppointment: {
            groupIndex: 11,
          },
        },
      };
      const layout = render({
        appointments: [
          viewModel0,
          viewModel1,
        ],
        appointmentsContextValue: {
          showReducedIconTooltip: 'some value 1',
          hideReducedIconTooltip: 'some value 2',
          appointmentTemplate,
        },
        isFocusedAppointment: () => false,
      });

      expect(layout.children().length)
        .toEqual(2);

      let appointment = layout.childAt(0);
      expect(appointment.key())
        .toEqual('1-2-10-20');
      expect(appointment.prop('showReducedIconTooltip'))
        .toBe('some value 1');
      expect(appointment.prop('hideReducedIconTooltip'))
        .toBe('some value 2');
      expect(appointment.prop('viewModel'))
        .toBe(viewModel0);

      appointment = layout.childAt(1);
      expect(appointment.key())
        .toEqual('100-200-10-20');
      expect(appointment.prop('viewModel'))
        .toBe(viewModel1);
      expect(appointment.prop('appointmentTemplate'))
        .toBe(appointmentTemplate);
    });

    it('it should have correct props with overflow indicators', () => {
      const viewModel = {
        key: 'key-01',
        geometry: {
          top: 50,
          left: 100,
        },
      };
      const overflowIndicatorTemplate = '<div class="test-template">Some template</div>';
      const layout = render({
        overflowIndicators: [viewModel],
        appointmentsContextValue: {
          overflowIndicatorTemplate,
        },
      });

      expect(layout.children().length)
        .toEqual(1);

      const overflowIndicator = layout.childAt(0);
      expect(overflowIndicator.key())
        .toEqual('key-01');
      expect(overflowIndicator.prop('viewModel'))
        .toBe(viewModel);
      expect(overflowIndicator.prop('overflowIndicatorTemplate'))
        .toBe(overflowIndicatorTemplate);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('CSS classes', () => {
        it('should return correct classes by default', () => {
          const layout = new AppointmentLayout(new AppointmentLayoutProps());

          expect(layout.classes)
            .toBe('dx-scheduler-scrollable-appointments');
        });

        it('should return correct classes for the allDay appointments', () => {
          const layout = new AppointmentLayout({
            ...new AppointmentLayoutProps(),
            isAllDay: true,
          } as any);

          expect(layout.classes)
            .toBe('dx-scheduler-all-day-appointments');
        });
      });

      describe('appointments', () => {
        it('should return regular appointments by default', () => {
          const layout = new AppointmentLayout(new AppointmentLayoutProps());

          const appointments = [];
          layout.appointmentsContextValue = {
            viewModel: {
              regular: appointments,
            },
          } as any;

          expect(layout.appointments)
            .toBe(appointments);
        });

        it('should return allDay appointments if isAllDay is true', () => {
          const layout = new AppointmentLayout({
            isAllDay: true,
          });

          const appointments = [];
          layout.appointmentsContextValue = {
            viewModel: {
              allDay: appointments,
            },
          } as any;

          expect(layout.appointments)
            .toBe(appointments);
        });
      });

      describe('overflowIndicators', () => {
        it('should return regular indicators by default', () => {
          const layout = new AppointmentLayout(new AppointmentLayoutProps());

          const appointments = [];
          layout.appointmentsContextValue = {
            viewModel: {
              regularCompact: appointments,
            },
          } as any;

          expect(layout.overflowIndicators)
            .toBe(appointments);
        });

        it('should return allDay appointments if isAllDay is true', () => {
          const layout = new AppointmentLayout({
            isAllDay: true,
          });

          const appointments = [];
          layout.appointmentsContextValue = {
            viewModel: {
              allDayCompact: appointments,
            },
          } as any;

          expect(layout.overflowIndicators)
            .toBe(appointments);
        });
      });
    });

    describe('Methods', () => {
      describe('pointerEventsEffect', () => {
        it('should return correct value', () => {
          const layout = new AppointmentLayout(new AppointmentLayoutProps());
          layout.layoutRef = { current: 'some_element' } as any;

          expect(subscribeToDXPointerDownEventMock)
            .toBeCalledTimes(0);
          expect(disposePointerDownMock)
            .toBeCalledTimes(0);

          const disposePointerDownCaller = layout.pointerEventsEffect() as any;
          expect(subscribeToDXPointerDownEventMock)
            .toBeCalledTimes(1);
          expect(subscribeToDXPointerDownEventMock)
            .toBeCalledWith(
              'some_element',
              expect.any(Function),
            );

          disposePointerDownCaller();

          expect(disposePointerDownMock)
            .toBeCalledTimes(1);
        });
      });
    });
  });
});
