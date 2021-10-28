import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction, Appointment, AppointmentProps } from '../appointment';
import { AppointmentContent } from '../content';
import { AppointmentViewModel, ReduceType } from '../types';

describe('Appointment', () => {
  const defaultViewModel: AppointmentViewModel = {
    key: '1-2-10-20',

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
      allDay: false,
      isRecurrent: false,
      direction: 'vertical',
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
        viewModel: defaultViewModel,
        ...viewModel.props,
      },
    }));

    it('it should has correct render', () => {
      const appointment = render({
        styles: 'some-styles',
        classes: 'some-classes',
      });

      expect(appointment.hasClass('some-classes'))
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
        classes: 'some-classes',
        ...templateProps,
        props: {
          appointmentTemplate: template,
        },
      });

      expect(appointment.is('div'))
        .toBe(true);

      expect(appointment.hasClass('some-classes'))
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

    it('content should have correct props', () => {
      const appointment = render({
        text: 'some-text',
        dateText: 'some-dateText',
        isReduced: true,
        props: {
          viewModel: {
            info: {
              isRecurrent: true,
            },
          },
        },
      });

      const appointmentContent = appointment.childAt(0);

      expect(appointmentContent.is(AppointmentContent))
        .toBe(true);

      expect(appointmentContent.props())
        .toEqual({
          text: 'some-text',
          dateText: 'some-dateText',
          isRecurrent: true,
          isReduced: true,
        });
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
              height: '20px',
              left: '1px',
              top: '2px',
              width: '10px',
            });
        });
      });

      describe('classes', () => {
        it('should return correct class names with vertical appointment direction', () => {
          const appointment = new Appointment({
            viewModel: {
              ...defaultViewModel,
              info: {
                ...defaultViewModel.info,
                direction: 'vertical',
              },
            },
          });

          expect(appointment.classes)
            .toBe('dx-scheduler-appointment dx-scheduler-appointment-vertical');
        });

        it('should return correct class names with horizontal appointment direction', () => {
          const appointment = new Appointment({
            viewModel: {
              ...defaultViewModel,
              info: {
                ...defaultViewModel.info,
                direction: 'horizontal',
              },
            },
          });

          expect(appointment.classes)
            .toBe('dx-scheduler-appointment dx-scheduler-appointment-horizontal');
        });

        it('should return correct class with recurrence', () => {
          const appointment = new Appointment({
            viewModel: {
              ...defaultViewModel,
              info: {
                ...defaultViewModel.info,
                isRecurrent: true,
              },
            },
          });

          const defaultClasses = 'dx-scheduler-appointment dx-scheduler-appointment-vertical';

          expect(appointment.classes.search(`${defaultClasses} dx-scheduler-appointment-recurrence`) >= 0)
            .toBe(true);
        });

        it('should return correct class with allDay', () => {
          const appointment = new Appointment({
            viewModel: {
              ...defaultViewModel,
              info: {
                ...defaultViewModel.info,
                allDay: true,
              },
            },
          });

          const defaultClasses = 'dx-scheduler-appointment dx-scheduler-appointment-vertical';

          expect(appointment.classes)
            .toBe(`${defaultClasses} dx-scheduler-all-day-appointment`);
        });

        (['head', 'body', 'tail'] as ReduceType[]).forEach((appointmentReduced) => {
          it(`should return correct class if ${appointmentReduced} is reduced`, () => {
            const appointment = new Appointment({
              viewModel: {
                ...defaultViewModel,
                info: {
                  ...defaultViewModel.info,
                  appointmentReduced,
                },
              },
            });

            const defaultClasses = 'dx-scheduler-appointment dx-scheduler-appointment-vertical';

            expect(appointment.classes)
              .toBe(`${defaultClasses} dx-scheduler-appointment-reduced dx-scheduler-appointment-${appointmentReduced}`);
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

      describe('isReduced', () => {
        it('should be false by default', () => {
          const appointment = new Appointment({
            viewModel: defaultViewModel,
          });

          expect(appointment.isReduced)
            .toBe(false);
        });

        (['head', 'body', 'tail'] as ReduceType[]).forEach((appointmentReduced) => {
          it(`shoud have correct value if appointment ${appointmentReduced} is reduced`, () => {
            const appointment = new Appointment({
              viewModel: {
                ...defaultViewModel,
                info: {
                  ...defaultViewModel.info,
                  appointmentReduced,
                },
              },
            });

            expect(appointment.isReduced)
              .toBe(true);
          });
        });
      });
    });
  });
});
