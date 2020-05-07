import { h, createRef } from 'preact';
import { mount, shallow } from 'enzyme';
// Should be before component import
import {
  clear as clearEventHandlers, defaultEvent, emit, getEventHandlers, fakeClickEvent, EVENT,
} from './utils/events-mock';
import Widget from '../../js/renovation/widget.p';
import type { WidgetRef } from '../../js/renovation/widget.p';

describe('Widget', () => {
  const render = (props = {}) => shallow(<Widget {...props} />);

  beforeEach(clearEventHandlers);

  describe('Props', () => {
    describe('accessKey', () => {
      it('should render `accesskey` attribute', () => {
        const widget = render({ accessKey: 'y', focusStateEnabled: true });

        expect(widget.props().accessKey).toBe('y');
      });

      it('should not render if disabled', () => {
        const widget = render({ accessKey: 'y', focusStateEnabled: true, disabled: true });

        expect(widget.props().accessKey).toBe(undefined);
      });

      it('should not render if `focusStateEnabled` is false', () => {
        const widget = render({ accessKey: 'y', focusStateEnabled: false });

        expect(widget.props().accessKey).toBe(undefined);
      });

      it('should take a focus if the `accessKey` is pressed', () => {
        const widget = render({ accessKey: 'y', focusStateEnabled: true });

        emit(EVENT.dxClick, fakeClickEvent);
        expect(widget.hasClass('dx-state-focused')).toBe(true);
      });

      it('should detach `dxclick` event before rerendering', () => {
        const widget = mount(<Widget accessKey="y" focusStateEnabled />);

        expect(getEventHandlers(EVENT.dxClick).length).toBe(1);
        widget.unmount();
        expect(getEventHandlers(EVENT.dxClick).length).toBe(0);
      });

      it('should not fire `dxclick` event if the `accessKey` is pressed', () => {
        const e = { ...fakeClickEvent, stopImmediatePropagation: jest.fn() };

        render({ accessKey: 'y', focusStateEnabled: true });
        emit(EVENT.dxClick, e);
        expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(1);
      });

      it('should ignore real mouse click', () => {
        const e = { ...defaultEvent, stopImmediatePropagation: jest.fn() };
        const widget = render({ accessKey: 'y', focusStateEnabled: true });

        emit(EVENT.dxClick, e);
        expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(0);
        expect(widget.hasClass('dx-state-focused')).toBe(false);
      });
    });

    describe('rtlEnabled', () => {
      it('should not add rtl marker class by default', () => {
        const widget = render();

        expect(widget.hasClass('dx-rtl')).toBe(false);
      });

      it('should add rtl marker class if `rtlEnabled` is true', () => {
        const widget = render({ rtlEnabled: true });

        expect(widget.hasClass('dx-rtl')).toBe(true);
      });
    });

    describe('width/height', () => {
      it('should have the ability to be a function', () => {
        const widget = render({ width: () => 50, height: () => 'auto' });

        expect(widget.props().style).toEqual({ width: 50, height: 'auto' });
      });

      it('should process string values', () => {
        const widget = render({ width: '50px', height: () => '100%' });

        expect(widget.props().style).toEqual({ width: '50px', height: '100%' });
      });

      it('should process number values', () => {
        const widget = render({ width: 50, height: 70 });

        expect(widget.props().style).toEqual({ width: 50, height: 70 });
      });

      it('should ignore null/undefined values', () => {
        const widget = render({ width: null, height: undefined });

        expect(widget.props().style).toEqual({});
      });
    });

    describe('disabled', () => {
      it('should add css marker class', () => {
        const widget = render({ disabled: true });

        expect(widget.hasClass('dx-state-disabled')).toBe(true);
      });

      it('should add aria attribute', () => {
        const widget = render({ disabled: true });

        expect(widget.prop('aria-disabled')).toBe('true');
      });
    });

    describe('visible', () => {
      it('should add css marker class', () => {
        const widget = render({ visible: false });

        expect(widget.hasClass('dx-state-invisible')).toBe(true);
      });

      it('should add aria attribute', () => {
        const widget = render({ visible: false });

        expect(widget.prop('aria-hidden')).toBe('true');
      });

      it('should add hidden attribute', () => {
        const widget = render({ visible: false });

        expect(widget.prop('hidden')).toBe(true);
      });
    });

    describe('tabIndex', () => {
      it('should add tabIndex attribute by default', () => {
        const widget = render({ focusStateEnabled: true });

        expect(widget.prop('tabIndex')).toBe(0);
      });

      it('should add custom `tabIndex` attribute', () => {
        const widget = render({ focusStateEnabled: true, tabIndex: 10 });

        expect(widget.prop('tabIndex')).toBe(10);
      });

      it('should not add tabIndex attribute if the `disabled` is true', () => {
        const widget = render({ focusStateEnabled: true, tabIndex: 10, disabled: true });

        expect(widget.prop('tabIndex')).toBe(false);
      });

      it('should not add `tabIndex` attribute if the `focusStateEnabled` is false', () => {
        const widget = render({ focusStateEnabled: false, tabIndex: 10 });

        expect(widget.prop('tabIndex')).toBe(false);
      });
    });

    describe('elementAttr', () => {
      it('should pass custom css class name via `elementAttr`', () => {
        const widget = render({ elementAttr: { class: 'custom-class' } });

        expect(widget.hasClass('custom-class')).toBe(true);
      });

      it('should pass custom attributes', () => {
        const widget = render({ elementAttr: { 'data-custom': 'custom-attribute-value' } });

        expect(widget.prop('data-custom')).toBe('custom-attribute-value');
      });

      it('should not provide `class` property', () => {
        const widget = render({ elementAttr: { class: 'custom-class' } });

        expect(widget.hasClass('custom-class')).toBe(true);
        expect(widget.hasClass('dx-widget')).toBe(true);
        expect(widget.prop('class')).toBe(undefined);
      });
    });

    describe('activeStateEnabled', () => {
      it('should be disabled by default', () => {
        const widget = render();

        expect(widget.instance().props.activeStateEnabled).toBe(false);
        expect(widget.hasClass('dx-state-active')).toBe(false);
      });
    });

    describe('hoverStateEnabled', () => {
      it('should be disabled by default', () => {
        const widget = render();

        expect(widget.instance().props.hoverStateEnabled).toBe(false);
        expect(widget.hasClass('dx-state-hover')).toBe(false);
      });
    });

    describe('focusStateEnabled', () => {
      it('should be disabled by default', () => {
        const widget = render();

        expect(widget.instance().props.focusStateEnabled).toBe(false);
        expect(widget.hasClass('dx-state-focus')).toBe(false);
      });
    });

    describe('classes', () => {
      it('should add className', () => {
        const widget = render({ classes: 'custom-class' });

        expect(widget.is('.custom-class.dx-widget')).toBe(true);
      });
    });

    describe('restAttributes', () => {
      it('should add merge `className` property', () => {
        const widget = render({ className: 'custom-class' });

        expect(widget.is('.custom-class.dx-widget')).toBe(true);
      });

      it('should add merge `style` property', () => {
        const widget = render({ style: { fontSize: '20px', height: 10 } });

        expect(widget.prop('style')).toMatchObject({
          fontSize: '20px',
          height: 10,
          width: undefined,
        });
      });

      it('should add custom property', () => {
        const widget = render({ data: 'custom-data' });

        expect(widget.prop('data')).toBe('custom-data');
      });
    });

    describe('hint', () => {
      it('should not add `title` attribute by default', () => {
        const widget = render();

        expect(widget.prop('title')).toBe(undefined);
      });

      it('should add `title` attribute with the hint value', () => {
        const widget = render({ hint: 'hint-text' });

        expect(widget.prop('title')).toBe('hint-text');
      });
    });
  });

  describe('aria', () => {
    it('should pass custom `aria` attributes', () => {
      const widget = render({
        aria: {
          label: 'custom-aria-label',
          role: 'button',
          id: 'custom-id',
        },
      });

      expect(widget.props()).toMatchObject({
        'aria-label': 'custom-aria-label',
        role: 'button',
        id: 'custom-id',
      });
    });
  });

  describe('Children', () => {
    it('should render child component', () => {
      const widget = render({ children: <div className="custom-content" /> });
      const children = widget.children();

      expect(children).toHaveLength(1);
      expect(children.at(0).is('.custom-content')).toBe(true);
    });
  });

  describe('States', () => {
    describe('Active', () => {
      it('should change state by mouse events', () => {
        const onActive = jest.fn();
        const onInactive = jest.fn();
        const widget = render({ activeStateEnabled: true, onActive, onInactive });

        expect(widget.hasClass('dx-state-active')).toBe(false);
        expect(onActive).toHaveBeenCalledTimes(0);
        expect(onInactive).toHaveBeenCalledTimes(0);

        emit(EVENT.active);
        expect(onActive).toHaveBeenCalledTimes(1);
        expect(onInactive).toHaveBeenCalledTimes(0);
        expect(widget.hasClass('dx-state-active')).toBe(true);

        emit(EVENT.inactive);
        expect(onActive).toHaveBeenCalledTimes(1);
        expect(onInactive).toHaveBeenCalledTimes(1);
        expect(widget.hasClass('dx-state-active')).toBe(false);
      });

      it('should not change state if `activeStateEnabled` is false', () => {
        const widget = render({ activeStateEnabled: false });

        expect(widget.hasClass('dx-state-active')).toBe(false);

        emit(EVENT.active);
        expect(widget.hasClass('dx-state-active')).toBe(false);

        emit(EVENT.inactive);
        expect(widget.hasClass('dx-state-active')).toBe(false);
      });

      it('should not change state if disabled', () => {
        const widget = render({ activeStateEnabled: true, disabled: true });

        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-active')).toBe(false);

        emit(EVENT.active);
        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-active')).toBe(false);

        emit(EVENT.inactive);
        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-active')).toBe(false);
      });

      it('should detach `dxactive` and `dxinactive` events before rerendering', () => {
        const widget = mount(<Widget activeStateEnabled />);

        expect(getEventHandlers(EVENT.active).length).toBe(1);
        expect(getEventHandlers(EVENT.inactive).length).toBe(1);
        widget.unmount();
        expect(getEventHandlers(EVENT.active).length).toBe(0);
        expect(getEventHandlers(EVENT.inactive).length).toBe(0);
      });
    });

    describe('Focus', () => {
      it('should change state by mouse events', () => {
        const widget = render({ focusStateEnabled: true });

        expect(widget.hasClass('dx-state-focused')).toBe(false);

        emit(EVENT.focus);
        expect(widget.hasClass('dx-state-focused')).toBe(true);

        emit(EVENT.blur);
        expect(widget.hasClass('dx-state-focused')).toBe(false);
      });

      it('should not change state if disabled', () => {
        const widget = render({ focusStateEnabled: true, disabled: true });

        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-focused')).toBe(false);

        emit(EVENT.focus);
        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-focused')).toBe(false);

        emit(EVENT.blur);
        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-focused')).toBe(false);
      });

      it('should detach `focusin` and `focusout` events before rerendering', () => {
        const widget = mount(<Widget focusStateEnabled />);

        expect(getEventHandlers(EVENT.focus).length).toBe(1);
        expect(getEventHandlers(EVENT.blur).length).toBe(1);
        widget.unmount();
        expect(getEventHandlers(EVENT.focus).length).toBe(0);
        expect(getEventHandlers(EVENT.blur).length).toBe(0);
      });
    });

    describe('Hover', () => {
      it('should change state by mouse events', () => {
        const widget = render({ hoverStateEnabled: true });

        expect(widget.hasClass('dx-state-hover')).toBe(false);

        emit(EVENT.hoverStart);
        expect(widget.hasClass('dx-state-hover')).toBe(true);

        emit(EVENT.hoverEnd);
        expect(widget.hasClass('dx-state-hover')).toBe(false);
      });

      it('should not change state if disabled', () => {
        const widget = render({ hoverStateEnabled: true, disabled: true });

        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-hover')).toBe(false);

        emit(EVENT.hoverStart);
        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-hover')).toBe(false);

        emit(EVENT.hoverEnd);
        expect(widget.hasClass('dx-state-disabled')).toBe(true);
        expect(widget.hasClass('dx-state-hover')).toBe(false);
      });

      it('should detach `dxhoverend` and `dxhoverstart` events before rerendering', () => {
        const widget = mount(<Widget hoverStateEnabled />);

        expect(getEventHandlers(EVENT.hoverStart).length).toBe(1);
        expect(getEventHandlers(EVENT.hoverEnd).length).toBe(1);
        widget.unmount();
        expect(getEventHandlers(EVENT.hoverStart).length).toBe(0);
        expect(getEventHandlers(EVENT.hoverEnd).length).toBe(0);
      });

      it('should clear hover state if active', () => {
        const widget = render({ hoverStateEnabled: true, activeStateEnabled: true });

        expect(widget.hasClass('dx-state-hover')).toBe(false);
        expect(widget.hasClass('dx-state-active')).toBe(false);

        emit(EVENT.hoverStart);
        expect(widget.hasClass('dx-state-hover')).toBe(true);
        expect(widget.hasClass('dx-state-active')).toBe(false);

        emit(EVENT.active);
        expect(widget.hasClass('dx-state-hover')).toBe(false);
        expect(widget.hasClass('dx-state-active')).toBe(true);

        emit(EVENT.inactive);
        expect(widget.hasClass('dx-state-hover')).toBe(true);
        expect(widget.hasClass('dx-state-active')).toBe(false);
      });
    });
  });

  describe('Events', () => {
    describe('onClick', () => {
      it('should detach `dxclick` event before rerendering', () => {
        const widget = mount(<Widget onClick={() => undefined} />);

        expect(getEventHandlers(EVENT.dxClick).length).toBe(1);
        widget.unmount();
        expect(getEventHandlers(EVENT.dxClick).length).toBe(0);
      });

      it('should be called on `dxclick` event', () => {
        const onClick = jest.fn();

        render({ onClick });
        expect(onClick).toHaveBeenCalledTimes(0);
        emit(EVENT.dxClick);
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('onDimensionChanged', () => {
      it('should detach `dxresize` event before rerendering', () => {
        const widget = mount(<Widget onDimensionChanged={() => undefined} />);

        expect(getEventHandlers(EVENT.resize).length).toBe(1);
        widget.unmount();
        expect(getEventHandlers(EVENT.resize).length).toBe(0);
      });

      it('should be called on the `dxresize` event', () => {
        const onDimensionChanged = jest.fn();

        render({ onDimensionChanged });
        expect(onDimensionChanged).toHaveBeenCalledTimes(0);

        emit(EVENT.resize);
        expect(onDimensionChanged).toHaveBeenCalledTimes(1);
      });
    });

    describe('onVisibilityChanged', () => {
      it('should add special css class when `onVisibilityChange` handler is defined', () => {
        const widget = render({ onVisibilityChange: () => undefined });

        expect(widget.exists('.dx-visibility-change-handler')).toBe(true);
      });

      it('should detach `dxshown` and `dxhiding` events before rerendering', () => {
        const widget = mount(<Widget onVisibilityChange={() => undefined} />);

        expect(getEventHandlers(EVENT.shown).length).toBe(1);
        expect(getEventHandlers(EVENT.hiding).length).toBe(1);
        widget.unmount();
        expect(getEventHandlers(EVENT.shown).length).toBe(0);
        expect(getEventHandlers(EVENT.hiding).length).toBe(0);
      });

      it('should be called on `dxhiding` and `dxshown` events', () => {
        const onVisibilityChange = jest.fn();

        render({ onVisibilityChange });
        expect(onVisibilityChange).toHaveBeenCalledTimes(0);

        emit(EVENT.hiding);
        expect(onVisibilityChange).toHaveBeenCalledTimes(1);
        expect(onVisibilityChange).toHaveBeenLastCalledWith(false);

        emit(EVENT.shown);
        expect(onVisibilityChange).toHaveBeenCalledTimes(2);
        expect(onVisibilityChange).toHaveBeenLastCalledWith(true);
      });
    });
  });

  describe('API', () => {
    describe('Focus', () => {
      it('should change state when called', () => {
        const widgetAPIRef = createRef<WidgetRef>();
        const widget = render({ ref: widgetAPIRef, focusStateEnabled: true });

        expect(widget.hasClass('dx-state-focused')).toBe(false);

        widgetAPIRef.current.focus();
        expect(widget.hasClass('dx-state-focused')).toBe(true);
      });
    });
  });

  it('should have dx-widget class', () => {
    const tree = render();

    expect(tree.is('.dx-widget')).toBe(true);
  });
});
