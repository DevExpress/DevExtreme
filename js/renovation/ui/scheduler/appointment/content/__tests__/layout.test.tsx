import { shallow, ShallowWrapper } from 'enzyme';
import { AppointmentDetails } from '../details/layout';
import { AppointmentContent, AppointmentContentProps, viewFunction } from '../layout';
import { AppointmentTitle } from '../title/layout';

const CLASSES = {
  content: 'dx-scheduler-appointment-content',
  title: 'dx-scheduler-appointment-title',
  dateText: 'dx-scheduler-appointment-content-date',
  recurrence: {
    icon: 'dx-scheduler-appointment-recurrence-icon',
    iconRepeat: 'dx-icon-repeat',
  },
  reducedIcon: 'dx-scheduler-appointment-reduced-icon',
};

describe('AppointmentContent', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(viewFunction({
      props: {
        text: '',
        dateText: '',
        isRecurrent: false,
        isReduced: false,
        index: 0,
        data: null,
        appointmentTemplate: jest.fn(),
      },
      ...viewModel,
    }));

    it('should has correct render', () => {
      const appointmentContent = render({
        props: {
          text: 'Appointment Text',
          dateText: 'Date Text',
        },
      });

      const title = appointmentContent.childAt(0);
      expect(title.type())
        .toBe(AppointmentTitle);
      expect(title.props())
        .toEqual({
          text: 'Appointment Text',
        });

      const details = appointmentContent.childAt(1);
      expect(details.type())
        .toBe(AppointmentDetails);

      expect(details.props())
        .toEqual({
          dateText: 'Date Text',
        });
    });

    it('should not render recurrent and reduced icons', () => {
      const appointmentContent = render({ });

      const recurrentIcon = appointmentContent.find(`.${CLASSES.recurrence.icon}.${CLASSES.recurrence.iconRepeat}`);
      expect(recurrentIcon)
        .toHaveLength(0);

      const reducedIcon = appointmentContent.find(`.${CLASSES.reducedIcon}`);
      expect(reducedIcon)
        .toHaveLength(0);
    });

    it('should render recurrent icon', () => {
      const appointmentContent = render({
        props: {
          isRecurrent: true,
        },
      });

      const recurrentIcon = appointmentContent.find(`.${CLASSES.recurrence.icon}.${CLASSES.recurrence.iconRepeat}`);

      expect(recurrentIcon)
        .toHaveLength(1);
    });

    it('should render reduced icon', () => {
      const appointmentContent = render({
        props: {
          isReduced: true,
        },
      });

      const reducedIcon = appointmentContent.find(`.${CLASSES.reducedIcon}`);

      expect(reducedIcon)
        .toHaveLength(1);
    });

    it('it should has correct render with template', () => {
      const templateProps = {
        data: { test: 'Test Data' },
        index: 1234,
      };
      const template = '<div class="some-template">Some Template</div>';
      const content = render({
        props: {
          ...templateProps,
          appointmentTemplate: template,
        },
      });

      expect(content.children())
        .toHaveLength(1);

      const appointmentTemplate = content.children();

      expect(appointmentTemplate.type())
        .toBe(template);

      expect(appointmentTemplate)
        .toHaveLength(1);

      expect(appointmentTemplate.props())
        .toEqual(templateProps);
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
            isReduced: false,
            index: 0,
            data: undefined,
            appointmentTemplate: undefined,
          });
      });
    });
  });
});
