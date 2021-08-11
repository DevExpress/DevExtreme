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
      const layout = render({ props: { items: [] } });

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
      const viewModel0 = {
        ...defaultViewModel,
        geometry: {
          ...defaultViewModel.geometry,
          left: 10,
        },
      };
      const viewModel1 = {
        ...defaultViewModel,
        geometry: {
          ...defaultViewModel.geometry,
          top: 20,
        },
      };
      const viewModel2 = {
        ...defaultViewModel,
        geometry: {
          ...defaultViewModel.geometry,
          width: 1220,
        },
      };
      const layout = render({
        props: {
          items: [
            viewModel0,
            viewModel1,
            viewModel2,
          ],
        },
      });

      expect(layout.hasClass('dx-scheduler-appointments'))
        .toEqual(true);

      expect(layout.children().length)
        .toEqual(3);

      let appointment = layout.children().get(0);
      expect(appointment.key)
        .toEqual('1-1628157600000-1628164800000_11-4-10-20');
      expect(appointment.props.viewModel)
        .toBe(viewModel0);

      appointment = layout.children().get(1);
      expect(appointment.key)
        .toEqual('1-1628157600000-1628164800000_2-22-10-20');
      expect(appointment.props.viewModel)
        .toBe(viewModel1);

      appointment = layout.children().get(2);
      expect(appointment.key)
        .toEqual('1-1628157600000-1628164800000_2-4-1220-20');
      expect(appointment.props.viewModel)
        .toBe(viewModel2);
    });
  });
});
