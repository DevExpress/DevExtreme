import Widget, { viewModelFunction, viewFunction } from '../../js/renovation/widget';
import React from 'react';
import { shallow } from 'enzyme';

describe('Widget', () => {
    const render = (props = {}) => shallow(
        viewFunction(viewModelFunction({ ...new Widget(), ...props } as Widget)),
    );

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
        });

        describe('rtlEnabled', () => {
            it('should not add rtl marker class by default', () => {
                const widget = render();

                expect(widget.hasClass('dx-rtl')).toBeFalsy();
            });

            it('should add rtl marker class if "rtlEnabled" is true', () => {
                const widget = render({ rtlEnabled: true });

                expect(widget.hasClass('dx-rtl')).toBeTruthy();
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

                expect(widget.hasClass('dx-state-disabled')).toBeTruthy();
            });

            it('should add aria attribute', () => {
                const widget = render({ disabled: true });

                expect(widget.prop('aria-disabled')).toBe('true');
            });
        });

        describe('visible', () => {
            it('should add css marker class', () => {
                const widget = render({ visible: false });

                expect(widget.hasClass('dx-state-invisible')).toBeTruthy();
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

                expect(widget.prop('tabIndex')).toBeFalsy();
            });

            it('should not add tabIndex attribute if the "focusStateEnabled" is false', () => {
                const widget = render({ focusStateEnabled: false, tabIndex: 10 });

                expect(widget.prop('tabIndex')).toBeFalsy();
            });
        });

        describe('elementAttr', () => {
            it('should pass custom css class name via elementAttr', () => {
                const widget = render({ elementAttr: { class: 'custom-class' }});

                expect(widget.hasClass('custom-class')).toBeTruthy();
            });

            it('should pass custom attributes', () => {
                const widget = render({ elementAttr: { 'data-custom': 'custom-attribute-value' }});

                expect(widget.prop('data-custom')).toBe('custom-attribute-value');
            });

            it('should not provide `class` property', () => {
                const tree = render({ elementAttr: { class: 'custom-class' } });

                const widget = tree.find('.dx-widget');
                expect(widget.prop('className').indexOf('custom-class') > -1).toBeTruthy();
                expect(widget.prop('className').indexOf('dx-widget') > -1).toBeTruthy();
                expect(widget.prop('class')).toBeFalsy();
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
            }});

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
            expect(children.at(0).is('.custom-content')).toBeTruthy();
        });
    });

    describe('States', () => {
        describe('Active', () => {
            it('should add `dx-state-active` css class', () => {
                const widget = render({ _active: true });

                expect(widget.hasClass('dx-state-active')).toBeTruthy();
            });
        });

        describe('Focus', () => {
            it('should add `dx-state-focused` css class', () => {
                const widget = render({ _focused: true, focusStateEnabled: true });

                expect(widget.hasClass('dx-state-focused')).toBeTruthy();
            });

            it('should not add marker class if the "focusStateEnabled" is false', () => {
                const widget = render({ _focused: true, focusStateEnabled: false });

                expect(widget.hasClass('dx-state-focused')).toBeFalsy();
            });

            it('should not add marker class if the "disabled" is true', () => {
                const widget = render({ _focused: true, focusStateEnabled: true, disabled: true });

                expect(widget.hasClass('dx-state-focused')).toBeFalsy();
            });
        });

        describe('Hover', () => {
            it('should add `dx-state-hover` css class', () => {
                const widget = render({ _hovered: true, hoverStateEnabled: true });

                expect(widget.hasClass('dx-state-hover')).toBeTruthy();
            });

            it('should not add `dx-state-hover` css class if the "hoverStateEnabled" is false', () => {
                const widget = render({ _hovered: true, hoverStateEnabled: false });

                expect(widget.hasClass('dx-state-hover')).toBeFalsy();
            });

            it('should not add `dx-state-hover` css class in the `active` state', () => {
                const widget = render({ _hovered: true, hoverStateEnabled: true, _active: true });

                expect(widget.hasClass('dx-state-hover')).toBeFalsy();
            });

            it('should not have `dx-state-hover` css class in the `disabled` state', () => {
                const widget = render({ _hovered: true, hoverStateEnabled: true, disabled: true });

                expect(widget.hasClass('dx-state-hover')).toBeFalsy();
            });
        });
    });

    it('should have dx-widget class', () => {
        const tree = render();

        expect(tree.find('.dx-widget').exists()).toBeTruthy();
    });
});
