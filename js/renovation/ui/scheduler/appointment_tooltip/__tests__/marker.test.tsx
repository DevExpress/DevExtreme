import { shallow, ShallowWrapper } from 'enzyme';
import { Marker, viewFunction as MarkerView } from '../marker';
import { Deferred } from '../../../../../core/utils/deferred';

describe('Marker', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(MarkerView({
      ...viewModel,
      props: { ...viewModel.props },
    }));

    it('should render components correctly', () => {
      const marker = render({});

      expect(marker.is('.dx-tooltip-appointment-item-marker'))
        .toEqual(true);
      expect(marker.children())
        .toHaveLength(1);

      const childDiv = marker.childAt(0);
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
      const marker = render({
        style: { background: 'appointmentColor' },
      });

      const childDiv = marker.find('.dx-tooltip-appointment-item-marker-body');
      expect(childDiv.prop('style'))
        .toEqual({
          background: 'appointmentColor',
        });
    });

    it('should combine `className` with predefined classes', () => {
      const tree = render({ props: { className: 'custom-class' } });

      expect(tree.hasClass('dx-tooltip-appointment-item-marker'))
        .toBe(true);
      expect(tree.hasClass('custom-class'))
        .toBe(true);
    });

    it('should spread restAttributes', () => {
      const tree = render({ restAttributes: { 'custom-attribute': 'customAttribute' } });

      expect(tree.prop('custom-attribute'))
        .toBe('customAttribute');
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      describe('colorEffect', () => {
        it('should set color correctly', () => {
          const color = 'color';
          const deferredColor = new Deferred<string>();
          const colorPromise = deferredColor.promise();
          deferredColor.resolve(color);

          const marker = new Marker({ color: colorPromise });

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
  });

  describe('Logic', () => {
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
});
