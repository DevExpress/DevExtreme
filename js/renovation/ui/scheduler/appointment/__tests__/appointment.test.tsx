import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction, Appointment } from '../appointment';

describe('Appointment', () => {
  const defaultViewModel = {
    appointment: {
      startDate: new Date('2021-08-05T10:00:00.000Z'),
      endDate: new Date('2021-08-05T12:00:00.000Z'),
      text: 'Some text',
    },

    geometry: {
      empty: false,
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
      dateText: '1AM - 2PM',
      resourceColor: '#1A2BC',
    },
  };

  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(viewFunction({
      ...viewModel,
      props: {
        ...viewModel.props,
        viewModel: defaultViewModel,
      },
    }));

    it('it should has correct render', () => {
      const appointment = render({
        styles: 'some-styles',
      });

      expect(appointment.hasClass('dx-scheduler-appointment'))
        .toBe(true);

      expect(appointment.is('div'))
        .toBe(true);

      expect(appointment.props())
        .toMatchObject({
          style: 'some-styles',
        });
    });

    it('it should has correct content container', () => {
      const appointment = render({});

      expect(appointment.children().hasClass('dx-scheduler-appointment-content'))
        .toBe(true);
    });

    it('it should has correct title', () => {
      const appointment = render({ text: 'Appointment Text' });

      const content = appointment.find('.dx-scheduler-appointment-content');
      const title = content.find('.dx-scheduler-appointment-title');

      expect(title.length)
        .toBe(1);

      expect(title.text())
        .toBe('Appointment Text');
    });

    it('it should has correct date text', () => {
      const appointment = render({ dateText: '2 AM - 3 PM' });

      const content = appointment.find('.dx-scheduler-appointment-content');

      const details = content.find('.dx-scheduler-appointment-content-details');
      expect(details.length)
        .toBe(1);

      const contentDate = details.find('.dx-scheduler-appointment-content-date');
      expect(contentDate.length)
        .toBe(1);

      expect(contentDate.text())
        .toBe('2 AM - 3 PM');
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('should return correct text', () => {
        const appointment = new Appointment({
          viewModel: defaultViewModel,
        });

        expect(appointment.text)
          .toBe('Some text');
      });

      it('should return correct date text', () => {
        const appointment = new Appointment({
          viewModel: defaultViewModel,
        });

        expect(appointment.dateText)
          .toBe('1AM - 2PM');
      });
    });
  });
});
