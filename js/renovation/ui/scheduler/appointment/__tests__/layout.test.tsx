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

    it('should spread restAttributes', () => {
      const layout = render({
        restAttributes: { 'custom-attribute': 'customAttribute' },
        props: { items: [] },
      });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
    });

    it('it should be rendered correctly with empty items', () => {
      const layout = render({ props: { items: [] } });

      expect(layout.hasClass('dx-scheduler-appointments'))
        .toEqual(true);
    });

    it('it should be rendered correctly with items', () => {
      const layout = render({
        props: {
          items: [
            { appointment: { text: 'appt-1' } },
            { appointment: { text: 'appt-2' } },
            { appointment: { text: 'appt-3' } },
          ],
        },
      });

      expect(layout.hasClass('dx-scheduler-appointments'))
        .toEqual(true);

      expect(layout.children().length)
        .toEqual(3);
    });
  });
});
