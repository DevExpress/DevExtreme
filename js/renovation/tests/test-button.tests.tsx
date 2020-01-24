import Button, { viewModelFunction, viewFunction } from '../src/test-button';

import React from 'react';
import { shallow } from 'enzyme';

describe('Button', () => {
    it('should render text', () => {
        const model = new Button();
        model.text = 'My button';

        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.find('.dx-button-text').text()).toBe('My button');
    });

    it('should render template', () => {
        const model = new Button();
        model.text = 'My button';

        model.contentRender = ({text}) => (<div className="custom-content">{text + "123"}</div>);

        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.find('.dx-button-content').children().props().text).toBe('My button');
        expect(tree.find('.dx-button-content').children().render().text()).toBe('My button123');
    });

    it('should have dx-button class', () => {
        const model = new Button();

        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.is('.dx-button')).toBeTruthy();
    });

    it('should be of success type', () => {
        const model = new Button();
        model.type = 'success';

        const tree = shallow(viewFunction(viewModelFunction(model)));

        expect(tree.is('.dx-button.dx-button-success')).toBeTruthy();
    });

});
