import React from 'react';
import { shallow } from 'enzyme';
import { PathSvgElement, PathSvgElementProps, viewFunction as PathSvgComponent } from '../svg_path';
import { Point } from '../types.d';

describe('PathSvgElement', () => {
  describe('View', () => {
    it('should pass props to path element', () => {
      const commonProps = {
        strokeWidth: 2,
        fill: 'red',
        stroke: '#ffaa66',
        opacity: 0.8,
        pointerEvents: 'pointerEvents',
      };
      const props = {
        points: [1, 2, 3, 4],
        type: 'line',
        strokeLineCap: 'square',
        ...commonProps,
      } as PathSvgElementProps;
      const viewModel = {
        d: 'M 1 2 L 3 4',
        props,
      };
      const path = shallow(<PathSvgComponent {...viewModel as any} /> as JSX.Element);

      expect(path.props()).toMatchObject({
        d: 'M 1 2 L 3 4',
        // eslint-disable-next-line spellcheck/spell-checker
        strokeLinecap: 'square',
        ...commonProps,
      });
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

      it('should set dash attributes to path when dashStyle=dash', () => {
        const path = new PathSvgElement({
          ...rectProps,
          dashStyle: 'dash',
        });
        path.pathRef = { setAttribute: jest.fn() } as any;
        path.effectUpdateShape();
        expect(path.pathRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(path.pathRef.setAttribute).toHaveBeenCalledWith('stroke-dasharray', '16,12');
      });

      it('should set dash attributes to path when dashStyle=longdash dot', () => {
        const path = new PathSvgElement({
          ...rectProps,
          dashStyle: 'longdash dot',
        });
        path.pathRef = { setAttribute: jest.fn() } as any;
        path.effectUpdateShape();
        expect(path.pathRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(path.pathRef.setAttribute).toHaveBeenCalledWith('stroke-dasharray', '32,12,4,12');
      });

      it('should set transformation attributes to path', () => {
        const path = new PathSvgElement({
          ...rectProps,
          rotate: 25,
          rotateX: 4,
          rotateY: 5,
          translateX: 15,
          translateY: -25,
          scaleX: 1.1,
          scaleY: 0.8,
        });
        path.pathRef = { setAttribute: jest.fn() } as any;
        path.effectUpdateShape();
        expect(path.pathRef.setAttribute).toHaveBeenCalledTimes(1);
        expect(path.pathRef.setAttribute).toHaveBeenCalledWith('transform', 'translate(15,-25) rotate(25,4,5) scale(1.1,0.8)');
      });
    });
  });

  describe('Logic', () => {
    describe('d', () => {
      const pathPoints: Point[] = [
        { x: 10, y: 20 },
        { x: 30, y: 70 },
        { x: 50, y: 40 },
        { x: 70, y: 75 },
        { x: 90, y: 120 },
        { x: 100, y: 50 },
        { x: 120, y: 60 },
      ];

      it('should pass shape from props.d', () => {
        const path = new PathSvgElement({ type: 'line', d: 'Path 1 2 3', points: undefined });
        expect(path.d).toBe('Path 1 2 3');
      });

      it('should calculate line shape by number[]', () => {
        const points = [50, 10, 50, 150];
        const path = new PathSvgElement({ type: 'line', points });
        expect(path.d).toBe('M 50 10 L 50 150');
      });

      it('should calculate line shape by number[][]', () => {
        const points = [
          [9, 12, 26, 12, 26, 14, 9, 14],
          [9, 17, 26, 17, 26, 19, 9, 19],
          [9, 22, 26, 22, 26, 24, 9, 24],
        ];
        const path = new PathSvgElement({ type: 'line', points });
        expect(path.d).toBe('M 9 12 L 26 12 L 26 14 L 9 14 M 9 17 L 26 17 L 26 19 L 9 19 M 9 22 L 26 22 L 26 24 L 9 24');
      });

      it('should calculate area shape by Points[]', () => {
        const path = new PathSvgElement({ type: 'area', points: pathPoints });
        expect(path.d).toBe('M 10 20 L 30 70 L 50 40 L 70 75 L 90 120 L 100 50 L 120 60 Z');
      });

      it('should calculate bezier shape by Points[]', () => {
        const path = new PathSvgElement({ type: 'bezier', points: pathPoints });
        expect(path.d).toBe('M 10 20 C 30 70 50 40 70 75 C 90 120 100 50 120 60');
      });
    });
  });
});
