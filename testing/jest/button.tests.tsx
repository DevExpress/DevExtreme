import Button, { viewModelFunction, viewFunction } from '../../js/renovation/button';

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

        model.contentRender = ({text}) => (<div className="custom-content">{`${text}123`}</div>);

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

    describe('icon', () => {
        it('should render icon before text if iconPosition is left', () => {
            const model = new Button();
            model.text = 'My Button';
            model.icon = 'test';

            const tree = shallow(viewFunction(viewModelFunction(model)));

            const content = tree.find('.dx-button-content');

            expect(content.children().at(0).is('.dx-icon.dx-icon-test'))
                .toBeTruthy();
            expect(content.children().at(1).is('.dx-button-text'))
                .toBeTruthy();
        });

        it('should render icon after text if iconPosition is right', () => {
            const model = new Button();
            model.text = 'My Button';
            model.icon = 'test';
            model.iconPosition = 'right';

            const tree = shallow(viewFunction(viewModelFunction(model)));

            const content = tree.find('.dx-button-content');

            expect(tree.hasClass('dx-button-icon-right'))
                .toBeTruthy();
            expect(content.children().at(0).is('.dx-button-text'))
                .toBeTruthy();
            expect(content.children().at(1).is('.dx-icon.dx-icon-test.dx-icon-right'))
                .toBeTruthy();
        });
    });

});
