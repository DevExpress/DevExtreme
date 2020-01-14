import Widget, { viewModelFunction, viewFunction } from '../../js/ui/test-widget';
import React from 'react';
import { mount, shallow } from 'enzyme';

describe('Widget', () => {
    it('should be rendered', () => {
        const model = new Widget();
        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.find('.dx-widget').exists())
            .toBeTruthy();
    });

    // it('should render children', () => {
    //     const model = new Widget();
    //     model.default = () => <div className="custom-content" />;

    //     const tree = mount(viewFunction(viewModelFunction(model)));

    //     expect(tree.find('.dx-widget').children().length > 0)
    //         .toBeTruthy();
    //     expect(tree.find('.custom-content').exists())
    //         .toBeTruthy();
    // });
});
