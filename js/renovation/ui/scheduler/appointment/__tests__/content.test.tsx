import { shallow, ShallowWrapper } from 'enzyme';
import { AppointmentContent, AppointmentContentProps, viewFunction } from '../content';

const CLASSES = {
  content: 'dx-scheduler-appointment-content',
  title: 'dx-scheduler-appointment-title',
  dateText: 'dx-scheduler-appointment-content-date',
  recurrence: {
    icon: 'dx-scheduler-appointment-recurrence-icon',
    iconRepeat: 'dx-icon-repeat',
  },
};

describe('AppointmentContent', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(viewFunction({
      props: {
        text: '',
        dateText: '',
        isRecurrent: false,
      },
      ...viewModel,
    }));

    it('should has correct render', () => {
      const appointmentContent = render({});

      expect(appointmentContent.hasClass(`${CLASSES.content}`))
        .toBe(true);

      expect(appointmentContent.is('div'))
        .toBe(true);
    });

    it('should has correct title', () => {
      const appointmentContent = render({
        props: {
          text: 'Appointment Text',
        },
      });

      const title = appointmentContent.find(`.${CLASSES.title}`);

      expect(title.length)
        .toBe(1);

      expect(title.text())
        .toBe('Appointment Text');
    });

    it('should has correct dateText', () => {
      const appointmentContent = render({
        props: {
          dateText: 'Date Text',
        },
      });

      const dateText = appointmentContent.find(`.${CLASSES.dateText}`);

      expect(dateText.length)
        .toBe(1);

      expect(dateText.text())
        .toBe('Date Text');
    });

    it('should render recurrent icon if isRecurrent', () => {
      const appointmentContent = render({
        props: {
          isRecurrent: true,
        },
      });

      const recurrentIcon = appointmentContent.find(`.${CLASSES.recurrence.icon}.${CLASSES.recurrence.iconRepeat}`);

      expect(recurrentIcon)
        .toHaveLength(1);
    });
  });

  describe('Logic', () => {
    describe('Default', () => {
      it('should be created with correct props', () => {
        const content = new AppointmentContent(new AppointmentContentProps());

        expect(content.props)
          .toEqual({
            text: '',
            dateText: '',
            isRecurrent: false,
          });
      });
    });
  });
});
