import { h } from 'preact';
import { shallow } from 'enzyme';
import Marker, { viewFunction as MarkerView } from '../../../../../js/renovation/scheduler/appointment-tooltip/marker';
import { Deferred } from '../../../../../js/core/utils/deferred';

describe('Marker', () => {
  describe('View', () => {
    const defaultProps = {};
    it('should render components correctly', () => {
      const tree = shallow(<MarkerView props={defaultProps} />);

      expect(tree.is('.dx-tooltip-appointment-item-marker'))
        .toEqual(true);
      expect(tree.children())
        .toHaveLength(1);

      const childDiv = tree.childAt(0);
      expect(childDiv.type())
        .toBe('div');
      expect(childDiv.is('.dx-tooltip-appointment-item-marker-body'))
        .toBe(true);
      expect(childDiv.children())
        .toHaveLength(0);
      expect(childDiv.prop('style'))
        .toBeUndefined();
    });

    it('should set color correctly', () => {
      const tree = shallow(
        <MarkerView props={defaultProps} style={{ background: 'appointmentColor' }} />,
      );

      const childDiv = tree.find('.dx-tooltip-appointment-item-marker-body');
      expect(childDiv.prop('style'))
        .toEqual({
          background: 'appointmentColor',
        });
    });

    it('should combine `className` with predefined classes', () => {
      const tree = shallow(<MarkerView props={{ className: 'custom-class' }} />);

      expect(tree.hasClass('dx-tooltip-appointment-item-marker'))
        .toBe(true);
      expect(tree.hasClass('custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const tree = shallow(
        <MarkerView
          restAttributes={{ customAttribute: 'customAttribute' }}
          props={defaultProps}
        />,
      );

      expect(tree.prop('customAttribute'))
        .toBe('customAttribute');
    });
  });

  describe('Effects', () => {
    describe('colorEffect', () => {
      it('should set color correctly', () => {
        const color = 'color';
        const deferredColor = new Deferred();
        deferredColor.resolve(color);

        const marker = new Marker({ color: deferredColor });

        marker.colorEffect();
        expect(marker.appointmentColor)
          .toBe('color');
      });

      it('should not set color', () => {
        const marker = new Marker({ color: undefined });

        marker.colorEffect();
        expect(marker.appointmentColor)
          .toBe(undefined);
      });
    });
  });

  describe('Getters', () => {
    describe('style', () => {
      it('should return correct style', () => {
        const color = 'color';

        const marker = new Marker({});
        marker.appointmentColor = color;

        expect(marker.style)
          .toEqual({ background: 'color' });
      });
    });
  });
});
