import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction } from '../content';

describe('AppointmentContent', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(viewFunction({
      props: {
        text: '',
        dateText: '',
      },
      ...viewModel,
    }));

    it('it should has correct render', () => {
      const appointmentContent = render({});

      expect(appointmentContent.hasClass('dx-scheduler-appointment-content'))
        .toBe(true);

      expect(appointmentContent.is('div'))
        .toBe(true);
    });

    it('it should has correct title', () => {
      const appointmentContent = render({
        props: {
          text: 'Appointment Text',
        },
      });

      const title = appointmentContent.find('.dx-scheduler-appointment-title');

      expect(title.length)
        .toBe(1);

      expect(title.text())
        .toBe('Appointment Text');
    });

    it('it should has correct dateText', () => {
      const appointmentContent = render({
        props: {
          dateText: 'Date Text',
        },
      });

      const dateText = appointmentContent.find('.dx-scheduler-appointment-content-date');

      expect(dateText.length)
        .toBe(1);

      expect(dateText.text())
        .toBe('Date Text');
    });
  });
});
