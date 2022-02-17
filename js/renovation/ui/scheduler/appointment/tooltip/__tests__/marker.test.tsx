import { shallow, ShallowWrapper } from 'enzyme';
import { Marker, viewFunction } from '../marker';

describe('Tooltip marker', () => {
  const render = (viewModel): ShallowWrapper => shallow(viewFunction({
    ...viewModel,
    props: { ...viewModel.props },
  }));

  describe('Render', () => {
    it('should have correct render', () => {
      const marker = render({});
      const markerBody = marker.childAt(0);

      expect(marker.is('div'))
        .toBe(true);

      expect(marker.hasClass('dx-tooltip-appointment-item-marker'))
        .toBe(true);

      expect(markerBody.is('div'))
        .toBe(true);

      expect(markerBody.hasClass('dx-tooltip-appointment-item-marker-body'))
        .toBe(true);
    });

    it('should set color correctly', () => {
      const marker = render({
        style: { background: 'appointmentColor' },
      });

      const childDiv = marker.find('.dx-tooltip-appointment-item-marker-body');
      expect(childDiv.prop('style'))
        .toEqual({
          background: 'appointmentColor',
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('style', () => {
        it('should return correct style', () => {
          const color = 'color';

          const marker = new Marker({});
          marker.props.color = color;

          expect(marker.style)
            .toEqual({ background: 'color' });
        });
      });
    });
  });
});
