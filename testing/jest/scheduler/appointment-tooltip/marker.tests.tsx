import { h } from 'preact';
import { mount, ReactWrapper } from 'enzyme';
import Marker from '../../../../js/renovation/scheduler/appointment-tooltip/marker.p';
import { Deferred } from '../../../../js/core/utils/deferred';
import { MarkerProps } from '../../../../js/renovation/scheduler/appointment-tooltip/marker';

describe('Marker', () => {
  describe('View', () => {
    const render = (props = {}): ReactWrapper => {
      window.h = h;
      return mount(<Marker {...(new MarkerProps())} {...props} />).childAt(0);
    };
    const defaultProps: MarkerProps = {};

    it('should render components correctly', () => {
      const tree = render(defaultProps);

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
        .toEqual({});
    });

    it('should set color correctly', () => {
      const color = 'color';
      const deferredColor = Deferred() as any;
      deferredColor.resolve(color);

      const tree = render({
        ...defaultProps,
        color: deferredColor.promise(),
      });


      const childDiv = tree.find('.dx-tooltip-appointment-item-marker-body');
      expect(childDiv.prop('style'))
        .toEqual({
          background: 'color',
        });
    });
  });
});
