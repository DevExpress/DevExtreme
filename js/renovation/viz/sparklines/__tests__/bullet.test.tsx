import React from 'react';
import { shallow } from 'enzyme';
import { Canvas } from '../../core/common/types.d';
import {
  clear as clearEventHandlers,
  defaultEvent,
  emit,
  getEventHandlers,
} from '../../../test_utils/events_mock';
import { Bullet, viewFunction as BulletComponent } from '../bullet';
import { PathSvgElement } from '../../core/renderers/svg_path';
import { resolveRtlEnabled } from '../../../utils/resolve_rtl';
import { TooltipProps } from '../../core/tooltip';
import { generateCustomizeTooltipCallback } from '../utils';

jest.mock('../../../utils/resolve_rtl');
jest.mock('../utils', () => {
  const originalUtils = jest.requireActual('../utils');
  return ({
    ...originalUtils,
    generateCustomizeTooltipCallback: jest.fn(),
  });
});

const pointerAction = {
  move: 'dxpointermove',
  down: 'dxpointerdown',
};

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

  const customizedTooltipProps = { enabled: false };

  describe('View', () => {
    it('should pass all necessary properties to the BaseWidget (by default)', () => {
      const onCanvasChange = jest.fn();
      const cssClasses = 'bullet-classes';
      const cssClassName = 'some-class';
      const viewModel = {
        prepareInternalComponents: getDefaultScaleProps,
        customizedTooltipProps,
        onCanvasChange,
        cssClasses,
        rtlEnabled: false,
        cssClassName,
        props: { },
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element).childAt(0);

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
        customizedTooltipProps,
        defaultCanvas,
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element).childAt(0);

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
        customizedTooltipProps,
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
        customizedTooltipProps,
        ...methods,
        props: {
          targetColor: '#666666',
          targetWidth: 4,
        },
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element).childAt(0);

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
        customizedTooltipProps,
        ...methods,
        props: { targetColor: '#666666' },
      };
      const bullet = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element).childAt(0);

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

    it('should render tooltip', () => {
      customizedTooltipProps.enabled = true;
      const viewModel = {
        prepareInternalComponents: getDefaultScaleProps,
        customizedTooltipProps,
        tooltipVisible: true,
        props: { },
      };
      const tooltip = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element).childAt(1);

      expect(tooltip.props()).toEqual({
        arrowLength: 10,
        arrowWidth: 20,
        border: {
          color: '#d3d3d3',
          dashStyle: 'solid',
          visible: true,
          width: 1,
        },
        color: '#fff',
        cornerRadius: 0,
        data: {},
        enabled: true,
        font: {
          color: '#232323',
          family: 'Segoe UI',
          opacity: 1,
          size: 12,
          weight: 400,
        },
        interactive: false,
        location: 'center',
        offset: 0,
        paddingLeftRight: 18,
        paddingTopBottom: 15,
        rtl: false,
        shadow: {
          blur: 2,
          color: '#000',
          offsetX: 0,
          offsetY: 4,
          opacity: 0.4,
        },
        shared: false,
        target: {},
        visible: true,
        x: 0,
        y: 0,
      });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      afterEach(clearEventHandlers);

      describe('tooltipEffect', () => {
        it('should be ignored if the "disabled" is true', () => {
          const bullet = new Bullet({ disabled: true });

          expect(bullet.tooltipEffect()).toBe(undefined);
          expect(getEventHandlers(pointerAction.move)).toBeUndefined();
          expect(getEventHandlers(pointerAction.down)).toBeUndefined();
        });

        it('should be ignored if the "enabled" of tooltip props is false', () => {
          const bullet = new Bullet({
            disabled: false,
            tooltip: { enabled: false },
          });

          expect(bullet.tooltipEffect()).toBe(undefined);
          expect(getEventHandlers(pointerAction.move)).toBeUndefined();
          expect(getEventHandlers(pointerAction.down)).toBeUndefined();
        });

        it('should call "pointerHandler" callback by pointer move event', () => {
          const bullet = new Bullet({
            value: 10,
            target: 15,
            tooltip: { enabled: true },
          });
          const baseRef = {} as any;
          bullet.widgetRef = { svg: jest.fn(() => baseRef) } as any;
          bullet.pointerHandler = jest.fn();
          bullet.tooltipEffect();

          emit(pointerAction.down, defaultEvent, baseRef);
          expect(bullet.pointerHandler).toHaveBeenCalledTimes(1);
        });

        it('should return event detach callback', () => {
          const bullet = new Bullet({
            value: 10,
            target: 15,
            tooltip: { enabled: true },
          });
          const baseRef = {} as any;
          bullet.widgetRef = { svg: jest.fn(() => baseRef) } as any;
          const detach = bullet.tooltipEffect() as () => undefined;

          expect(getEventHandlers(pointerAction.down).length).toBe(1);
          detach();
          expect(getEventHandlers(pointerAction.down).length).toBe(0);
        });
      });
    });

    afterEach(clearEventHandlers);

    describe('Pointer events', () => {
      describe('pointerHandler', () => {
        it('should change tooltip visibility state to true (if there is no such prop)', () => {
          const bullet = new Bullet({ });
          bullet.pointerHandler();

          expect(bullet.tooltipVisible).toBe(true);
          expect(getEventHandlers(pointerAction.down).length).toBe(1);
        });

        it('should change tooltip visibility state from props', () => {
          const bullet = new Bullet({ tooltip: { visible: false } });
          bullet.pointerHandler();

          expect(bullet.tooltipVisible).toBe(false);
          expect(getEventHandlers(pointerAction.down)).toBeUndefined();
        });

        it('should call "pointerOutHandler" callback by pointer out move', () => {
          const bullet = new Bullet({ });
          bullet.pointerOutHandler = jest.fn();
          bullet.pointerHandler();
          emit(pointerAction.down, defaultEvent);

          expect(bullet.pointerOutHandler).toHaveBeenCalledTimes(1);
          expect(bullet.pointerOutHandler).toHaveBeenCalledWith({ ...defaultEvent });
        });
      });

      describe('pointerOutHandler', () => {
        it('should not hide tooltip if pointer in canvas', () => {
          const bullet = new Bullet({ });
          bullet.tooltipVisible = true;
          bullet.canvasState = {
            top: 0,
            left: 0,
            width: 200,
            height: 50,
            right: 0,
            bottom: 0,
          };
          bullet.pointerHandler();
          bullet.pointerOutHandler({ pageX: 100, pageY: 20 });

          expect(bullet.tooltipVisible).toBe(true);
          expect(getEventHandlers(pointerAction.down).length).toBe(1);
        });

        it('should hide tooltip if pointer out of canvas', () => {
          const bullet = new Bullet({ });
          bullet.tooltipVisible = true;
          bullet.canvasState = {
            top: 0,
            left: 0,
            width: 200,
            height: 50,
            right: 0,
            bottom: 0,
          };
          bullet.pointerHandler();
          bullet.pointerOutHandler({ pageX: 300, pageY: 200 });

          expect(bullet.tooltipVisible).toBe(false);
          expect(getEventHandlers(pointerAction.down).length).toBe(0);
        });
      });
    });
  });

  describe('Logic', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe('Getters', () => {
      describe('cssClasses', () => {
        it('should add default classes', () => {
          const bullet = new Bullet({ });
          expect(bullet.cssClasses).toBe('dxb dxb-bullet');
        });

        it('should add className property', () => {
          const bullet = new Bullet({ classes: 'custom-class' });
          expect(bullet.cssClasses).toBe('dxb dxb-bullet custom-class');
        });
      });

      describe('cssClassName', () => {
        it('should add default className', () => {
          const bullet = new Bullet({ });
          expect(bullet.cssClassName).toBe('dx-bullet');
        });

        it('should add className property', () => {
          const bullet = new Bullet({ className: 'custom-class' });
          expect(bullet.cssClassName).toBe('dx-bullet custom-class');
        });
      });

      describe('rtlEnabled', () => {
        it('should call utils method resolveRtlEnabled', () => {
          (resolveRtlEnabled as jest.Mock).mockReturnValue(false);
          const bullet = new Bullet({ });
          const { rtlEnabled } = bullet;

          expect(rtlEnabled).toBe(false);
          expect(resolveRtlEnabled).toHaveBeenCalledTimes(1);
        });
      });

      describe('tooltipEnabled', () => {
        it('should return false by default', () => {
          const bullet = new Bullet({ });
          expect(bullet.tooltipEnabled).toBe(false);
        });

        it('should return true if props.value exists', () => {
          const bullet = new Bullet({ value: 10 });
          expect(bullet.tooltipEnabled).toBe(true);
        });

        it('should return true if props.target exists', () => {
          const bullet = new Bullet({ target: 100 });
          expect(bullet.tooltipEnabled).toBe(true);
        });
      });

      describe('tooltipData', () => {
        it('should return simple text by default (without fotmatting)', () => {
          const value = 10;
          const target = 15;
          const bullet = new Bullet({ value, target });

          expect(bullet.tooltipData).toEqual({
            originalValue: value,
            originalTarget: target,
            value: String(value),
            target: String(target),
            valueTexts: ['Actual Value:', String(value), 'Target Value:', String(target)],
          });
        });

        it('should return formatted text if tooltip has such props', () => {
          const value = 0.2022;
          const target = 0.7077;
          const pValue = '20.2%';
          const pTarget = '70.8%';
          const tooltip = {
            format: {
              type: 'percent',
              precision: 1,
            },
          } as TooltipProps;
          const bullet = new Bullet({ value, target, tooltip });

          expect(bullet.tooltipData).toEqual({
            originalValue: value,
            originalTarget: target,
            value: pValue,
            target: pTarget,
            valueTexts: ['Actual Value:', pValue, 'Target Value:', pTarget],
          });
        });
      });

      describe('tooltipCoords', () => {
        it('should return zero coords by default (empty canvas and offset)', () => {
          const bullet = new Bullet({ });

          expect(bullet.tooltipCoords).toEqual({ x: 0, y: 0 });
        });

        it('should return correct coords by canvas and offset', () => {
          const bullet = new Bullet({ });
          bullet.canvasState = { width: 200, height: 100 } as Canvas;
          bullet.offsetState = { left: 150, top: 200 };

          expect(bullet.tooltipCoords).toEqual({ x: 250, y: 250 });
        });
      });

      const value = 10;
      const target = 15;
      const data = {
        originalValue: value,
        originalTarget: target,
        value: String(value),
        target: String(target),
        valueTexts: ['Actual Value:', String(value), 'Target Value:', String(target)],
      };
      const customizeTooltipFn = jest.fn();

      describe('customizedTooltipProps', () => {
        it('should return inner custom props if bullet doesn\'t have tooltip props', () => {
          (generateCustomizeTooltipCallback as jest.Mock).mockReturnValue(customizeTooltipFn);
          const bullet = new Bullet({ value, target });
          bullet.canvasState = { width: 200, height: 100 } as Canvas;
          bullet.offsetState = { left: 100, top: 200 };

          expect(bullet.customizedTooltipProps).toEqual({
            enabled: true,
            data,
            customizeTooltip: customizeTooltipFn,
            x: 200,
            y: 250,
          });
        });

        it('should return customized tooltip props', () => {
          const tooltip = {
            enabled: true,
            cornerRadius: 5,
            arrowWidth: 25,
            arrowLength: 15,
            offset: 10,
          };
          (generateCustomizeTooltipCallback as jest.Mock).mockReturnValue(customizeTooltipFn);
          const bullet = new Bullet({ value, target, tooltip });
          bullet.canvasState = { width: 200, height: 100 } as Canvas;
          bullet.offsetState = { left: 100, top: 200 };

          expect(bullet.customizedTooltipProps).toEqual({
            ...tooltip,
            customizeTooltip: customizeTooltipFn,
            data,
            x: 200,
            y: 250,
          });
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
      describe('onCanvasChange', () => {
        it('should change canvas state', () => {
          const canvas = {
            height: 400,
            width: 600,
            top: 10,
            left: 20,
            right: 30,
            bottom: 40,
          };
          const bullet = new Bullet({ });
          bullet.widgetRef = { svg: jest.fn(() => null) } as any;
          bullet.onCanvasChange(canvas);

          expect(bullet.canvasState).toEqual(canvas);
        });

        it('should change offset state', () => {
          const offsetState = {
            top: 100,
            left: 200,
          };
          const bullet = new Bullet({ });
          bullet.widgetRef = {
            svg: jest.fn(() => ({
              getBoundingClientRect: jest.fn().mockReturnValue(offsetState),
            })),
          } as any;
          bullet.onCanvasChange({} as Canvas);

          expect(bullet.offsetState).toEqual(offsetState);
        });
      });

      describe('prepareScaleProps', () => {
        it('should return default scale props (no props)', () => {
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

        it('should return scale props by target and value (target > value > 0)', () => {
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

        it('should return scale props by target and value (target < value < 0)', () => {
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

        it('should return scale props by startScaleValue and endScaleValue (startScaleValue < endScaleValue)', () => {
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

        it('should return inverted scale props by startScaleValue and endScaleValue (startScaleValue < endScaleValue)', () => {
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
            it('should return correct points when startScaleValue > 0 and value < endScaleValue', () => {
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

            it('should return correct points when startScaleValue > 0 and value > endScaleValue', () => {
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

            it('should return correct points when startScaleValue > 0 and value < startScaleValue', () => {
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

            it('should return correct points when startScaleValue < 0 and value < endScaleValue', () => {
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
            it('should return correct points when endScaleValue < 0 and value > startScaleValue', () => {
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

            it('should return correct points when endScaleValue < 0 and value < startScaleValue', () => {
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

            it('should return correct points when endScaleValue < 0 and value > endScaleValue', () => {
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

            it('should return correct points when endScaleValue > 0 and value > startScaleValue', () => {
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

        describe('getTargetShape', () => {
          it('should return correct points', () => {
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
        });

        describe('getZeroLevelShape', () => {
          it('should return correct points', () => {
            getTranslator = () => ({ translate: (x: number) => x * 100 + 10 });
            const bullet = new Bullet({ });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;
            const valueShape = bullet.getZeroLevelShape();

            expect(valueShape).toEqual([10, 12, 10, 108]);
          });
        });
      });

      describe('isValidTarget', () => {
        it('should hide target when showTarget = false', () => {
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

        it('should hide target when target > endScaleValue', () => {
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

        it('should hide target when target < startScaleValue', () => {
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
        it('should hide target when showZeroLevel = false', () => {
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

        it('should hide zero level when endScaleValue < 0', () => {
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

        it('should hide zero level when startScaleValue> 0', () => {
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
          const bullet = new Bullet({ });
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

        it('should invert arg axis by rtlEnabled', () => {
          (resolveRtlEnabled as jest.Mock).mockReturnValue(true);
          const scaleProps = {
            inverted: false,
            value: 5,
            target: 15,
            startScaleValue: 0,
            endScaleValue: 20,
          };
          const bullet = new Bullet({ });
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
          const bullet = new Bullet({ });
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
