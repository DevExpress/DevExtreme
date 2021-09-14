import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction, Appointment, AppointmentProps } from '../appointment';
import { AppointmentContent } from '../content';

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

      expect(appointment.prop('style'))
        .toEqual('some-styles');
    });

    it('it should has correct render with template', () => {
      const templateProps = {
        data: { test: 'Test Data' },
        index: 1234,
      };
      const template = '<div class="some-template">Some Template</div>';
      const appointment = render({
        styles: 'some-styles',
        ...templateProps,
        props: {
          appointmentTemplate: template,
        },
      });

      expect(appointment.hasClass('dx-scheduler-appointment'))
        .toBe(true);

      expect(appointment.is('div'))
        .toBe(true);

      expect(appointment.prop('style'))
        .toEqual('some-styles');

      const appointmentTemplate = appointment.children();

      expect(appointmentTemplate.type())
        .toBe(template);

      expect(appointmentTemplate)
        .toHaveLength(1);

      expect(appointmentTemplate.props())
        .toEqual(templateProps);
    });

    it('it should has correct content container', () => {
      const appointment = render({});

      expect(appointment.children().type())
        .toBe(AppointmentContent);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('styles', () => {
        it('should return correct styles', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          });

          expect(appointment.styles)
            .toEqual({
              backgroundColor: '#1A2BC',
              height: 20,
              left: 1,
              top: 2,
              width: 10,
            });
        });
      });

      describe('text', () => {
        it('should return correct text', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          });

          expect(appointment.text)
            .toBe('Some text');
        });
      });

      describe('dateText', () => {
        it('should return correct dateText', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          });

          expect(appointment.dateText)
            .toBe('1AM - 2PM');
        });
      });

      describe('data', () => {
        it('shoud return correct data', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          });

          expect(appointment.data)
            .toEqual({
              appointmentData: {
                startDate: new Date('2021-08-05T10:00:00.000Z'),
                endDate: new Date('2021-08-05T12:00:00.000Z'),
              },
              targetedAppointmentData: {
                startDate: new Date('2021-08-05T10:00:00.000Z'),
                endDate: new Date('2021-08-05T12:00:00.000Z'),
                text: 'Some text',
              },
            });
        });
      });

      describe('index', () => {
        it('shoud return correct default value', () => {
          const appointment = new Appointment(new AppointmentProps());

          expect(appointment.index)
            .toEqual(0);
        });

        it('shoud return correct value', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
            index: 1234,
          });

          expect(appointment.index)
            .toEqual(1234);
        });
      });
    });
  });
});
