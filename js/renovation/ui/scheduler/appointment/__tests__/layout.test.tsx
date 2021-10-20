import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction } from '../layout';

describe('AppointmentLayout', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(viewFunction({
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    }));

    it('it should be rendered correctly with empty items', () => {
      const layout = render({ props: { appointments: [] } });

      expect(layout.hasClass('dx-scheduler-appointments'))
        .toEqual(true);
    });

    it('it should be rendered correctly with items', () => {
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
        props: {
          appointments: [
            viewModel0,
            viewModel1,
          ],
          appointmentTemplate,
        },
      });

      expect(layout.hasClass('dx-scheduler-appointments'))
        .toEqual(true);

      expect(layout.children().length)
        .toEqual(2);

      let appointment = layout.childAt(0);
      expect(appointment.key())
        .toEqual('1-2-10-20');
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
  });
});
