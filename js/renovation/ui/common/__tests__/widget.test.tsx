import { h, createRef } from 'preact';
// Should be before component import
import { shallow } from 'enzyme';
import {
  clear as clearEventHandlers, defaultEvent, emit,
  emitKeyboard, getEventHandlers, EVENT, KEY,
} from '../../../__tests__/events_mock';
import { Widget, viewFunction, WidgetProps } from '../widget';
import { isFakeClickEvent } from '../../../../events/utils/index';
import config from '../../../../core/config';

jest.mock('../../../../events/utils/index', () => ({
  ...require.requireActual('../../../../events/utils/index'),
  isFakeClickEvent: jest.fn(),
}));

describe('Widget', () => {
  describe('Render', () => {
    it('should pass all necessary properties to the div element', () => {
      const props = {
        hint: 'hint',
        visible: true,
      };
      const widget = shallow(viewFunction({
        props,
        tabIndex: 10,
        cssClasses: 'cssClasses',
        styles: 'styles',
        attributes: { attributes: 'attributes' },
      } as any) as any);

      expect(widget.props()).toEqual({
        attributes: 'attributes',
        style: 'styles',
        className: 'cssClasses',
        hidden: false,
        title: 'hint',
        tabIndex: 10,
      });
    });

    it('should pass REF into the main div element', () => {
      const mockRef = createRef();
      const props = {
        hint: 'hint',
        visible: true,
      };
      shallow(viewFunction({
        widgetRef: mockRef,
        props,
        cssClasses: 'cssClasses',
      } as any) as any);

      expect(mockRef.current.className).toBe('cssClasses');
    });

    it('should render children', () => {
      const mockRef = createRef();
      const props = {
        hint: 'hint',
        visible: true,
        children: <div className="child" />,
      };
      const widget = shallow(viewFunction({
        widgetRef: mockRef,
        props,
        cssClasses: 'cssClasses',
      } as any) as any);

      expect(widget.find('.child').exists()).toBe(true);
    });
  });

  describe('Behavior', () => {
    beforeEach(clearEventHandlers);

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('Effects', () => {
      describe('accessKeyEffect', () => {
        const e = { ...defaultEvent, stopImmediatePropagation: jest.fn() };

        beforeEach(() => {
          (isFakeClickEvent as any).mockImplementation(() => true);
        });

        it('should subscribe to click event', () => {
          const widget = new Widget({ accessKey: 'c', focusStateEnabled: true, disabled: false });
          widget.widgetRef = {} as any;

          widget.accessKeyEffect();
          emit(EVENT.dxClick, e);

          expect(widget.focused).toBe(true);
          expect(e.stopImmediatePropagation).toBeCalledTimes(1);
        });

        it('should not change state if click event is not fake', () => {
          (isFakeClickEvent as any).mockImplementation(() => false);
          const widget = new Widget({ accessKey: 'c', focusStateEnabled: true, disabled: false });
          widget.widgetRef = {} as any;

          widget.accessKeyEffect();
          emit(EVENT.dxClick, e);

          expect(widget.focused).toBe(false);
          expect(e.stopImmediatePropagation).toBeCalledTimes(0);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ accessKey: 'c', focusStateEnabled: true, disabled: false });
          widget.widgetRef = {} as any;

          const detach = widget.accessKeyEffect();

          expect(getEventHandlers(EVENT.dxClick).length).toBe(1);
          detach!();
          expect(getEventHandlers(EVENT.dxClick).length).toBe(0);
        });

        it('should not subscribe if widget is disabled', () => {
          const widget = new Widget({ accessKey: 'c', focusStateEnabled: true, disabled: true });

          widget.accessKeyEffect();
          emit(EVENT.dxClick, e);

          expect(widget.focused).toBe(false);
          expect(e.stopImmediatePropagation).toBeCalledTimes(0);
        });

        it('should not subscribe if widget is not focusable', () => {
          const widget = new Widget({ accessKey: 'c', focusStateEnabled: false, disabled: false });

          widget.accessKeyEffect();
          emit(EVENT.dxClick, e);

          expect(widget.focused).toBe(false);
          expect(e.stopImmediatePropagation).toBeCalledTimes(0);
        });

        it('should not subscribe if widget does not have accessKey', () => {
          const widget = new Widget({ focusStateEnabled: true, disabled: false });

          widget.accessKeyEffect();
          emit(EVENT.dxClick, e);

          expect(widget.focused).toBe(false);
          expect(e.stopImmediatePropagation).toBeCalledTimes(0);
        });
      });

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

          const detach = widget.activeEffect();

          expect(getEventHandlers(EVENT.active).length).toBe(1);
          expect(getEventHandlers(EVENT.inactive).length).toBe(1);
          detach!();
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

          const detach = widget.clickEffect();
          detach!();
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
          const widget = new Widget({ focusStateEnabled: true, disabled: false });
          widget.widgetRef = {} as any;

          widget.focusEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(true);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(1);

          emit(EVENT.blur, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(2);
        });

        it('should return unsubscribe callback', () => {
          const widget = new Widget({ focusStateEnabled: true, disabled: false });

          const detach = widget.focusEffect();

          expect(getEventHandlers(EVENT.focus).length).toBe(1);
          expect(getEventHandlers(EVENT.blur).length).toBe(1);
          detach!();
          expect(getEventHandlers(EVENT.focus).length).toBe(0);
          expect(getEventHandlers(EVENT.blur).length).toBe(0);
        });

        it('should subscribe is widget is disabled', () => {
          const widget = new Widget({ focusStateEnabled: true, disabled: true });
          widget.widgetRef = {} as any;
          widget.focused = false;

          widget.focusEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(0);
        });

        it('should subscribe is widget is not focusable', () => {
          const widget = new Widget({ focusStateEnabled: false, disabled: false });
          widget.widgetRef = {} as any;
          widget.focused = false;

          widget.focusEffect();

          emit(EVENT.focus, e);
          expect(widget.focused).toBe(false);
          expect(e.isDefaultPrevented).toHaveBeenCalledTimes(0);
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
          const detach = widget.hoverEffect();

          expect(getEventHandlers(EVENT.hoverStart).length).toBe(1);
          expect(getEventHandlers(EVENT.hoverEnd).length).toBe(1);
          detach!();
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
          const detach = widget.keyboardEffect();

          emitKeyboard(KEY.enter);
          expect(onKeyDown).toHaveBeenCalledTimes(1);

          detach!();

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
          const detach = widget.resizeEffect();

          expect(getEventHandlers(EVENT.resize).length).toBe(1);
          detach!();
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
          const detach = widget.visibilityEffect();

          expect(getEventHandlers(EVENT.shown).length).toBe(1);
          expect(getEventHandlers(EVENT.hiding).length).toBe(1);
          detach!();
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
            'aria-hidden': 'true', id: '10', role: 'button', 'aria-level': '100', restAttributes: 'restAttributes',
          });
        });

        it('should not return accessKey if widget is not focusable', () => {
          const widget1 = new Widget({ accessKey: 'c', visible: true });
          expect(widget1.attributes).toEqual({ restAttributes: 'restAttributes' });
        });

        it('should return accessKey if widget is focusable', () => {
          const widget2 = new Widget({ accessKey: 'c', focusStateEnabled: true, visible: true });
          expect(widget2.attributes).toEqual({ accessKey: 'c', restAttributes: 'restAttributes' });
        });

        it('should not return accessKay if widget is disabled', () => {
          const widget3 = new Widget({
            accessKey: 'c', focusStateEnabled: true, disabled: true, visible: true,
          });
          expect(widget3.attributes).toEqual({ 'aria-disabled': 'true', restAttributes: 'restAttributes' });
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
        rtlEnabled: config().rtlEnabled,
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
