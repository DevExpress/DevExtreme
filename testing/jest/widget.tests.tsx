import Widget from '../../js/renovation/widget.p.js';
import { h } from 'preact';
import { clear as clearEventHandlers, emit, fakeClickEvent, EVENT } from './utils/events-mock';
import { shallow, mount } from 'enzyme';

describe('Widget', () => {
    const render = (props = {}) => shallow(<Widget {...props} />);
    const mountRender = (props = {}) => mount(<Widget {...props} />);

    beforeEach(clearEventHandlers);

    describe('Props', () => {
        describe('accessKey', () => {
            it('should render "accesskey" attribute', () => {
                const widget = render({ accessKey: 'y', focusStateEnabled: true });

                expect(widget.props().accessKey).toBe('y');
            });

            it('should not render if disabled', () => {
                const widget = render({ accessKey: 'y', focusStateEnabled: true, disabled: true });

                expect(widget.props().accessKey).toBe(void 0);
            });

            it('should not render if focusStateEnabled is false', () => {
                const widget = render({ accessKey: 'y', focusStateEnabled: false });

                expect(widget.props().accessKey).toBe(void 0);
            });

            it('should take a focus if the accessKey is pressed', () => {
                const widget = render({ accessKey: 'y', focusStateEnabled: true });

                emit(EVENT.dxClick, fakeClickEvent);
                expect(widget.hasClass('dx-state-focused')).toBe(true);
            });

            it('should not fire click event if the accessKey is pressed', () => {
                const e = { ...fakeClickEvent, stopImmediatePropagation: jest.fn() };

                render({ accessKey: 'y', focusStateEnabled: true });
                emit(EVENT.dxClick, e);
                expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(1);
            });
        });

        describe('rtlEnabled', () => {
            it('should not add rtl marker class by default', () => {
                const widget = render();

                expect(widget.hasClass('dx-rtl')).toBe(false);
            });

            it('should add rtl marker class if "rtlEnabled" is true', () => {
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
                const widget = render({ width: null, height: void 0 });

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

            it('should add custom tabIndex attribute', () => {
                const widget = render({ focusStateEnabled: true, tabIndex: 10 });

                expect(widget.prop('tabIndex')).toBe(10);
            });

            it('should not add tabIndex attribute if the "disabled" is true', () => {
                const widget = render({ focusStateEnabled: true, tabIndex: 10, disabled: true });

                expect(widget.prop('tabIndex')).toBe(false);
            });

            it('should not add tabIndex attribute if the "focusStateEnabled" is false', () => {
                const widget = render({ focusStateEnabled: false, tabIndex: 10 });

                expect(widget.prop('tabIndex')).toBe(false);
            });
        });

        describe('elementAttr', () => {
            it('should pass custom css class name via elementAttr', () => {
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
                expect(widget.prop('class')).toBe(void 0);
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

        describe('hint', () => {
            it('should not add "title" attribute by default', () => {
                const widget = render();

                expect(widget.prop('title')).toBe(void 0);
            });

            it('should add "title" attribute with the hint value', () => {
                const widget = render({ hint: 'hint-text' });

                expect(widget.prop('title')).toBe('hint-text');
            });
        });
    });

    describe('aria', () => {
        it('should pass custom "aria" attributes', () => {
            const widget = render({ aria: {
                label: 'custom-aria-label',
                role: 'button',
                id: 'custom-id',
            } });

            expect(widget.props()).toMatchObject({
                'aria-label': 'custom-aria-label',
                role: 'button',
                id: 'custom-id',
            });
        });
    });

    describe('Children', () => {
        it('should render child component', () => {
            const widget = render({ children: <div className={'custom-content'} /> });
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

            it('should not change state if activeStateEnabled is false', () => {
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
        });

        describe('Focus', () => {
            // it('should change state by mouse events', () => {
            //     const widget = render();

            //     expect(widget.hasClass('dx-state-focus')).toBe(false);

            //     emit(EVENT.focus);
            //     expect(widget.hasClass('dx-state-focus')).toBe(true);

            //     emit(EVENT.blur);
            //     expect(widget.hasClass('dx-state-focus')).toBe(false);
            // });

            // it('should not change state if disabled', () => {
            //     const widget = render({ disabled: true });

            //     expect(widget.hasClass('dx-state-disabled')).toBe(true);
            //     expect(widget.hasClass('dx-state-focus')).toBe(false);

            //     emit(EVENT.focus);
            //     expect(widget.hasClass('dx-state-disabled')).toBe(true);
            //     expect(widget.hasClass('dx-state-focus')).toBe(false);

            //     emit(EVENT.blur);
            //     expect(widget.hasClass('dx-state-disabled')).toBe(true);
            //     expect(widget.hasClass('dx-state-focus')).toBe(false);
            // });
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
        describe('visibilityChanged', () => {
            const getClientRects = jest.spyOn(Element.prototype, 'getClientRects');
            getClientRects.mockImplementation(() => ({ length: 1 }));

            let hidingFired = 0;
            let shownFired = 0;

            const _visibilityChanged = (visible) => {
                visible ? shownFired += 1 : hidingFired += 1;
            };

            beforeEach(() => {
                hidingFired = 0;
                shownFired = 0;
            });

            it('is called on dxhiding and dxshown events and special css class is attached', () => {
                const widget = render({ _visibilityChanged });

                expect(widget.find('.dx-visibility-change-handler').exists()).toBe(true);

                emit(EVENT.hiding);
                widget.setProps({});
                expect(hidingFired).toBe(1);
                expect(shownFired).toBe(0);

                emit(EVENT.shown);
                widget.setProps({});
                expect(hidingFired).toBe(1);
                expect(shownFired).toBe(1);
            });

            it('works optimally if component is visible on initializing', () => {
                let widget = null;
                widget = render({ _visibilityChanged });

                expect(hidingFired).toBe(0);
                expect(shownFired).toBe(0);

                emit(EVENT.shown);
                widget.setProps({});
                widget.update();
                expect(shownFired).toBe(0);

                emit(EVENT.hiding);
                widget.setProps({});
                widget.update();
                expect(hidingFired).toBe(1);

                emit(EVENT.hiding);
                widget.setProps({});
                widget.update();
                expect(hidingFired).toBe(1);
            });

            it('works optimally if component is hidden on initializing', () => {
                const widget = mountRender({ _visibilityChanged, _isHidden: true });

                expect(hidingFired).toBe(0);
                expect(shownFired).toBe(0);

                emit(EVENT.hiding);
                widget.setProps({});
                expect(shownFired).toBe(0);

                emit(EVENT.shown);
                widget.setProps({});
                expect(shownFired).toBe(1);

                emit(EVENT.shown);
                widget.setProps({});
                expect(shownFired).toBe(1);
            });

            it('should not calls with hidden parent', () => {
                getClientRects.mockImplementation(() => ({ length: 0 }));
                const widget = mountRender({ _visibilityChanged });

                expect(hidingFired).toBe(0);
                expect(shownFired).toBe(0);

                emit(EVENT.shown);
                widget.setProps({});
                expect(shownFired).toBe(0);

                getClientRects.mockImplementation(() => ({ length: 1 }));
                emit(EVENT.shown);
                widget.setProps({});
                expect(shownFired).toBe(1);
            });
        });
    });

    it('should have dx-widget class', () => {
        const tree = render();

        expect(tree.is('.dx-widget')).toBe(true);
    });
});
