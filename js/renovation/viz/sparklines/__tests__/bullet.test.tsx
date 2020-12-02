import React from 'react';
import { shallow } from 'enzyme';
import { Bullet, viewFunction as BulletComponent } from '../bullet';
import { PathSvgElement } from '../../core/renderers/svg_path';
import config from '../../../../core/config';

describe('Bullet', () => {
  const prepareInternalComponents = jest.fn(() => ({
    value: 50,
    startScaleValue: 0,
    endScaleValue: 100,
    target: 100,
  }));

  const getDefaultScaleProps = jest.fn(() => ({
    value: 0,
    startScaleValue: 0,
    endScaleValue: 0,
    target: 0,
  }));

  const shapeMethods = (
    valuePoints: number[],
    isValidTarget: boolean,
    targetPoints: number[],
    isValidZeroLevel: boolean,
    zeroLevelPoints: number[],
  ) => ({
    getBarValueShape: () => valuePoints,
    isValidTarget: () => isValidTarget,
    getTargetShape: () => targetPoints,
    isValidZeroLevel: () => isValidZeroLevel,
    getZeroLevelShape: () => zeroLevelPoints,
  });

  describe('View', () => {
    it('should pass all necessary properties to the BaseWidget (by default)', () => {
      const onCanvasChange = jest.fn();
      const cssClasses = 'bullet-classes';
      const cssClassName = 'some-class';
      const viewModel = {
        prepareInternalComponents: getDefaultScaleProps,
        onCanvasChange,
        cssClasses,
        rtlEnabled: false,
        cssClassName,
        props: { },
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element);

      expect(bullet.children()).toHaveLength(0);
      expect(bullet.props()).toMatchObject({
        canvasChange: onCanvasChange,
        disabled: false,
        rtlEnabled: false,
        pointerEvents: 'visible',
        className: cssClassName,
        classes: cssClasses,
      });
    });

    it('should pass all canvas properties to the BaseWidget (by default)', () => {
      const size = {
        width: 500,
        height: 50,
      };
      const margin = {
        top: 5,
        left: 10,
        right: 10,
        bottom: 5,
      };
      const defaultCanvas = {
        width: 300,
        height: 30,
        top: 3,
        left: 6,
        right: 6,
        bottom: 3,
      };
      const viewModel = {
        prepareInternalComponents: getDefaultScaleProps,
        props: {
          size,
          margin,
        },
        defaultCanvas,
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element);

      expect(bullet.children()).toHaveLength(0);
      expect(bullet.props()).toMatchObject({
        size,
        margin,
        defaultCanvas,
      });
    });

    it('should render value bar', () => {
      const points = [1, 2, 3, 4, 5, 6, 7, 8];
      const methods = shapeMethods(points, false, [], false, []);
      const viewModel = {
        prepareInternalComponents,
        ...methods,
        props: { color: '#e8c267' },
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element);

      expect(bullet.children()).toHaveLength(1);
      expect(bullet.find(PathSvgElement).props()).toEqual({
        d: '',
        type: 'line',
        points,
        className: 'dxb-bar-value',
        strokeLineCap: 'square',
        fill: '#e8c267',
      });
    });

    it('should render target mark', () => {
      const points = [1, 2, 3, 4];
      const methods = shapeMethods([], true, points, false, []);
      const viewModel = {
        prepareInternalComponents,
        ...methods,
        props: {
          targetColor: '#666666',
          targetWidth: 4,
        },
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element);

      expect(bullet.children()).toHaveLength(2);
      expect(bullet.find(PathSvgElement).length).toBe(2);
      expect(bullet.childAt(1).props()).toEqual({
        d: '',
        type: 'line',
        points,
        className: 'dxb-target',
        sharp: true,
        strokeLineCap: 'square',
        stroke: '#666666',
        strokeWidth: 4,
      });
    });

    it('should render zero level mark', () => {
      const points = [1, 2, 3, 4];
      const methods = shapeMethods([], false, [], true, points);
      const viewModel = {
        prepareInternalComponents,
        ...methods,
        props: { targetColor: '#666666' },
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element);

      expect(bullet.children()).toHaveLength(2);
      expect(bullet.find(PathSvgElement).length).toBe(2);
      expect(bullet.childAt(1).props()).toEqual({
        d: '',
        type: 'line',
        points,
        className: 'dxb-zero-level',
        sharp: true,
        strokeLineCap: 'square',
        stroke: '#666666',
        strokeWidth: 1,
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        it('default classes', () => {
          const bullet = new Bullet({ });
          expect(bullet.cssClasses).toBe('dxb dxb-bullet');
        });

        it('should add className property', () => {
          const bullet = new Bullet({ classes: 'custom-class' });
          expect(bullet.cssClasses).toBe('dxb dxb-bullet custom-class');
        });
      });

      describe('cssClassName', () => {
        it('default className', () => {
          const bullet = new Bullet({ });
          expect(bullet.cssClassName).toBe('dx-bullet');
        });

        it('should add className property', () => {
          const bullet = new Bullet({ className: 'custom-class' });
          expect(bullet.cssClassName).toBe('dx-bullet custom-class');
        });
      });

      describe('rtlEnabled', () => {
        it('should return value from props if props has value', () => {
          const bullet = new Bullet({ rtlEnabled: false });
          // emulate context
          bullet.config = { rtlEnabled: true };

          expect(bullet.rtlEnabled).toBe(false);
        });

        it('should return value from parent rtlEnabled context if props isnt defined', () => {
          const bullet = new Bullet({ });
          // emulate context
          bullet.config = { rtlEnabled: true };
          expect(bullet.rtlEnabled).toBe(true);
        });

        it('should return value from config if any other props isnt defined', () => {
          config().rtlEnabled = true;
          const bullet = new Bullet({ });
          expect(bullet.rtlEnabled).toBe(true);
        });
      });

      describe('tooltipEnabled', () => {
        it('default', () => {
          const bullet = new Bullet({ });
          expect(bullet.tooltipEnabled).toBe(false);
        });

        it('it\'s enough value to enabled tooltip', () => {
          const bullet = new Bullet({ value: 10 });
          expect(bullet.tooltipEnabled).toBe(true);
        });

        it('it\'s enough target to enabled tooltip', () => {
          const bullet = new Bullet({ target: 100 });
          expect(bullet.tooltipEnabled).toBe(true);
        });
      });

      describe('defaultCanvas', () => {
        it('should return all params of canvas', () => {
          const bullet = new Bullet({ });
          expect(bullet.defaultCanvas).toEqual({
            width: 300,
            height: 30,
            left: 1,
            right: 1,
            top: 2,
            bottom: 2,
          });
        });
      });
    });

    describe('Internal Methods', () => {
      it('onCanvasChange', () => {
        const canvas = {
          height: 400,
          width: 600,
          top: 10,
          left: 20,
          right: 30,
          bottom: 40,
        };
        const bullet = new Bullet({ });
        bullet.onCanvasChange(canvas);

        expect(bullet.canvasState).toEqual(canvas);
      });

      describe('prepareScaleProps', () => {
        it('get default scale props by prepareScaleProps', () => {
          const bullet = new Bullet({ });
          const scaleProps = bullet.prepareScaleProps();

          expect(scaleProps).toEqual({
            inverted: false,
            value: 0,
            target: 0,
            startScaleValue: 0,
            endScaleValue: 0,
          });
        });

        it('get scale props by target and value (target > value > 0)', () => {
          const bullet = new Bullet({ target: 200, value: 100 });
          const scaleProps = bullet.prepareScaleProps();

          expect(scaleProps).toEqual({
            inverted: false,
            value: 100,
            target: 200,
            startScaleValue: 0,
            endScaleValue: 200,
          });
        });

        it('get scale props by target and value (target < value < 0)', () => {
          const bullet = new Bullet({ target: -200, value: -100 });
          const scaleProps = bullet.prepareScaleProps();

          expect(scaleProps).toEqual({
            inverted: false,
            value: -100,
            target: -200,
            startScaleValue: -200,
            endScaleValue: -100,
          });
        });

        it('get scale props by startScaleValue and endScaleValue (startScaleValue < endScaleValue)', () => {
          const bullet = new Bullet({ startScaleValue: 100, endScaleValue: 200 });
          const scaleProps = bullet.prepareScaleProps();

          expect(scaleProps).toEqual({
            inverted: false,
            value: 0,
            target: 0,
            startScaleValue: 100,
            endScaleValue: 200,
          });
        });

        it('get inverted scale props by startScaleValue and endScaleValue (startScaleValue < endScaleValue)', () => {
          const bullet = new Bullet({ startScaleValue: 200, endScaleValue: 100 });
          const scaleProps = bullet.prepareScaleProps();

          expect(scaleProps).toEqual({
            inverted: true,
            value: 0,
            target: 0,
            startScaleValue: 100,
            endScaleValue: 200,
          });
        });
      });

      describe('Shapes', () => {
        let getTranslator = () => ({ translate: (x: number) => x * 10 });

        describe('getBarValueShape', () => {
          describe('value > 0', () => {
            it('startScaleValue > 0 and value < endScaleValue', () => {
              const scaleProps = {
                inverted: false,
                value: 15,
                target: 15,
                startScaleValue: 10,
                endScaleValue: 20,
              };
              const bullet = new Bullet({ });
              bullet.argumentAxis.getTranslator = getTranslator;
              bullet.valueAxis.getTranslator = getTranslator;
              const valueShape = bullet.getBarValueShape(scaleProps);

              expect(valueShape).toEqual([100, 9, 150, 9, 150, 1, 100, 1]);
            });

            it('startScaleValue > 0 and value > endScaleValue', () => {
              const scaleProps = {
                inverted: false,
                value: 25,
                target: 15,
                startScaleValue: 10,
                endScaleValue: 20,
              };
              const bullet = new Bullet({ });
              bullet.argumentAxis.getTranslator = getTranslator;
              bullet.valueAxis.getTranslator = getTranslator;
              const valueShape = bullet.getBarValueShape(scaleProps);

              expect(valueShape).toEqual([100, 9, 200, 9, 200, 1, 100, 1]);
            });

            it('startScaleValue > 0 and value < startScaleValue', () => {
              const scaleProps = {
                inverted: false,
                value: 5,
                target: 15,
                startScaleValue: 10,
                endScaleValue: 20,
              };
              const bullet = new Bullet({ });
              bullet.argumentAxis.getTranslator = getTranslator;
              bullet.valueAxis.getTranslator = getTranslator;
              const valueShape = bullet.getBarValueShape(scaleProps);

              expect(valueShape).toEqual([100, 9, 100, 9, 100, 1, 100, 1]);
            });

            it('startScaleValue < 0 and value < endScaleValue', () => {
              const scaleProps = {
                inverted: false,
                value: 15,
                target: 15,
                startScaleValue: -10,
                endScaleValue: 20,
              };
              const bullet = new Bullet({ });
              bullet.argumentAxis.getTranslator = getTranslator;
              bullet.valueAxis.getTranslator = getTranslator;
              const valueShape = bullet.getBarValueShape(scaleProps);

              expect(valueShape).toEqual([0, 9, 150, 9, 150, 1, 0, 1]);
            });
          });

          describe('value < 0', () => {
            it('endScaleValue < 0 and value > startScaleValue', () => {
              const scaleProps = {
                inverted: false,
                value: -15,
                target: -15,
                startScaleValue: -20,
                endScaleValue: -10,
              };
              const bullet = new Bullet({ });
              bullet.argumentAxis.getTranslator = getTranslator;
              bullet.valueAxis.getTranslator = getTranslator;
              const valueShape = bullet.getBarValueShape(scaleProps);

              expect(valueShape).toEqual([-100, 9, -150, 9, -150, 1, -100, 1]);
            });

            it('endScaleValue < 0 and value < startScaleValue', () => {
              const scaleProps = {
                inverted: false,
                value: -25,
                target: -15,
                startScaleValue: -20,
                endScaleValue: -10,
              };
              const bullet = new Bullet({ });
              bullet.argumentAxis.getTranslator = getTranslator;
              bullet.valueAxis.getTranslator = getTranslator;
              const valueShape = bullet.getBarValueShape(scaleProps);

              expect(valueShape).toEqual([-100, 9, -200, 9, -200, 1, -100, 1]);
            });

            it('endScaleValue < 0 and value > endScaleValue', () => {
              const scaleProps = {
                inverted: false,
                value: -5,
                target: -15,
                startScaleValue: -20,
                endScaleValue: -10,
              };
              const bullet = new Bullet({ });
              bullet.argumentAxis.getTranslator = getTranslator;
              bullet.valueAxis.getTranslator = getTranslator;
              const valueShape = bullet.getBarValueShape(scaleProps);

              expect(valueShape).toEqual([-100, 9, -100, 9, -100, 1, -100, 1]);
            });

            it('endScaleValue > 0 and value > startScaleValue', () => {
              const scaleProps = {
                inverted: false,
                value: -15,
                target: -15,
                startScaleValue: -20,
                endScaleValue: 5,
              };
              const bullet = new Bullet({ });
              bullet.argumentAxis.getTranslator = getTranslator;
              bullet.valueAxis.getTranslator = getTranslator;
              const valueShape = bullet.getBarValueShape(scaleProps);

              expect(valueShape).toEqual([0, 9, -150, 9, -150, 1, 0, 1]);
            });
          });
        });

        it('getTargetShape', () => {
          const scaleProps = {
            inverted: false,
            value: 15,
            target: 15,
            startScaleValue: 10,
            endScaleValue: 20,
          };
          const bullet = new Bullet({ });
          bullet.argumentAxis.getTranslator = getTranslator;
          bullet.valueAxis.getTranslator = getTranslator;
          const valueShape = bullet.getTargetShape(scaleProps);

          expect(valueShape).toEqual([150, 0.2, 150, 9.8]);
        });

        it('getZeroLevelShape', () => {
          getTranslator = () => ({ translate: (x: number) => x * 100 + 10 });
          const bullet = new Bullet({ });
          bullet.argumentAxis.getTranslator = getTranslator;
          bullet.valueAxis.getTranslator = getTranslator;
          const valueShape = bullet.getZeroLevelShape();

          expect(valueShape).toEqual([10, 12, 10, 108]);
        });
      });

      describe('isValidTarget', () => {
        it('should hide target - showTarget = false', () => {
          const scaleProps = {
            inverted: false,
            value: 100,
            target: 150,
            startScaleValue: 0,
            endScaleValue: 200,
          };
          const bullet = new Bullet({ showTarget: false });

          expect(bullet.isValidTarget(scaleProps)).toBe(false);
        });

        it('should hide target - target > endScaleValue', () => {
          const scaleProps = {
            inverted: false,
            value: 100,
            target: 250,
            startScaleValue: 0,
            endScaleValue: 200,
          };
          const bullet = new Bullet({ showTarget: true });

          expect(bullet.isValidTarget(scaleProps)).toBe(false);
        });

        it('should hide target - target < startScaleValue', () => {
          const scaleProps = {
            inverted: false,
            value: 100,
            target: 0,
            startScaleValue: 50,
            endScaleValue: 200,
          };
          const bullet = new Bullet({ showTarget: true });

          expect(bullet.isValidTarget(scaleProps)).toBe(false);
        });

        it('should show target', () => {
          const scaleProps = {
            inverted: false,
            value: 100,
            target: 150,
            startScaleValue: 0,
            endScaleValue: 200,
          };
          const bullet = new Bullet({ showTarget: true });

          expect(bullet.isValidTarget(scaleProps)).toBe(true);
        });
      });

      describe('isValidZeroLevel', () => {
        it('should hide target - showZeroLevel = false', () => {
          const scaleProps = {
            inverted: false,
            value: 100,
            target: 150,
            startScaleValue: 0,
            endScaleValue: 200,
          };
          const bullet = new Bullet({ showZeroLevel: false });

          expect(bullet.isValidZeroLevel(scaleProps)).toBe(false);
        });

        it('should hide zero level - endScaleValue < 0', () => {
          const scaleProps = {
            inverted: false,
            value: 100,
            target: 250,
            startScaleValue: 0,
            endScaleValue: -200,
          };
          const bullet = new Bullet({ showZeroLevel: true });

          expect(bullet.isValidZeroLevel(scaleProps)).toBe(false);
        });

        it('should hide zero level - startScaleValue> 0', () => {
          const scaleProps = {
            inverted: false,
            value: 100,
            target: 0,
            startScaleValue: 50,
            endScaleValue: 200,
          };
          const bullet = new Bullet({ showZeroLevel: true });

          expect(bullet.isValidZeroLevel(scaleProps)).toBe(false);
        });

        it('should show zero level', () => {
          const scaleProps = {
            inverted: false,
            value: 100,
            target: 150,
            startScaleValue: 0,
            endScaleValue: 200,
          };
          const bullet = new Bullet({ showZeroLevel: true });

          expect(bullet.isValidZeroLevel(scaleProps)).toBe(true);
        });
      });

      describe('updateRange', () => {
        it('should not invert arg axis by default', () => {
          const scaleProps = {
            inverted: false,
            value: 5,
            target: 15,
            startScaleValue: 0,
            endScaleValue: 20,
          };
          const bullet = new Bullet({ rtlEnabled: false });
          const axesRanges = bullet.updateRange(scaleProps);

          expect(axesRanges).toEqual({
            arg: {
              invert: false,
              min: 0,
              max: 20,
              axisType: 'continuous',
              dataType: 'numeric',
            },
            val: {
              min: 0,
              max: 1,
              axisType: 'continuous',
              dataType: 'numeric',
            },
          });
        });

        it('should not invert arg axis by rtlEnabled', () => {
          const scaleProps = {
            inverted: false,
            value: 5,
            target: 15,
            startScaleValue: 0,
            endScaleValue: 20,
          };
          const bullet = new Bullet({ rtlEnabled: true });
          const axesRanges = bullet.updateRange(scaleProps);

          expect(axesRanges).toMatchObject({
            arg: {
              invert: true,
            },
          });
        });
      });

      describe('updateWidgetElements', () => {
        it('should update axes with range and canvas', () => {
          const scaleProps = {
            inverted: false,
            value: 5,
            target: 15,
            startScaleValue: 0,
            endScaleValue: 20,
          };
          const canvas = {
            height: 40,
            width: 400,
            top: 1,
            left: 2,
            right: 3,
            bottom: 4,
          };
          const updateArgumentAxis = jest.fn();
          const updateValueAxis = jest.fn();
          const bullet = new Bullet({ rtlEnabled: false });
          bullet.canvasState = canvas;
          bullet.argumentAxis.update = updateArgumentAxis;
          bullet.valueAxis.update = updateValueAxis;
          bullet.updateWidgetElements(scaleProps);

          expect(updateArgumentAxis).toBeCalledTimes(1);
          expect(updateArgumentAxis).toHaveBeenCalledWith({
            invert: false,
            min: 0,
            max: 20,
            axisType: 'continuous',
            dataType: 'numeric',
          }, canvas, undefined);
          expect(updateValueAxis).toBeCalledTimes(1);
          expect(updateValueAxis).toHaveBeenCalledWith({
            min: 0,
            max: 1,
            axisType: 'continuous',
            dataType: 'numeric',
          }, canvas, undefined);
        });
      });

      describe('prepareInternalComponents', () => {
        it('should prepare scale props and update axes', () => {
          const updateWidgetElements = jest.fn();
          const bullet = new Bullet({ startScaleValue: 100, endScaleValue: 200 });
          bullet.updateWidgetElements = updateWidgetElements;
          const scaleProps = bullet.prepareInternalComponents();

          expect(updateWidgetElements).toBeCalledTimes(1);
          expect(updateWidgetElements).toBeCalledWith(scaleProps);
          expect(scaleProps).toEqual({
            inverted: false,
            value: 0,
            target: 0,
            startScaleValue: 100,
            endScaleValue: 200,
          });
        });
      });
    });
  });
});
