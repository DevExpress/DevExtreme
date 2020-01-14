import Widget, { viewModelFunction, viewFunction } from '../../js/ui/test-widget';
import React from 'react';
import { mount, shallow } from 'enzyme';

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
    it('should have `dx-state-disabled` css class', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, disabled: true })));

        expect(tree.find('.dx-widget.dx-state-disabled').exists())
            .toBeTruthy();
    });
    it('should have `dx-state-invisible` css class and `hidden` property', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, visible: false })));

        const widget = tree.find('.dx-widget.dx-state-invisible');
        expect(widget.exists())
            .toBeTruthy();
        expect(widget.props().hidden)
            .toBeTruthy();
    });
    it('should have `dx-state-active` css class', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, _active: true })));

        expect(tree.find('.dx-widget.dx-state-active').exists())
            .toBeTruthy();
    });
    it('should have `dx-state-hover` css class', () => {
        const model = new Widget();
        const tree = mount(viewFunction(viewModelFunction({ ...model, _hovered: true })));

        expect(tree.find('.dx-widget.dx-state-hover').exists())
            .toBeTruthy();
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
});
