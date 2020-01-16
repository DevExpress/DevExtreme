import Widget, { viewModelFunction, viewFunction } from '../../js/ui/test-widget';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { toComparable } from '../../js/core/utils/data';

describe('Widget', () => {
    it('should be rendered', () => {
        const model = new Widget();
        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.find('.dx-widget').exists())
            .toBeTruthy();
        expect(tree.find('.dx-rtl').exists())
            .not.toBeTruthy();
    });
    it('should render children', () => {
        const model = new Widget();
        model.default = <div className="custom-content" />;

        const tree = mount(viewFunction(viewModelFunction(model)));

        expect(tree.find('.dx-widget').children().length > 0)
            .toBeTruthy();
        expect(tree.find('.custom-content').exists())
            .toBeTruthy();
    });
    it('should be init with custom dimensions', () => {
        const model = new Widget();
        model.width = 50;
        model.height = 75;

        const widget = mount(viewFunction(viewModelFunction(model)))
            .find('.dx-widget');

        expect(widget.props().style.width)
            .toBe(50);
        expect(widget.props().style.height)
            .toBe(75);
    });
    it('should have `disabled` state', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, disabled: true })));

        const widget = tree.find('.dx-widget.dx-state-disabled');
        expect(widget.exists())
            .toBeTruthy();
        expect(widget.props()['aria-disabled'])
            .toBe('true');
    });
    it('should have `hidden` state', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, visible: false })));

        const widget = tree.find('.dx-widget.dx-state-invisible');
        expect(widget.exists())
            .toBeTruthy();
        expect(widget.props().hidden)
            .toBeTruthy();
        expect(widget.props()['aria-hidden'])
            .toBe('true');
    });
    it('should have `dx-state-active` css class', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, _active: true })));

        expect(tree.find('.dx-widget.dx-state-active').exists())
            .toBeTruthy();
    });
    it('should have `dx-state-hover` css class', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, _hovered: true, hoverStateEnabled: true })));

        expect(tree.find('.dx-widget.dx-state-hover').exists())
            .toBeTruthy();
    });
    it('should not have `dx-state-hover` css class with `active` state', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, _hovered: true, hoverStateEnabled: true, _active: true })));

        expect(tree.find('.dx-widget.dx-state-hover').exists())
            .toBeFalsy();
    });
    it('should not have `dx-state-hover` css class with `disabled` state', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, _hovered: true, hoverStateEnabled: true, disabled: true })));

        expect(tree.find('.dx-widget.dx-state-hover').exists())
            .toBeFalsy();
    });
    it('should have `dx-rtl` css class', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, rtlEnabled: true })));

        expect(tree.find('.dx-widget.dx-rtl').exists())
            .toBeTruthy();
    });
    it('should pass custom css class name via elementAttributes', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, elementAttr: { class: 'custom-class' }} )));

        expect(tree.find('.dx-widget.custom-class').exists())
            .toBeTruthy();
    });
    it('should pass attributes', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, elementAttr: { class: 'custom-class' }} )));

        expect(tree.find('.dx-widget.custom-class').exists())
            .toBeTruthy();
    });
    it('should pass `hint` property as a title', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, hint: 'custom-hint' })));

        expect(tree.find('.dx-widget').props().title)
            .toBe('custom-hint');
    });
    it('should have `focus` state', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, focusStateEnabled: true, _focused: true })));

        expect(tree.find('.dx-widget.dx-state-focused').exists())
            .toBeTruthy();
    });
    it('should provide `tabIndex`', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, focusStateEnabled: true })));

        expect(tree.find('.dx-widget.dx-state-focused').exists())
            .toBeFalsy();
        expect(tree.find('.dx-widget').props().tabIndex)
            .toBe(0);
    });
    it('should provide custom `tabIndex`', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, focusStateEnabled: true, tabIndex: 10 })));

        expect(tree.find('.dx-widget.dx-state-focused').exists())
            .toBeFalsy();
        expect(tree.find('.dx-widget').props().tabIndex)
            .toBe(10);
    });
    it('should not have `focus` state with `disabled` property', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, focusStateEnabled: true, _focused: true, disabled: true })));

        const widget = tree.find('.dx-widget');
        expect(widget.exists())
            .toBeTruthy();
        expect(widget.is('.dx-widget.dx-state-focused'))
            .toBeFalsy();
        expect(widget.props().tabIndex)
            .toBe(undefined);
    });
    it('should pass `accessKey` property', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, accessKey: 'x' })));

        expect(tree.find('.dx-widget').props().accessKey)
            .toBe('x');
    });
});
