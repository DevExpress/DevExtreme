import React, { createRef } from 'react';
// Should be before component import
import { mount } from 'enzyme';
// import { create as mount } from 'react-test-renderer';
import { RefObject } from '@devextreme-generator/declarations';
import { DisposeEffectReturn } from '../../../utils/effect_return';
import {
  clear as clearEventHandlers, defaultEvent, emit,
  emitKeyboard, getEventHandlers, EVENT, KEY,
} from '../../../test_utils/events_mock';
import { Widget, viewFunction, WidgetProps } from '../widget';
import { ConfigProvider } from '../../../common/config_provider';
import { resolveRtlEnabled, resolveRtlEnabledDefinition } from '../../../utils/resolve_rtl';
import resizeCallbacks from '../../../../core/utils/resize_callbacks';
import errors from '../../../../core/errors';
import domAdapter from '../../../../core/dom_adapter';

jest.mock('../../../../events/utils/index', () => ({
  ...jest.requireActual('../../../../events/utils/index'),
}));
jest.mock('../../../common/config_provider', () => ({ ConfigProvider: () => null }));
jest.mock('../../../utils/resolve_rtl');
jest.mock('../../../../core/utils/resize_callbacks');
jest.mock('../../../../core/errors');

describe('Widget', () => {
  describe('Render', () => {
    it('should pass all necessary properties to the div element', () => {
      const props = {
        hint: 'hint',
        visible: true,
      };
      const widget = mount(viewFunction({
        props,
        tabIndex: 10,
        cssClasses: 'cssClasses',
        styles: { display: 'none' },
        attributes: { attributes: 'attributes' },
      } as any) as any);
      expect(widget.props()).toEqual({
        attributes: 'attributes',
        style: { display: 'none' },
        className: 'cssClasses',
        title: 'hint',
        tabIndex: 10,
      });
    });

    it('should pass REF into the main div element', () => {
      const mockRef = createRef<HTMLDivElement>();
      const props = {
        hint: 'hint',
        visible: true,
      };
      mount(viewFunction({
        widgetElementRef: mockRef,
        props,
        cssClasses: 'cssClasses',
      } as any) as any);

      expect(mockRef.current?.className).toBe('cssClasses');
    });

    it('should render children', () => {
      const mockRef = createRef();
      const props = {
        hint: 'hint',
        visible: true,
        children: <div className="child" />,
      };
      const widget = mount(viewFunction({
        widgetElementRef: mockRef,
        props,
        cssClasses: 'cssClasses',
      } as any) as any);

      expect(widget.find('.child').exists()).toBe(true);
    });

    it('should render ConfigProvider if shouldRenderConfigProvider is true', () => {
      const props = {
        hint: 'hint',
        visible: true,
      };
      const widget = mount(viewFunction({
        props,
        shouldRenderConfigProvider: true,
      } as any) as any);

      expect(widget.find(ConfigProvider)).toHaveLength(1);
    });
  });

  describe('Behavior', () => {
    beforeEach(clearEventHandlers);

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('Effects', () => {
      describe('applyCssTextEffect', () => {
        it('should apply cssText value to the main element', () => {
          const widget = new Widget({ cssText: 'background-color: red;' });
          widget.widgetElementRef = { current: { style: {} } } as any;
          widget.applyCssTextEffect();
          expect(widget.widgetElementRef.current!.style.cssText).toStrictEqual('background-color: red;');
        });

        it('should ignore empty cssText value', () => {
          const widget = new Widget({ cssText: '' });
          widget.widgetElementRef = { current: { style: {} } } as any;
          widget.applyCssTextEffect();
          expect(widget.widgetElementRef.current!.style.cssText).toStrictEqual(undefined);
        });
      });

      describe('activeEffect', () => {
        const onActive = jest.fn();

        it('should subscribe to active event', () => {
          const e = { ...defaultEvent };
          const widget = new Widget({
            activeStateEnabled: true, disabled: false, onActive,
          });
          widget.widgetElementRef = {} as any;
          widget.activeEffect();

          emit(EVENT.active, e);
          expect(widget.active).toBe(true);

          expect(onActive).toHaveBeenCalledTimes(1);
          expect(onActive).toHaveBeenCalledWith(e);
        });

        it('should work without errors if onActive is not defined', () => {
          const e = { ...defaultEvent };
          const widget = new Widget({
            activeStateEnabled: true, disabled: false, onActive: undefined,
          });
          widget.widgetElementRef = {} as any;
          widget.activeEffect();

          emit(EVENT.active, e);
          expect(widget.active).toBe(true);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ activeStateEnabled: true, disabled: false });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;

          const detachActive = widget.activeEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.active).length).toBe(1);
          detachActive();
          expect(getEventHandlers(EVENT.active).length).toBe(0);
        });

        it('should not subscribe to active event if widget is disabled', () => {
          const widget = new Widget({
            activeStateEnabled: true, disabled: true, onActive,
          });
          widget.activeEffect();

          emit(EVENT.active);
          expect(widget.active).toBe(false);
          expect(onActive).toHaveBeenCalledTimes(0);
        });

        it('should not subscribe to active event if activeStateEnabled is false', () => {
          const widget = new Widget({
            activeStateEnabled: false, disabled: false, onActive,
          });
          widget.activeEffect();

          emit(EVENT.active);
          expect(widget.active).toBe(false);
          expect(onActive).toHaveBeenCalledTimes(0);
        });
      });

      describe('inactiveEffect', () => {
        const onInactive = jest.fn();

        it('should subscribe to inactive event', () => {
          const e = { ...defaultEvent };
          const widget = new Widget({
            activeStateEnabled: true, disabled: false, onInactive,
          });
          widget.widgetElementRef = {} as any;
          widget.active = true;
          widget.inactiveEffect();

          emit(EVENT.inactive, e);
          expect(widget.active).toBe(false);

          expect(onInactive).toHaveBeenCalledTimes(1);
          expect(onInactive).toHaveBeenCalledWith(e);
        });

        it('should work without errors if onInactive is not defined', () => {
          const e = { ...defaultEvent };
          const widget = new Widget({
            activeStateEnabled: true, disabled: false, onInactive: undefined,
          });
          widget.widgetElementRef = {} as any;
          widget.active = true;
          widget.inactiveEffect();

          emit(EVENT.inactive, e);
          expect(widget.active).toBe(false);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ activeStateEnabled: true, disabled: false });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;

          const detachInactive = widget.inactiveEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.inactive).length).toBe(1);
          detachInactive();
          expect(getEventHandlers(EVENT.inactive).length).toBe(0);
        });

        it('should call inactive event handler if widget is active', () => {
          const widget = new Widget({
            activeStateEnabled: true, onInactive,
          });
          widget.widgetElementRef = {} as any;
          widget.inactiveEffect();
          widget.active = true;

          emit(EVENT.inactive);
          expect(widget.active).toBe(false);
          expect(onInactive).toHaveBeenCalledTimes(1);
        });

        it('should not call inactive event handler if widget is not active', () => {
          const widget = new Widget({
            activeStateEnabled: true, onInactive,
          });
          widget.widgetElementRef = {} as any;
          widget.inactiveEffect();

          emit(EVENT.inactive);
          expect(onInactive).toHaveBeenCalledTimes(0);
        });

        it('should not subscribe to inactive event if activeStateEnabled is false', () => {
          const widget = new Widget({
            activeStateEnabled: false, disabled: false, onInactive,
          });
          widget.inactiveEffect();
          widget.active = true;

          emit(EVENT.inactive);
          expect(widget.active).toBe(true);
          expect(onInactive).toHaveBeenCalledTimes(0);
        });
      });

      describe('clickEffect', () => {
        it('should subscribe to dxClick event', () => {
          const e = { ...defaultEvent };
          const onClick = jest.fn();
          const widget = new Widget({ onClick });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;

          widget.clickEffect();
          emit(EVENT.dxClick, e);

          expect(onClick).toHaveBeenCalledTimes(1);
          expect(onClick).toHaveBeenCalledWith(e);
        });

        it('should return unsubscribe callback', () => {
          const onClick = jest.fn();
          const widget = new Widget({ onClick });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;

          const detach = widget.clickEffect() as DisposeEffectReturn;
          detach();
          emit(EVENT.dxClick);

          expect(onClick).toHaveBeenCalledTimes(0);
        });

        it('should return nothing if click is not defined', () => {
          const widget = new Widget({ onClick: undefined });

          const detach = widget.clickEffect();

          expect(detach).toBe(undefined);
        });
      });

      describe('focusInEffect', () => {
        const e = { ...defaultEvent, isDefaultPrevented: jest.fn() };
        const onFocusIn = jest.fn();

        it('should subscribe to focusin event', () => {
          const widget = new Widget({
            focusStateEnabled: true, disabled: false, onFocusIn,
          });
          widget.widgetElementRef = {} as any;
          widget.focusInEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(true);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);
          expect(onFocusIn).toHaveBeenCalledTimes(1);
          expect(onFocusIn).toHaveBeenCalledWith(e);
        });

        it('should not raise any error if onFocusIn is undefined', () => {
          const widget = new Widget({
            focusStateEnabled: true, disabled: false, onFocusIn: undefined,
          });
          widget.widgetElementRef = {} as any;
          widget.focusInEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(true);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);
        });

        it('should not raise onFocusIn if event is prevented', () => {
          try {
            e.isDefaultPrevented = jest.fn(() => true);
            const widget = new Widget({
              focusStateEnabled: true, disabled: false, onFocusIn,
            });
            widget.widgetElementRef = {} as any;
            widget.focusInEffect();

            emit(EVENT.focus, e);
            expect(widget.focused).toBe(false);
            expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);
            expect(onFocusIn).not.toHaveBeenCalled();
          } finally {
            e.isDefaultPrevented = jest.fn();
          }
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ focusStateEnabled: true, disabled: false });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;

          const detach = widget.focusInEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.focus).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.focus).length).toBe(0);
        });

        it('should subscribe to focusIn event if widget is disabled', () => {
          const widget = new Widget({ focusStateEnabled: true, disabled: true });
          widget.widgetElementRef = {} as any;
          widget.focusInEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(0);
        });

        it('should not subscribe to focusin event is widget is not focusable', () => {
          const widget = new Widget({ focusStateEnabled: false, disabled: false, onFocusIn });
          widget.widgetElementRef = {} as any;

          widget.focusInEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(0);
          expect(onFocusIn).toHaveBeenCalledTimes(0);
        });
      });

      describe('focusOutEffect', () => {
        const e = { ...defaultEvent, isDefaultPrevented: jest.fn() };
        const onFocusOut = jest.fn();

        it('should subscribe to focusout event', () => {
          const widget = new Widget({
            focusStateEnabled: true, disabled: false, onFocusOut,
          });
          widget.widgetElementRef = {} as any;
          widget.focusOutEffect();
          widget.focused = true;

          emit(EVENT.blur, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);
          expect(onFocusOut).toHaveBeenCalledTimes(1);
          expect(onFocusOut).toHaveBeenCalledWith(e);
        });

        it('should not raise any error if onFocusOut is undefined', () => {
          const widget = new Widget({
            focusStateEnabled: true, disabled: false, onFocusOut: undefined,
          });
          widget.widgetElementRef = {} as any;
          widget.focused = true;
          widget.focusOutEffect();

          emit(EVENT.blur, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);
        });

        it('should not raise onFocusOut if event is prevented', () => {
          try {
            e.isDefaultPrevented = jest.fn(() => true);
            const widget = new Widget({
              focusStateEnabled: true, disabled: false, onFocusOut,
            });
            widget.widgetElementRef = {} as any;
            widget.focused = true;
            widget.focusOutEffect();

            emit(EVENT.blur, e);
            expect(widget.focused).toBe(true);
            expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);
            expect(onFocusOut).not.toHaveBeenCalled();
          } finally {
            e.isDefaultPrevented = jest.fn();
          }
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ focusStateEnabled: true, disabled: false });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;

          const detach = widget.focusOutEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.blur).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.blur).length).toBe(0);
        });

        it('should call focusOut event handler if widget is focused', () => {
          const widget = new Widget({
            focusStateEnabled: true, onFocusOut,
          });
          widget.widgetElementRef = {} as any;
          widget.focusOutEffect();
          widget.focused = true;

          emit(EVENT.blur);
          expect(widget.focused).toBe(false);
          expect(onFocusOut).toHaveBeenCalledTimes(1);
        });

        it('should not call focusOut event handler if widget is not focused', () => {
          const widget = new Widget({
            focusStateEnabled: true, onFocusOut,
          });
          widget.widgetElementRef = {} as any;
          widget.focusOutEffect();

          emit(EVENT.blur);
          expect(onFocusOut).toHaveBeenCalledTimes(0);
        });

        it('should not subscribe to focusout event is widget is not focusable', () => {
          const widget = new Widget({ focusStateEnabled: false, disabled: false, onFocusOut });
          widget.widgetElementRef = {} as any;
          widget.focused = true;
          widget.focusOutEffect();

          emit(EVENT.blur, e);
          expect(widget.focused).toBe(true);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(0);
          expect(onFocusOut).toHaveBeenCalledTimes(0);
        });
      });

      describe('hoverStartEffect', () => {
        const onHoverStart = jest.fn();

        it('should subscribe to hoverStart event', () => {
          const widget = new Widget({
            hoverStateEnabled: true, disabled: false, onHoverStart,
          });
          widget.widgetElementRef = {} as any;
          widget.hoverStartEffect();

          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(true);
          expect(onHoverStart).toHaveBeenCalledTimes(1);
          expect(onHoverStart).toHaveBeenCalledWith(defaultEvent);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: false });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;
          const detach = widget.hoverStartEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.hoverStart).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.hoverStart).length).toBe(0);
        });

        it('should change hover state if widget is not active', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: false });
          widget.widgetElementRef = {} as any;
          widget.hoverStartEffect();

          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(true);
        });

        it('should not change hover state if widget is active', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: false });
          widget.widgetElementRef = {} as any;
          widget.active = true;
          widget.hoverStartEffect();

          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(false);
        });

        it('should not subscribe to hoverstart if widget is disabled', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: true });
          widget.widgetElementRef = {} as any;
          widget.hoverStartEffect();

          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(false);
        });

        it('should not subscribe if widget is not hoverStateEnabled', () => {
          const widget = new Widget({ hoverStateEnabled: false, disabled: false, onHoverStart });
          widget.widgetElementRef = {} as any;
          widget.hoverStartEffect();

          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(false);
          expect(onHoverStart).toHaveBeenCalledTimes(0);
        });
      });

      describe('hoverEndEffect', () => {
        const onHoverEnd = jest.fn();

        it('should subscribe to hoverEnd event', () => {
          const widget = new Widget({
            hoverStateEnabled: true, disabled: false, onHoverEnd,
          });
          widget.widgetElementRef = {} as any;
          widget.hovered = true;
          widget.hoverEndEffect();

          emit(EVENT.hoverEnd);
          expect(widget.hovered).toBe(false);
          expect(onHoverEnd).toHaveBeenCalledTimes(1);
          expect(onHoverEnd).toHaveBeenCalledWith(defaultEvent);
        });

        it('should work without errors if onHoverEnd is not defined', () => {
          const e = { ...defaultEvent };
          const widget = new Widget({
            hoverStateEnabled: true, disabled: false, onHoverEnd: undefined,
          });
          widget.widgetElementRef = {} as any;
          widget.hovered = true;
          widget.hoverEndEffect();

          emit(EVENT.hoverEnd, e);
          expect(widget.hovered).toBe(false);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: false });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;
          const detach = widget.hoverEndEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.hoverEnd).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.hoverEnd).length).toBe(0);
        });

        it('should call hoverEnd event handler if widget is hovered', () => {
          const widget = new Widget({
            hoverStateEnabled: true, onHoverEnd,
          });
          widget.widgetElementRef = {} as any;
          widget.hoverEndEffect();
          widget.hovered = true;

          emit(EVENT.hoverEnd);
          expect(widget.hovered).toBe(false);
          expect(onHoverEnd).toHaveBeenCalledTimes(1);
        });

        it('should not call hoverEnd event handler if widget is not hovered', () => {
          const widget = new Widget({
            hoverStateEnabled: true, onHoverEnd,
          });
          widget.widgetElementRef = {} as any;
          widget.hoverEndEffect();

          emit(EVENT.hoverEnd);
          expect(onHoverEnd).toHaveBeenCalledTimes(0);
        });

        it('should not subscribe if widget is not hoverStateEnabled', () => {
          const widget = new Widget({ hoverStateEnabled: false, disabled: false, onHoverEnd });
          widget.widgetElementRef = {} as any;
          widget.hovered = true;
          widget.hoverEndEffect();

          emit(EVENT.hoverEnd);
          expect(widget.hovered).toBe(true);
          expect(onHoverEnd).toHaveBeenCalledTimes(0);
        });
      });

      describe('keyboardEffect', () => {
        const onKeyDown = jest.fn();

        it('should subscribe to keyboard event', () => {
          const widget = new Widget({ focusStateEnabled: true, onKeyDown });
          widget.widgetElementRef = {} as any;
          widget.keyboardEffect();

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(1);
          emitKeyboard(KEY.space);
          expect(onKeyDown).toHaveBeenCalledTimes(2);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ focusStateEnabled: true, onKeyDown });
          widget.widgetElementRef = {} as any;
          const detach = widget.keyboardEffect() as DisposeEffectReturn;

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(1);

          detach();

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(1);
        });

        it('should not subscribe if focusStateEnabled is "false"', () => {
          const widget = new Widget({ focusStateEnabled: false, onKeyDown });
          widget.widgetElementRef = {} as any;
          widget.keyboardEffect();

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(0);
        });

        it('should return nothing if widget does not have event and is not focusable', () => {
          const widget = new Widget({ });
          const detach = widget.keyboardEffect();

          expect(detach).toBe(undefined);
        });
      });

      describe('resizeEffect', () => {
        const onDimensionChanged = jest.fn();

        it('should subscribe to resize event', () => {
          const e = { ...defaultEvent };
          const widget = new Widget({ onDimensionChanged });
          widget.widgetElementRef = {} as any;
          widget.resizeEffect();

          emit(EVENT.resize, e);
          expect(onDimensionChanged).toHaveBeenCalledTimes(1);
          expect(onDimensionChanged).toHaveBeenCalledWith(e);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ onDimensionChanged });
          widget.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;
          const detach = widget.resizeEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.resize).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.resize).length).toBe(0);
        });

        it('should not subscribe if callback does not exist', () => {
          const widget = new Widget({ });
          widget.resizeEffect();

          emit(EVENT.resize);
          expect(getEventHandlers(EVENT.resize)).toBe(undefined);
        });
      });

      describe('windowResizeEffect', () => {
        afterEach(() => {
          jest.clearAllMocks();
        });

        it('should subscribe on window.onresize event', () => {
          const onDimensionChanged = jest.fn();
          const widget = new Widget({ onDimensionChanged });

          const dispose = widget.windowResizeEffect() as DisposeEffectReturn;

          expect(resizeCallbacks.add).toBeCalledTimes(1);
          expect(resizeCallbacks.add).toHaveBeenCalledWith(onDimensionChanged);
          expect(resizeCallbacks.remove).toBeCalledTimes(0);

          dispose?.();
        });

        it('should return window.onresize unsubscribe callback', () => {
          const onDimensionChanged = jest.fn();
          const widget = new Widget({ onDimensionChanged });

          const dispose = widget.windowResizeEffect() as DisposeEffectReturn;

          dispose?.();

          expect(resizeCallbacks.remove).toBeCalledTimes(1);
          expect(resizeCallbacks.remove).toHaveBeenCalledWith(onDimensionChanged);
        });

        it('should not subscribe on window.onresize event if onDimensionChanged callback does not defined', () => {
          const widget = new Widget({ });
          const dispose = widget.windowResizeEffect();

          expect(resizeCallbacks.add).toBeCalledTimes(0);
          expect(resizeCallbacks.remove).toBeCalledTimes(0);
          expect(dispose).toBe(undefined);
        });
      });

      describe('visibilityEffect', () => {
        const onVisibilityChange = jest.fn();

        it('should subscribe to visible events', () => {
          const widget = new Widget({ onVisibilityChange });
          widget.widgetElementRef = {} as any;
          widget.visibilityEffect();

          emit(EVENT.shown);
          expect(onVisibilityChange).toHaveBeenCalledTimes(1);
          expect(onVisibilityChange).toHaveBeenCalledWith(true);

          emit(EVENT.hiding);
          expect(onVisibilityChange).toHaveBeenCalledTimes(2);
          expect(onVisibilityChange).toHaveBeenCalledWith(false);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ onVisibilityChange });
          widget.widgetElementRef = {} as any;
          const detach = widget.visibilityEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.shown).length).toBe(1);
          expect(getEventHandlers(EVENT.hiding).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.shown).length).toBe(0);
          expect(getEventHandlers(EVENT.hiding).length).toBe(0);
        });

        it('should not subscribe if callback does not exist', () => {
          const widget = new Widget({ });
          widget.visibilityEffect();

          expect(getEventHandlers(EVENT.shown)).toBe(undefined);
          expect(getEventHandlers(EVENT.hiding)).toBe(undefined);
        });
      });

      describe('setRootElementRef', () => {
        it('set rootElementRef to div ref', () => {
          const widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;
          const component = new Widget({
            rootElementRef: {},
          } as WidgetProps);
          component.widgetElementRef = widgetElementRef;
          component.setRootElementRef();

          expect(component.props.rootElementRef?.current).toBe(component.widgetElementRef.current);
        });

        it('hasnt rootElementRef', () => {
          const component = new Widget({ });
          component.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;
          component.setRootElementRef();
          expect(component.props.rootElementRef?.current).toBeUndefined();
        });

        it('calls onRootElementRendered handler', () => {
          const onRootElementRendered = jest.fn();
          const component = new Widget({ onRootElementRendered });
          component.widgetElementRef = { current: {} } as RefObject<HTMLDivElement>;

          component.setRootElementRef();

          expect(onRootElementRendered).toBeCalledTimes(1);
          expect(onRootElementRendered).toBeCalledWith(component.widgetElementRef.current);
        });

        it('does not raise any error if onRootElementRendered is not passed', () => {
          const component = new Widget({});

          expect(() => { component.setRootElementRef(); }).not.toThrow();
        });
      });

      describe('checkDeprecation', () => {
        it('check deprecation error', () => {
          const component = new Widget({
            width: () => {},
            height: () => {},
          } as WidgetProps);
          component.checkDeprecation();
          expect(errors.log).toBeCalledTimes(2);
          expect(errors.log).toHaveBeenNthCalledWith(1, 'W0017', 'width');
          expect(errors.log).toHaveBeenNthCalledWith(2, 'W0017', 'height');
        });

        it('no deprecation error', () => {
          const component = new Widget({
            width: '100px',
            height: '100px',
          } as WidgetProps);
          component.checkDeprecation();
          expect(errors.log).toBeCalledTimes(0);
        });
      });
    });

    describe('Methods', () => {
      describe('activate', () => {
        it('should switch active state to "true"', () => {
          const widget = new Widget({ activeStateEnabled: true });
          expect(widget.active).toBe(false);
          widget.activate();
          expect(widget.active).toBe(true);
        });
      });

      describe('deactivate', () => {
        it('should switch active state to "false"', () => {
          const widget = new Widget({ activeStateEnabled: true });
          widget.activate();
          expect(widget.active).toBe(true);
          widget.deactivate();
          expect(widget.active).toBe(false);
        });
      });

      describe('focus', () => {
        it('should trigger focus at element', () => {
          const widget = new Widget({ focusStateEnabled: true });
          const mockRef = jest.fn();
          widget.widgetElementRef = mockRef as any;

          widget.focusInEffect();

          expect(widget.focused).toBe(false);
          widget.focus();
          expect(widget.focused).toBe(true);
        });
      });

      describe('blur', () => {
        it('should trigger blur at root element if it is active element', () => {
          const widget = new Widget({ focusStateEnabled: true });
          const mockRef = { current: { blur: jest.fn() } };
          widget.widgetElementRef = mockRef as any;

          const { getActiveElement } = domAdapter;
          try {
            domAdapter.getActiveElement = () => mockRef.current as unknown as HTMLDivElement;
            widget.focusInEffect();
            widget.focusOutEffect();
            widget.focus();
            widget.blur();

            expect(widget.widgetElementRef.current?.blur).toHaveBeenCalledTimes(1);
          } finally {
            domAdapter.getActiveElement = getActiveElement;
          }
        });

        it('should not trigger blur at root element if it is not active element', () => {
          const widget = new Widget({ focusStateEnabled: true });
          const mockRef = { current: { blur: jest.fn() } };
          widget.widgetElementRef = mockRef as any;

          widget.focusInEffect();
          widget.focusOutEffect();
          widget.focus();
          widget.blur();

          expect(widget.widgetElementRef.current?.blur).not.toBeCalled();
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      beforeEach(() => {
        jest.resetAllMocks();
      });

      describe('attributes', () => {
        it('should return ARIA labels', () => {
          const widget = new Widget({ visible: false, aria: { id: '10', role: 'button', level: '100' } });

          expect(widget.attributes).toEqual({
            'aria-hidden': 'true', id: '10', role: 'button', 'aria-level': '100', 'rest-attributes': 'restAttributes',
          });
        });

        it('rest attributes should have more priority than aria property (T1115877)', () => {
          const widget = new Widget({ visible: false, aria: { label: 'default' } });
          widget.restAttributes = { 'aria-label': 'custom', 'aria-hidden': 'false' };

          expect(widget.attributes).toEqual({
            'aria-hidden': 'false',
            'aria-label': 'custom',
          });
        });

        it('should not return accessKey if widget is not focusable', () => {
          const widget1 = new Widget({ accessKey: 'c', visible: true });
          expect(widget1.attributes).toEqual({ 'rest-attributes': 'restAttributes' });
        });

        it('should return accessKey if widget is focusable', () => {
          const widget2 = new Widget({ accessKey: 'c', focusStateEnabled: true, visible: true });
          expect(widget2.attributes).toEqual({ accessKey: 'c', 'rest-attributes': 'restAttributes' });
        });

        it('should not return accessKay if widget is disabled', () => {
          const widget3 = new Widget({
            accessKey: 'c', focusStateEnabled: true, disabled: true, visible: true,
          });
          expect(widget3.attributes).toEqual({ 'aria-disabled': 'true', 'rest-attributes': 'restAttributes' });
        });
      });

      describe('styles', () => {
        it('should spread style', () => {
          const widget = new Widget({ });
          widget.restAttributes = { style: { color: 'red' } };

          expect(widget.styles).toEqual({ color: 'red' });
        });

        it('should add width and height as functions', () => {
          const widget = new Widget({ width: () => 50, height: () => 'auto' });

          expect(widget.styles).toEqual({ width: '50px', height: 'auto' });
        });

        it('should add width and height as string values', () => {
          const widget = new Widget({ width: '50px', height: () => '100%' });

          expect(widget.styles).toEqual({ width: '50px', height: '100%' });
        });

        it('should add width and height as number values', () => {
          const widget = new Widget({ width: 50, height: 70 });

          expect(widget.styles).toEqual({ width: '50px', height: '70px' });
        });

        it('should ignore width and height undefined values', () => {
          const widget = new Widget({ width: undefined, height: undefined });

          expect(widget.styles).toEqual({});
        });

        it('should convert string without unit into number', () => {
          const widget = new Widget({ width: '50', height: '100' });

          expect(widget.styles).toEqual({ width: '50px', height: '100px' });
        });
      });

      describe('cssClasses', () => {
        it('should not add any classes', () => {
          const widget = new Widget({ visible: true });

          expect(widget.cssClasses).toEqual('');
        });

        it('should add widget class', () => {
          const widget = new Widget({ addWidgetClass: true, visible: true });

          expect(widget.cssClasses).toEqual('dx-widget');
        });

        it('should add invisible class', () => {
          const widget = new Widget({ visible: false });

          expect(widget.cssClasses).toEqual('dx-state-invisible');
        });

        it('should add className property', () => {
          const widget = new Widget({ className: 'custom-class', visible: true });

          expect(widget.cssClasses).toEqual('custom-class');
        });

        it('should add class from classes property', () => {
          const widget = new Widget({ classes: 'custom-classes', visible: true });

          expect(widget.cssClasses).toEqual('custom-classes');
        });

        it('should add disabled class', () => {
          const widget = new Widget({ disabled: true, visible: true });

          expect(widget.cssClasses).toEqual('dx-state-disabled');
        });

        it('should add focused class', () => {
          const widget = new Widget({ visible: true, focusStateEnabled: true, disabled: false });

          expect(widget.cssClasses).toEqual('');

          widget.focused = true;
          expect(widget.cssClasses).toEqual('dx-state-focused');
        });

        it('should add active class', () => {
          const widget = new Widget({ visible: true, activeStateEnabled: true });
          widget.active = true;

          expect(widget.cssClasses).toEqual('dx-state-active');
        });

        it('should not add active class if widget is disabled', () => {
          const widget = new Widget({ visible: true, activeStateEnabled: true, disabled: true });
          widget.active = true;

          expect(widget.cssClasses).toEqual('dx-state-disabled');
        });

        it('should add hovered class', () => {
          const widget = new Widget({ visible: true, disabled: false, hoverStateEnabled: true });

          widget.active = false;
          widget.hovered = true;
          expect(widget.cssClasses).toEqual('dx-state-hover');
        });

        it('should add RTL class', () => {
          (resolveRtlEnabled as jest.Mock).mockReturnValue(true);
          const widget = new Widget({ visible: true });

          expect(widget.cssClasses).toEqual('dx-rtl');
          (resolveRtlEnabled as jest.Mock).mockReturnValue(false);
        });

        it('should add visibility handler class', () => {
          const widget = new Widget({ visible: true, onVisibilityChange: () => undefined });

          expect(widget.cssClasses).toEqual('dx-visibility-change-handler');
        });
      });

      describe('tabIndex', () => {
        it('should return `undefined` if disabled', () => {
          const widget = new Widget({ disabled: true, focusStateEnabled: true });

          expect(widget.tabIndex).toBe(undefined);
        });

        it('should return `undefined` if widget is not focusable', () => {
          const widget = new Widget({ disabled: false, focusStateEnabled: false });

          expect(widget.tabIndex).toBe(undefined);
        });

        it('should return value if widget is focusable and not disabled', () => {
          const widget = new Widget({ disabled: false, focusStateEnabled: true, tabIndex: 10 });

          expect(widget.tabIndex).toBe(10);
        });
      });

      describe('shouldRenderConfigProvider', () => {
        it('should call utils method resolveRtlEnabledDefinition', () => {
          (resolveRtlEnabledDefinition as jest.Mock).mockReturnValue(true);
          const widget = new Widget({ });
          const { shouldRenderConfigProvider } = widget;

          expect(shouldRenderConfigProvider).toBe(true);
          expect(resolveRtlEnabledDefinition).toHaveBeenCalledTimes(1);
        });
      });

      describe('rtlEnabled', () => {
        it('should call utils method resolveRtlEnabled', () => {
          (resolveRtlEnabled as jest.Mock).mockReturnValue(false);
          const widget = new Widget({ });
          const { rtlEnabled } = widget;

          expect(rtlEnabled).toBe(false);
          expect(resolveRtlEnabled).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe('Default options', () => {
    it('should define necessary properties', () => {
      const defaultProps = new WidgetProps();

      expect(defaultProps).toEqual({
        addWidgetClass: true,
        activeStateEnabled: false,
        disabled: false,
        focusStateEnabled: false,
        hoverStateEnabled: false,
        tabIndex: 0,
        visible: true,
        _feedbackHideTimeout: 400,
        _feedbackShowTimeout: 30,
        cssText: '',
        aria: {},
        classes: '',
        className: '',
        name: '',
      });
    });
  });
});
