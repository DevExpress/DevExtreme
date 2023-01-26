import { shallow, ShallowWrapper } from 'enzyme';
import { AppointmentTitle, AppointmentTitleProps, viewFunction } from '../layout';

const CLASSES = {
  title: 'dx-scheduler-appointment-title',
};

describe('AppointmentTitle', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(viewFunction({
      props: {
        text: '',
      },
      ...viewModel,
    }));

    it('should has correct render', () => {
      const title = render({
        props: {
          text: 'Appointment Text',
        },
      });

      expect(title.hasClass(`${CLASSES.title}`))
        .toBe(true);

      expect(title.is('div'))
        .toBe(true);

      expect(title.text())
        .toBe('Appointment Text');
    });
  });

  describe('Logic', () => {
    describe('Default', () => {
      it('should be created with correct props', () => {
        const content = new AppointmentTitle(new AppointmentTitleProps());

        expect(content.props)
          .toEqual({
            text: '',
          });
      });
    });
  });
});
