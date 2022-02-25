import { shallow, ShallowWrapper } from 'enzyme';
import { viewFunction } from '../marker';

describe('Tooltip marker', () => {
  describe('Render', () => {
    const render = (): ShallowWrapper => shallow(viewFunction());

    it('it should have correct render', () => {
      const marker = render();
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
  });
});
