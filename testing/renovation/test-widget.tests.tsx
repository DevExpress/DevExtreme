import Widget, { viewModelFunction, viewFunction } from '../../js/ui/test-widget';
import React from 'react';
import { mount } from 'enzyme';

const model = new Widget();
const render = (props = {}) => {
    props = Object.assign({}, model, props);

    return mount(viewFunction(viewModelFunction(props as Widget)));
};

describe('Widget', () => {
    describe('accessKey', () => {
        it('should render "accesskey" attribute', () => {
            const tree = render({ accessKey: 'y', focusStateEnabled: true });

            expect(tree.find('.dx-widget').props().accessKey).toBe('y');
        });

        it('should not render if disabled', () => {
            let tree = render({ accessKey: 'y', focusStateEnabled: true, disabled: false });

            expect(tree.find('.dx-widget').props().accessKey).toBe('y');

            tree = render({ accessKey: 'y', focusStateEnabled: true, disabled: true });

            expect(tree.find('.dx-widget').props().accessKey).toBe(void 0);
        });

        it('should not render if focusStateEnabled is false', () => {
            let tree = render({ accessKey: 'y', focusStateEnabled: false });

            expect(tree.find('.dx-widget').props().accessKey).toBe(void 0);

            tree = render({ accessKey: 'y', focusStateEnabled: true });

            expect(tree.find('.dx-widget').props().accessKey).toBe('y');
        });
    });

    describe('RTL', () => {
        it('should be rendered rtl marker class', () => {
            let tree = render();

            expect(tree.find('.dx-widget.dx-rtl').exists()).not.toBeTruthy();

            tree = render({ rtlEnabled: true });

            expect(tree.find('.dx-widget.dx-rtl').exists()).toBeTruthy();
        });
    });

    describe('aria', () => {
        it('should pass custom "aria" attributes', () => {
            const tree = render({ aria: {
                label: 'custom-aria-label',
                role: 'button',
                id: 'custom-id'
            }});

            expect(tree.find('.dx-widget').props()).toMatchObject({
                'aria-label': 'custom-aria-label',
                role: 'button',
                id: 'custom-id'
            });
        });
    });

    describe('Children', () => {
        it('should render child component', () => {
            const tree = render({ children: <div className="custom-content" /> });
            const children = tree.find('.dx-widget').children();

            expect(children).toHaveLength(1);
            expect(children.at(0).is('.custom-content')).toBeTruthy();
        });
    });

    describe('width/height', () => {
        it('should be init with custom dimensions', () => {
            const tree = render({ width: 50, height: 70 });
            const root = tree.find('.dx-widget');

            expect(root.props().style).toEqual({ width: 50, height: 70 });
        });
    });

    describe('disabled', () => {
        it('should add css marker class', () => {
            const tree = render({ disabled: true });

            expect(tree.find('.dx-widget').hasClass('dx-state-disabled')).toBeTruthy();
        });

        it('should add aria attribute', () => {
            const tree = render({ disabled: true });

            expect(tree.find('.dx-widget').prop('aria-disabled')).toBe('true');
        });
    });

    describe('Visibility', () => {
        it('should add css marker class', () => {
            const tree = render({ visible: false });

            expect(tree.find('.dx-widget').hasClass('dx-state-invisible')).toBeTruthy();
        });

        it('should add aria attribute', () => {
            const tree = render({ visible: false });

            expect(tree.find('.dx-widget').prop('aria-hidden')).toBe('true');
        });

        it('should add hidden attribute', () => {
            const tree = render({ visible: false });

            expect(tree.find('.dx-widget').prop('hidden')).toBe(true);
        });
    });

    describe('States', () => {
        describe('Active', () => {
            it('should add `dx-state-active` css class', () => {
                const tree = render({ _active: true });

                expect(tree.find('.dx-widget').hasClass('dx-state-active')).toBeTruthy();
            });
        });

        describe('Focus', () => {
            it('should add `dx-state-focused` css class', () => {
                const tree = render({ _focused: true, focusStateEnabled: true });

                expect(tree.find('.dx-widget').hasClass('dx-state-focused')).toBeTruthy();
            });

            it('should not add marker class if the "focusStateEnabled" is false', () => {
                const tree = render({ _focused: true, focusStateEnabled: false });

                expect(tree.find('.dx-widget').hasClass('dx-state-focused')).toBeFalsy();
            });

            it('should not add marker class if the "disabled" is true', () => {
                const tree = render({ _focused: true, focusStateEnabled: true, disabled: true });

                expect(tree.find('.dx-widget').hasClass('dx-state-focused')).toBeFalsy();
            });
        });

        describe('Hover', () => {
            it('should add `dx-state-hover` css class', () => {
                const tree = render({ _hovered: true, hoverStateEnabled: true });

                expect(tree.find('.dx-widget').hasClass('dx-state-hover')).toBeTruthy();
            });

            it('should not add `dx-state-hover` css class if the "hoverStateEnabled" is false', () => {
                const tree = render({ _hovered: true, hoverStateEnabled: false });

                expect(tree.find('.dx-widget').hasClass('dx-state-hover')).toBeFalsy();
            });

            it('should not add `dx-state-hover` css class in the `active` state', () => {
                const tree = render({ _hovered: true, hoverStateEnabled: true, _active: true });

                expect(tree.find('.dx-widget').hasClass('dx-state-hover')).toBeFalsy();
            });

            it('should not have `dx-state-hover` css class in the `disabled` state', () => {
                const tree = render({ _hovered: true, hoverStateEnabled: true, disabled: true });

                expect(tree.find('.dx-widget').hasClass('dx-state-hover')).toBeFalsy();
            });
        });
    });

    describe('tabIndex', () => {
        it('should add tabIndex attribute by default', () => {
            const tree = render({ focusStateEnabled: true });

            expect(tree.find('.dx-widget').prop('tabIndex')).toBe(0);
        });

        it('should add custom tabIndex attribute', () => {
            const tree = render({ focusStateEnabled: true, tabIndex: 10 });

            expect(tree.find('.dx-widget').prop('tabIndex')).toBe(10);
        });

        it('should not add tabIndex attribute if the "disabled" is true', () => {
            const tree = render({ focusStateEnabled: true, tabIndex: 10, disabled: true });

            expect(tree.find('.dx-widget').prop('tabIndex')).toBeFalsy();
        });

        it('should not add tabIndex attribute if the "focusStateEnabled" is false', () => {
            const tree = render({ focusStateEnabled: false, tabIndex: 10 });

            expect(tree.find('.dx-widget').prop('tabIndex')).toBeFalsy();
        });
    });

    describe('elementAttr', () => {
        it('should pass custom css class name via elementAttr', () => {
            const tree = render({ elementAttr: { class: 'custom-class' }});

            expect(tree.find('.dx-widget').hasClass('custom-class')).toBeTruthy();
        });

        it('should pass custom attributes', () => {
            const tree = render({ elementAttr: { 'data-custom': 'custom-attribute-value' }});

            expect(tree.find('.dx-widget').prop('data-custom')).toBe('custom-attribute-value');
        });
    });

    describe('Hint', () => {
        it('should add "title" attribute with the hint value', () => {
            const tree = render({ hint: 'hint-text' });

            expect(tree.find('.dx-widget').prop('title')).toBe('hint-text');
        });
    });
});
