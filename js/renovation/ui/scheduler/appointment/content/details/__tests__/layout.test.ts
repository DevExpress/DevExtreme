import { shallow, ShallowWrapper } from 'enzyme';
import { AppointmentDetails, AppointmentDetailsProps, viewFunction } from '../layout';

const CLASSES = {
  details: 'dx-scheduler-appointment-content-details',
  dateText: 'dx-scheduler-appointment-content-date',
};

describe('AppointmentDetails', () => {
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
      const appointmentDetails = render({
        props: {
          dateText: 'Date Text',
        },
      });

      expect(appointmentDetails.hasClass(CLASSES.details))
        .toBe(true);

      expect(appointmentDetails.find(`.${CLASSES.dateText}`))
        .toHaveLength(1);

      expect(appointmentDetails.text())
        .toBe('Date Text');
    });
  });

  describe('Logic', () => {
    describe('Default', () => {
      it('should be created with correct props', () => {
        const content = new AppointmentDetails(new AppointmentDetailsProps());

        expect(content.props)
          .toEqual({
            dateText: '',
          });
      });
    });
  });
});
