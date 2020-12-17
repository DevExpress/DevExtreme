import React, { createRef } from 'react';
import { shallow } from 'enzyme';
import { RectSvgElement, RectSvgElementProps, viewFunction as RectSvgComponent } from '../svg_rect';

describe('RectSvgElement', () => {
  describe('View', () => {
    it('should pass parsed props and ref', () => {
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
      const rect = shallow(<RectSvgComponent {...viewModel as any} /> as JSX.Element);

      expect(rect.props()).toMatchObject({ ...parsedProps });
      expect(rect.instance()).toBe(rectRef.current);
    });
  });

  describe('Behavior', () => {
    describe('effectUpdateShape', () => {
      const rectProps = {
        height: 50,
        width: 100,
        stroke: 'red',
        strokeWidth: 4,
      };

      it('should set dash attributes to rect when dashStyle=dash', () => {
        const rect = new RectSvgElement({
          ...rectProps,
          dashStyle: 'dash',
        });
        rect.rectRef = { setAttribute: jest.fn() } as any;
        rect.effectUpdateShape();
        expect(rect.rectRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(rect.rectRef.setAttribute).toHaveBeenCalledWith('stroke-dasharray', '16,12');
      });

      it('should set dash attributes to rect when dashStyle=longdash dot', () => {
        const rect = new RectSvgElement({
          ...rectProps,
          dashStyle: 'longdash dot',
        });
        rect.rectRef = { setAttribute: jest.fn() } as any;
        rect.effectUpdateShape();
        expect(rect.rectRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(rect.rectRef.setAttribute).toHaveBeenCalledWith('stroke-dasharray', '32,12,4,12');
      });

      it('should set transformation attributes to rect', () => {
        const rect = new RectSvgElement({
          ...rectProps,
          rotate: 25,
          translateX: 15,
          translateY: -25,
          scaleX: 1.1,
          scaleY: 0.8,
        });
        rect.rectRef = { setAttribute: jest.fn() } as any;
        rect.effectUpdateShape();
        expect(rect.rectRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(rect.rectRef.setAttribute).toHaveBeenCalledWith('transform', 'translate(15,-25) rotate(25,2,2) scale(1.1,0.8)');
      });
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
