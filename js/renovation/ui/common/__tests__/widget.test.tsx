import React, { createRef } from 'react';
// Should be before component import
import { mount } from 'enzyme';
// import { create as mount } from 'react-test-renderer';
import each from 'jest-each';
import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import {
  clear as clearEventHandlers, defaultEvent, emit,
  emitKeyboard, getEventHandlers, EVENT, KEY,
} from '../../../test_utils/events_mock';
import { Widget, viewFunction, WidgetProps } from '../widget';
import config from '../../../../core/config';
import { ConfigProvider } from '../config_provider';

jest.mock('../../../../events/utils/index', () => ({
  ...jest.requireActual('../../../../events/utils/index'),
}));
jest.mock('../config_provider', () => ({ ConfigProvider: () => null }));

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
        hidden: false,
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
        widgetRef: mockRef,
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
        widgetRef: mockRef,
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
      describe('activeEffect', () => {
        const onActive = jest.fn();
        const onInactive = jest.fn();

        it('should subscribe to active event', () => {
          const e = { ...defaultEvent };
          const widget = new Widget({
            activeStateEnabled: true, disabled: false, onActive, onInactive,
          });
          widget.widgetRef = {} as any;
          widget.activeEffect();

          emit(EVENT.active, e);
          expect(widget.active).toBe(true);

          emit(EVENT.inactive, e);
          expect(widget.active).toBe(false);

          expect(onActive).toHaveBeenCalledTimes(1);
          expect(onActive).toHaveBeenCalledWith(e);
          expect(onInactive).toHaveBeenCalledTimes(1);
          expect(onInactive).toHaveBeenCalledWith(e);
        });

        it('should woork without errors if onActive and onInactive are not defined', () => {
          const e = { ...defaultEvent };
          const widget = new Widget({
            activeStateEnabled: true, disabled: false, onActive: undefined, onInactive: undefined,
          });
          widget.widgetRef = {} as any;
          widget.activeEffect();

          emit(EVENT.active, e);
          expect(widget.active).toBe(true);

          emit(EVENT.inactive, e);
          expect(widget.active).toBe(false);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ activeStateEnabled: true, disabled: false });

          const detach = widget.activeEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.active).length).toBe(1);
          expect(getEventHandlers(EVENT.inactive).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.active).length).toBe(0);
          expect(getEventHandlers(EVENT.inactive).length).toBe(0);
        });

        it('should not subscribe if widget is disabled', () => {
          const widget = new Widget({
            activeStateEnabled: true, disabled: true, onActive, onInactive,
          });
          widget.activeEffect();
          widget.active = false;

          emit(EVENT.active);
          expect(widget.active).toBe(false);

          widget.active = true;
          emit(EVENT.inactive);
          expect(widget.active).toBe(true);

          expect(onActive).toHaveBeenCalledTimes(0);
          expect(onInactive).toHaveBeenCalledTimes(0);
        });

        it('should not subscribe if widget is not focusable', () => {
          const widget = new Widget({
            activeStateEnabled: false, disabled: false, onActive, onInactive,
          });
          widget.activeEffect();
          widget.active = false;

          emit(EVENT.active);
          expect(widget.active).toBe(false);

          widget.active = true;
          emit(EVENT.inactive);
          expect(widget.active).toBe(true);

          expect(onActive).toHaveBeenCalledTimes(0);
          expect(onInactive).toHaveBeenCalledTimes(0);
        });
      });

      describe('clickEffect', () => {
        it('should subscribe to dxClick event', () => {
          const e = { ...defaultEvent };
          const onClick = jest.fn();
          const widget = new Widget({ onClick });

          widget.clickEffect();
          emit(EVENT.dxClick, e);

          expect(onClick).toHaveBeenCalledTimes(1);
          expect(onClick).toHaveBeenCalledWith(e);
        });

        it('should return unsubscribe callback', () => {
          const onClick = jest.fn();
          const widget = new Widget({ onClick });

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

      describe('focusEffect', () => {
        const e = { ...defaultEvent, isDefaultPrevented: jest.fn() };

        it('should subscribe to focus event', () => {
          const onFocusIn = jest.fn();
          const onFocusOut = jest.fn();
          const widget = new Widget({
            focusStateEnabled: true, disabled: false, onFocusIn, onFocusOut,
          });
          widget.widgetRef = {} as any;

          widget.focusEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(true);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);
          expect(onFocusIn).toHaveBeenCalledTimes(1);

          emit(EVENT.blur, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(2);
          expect(onFocusOut).toHaveBeenCalledTimes(1);
        });

        it('should not raise any error if onFocusIn or onFocusOut is undefined', () => {
          const widget = new Widget({
            focusStateEnabled: true, disabled: false, onFocusIn: undefined, onFocusOut: undefined,
          });
          widget.widgetRef = {} as any;

          widget.focusEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(true);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);

          emit(EVENT.blur, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(2);
        });

        it('should not raise onFocusIn/onFocusOut if event is prevented', () => {
          try {
            e.isDefaultPrevented = jest.fn(() => true);
            const onFocusIn = jest.fn();
            const onFocusOut = jest.fn();
            const widget = new Widget({
              focusStateEnabled: true, disabled: false, onFocusIn, onFocusOut,
            });
            widget.widgetRef = {} as any;

            widget.focusEffect();

            emit(EVENT.focus, e);
            expect(widget.focused).toBe(false);
            expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);
            expect(onFocusIn).not.toHaveBeenCalled();

            emit(EVENT.blur, e);
            expect(widget.focused).toBe(false);
            expect(e.isDefaultPrevented).toHaveBeenCalledTimes(2);
            expect(onFocusOut).not.toHaveBeenCalled();
          } finally {
            e.isDefaultPrevented = jest.fn();
          }
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ focusStateEnabled: true, disabled: false });

          const detach = widget.focusEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.focus).length).toBe(1);
          expect(getEventHandlers(EVENT.blur).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.focus).length).toBe(0);
          expect(getEventHandlers(EVENT.blur).length).toBe(0);
        });

        it('should subscribe if widget is disabled', () => {
          const widget = new Widget({ focusStateEnabled: true, disabled: true });
          widget.widgetRef = {} as any;
          widget.focused = false;

          widget.focusEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(0);
        });

        it('should subscribe is widget is not focusable', () => {
          const onFocusIn = jest.fn();

          const widget = new Widget({ focusStateEnabled: false, disabled: false, onFocusIn });
          widget.widgetRef = {} as any;
          widget.focused = false;

          widget.focusEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(0);
          expect(onFocusIn).toHaveBeenCalledTimes(0);
        });
      });

      describe('hoverEffect', () => {
        it('should subscribe to hover event', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: false });
          widget.widgetRef = {} as any;
          widget.active = false;
          widget.hoverEffect();

          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(true);

          emit(EVENT.hoverEnd);
          expect(widget.hovered).toBe(false);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: false });
          widget.active = false;
          const detach = widget.hoverEffect() as DisposeEffectReturn;

          expect(getEventHandlers(EVENT.hoverStart).length).toBe(1);
          expect(getEventHandlers(EVENT.hoverEnd).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.hoverStart).length).toBe(0);
          expect(getEventHandlers(EVENT.hoverEnd).length).toBe(0);
        });

        it('should change hover state if widget is not active', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: false });
          widget.widgetRef = {} as any;
          widget.active = true;
          widget.hoverEffect();

          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(false);

          emit(EVENT.hoverEnd);
          expect(widget.hovered).toBe(false);
        });

        it('should subscribe if widget is disabled', () => {
          const widget = new Widget({ hoverStateEnabled: true, disabled: true });
          widget.widgetRef = {} as any;
          widget.active = false;
          widget.hoverEffect();

          expect(widget.hovered).toBe(false);
          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(false);
        });

        it('should subscribe if widget is not hovered', () => {
          const widget = new Widget({ hoverStateEnabled: false, disabled: false });
          widget.widgetRef = {} as any;
          widget.active = false;
          widget.hoverEffect();

          expect(widget.hovered).toBe(false);
          emit(EVENT.hoverStart);
          expect(widget.hovered).toBe(false);
        });
      });

      describe('keyboardEffect', () => {
        const onKeyDown = jest.fn();

        it('should subscribe to keyboard event', () => {
          const widget = new Widget({ focusStateEnabled: true, onKeyDown });
          widget.widgetRef = {} as any;
          widget.keyboardEffect();

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(1);
          emitKeyboard(KEY.space);
          expect(onKeyDown).toHaveBeenCalledTimes(2);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ focusStateEnabled: true, onKeyDown });
          widget.widgetRef = {} as any;
          const detach = widget.keyboardEffect() as DisposeEffectReturn;

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(1);

          detach();

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(1);
        });

        it('should subscribe without focusable', () => {
          const widget = new Widget({ focusStateEnabled: false, onKeyDown });
          widget.widgetRef = {} as any;
          widget.keyboardEffect();

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(1);
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
          widget.widgetRef = {} as any;
          widget.resizeEffect();

          emit(EVENT.resize, e);
          expect(onDimensionChanged).toHaveBeenCalledTimes(1);
          expect(onDimensionChanged).toHaveBeenCalledWith(e);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ onDimensionChanged });
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

      describe('visibilityEffect', () => {
        const onVisibilityChange = jest.fn();

        it('should subscribe to visible events', () => {
          const widget = new Widget({ onVisibilityChange });
          widget.widgetRef = {} as any;
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
          widget.widgetRef = {} as any;
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
          const widgetRef = {} as HTMLDivElement;
          const component = new Widget({
            rootElementRef: {},
          } as WidgetProps);
          component.widgetRef = widgetRef;
          component.setRootElementRef();

          expect(component.props.rootElementRef).toBe(component.widgetRef);
        });

        it('hasnt rootElementRef', () => {
          const component = new Widget({ });
          component.widgetRef = {} as HTMLDivElement;
          component.setRootElementRef();
          expect(component.props.rootElementRef).toBeUndefined();
        });
      });
    });

    describe('Methods', () => {
      describe('focus', () => {
        it('should trigger focus at element', () => {
          const widget = new Widget({ focusStateEnabled: true });
          const mockRef = jest.fn();
          widget.widgetRef = mockRef as any;

          widget.focusEffect();

          expect(widget.focused).toBe(false);
          widget.focus();
          expect(widget.focused).toBe(true);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('attributes', () => {
        it('should return ARIA labels', () => {
          const widget = new Widget({ visible: false, aria: { id: 10, role: 'button', level: 100 } });

          expect(widget.attributes).toEqual({
            'aria-hidden': 'true', id: '10', role: 'button', 'aria-level': '100', 'rest-attributes': 'restAttributes',
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
        it('should add invisible class', () => {
          const widget = new Widget({ visible: false });

          expect(widget.cssClasses).toEqual('dx-widget dx-state-invisible');
        });

        it('should add className property', () => {
          const widget = new Widget({ className: 'custom-class', visible: true });

          expect(widget.cssClasses).toEqual('dx-widget custom-class');
        });

        it('should add class from classes property', () => {
          const widget = new Widget({ classes: 'custom-classes', visible: true });

          expect(widget.cssClasses).toEqual('dx-widget custom-classes');
        });

        it('should add disabled class', () => {
          const widget = new Widget({ disabled: true, visible: true });

          expect(widget.cssClasses).toEqual('dx-widget dx-state-disabled');
        });

        it('should add focused class', () => {
          const widget = new Widget({ visible: true, focusStateEnabled: true, disabled: false });

          expect(widget.cssClasses).toEqual('dx-widget');

          widget.focused = true;
          expect(widget.cssClasses).toEqual('dx-widget dx-state-focused');
        });

        it('should add active class', () => {
          const widget = new Widget({ visible: true });
          widget.active = true;

          expect(widget.cssClasses).toEqual('dx-widget dx-state-active');
        });

        it('should add hovered class', () => {
          const widget = new Widget({ visible: true, disabled: false, hoverStateEnabled: true });

          widget.active = false;
          widget.hovered = true;
          expect(widget.cssClasses).toEqual('dx-widget dx-state-hover');
        });

        it('should add RTL class', () => {
          const widget = new Widget({ visible: true, rtlEnabled: true });

          expect(widget.cssClasses).toEqual('dx-widget dx-rtl');
        });

        it('should add visibility handler class', () => {
          const widget = new Widget({ visible: true, onVisibilityChange: () => undefined });

          expect(widget.cssClasses).toEqual('dx-widget dx-visibility-change-handler');
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

      each`
      global       | rtlEnabled   | parentRtlEnabled | expected
      ${true}      | ${true}      | ${true}          | ${false}
      ${undefined} | ${undefined} | ${undefined}     | ${false}
      ${true}      | ${true}      | ${undefined}     | ${true}
      ${true}      | ${false}     | ${undefined}     | ${true}
      ${true}      | ${true}      | ${false}         | ${true}
      ${true}      | ${false}     | ${true}          | ${true}
      ${true}      | ${undefined} | ${undefined}     | ${true}
      ${true}      | ${undefined} | ${true}          | ${false}
      ${true}      | ${undefined} | ${false}         | ${false}
      ${true}      | ${true}      | ${true}          | ${false}
      `
        .describe('shouldRenderConfigProvider', ({
          global, rtlEnabled, parentRtlEnabled, expected,
        }) => {
          const name = `${JSON.stringify({
            global, rtlEnabled, parentRtlEnabled, expected,
          })}`;

          it(name, () => {
            config().rtlEnabled = global;
            const widget = new Widget({ rtlEnabled });
            widget.config = { rtlEnabled: parentRtlEnabled };
            expect(widget.shouldRenderConfigProvider).toBe(expected);
          });
        });

      describe('rtlEnabled', () => {
        it('should return value from props if props has value', () => {
          const widget = new Widget({ rtlEnabled: false });
          // emulate context
          widget.config = { rtlEnabled: true };

          expect(widget.rtlEnabled).toBe(false);
        });

        it('should return value from parent rtlEnabled context if props isnt defined', () => {
          const widget = new Widget({ });
          // emulate context
          widget.config = { rtlEnabled: true };
          expect(widget.rtlEnabled).toBe(true);
        });

        it('should return value from config if any other props isnt defined', () => {
          config().rtlEnabled = true;
          const widget = new Widget({ });
          expect(widget.rtlEnabled).toBe(true);
        });
      });
    });
  });

  describe('Default options', () => {
    it('should define necessary properties', () => {
      const defaultProps = new WidgetProps();

      expect(defaultProps).toEqual({
        accessKey: null,
        activeStateEnabled: false,
        disabled: false,
        focusStateEnabled: false,
        hoverStateEnabled: false,
        onContentReady: expect.any(Function),
        tabIndex: 0,
        visible: true,
        _feedbackHideTimeout: 400,
        _feedbackShowTimeout: 30,
        aria: {},
        classes: '',
        className: '',
        name: '',
      });
    });
  });
});
