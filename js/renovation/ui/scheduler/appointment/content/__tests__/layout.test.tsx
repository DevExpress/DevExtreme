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

      expect(reducedIcon.props())
        .toEqual({
          className: 'dx-scheduler-appointment-reduced-icon',
        });
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

  describe('Behavior', () => {
    describe('bindHoverEffect', () => {
      it('should correctly handle events from the reduced icon element', () => {
        const addEventListener = jest.fn();
        const removeEventListener = jest.fn();
        const showReducedIconTooltip = jest.fn();
        const hideReducedIconTooltip = jest.fn();

        const content = new AppointmentContent({
          ...new AppointmentContentProps(),
          showReducedIconTooltip,
          hideReducedIconTooltip,
          data: { appointmentData: {} },
        });

        content.refReducedIcon = {
          current: {
            addEventListener,
            removeEventListener,
          },
        } as any;

        const freeResources = content.bindHoverEffect() as any;

        expect(addEventListener)
          .toHaveBeenCalledTimes(2);

        expect(addEventListener)
          .toBeCalledWith('mouseenter', expect.any(Function));
        expect(addEventListener)
          .lastCalledWith('mouseleave', expect.any(Function));

        addEventListener.mock.calls[0][1]();
        expect(showReducedIconTooltip)
          .toBeCalled();
        addEventListener.mock.calls[1][1]();
        expect(hideReducedIconTooltip)
          .toBeCalled();

        freeResources();

        expect(removeEventListener)
          .toHaveBeenCalledTimes(2);

        expect(removeEventListener)
          .toBeCalledWith('mouseenter', expect.any(Function));
        expect(removeEventListener)
          .lastCalledWith('mouseleave', expect.any(Function));

        removeEventListener.mock.calls[0][1]();
        expect(showReducedIconTooltip)
          .toBeCalledTimes(2);
        removeEventListener.mock.calls[1][1]();
        expect(hideReducedIconTooltip)
          .toBeCalledTimes(2);
      });

      it('should do nothing if reduced icon ref is not defined', () => {
        const content = new AppointmentContent({
          ...new AppointmentContentProps(),
        });

        content.refReducedIcon = {
          undefined,
        } as any;

        expect(() => {
          const freeResources = content.bindHoverEffect();
          expect(freeResources)
            .not.toThrow();
        }).not.toThrow();
      });
    });

    describe('onReducedIconMouseEnter', () => {
      it('should invoke showReducedIconTooltip', () => {
        const showReducedIconTooltip = jest.fn();
        const content = new AppointmentContent({
          data: {
            appointmentData: {
              endDate: 'some value 0',
            },
          },
          showReducedIconTooltip,
        } as any);

        content.refReducedIcon = { current: 'some ref' } as any;

        content.onReducedIconMouseEnter();

        expect(showReducedIconTooltip)
          .toBeCalledWith({
            target: 'some ref',
            endDate: 'some value 0',
          });
      });
    });

    describe('onReducedIconMouseLeave', () => {
      it('should invoke hideReducedIconTooltip', () => {
        const hideReducedIconTooltip = jest.fn();
        const content = new AppointmentContent({
          hideReducedIconTooltip,
        } as any);

        content.onReducedIconMouseLeave();

        expect(hideReducedIconTooltip)
          .toBeCalledTimes(1);
      });
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
