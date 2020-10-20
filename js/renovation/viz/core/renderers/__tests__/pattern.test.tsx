import React from 'react';
import { shallow } from 'enzyme';
import { SvgPattern, SvgPatternProps, viewFunction as SvgPatternComponent } from '../pattern';
import { RectSvgElement } from '../svg_rect';
import { PathSvgElement } from '../svg_path';

describe('SvgPattern', () => {
  describe('View', () => {
    it('View with custom hatching', () => {
      const vm = {
        props: {
          id: 'DevExpress_1-hatching-1',
          hatching: { width: 2, opacity: 0.5 },
          color: '#ffaa66',
        } as SvgPatternProps,
        step: 8,
        d: 'Somepath 1 2 3 4',
      };
      const pattern = shallow(<SvgPatternComponent {...vm as any} /> as JSX.Element);

      expect(pattern.props()).toMatchObject({
        id: 'DevExpress_1-hatching-1',
        width: 8,
        height: 8,
      });
      expect(pattern.find(RectSvgElement).at(0).props()).toEqual({
        x: 0,
        y: 0,
        width: 8,
        height: 8,
        fill: '#ffaa66',
        opacity: 0.5,
      });
      expect(pattern.find(PathSvgElement).at(0).props()).toEqual({
        type: 'line',
        d: 'Somepath 1 2 3 4',
        strokeWidth: 2,
        stroke: '#ffaa66',
      });
    });

    it('View with default hatching', () => {
      const vm = {
        props: {
          id: 'DevExpress_1-hatching-1',
          hatching: undefined,
          color: '#ffaa66',
        } as SvgPatternProps,
        step: 8,
        d: 'Somepath 1 2 3 4',
      };
      const pattern = shallow(<SvgPatternComponent {...vm as any} /> as JSX.Element);

      expect(pattern.props()).toMatchObject({
        id: 'DevExpress_1-hatching-1',
        width: 8,
        height: 8,
      });
      expect(pattern.find(RectSvgElement).at(0).props()).toEqual({
        x: 0,
        y: 0,
        width: 8,
        height: 8,
        fill: '#ffaa66',
      });
      expect(pattern.find(RectSvgElement).at(0).props().opacity).toBe(undefined);
      expect(pattern.find(PathSvgElement).at(0).props()).toEqual({
        type: 'line',
        d: 'Somepath 1 2 3 4',
        strokeWidth: 1,
        stroke: '#ffaa66',
      });
    });
  });

  describe('Logic', () => {
    describe('step', () => {
      it('hatching.step = undefined', () => {
        const pattern = new SvgPattern({ id: 'DevExpress_1-hatching-1' });
        expect(pattern.step).toBe(6);
      });

      it('hatching.step = 8', () => {
        const pattern = new SvgPattern({ hatching: { step: 8 } });
        expect(pattern.step).toBe(8);
      });
    });

    describe('d', () => {
      it('default hatching', () => {
        const pattern = new SvgPattern({ id: 'DevExpress_1-hatching-1' });
        expect(pattern.d).toBe('M 0 0 L 6 6 M -3 3 L 3 9 M 3 -3 L 9 3');
      });

      it('hatching.direction = right', () => {
        const pattern = new SvgPattern({ hatching: { direction: 'right' } });
        expect(pattern.d).toBe('M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9');
      });

      it('hatching.step = 7', () => {
        const pattern = new SvgPattern({ hatching: { step: 7 } });
        expect(pattern.d).toBe('M 0 0 L 7 7 M -3.5 3.5 L 3.5 10.5 M 3.5 -3.5 L 10.5 3.5');
      });
    });
  });
});
