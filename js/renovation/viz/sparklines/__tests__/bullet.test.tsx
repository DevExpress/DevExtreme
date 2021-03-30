import React from 'react';
import { shallow } from 'enzyme';
import {
  clear as clearEventHandlers,
  defaultEvent,
  emit,
  getEventHandlers,
} from '../../../test_utils/events_mock';
import { Bullet, viewFunction as BulletComponent } from '../bullet';
import { PathSvgElement } from '../../common/renderers/svg_path';
import { resolveRtlEnabled } from '../../../utils/resolve_rtl';
import { TooltipProps } from '../../common/tooltip';
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
  const shapeProps = (
    valuePoints: number[],
    isValidTarget: boolean,
    targetPoints: number[],
    isValidZeroLevel: boolean,
    zeroLevelPoints: number[],
    isValidBulletScale: boolean,
  ) => ({
    barValueShape: valuePoints,
    isValidTarget,
    targetShape: targetPoints,
    isValidZeroLevel,
    zeroLevelShape: zeroLevelPoints,
    isValidBulletScale,
  });

  const customizedTooltipProps = { enabled: false } as any;

  describe('View', () => {
    it('should pass all necessary properties to the BaseWidget (by default)', () => {
      const onCanvasChange = jest.fn();
      const cssClasses = 'bullet-classes';
      const cssClassName = 'some-class';
      const viewModel = {
        customizedTooltipProps,
        onCanvasChange,
        cssClasses,
        rtlEnabled: false,
        cssClassName,
        props: {
          disabled: false,
        },
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
      const extraProps = shapeProps(points, false, [], false, [], true);
      const viewModel = {
        customizedTooltipProps,
        ...extraProps,
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
      const extraProps = shapeProps([], true, points, false, [], true);
      const viewModel = {
        scaleProps: {
          value: 50,
          startScaleValue: 0,
          endScaleValue: 100,
          target: 100,
        },
        customizedTooltipProps,
        ...extraProps,
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
      const extraProps = shapeProps([], false, [], true, points, true);
      const viewModel = {
        scaleProps: {
          value: 50,
          startScaleValue: 0,
          endScaleValue: 100,
          target: 100,
        },
        customizedTooltipProps,
        ...extraProps,
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
        visible: true,
        x: 0,
        y: 0,
      });
    });

    it('should pass event data to the tooltip', () => {
      const widgetRef = { current: {} };
      customizedTooltipProps.enabled = true;
      customizedTooltipProps.eventData = { component: widgetRef };
      const viewModel = {
        widgetRef,
        customizedTooltipProps,
        tooltipVisible: true,
        props: { },
      };
      const tooltip = shallow(<BulletComponent {...viewModel as any} /> as JSX.Element).childAt(1);

      expect(tooltip.props()).toMatchObject({
        eventData: { component: widgetRef },
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
          bullet.widgetRef = React.createRef() as any;
          const baseRef = {} as any;
          bullet.widgetRef.current = { svg: jest.fn(() => baseRef) } as any;
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

      describe('tooltipOutEffect', () => {
        it('should be ignored if the tooltip is not visible', () => {
          const bullet = new Bullet({ });
          bullet.tooltipVisible = false;

          expect(bullet.tooltipOutEffect()).toBe(undefined);
          expect(getEventHandlers(pointerAction.move)).toBeUndefined();
          expect(getEventHandlers(pointerAction.down)).toBeUndefined();
        });

        it('should call "pointerOutHandler" callback', () => {
          const bullet = new Bullet({ });
          bullet.tooltipVisible = true;

          bullet.pointerOutHandler = jest.fn();
          bullet.tooltipOutEffect();

          emit(pointerAction.down, defaultEvent);
          expect(bullet.pointerOutHandler).toHaveBeenCalledTimes(1);
        });

        it('should return event detach callback', () => {
          const bullet = new Bullet({});
          bullet.tooltipVisible = true;

          bullet.pointerOutHandler = jest.fn();
          const detach = bullet.tooltipOutEffect() as () => undefined;

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
        });

        it('should not hide tooltip if pointer in the canvas with margins, top-left', () => {
          const bullet = new Bullet({ });
          bullet.tooltipVisible = true;
          bullet.canvasState = {
            top: 10,
            left: 15,
            width: 200,
            height: 50,
            right: 5,
            bottom: 20,
          };
          bullet.pointerHandler();
          bullet.pointerOutHandler({ pageX: 10, pageY: 5 });

          expect(bullet.tooltipVisible).toBe(true);
        });

        it('should not hide tooltip if pointer in the canvas with margins, bottom-right', () => {
          const bullet = new Bullet({ });
          bullet.tooltipVisible = true;
          bullet.canvasState = {
            top: 10,
            left: 15,
            width: 200,
            height: 50,
            right: 5,
            bottom: 20,
          };
          bullet.pointerHandler();
          bullet.pointerOutHandler({ pageX: 199, pageY: 49 });

          expect(bullet.tooltipVisible).toBe(true);
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
          bullet.canvasState = { width: 200, height: 100 } as ClientRect;
          bullet.offsetState = { left: 150, top: 200 };

          expect(bullet.tooltipCoords).toEqual({ x: 250, y: 250 });
        });
      });

      describe('customizedTooltipProps', () => {
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

        it('should return inner custom props if bullet doesn\'t have tooltip props', () => {
          (generateCustomizeTooltipCallback as jest.Mock).mockReturnValue(customizeTooltipFn);
          const bullet = new Bullet({ value, target });
          bullet.canvasState = { width: 200, height: 100 } as ClientRect;
          bullet.offsetState = { left: 100, top: 200 };
          bullet.widgetRef = {} as any;

          expect(bullet.customizedTooltipProps).toEqual({
            enabled: true,
            data,
            eventData: { component: {} },
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
          bullet.canvasState = { width: 200, height: 100 } as ClientRect;
          bullet.offsetState = { left: 100, top: 200 };
          bullet.widgetRef = {} as any;

          expect(bullet.customizedTooltipProps).toEqual({
            ...tooltip,
            customizeTooltip: customizeTooltipFn,
            eventData: { component: {} },
            data,
            x: 200,
            y: 250,
          });
        });

        it('should return customized tooltip props with onTooltipShown/onTooltipHidden events', () => {
          (generateCustomizeTooltipCallback as jest.Mock).mockReturnValue(customizeTooltipFn);
          const onTooltipShown = jest.fn();
          const onTooltipHidden = jest.fn();
          const bullet = new Bullet({
            value, target, onTooltipShown, onTooltipHidden,
          });
          bullet.canvasState = { width: 200, height: 100 } as ClientRect;
          bullet.offsetState = { left: 100, top: 200 };
          bullet.widgetRef = {} as any;

          expect(bullet.customizedTooltipProps).toEqual({
            enabled: true,
            data,
            eventData: { component: {} },
            onTooltipShown,
            onTooltipHidden,
            customizeTooltip: customizeTooltipFn,
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

      describe('scaleProps', () => {
        const checkAxes = (bullet, requiredProps, inverted) => {
          const canvas = {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          };
          expect(bullet.argumentAxis.update).toBeCalledWith({
            invert: inverted,
            min: requiredProps.startScaleValue,
            max: requiredProps.endScaleValue,
            axisType: 'continuous',
            dataType: 'numeric',
          }, canvas, undefined);
          expect(bullet.valueAxis.update).toBeCalledWith({
            min: 0,
            max: 1,
            axisType: 'continuous',
            dataType: 'numeric',
          }, canvas, undefined);
        };

        it('should prepare scale props & update axes', () => {
          const bullet = new Bullet({
            startScaleValue: 100, endScaleValue: 200, target: 10, value: 13,
          });
          bullet.argumentAxis.update = jest.fn();
          bullet.valueAxis.update = jest.fn();
          const requiredProps = {
            inverted: false,
            value: 13,
            target: 10,
            startScaleValue: 100,
            endScaleValue: 200,
          };

          expect(bullet.scaleProps).toEqual(requiredProps);
          checkAxes(bullet, requiredProps, false);
        });

        it('should prepare scale props & update axes, startScaleValue is undefined', () => {
          const bullet = new Bullet({ endScaleValue: 200, target: 100, value: 80 });
          bullet.argumentAxis.update = jest.fn();
          bullet.valueAxis.update = jest.fn();
          const requiredProps = {
            inverted: false,
            value: 80,
            target: 100,
            startScaleValue: 0,
            endScaleValue: 200,
          };

          expect(bullet.scaleProps).toEqual(requiredProps);
          checkAxes(bullet, requiredProps, false);
        });

        it('should prepare scale props & update axes, startScaleValue is undefined, value & target < 0', () => {
          const bullet = new Bullet({ endScaleValue: 200, target: -80, value: -100 });
          bullet.argumentAxis.update = jest.fn();
          bullet.valueAxis.update = jest.fn();
          const requiredProps = {
            inverted: false,
            value: -100,
            target: -80,
            startScaleValue: -100,
            endScaleValue: 200,
          };

          expect(bullet.scaleProps).toEqual(requiredProps);
          checkAxes(bullet, requiredProps, false);
        });

        it('should prepare scale props & update axes, endScaleValue is undefined', () => {
          const bullet = new Bullet({ startScaleValue: 20, target: 100, value: 80 });
          bullet.argumentAxis.update = jest.fn();
          bullet.valueAxis.update = jest.fn();
          const requiredProps = {
            inverted: false,
            value: 80,
            target: 100,
            startScaleValue: 20,
            endScaleValue: 100,
          };

          expect(bullet.scaleProps).toEqual(requiredProps);
          checkAxes(bullet, requiredProps, false);
        });

        it('should prepare scale props & update axes, endScaleValue < startScaleValue', () => {
          const bullet = new Bullet({
            startScaleValue: 200, endScaleValue: 100, target: 80, value: 100,
          });
          bullet.argumentAxis.update = jest.fn();
          bullet.valueAxis.update = jest.fn();
          const requiredProps = {
            inverted: true,
            value: 100,
            target: 80,
            startScaleValue: 100,
            endScaleValue: 200,
          };

          expect(bullet.scaleProps).toEqual(requiredProps);
          checkAxes(bullet, requiredProps, true);
        });

        it('should prepare scale props & update axes, rtlenabled is true', () => {
          (resolveRtlEnabled as jest.Mock).mockReturnValue(true);
          const bullet = new Bullet({
            startScaleValue: 20, endScaleValue: 200, target: 80, value: 100,
          });
          bullet.argumentAxis.update = jest.fn();
          bullet.valueAxis.update = jest.fn();
          const requiredProps = {
            inverted: false,
            value: 100,
            target: 80,
            startScaleValue: 20,
            endScaleValue: 200,
          };

          expect(bullet.scaleProps).toEqual(requiredProps);
          checkAxes(bullet, requiredProps, true);
        });

        it('should prepare scale props & update axes, endScaleValue < startScaleValue, rtlenabled is true', () => {
          (resolveRtlEnabled as jest.Mock).mockReturnValue(true);
          const bullet = new Bullet({
            startScaleValue: 200, endScaleValue: 100, target: 80, value: 100,
          });
          bullet.argumentAxis.update = jest.fn();
          bullet.valueAxis.update = jest.fn();
          const requiredProps = {
            inverted: true,
            value: 100,
            target: 80,
            startScaleValue: 100,
            endScaleValue: 200,
          };

          expect(bullet.scaleProps).toEqual(requiredProps);
          checkAxes(bullet, requiredProps, false);
        });
      });

      describe('barValueShape', () => {
        const getTranslator = () => ({ translate: (x: number) => x * 10 }) as any;

        describe('value > 0', () => {
          it('should return correct points when startScaleValue > 0 and value < endScaleValue', () => {
            const bullet = new Bullet({
              value: 15,
              target: 15,
              startScaleValue: 10,
              endScaleValue: 20,
            });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;

            expect(bullet.barValueShape).toEqual([100, 9, 150, 9, 150, 1, 100, 1]);
          });

          it('should return correct points when startScaleValue > 0 and value > endScaleValue', () => {
            const bullet = new Bullet({
              value: 25,
              target: 15,
              startScaleValue: 10,
              endScaleValue: 20,
            });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;

            expect(bullet.barValueShape).toEqual([100, 9, 200, 9, 200, 1, 100, 1]);
          });

          it('should return correct points when startScaleValue > 0 and value < startScaleValue', () => {
            const bullet = new Bullet({
              value: 5,
              target: 15,
              startScaleValue: 10,
              endScaleValue: 20,
            });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;

            expect(bullet.barValueShape).toEqual([100, 9, 100, 9, 100, 1, 100, 1]);
          });

          it('should return correct points when startScaleValue < 0 and value < endScaleValue', () => {
            const bullet = new Bullet({
              value: 15,
              target: 15,
              startScaleValue: -10,
              endScaleValue: 20,
            });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;

            expect(bullet.barValueShape).toEqual([0, 9, 150, 9, 150, 1, 0, 1]);
          });
        });

        describe('value < 0', () => {
          it('should return correct points when endScaleValue < 0 and value > startScaleValue', () => {
            const bullet = new Bullet({
              value: -15,
              target: -15,
              startScaleValue: -20,
              endScaleValue: -10,
            });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;

            expect(bullet.barValueShape).toEqual([-100, 9, -150, 9, -150, 1, -100, 1]);
          });

          it('should return correct points when endScaleValue < 0 and value < startScaleValue', () => {
            const bullet = new Bullet({
              value: -25,
              target: -15,
              startScaleValue: -20,
              endScaleValue: -10,
            });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;

            expect(bullet.barValueShape).toEqual([-100, 9, -200, 9, -200, 1, -100, 1]);
          });

          it('should return correct points when endScaleValue < 0 and value > endScaleValue', () => {
            const bullet = new Bullet({
              value: -5,
              target: -15,
              startScaleValue: -20,
              endScaleValue: -10,
            });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;

            expect(bullet.barValueShape).toEqual([-100, 9, -100, 9, -100, 1, -100, 1]);
          });

          it('should return correct points when endScaleValue > 0 and value > startScaleValue', () => {
            const bullet = new Bullet({
              value: -15,
              target: -15,
              startScaleValue: -20,
              endScaleValue: 5,
            });
            bullet.argumentAxis.getTranslator = getTranslator;
            bullet.valueAxis.getTranslator = getTranslator;

            expect(bullet.barValueShape).toEqual([0, 9, -150, 9, -150, 1, 0, 1]);
          });
        });
      });

      describe('targetShape', () => {
        const getTranslator = () => ({ translate: (x: number) => x * 10 }) as any;

        it('should return correct points', () => {
          const bullet = new Bullet({
            value: 15,
            target: 15,
            startScaleValue: 10,
            endScaleValue: 20,
          });
          bullet.argumentAxis.getTranslator = getTranslator;
          bullet.valueAxis.getTranslator = getTranslator;

          expect(bullet.targetShape).toEqual([150, 0.2, 150, 9.8]);
        });
      });

      describe('zeroLevelShape', () => {
        it('should return correct points', () => {
          const getTranslator = () => ({ translate: (x: number) => x * 100 + 10 });
          const bullet = new Bullet({ });
          (bullet.argumentAxis as any).getTranslator = getTranslator;
          (bullet.valueAxis as any).getTranslator = getTranslator;

          expect(bullet.zeroLevelShape).toEqual([10, 12, 10, 108]);
        });
      });

      describe('isValidTarget', () => {
        it('should hide target when showTarget = false', () => {
          const bullet = new Bullet({
            showTarget: false,
            target: 150,
            startScaleValue: 0,
            endScaleValue: 200,
          });

          expect(bullet.isValidTarget).toEqual(false);
        });

        it('should hide target when target > endScaleValue', () => {
          const bullet = new Bullet({
            showTarget: true,
            target: 250,
            startScaleValue: 0,
            endScaleValue: 200,
          });

          expect(bullet.isValidTarget).toEqual(false);
        });

        it('should hide target when target < startScaleValue', () => {
          const bullet = new Bullet({
            showTarget: true,
            target: 0,
            startScaleValue: 50,
            endScaleValue: 200,
          });

          expect(bullet.isValidTarget).toEqual(false);
        });

        it('should show target', () => {
          const bullet = new Bullet({
            showTarget: true,
            target: 150,
            startScaleValue: 0,
            endScaleValue: 200,
          });

          expect(bullet.isValidTarget).toEqual(true);
        });
      });

      describe('isValidBulletScale', () => {
        it('should return true, scale is valid', () => {
          const bullet = new Bullet({
            value: 100,
            target: 150,
            startScaleValue: 0,
            endScaleValue: 200,
          });

          expect(bullet.isValidBulletScale).toEqual(true);
        });

        it('should return false, startScaleValue === endScaleValue', () => {
          const bullet = new Bullet({
            value: 100,
            target: 150,
            startScaleValue: 10,
            endScaleValue: 10,
          });

          expect(bullet.isValidBulletScale).toEqual(false);
        });

        it('should return false, props is not valid', () => {
          const bullet = new Bullet({
            value: NaN,
            target: NaN,
            startScaleValue: NaN,
            endScaleValue: NaN,
          });

          expect(bullet.isValidBulletScale).toEqual(false);
        });
      });

      describe('isValidZeroLevel', () => {
        it('should hide target when showZeroLevel = false', () => {
          const bullet = new Bullet({
            showZeroLevel: false,
            startScaleValue: 0,
            endScaleValue: 200,
          });

          expect(bullet.isValidZeroLevel).toEqual(false);
        });

        it('should hide zero level when endScaleValue < 0', () => {
          const bullet = new Bullet({
            showZeroLevel: true,
            startScaleValue: -200,
            endScaleValue: -100,
          });

          expect(bullet.isValidZeroLevel).toEqual(false);
        });

        it('should hide zero level when startScaleValue> 0', () => {
          const bullet = new Bullet({
            showZeroLevel: true,
            startScaleValue: 50,
            endScaleValue: 200,
          });

          expect(bullet.isValidZeroLevel).toEqual(false);
        });

        it('should show zero level', () => {
          const bullet = new Bullet({
            showZeroLevel: true,
            value: 100,
            target: 150,
            startScaleValue: 0,
            endScaleValue: 200,
          });

          expect(bullet.isValidZeroLevel).toEqual(true);
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
        bullet.widgetRef = React.createRef() as any;
        bullet.widgetRef.current = {
          svg: jest.fn(() => ({
            getBoundingClientRect: jest.fn().mockReturnValue(offsetState),
          })),
        } as any;
        bullet.onCanvasChange({} as ClientRect);

        expect(bullet.offsetState).toEqual(offsetState);
      });
    });
  });
});
