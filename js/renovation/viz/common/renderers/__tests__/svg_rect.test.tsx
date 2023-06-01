import React, { createRef } from 'react';
import { shallow } from 'enzyme';
import { RectSvgElement, RectSvgElementProps, viewFunction as RectSvgComponent } from '../svg_rect';
import * as utilsModule from '../utils';

describe('RectSvgElement', () => {
  const rectRef = createRef();
  const parsedProps = {
    x: 10,
    y: 20,
    width: 30,
    height: 15,
    strokeWidth: 2,
    fill: 'red',
    stroke: '#ffaa66',
    opacity: 0.8,
  } as RectSvgElementProps;
  const viewModel = {
    rectRef: rectRef as unknown as SVGGraphicsElement,
    parsedProps,
  };

  describe('View', () => {
    it('should pass parsed props and ref', () => {
      const rect = shallow(<RectSvgComponent {...viewModel as any} />);

      expect(rect.props()).toMatchObject({ ...parsedProps });
      expect(rect.instance()).toBe(rectRef.current);
    });

    it('should pass transform and dash style', () => {
      jest.spyOn(utilsModule, 'getGraphicExtraProps').mockImplementation(() => ({ transform: 'transformation', 'stroke-dasharray': 'dash' }));
      const rect = shallow(<RectSvgComponent {...viewModel as any} />);

      expect(rect.props()).toMatchObject({ transform: 'transformation', 'stroke-dasharray': 'dash' });
      expect(utilsModule.getGraphicExtraProps)
        .toHaveBeenCalledWith(parsedProps, parsedProps.x, parsedProps.y);
    });
  });

  describe('Logic', () => {
    describe('parsedProps', () => {
      it('should return empty props by default', () => {
        const rect = new RectSvgElement({});
        expect(rect.parsedProps).toEqual({});
      });

      it('should return props.x when x != undefined', () => {
        const rect = new RectSvgElement({ x: 5 });
        expect(rect.parsedProps).toEqual({
          x: 5,
          y: 0,
          width: 0,
          height: 0,
        });
      });

      it('should return props.y when y != undefined', () => {
        const rect = new RectSvgElement({ y: 5 });
        expect(rect.parsedProps).toEqual({
          x: 0,
          y: 5,
          width: 0,
          height: 0,
        });
      });

      it('should return props.width when width != undefined', () => {
        const rect = new RectSvgElement({ width: 20 });
        expect(rect.parsedProps).toEqual({
          x: 0,
          y: 0,
          width: 20,
          height: 0,
        });
      });

      it('should return strokeWidth === 0 when props.strokeWidth != undefined, props.width != undefined, props.height = undefined', () => {
        const rect = new RectSvgElement({ width: 2, strokeWidth: 3 });
        expect(rect.parsedProps).toEqual({
          x: 0,
          y: 0,
          width: 2,
          height: 0,
          strokeWidth: 0,
        });
      });

      it('should return props.strokeWidth when props.width > props.height, props.width > props.strokeWidth', () => {
        const rect = new RectSvgElement({ width: 20, height: 10, strokeWidth: 2 });
        expect(rect.parsedProps).toEqual({
          x: 1,
          y: 1,
          width: 18,
          height: 8,
          strokeWidth: 2,
        });
      });

      it('should return props.strokeWidth when props.width < props.height, props.height > props.strokeWidth', () => {
        const rect = new RectSvgElement({ width: 10, height: 20, strokeWidth: 2 });
        expect(rect.parsedProps).toEqual({
          x: 1,
          y: 1,
          width: 8,
          height: 18,
          strokeWidth: 2,
        });
      });

      it('should return calculated strokeWidth when props.width === props.height, props.width < props.strokeWidth', () => {
        const rect = new RectSvgElement({ width: 4, height: 4, strokeWidth: 6 });
        expect(rect.parsedProps).toEqual({
          x: 1,
          y: 1,
          width: 2,
          height: 2,
          strokeWidth: 2,
        });
      });
    });

    it('should set sharp to false', () => {
      const rect = new RectSvgElement({ sharp: 'h' });
      expect(rect.parsedProps.sharp).toBe(false);
    });
  });
});
