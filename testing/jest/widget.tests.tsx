import Widget from '../../js/renovation/widget.p.js';
import { createElement } from 'preact';
import { emit, fakeClickEvent, EVENT } from './utils/events-mock';
import { shallow } from 'enzyme';

describe('Widget', () => {
    const render = (props = {}) => shallow(createElement(Widget, props));

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

                emit(EVENT.click, fakeClickEvent);
                expect(widget.hasClass('dx-state-focused')).toBe(true);
            });

            it('should not fire click event if the accessKey is pressed', () => {
                const clickHandler = jest.fn();
                const stopImmediatePropagation = jest.fn();
                const fakeClickEventClone = Object.assign({}, fakeClickEvent);

                fakeClickEventClone.stopImmediatePropagation = stopImmediatePropagation;

                render({ accessKey: 'y', focusStateEnabled: true, onClick: clickHandler });
                emit(EVENT.click, fakeClickEvent);
                expect(stopImmediatePropagation).toHaveBeenCalledTimes(0);
                expect(clickHandler).toHaveBeenCalledTimes(1);
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
                expect(widget.prop('class')).toBe(false);
            });
        });

        describe('activeStateEnabled', () => {
            it('should be disabled by default', () => {
                const widget = render();

                expect(widget.prop('activeStateEnabled')).toBe(false);
                expect(widget.hasClass('dx-state-active')).toBe(false);
            });
        });

        describe('hoverStateEnabled', () => {
            it('should be disabled by default', () => {
                const widget = render();

                expect(widget.prop('hoverStateEnabled')).toBe(false);
                expect(widget.hasClass('dx-state-hover')).toBe(false);
            });
        });

        describe('focusStateEnabled', () => {
            it('should be disabled by default', () => {
                const widget = render();

                expect(widget.prop('focusStateEnabled')).toBe(false);
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
            const widget = render({ children: createElement('div', { className: 'custom-content' }) });
            const children = widget.children();

            expect(children).toHaveLength(1);
            expect(children.at(0).is('.custom-content')).toBe(true);
        });
    });

    describe('States', () => {
        describe('Active', () => {
            it('should change state by mouse events', () => {
                const widget = render({ activeStateEnabled: true });

                expect(widget.hasClass('dx-state-active')).toBe(false);

                emit(EVENT.active);
                expect(widget.hasClass('dx-state-active')).toBe(true);

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

    it('should have dx-widget class', () => {
        const tree = render();

        expect(tree.is('.dx-widget')).toBe(true);
    });
});
