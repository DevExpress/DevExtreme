import React from 'react';
import Button, { viewModelFunction, viewFunction } from '../../js/renovation/button';
import { shallow } from 'enzyme';

const render = (props = {}) => {
    props = Object.assign({}, new Button(), props);

    return shallow(viewFunction(viewModelFunction(props as Button)));
};

describe('Button', () => {
    describe('Props', () => {
        describe('stylingMode', () => {
            it('should use "contained" as a default value', () => {
                const button = render();

                expect(button.hasClass('dx-button-mode-contained')).toBeTruthy();
                expect(button.hasClass('dx-button-mode-text')).toBeFalsy();
                expect(button.hasClass('dx-button-mode-outlined')).toBeFalsy();
            });

            it('should add "dx-button-mode-text" class if the stylingMode is "text"', () => {
                const button = render({ stylingMode: 'text' });

                expect(button.hasClass('dx-button-mode-text')).toBeTruthy();
                expect(button.hasClass('dx-button-mode-contained')).toBeFalsy();
                expect(button.hasClass('dx-button-mode-outlined')).toBeFalsy();
            });

            it('should add "dx-button-mode-contained" class if the stylingMode is "contained"', () => {
                const button = render({ stylingMode: 'contained' });

                expect(button.hasClass('dx-button-mode-contained')).toBeTruthy();
                expect(button.hasClass('dx-button-mode-text')).toBeFalsy();
                expect(button.hasClass('dx-button-mode-outlined')).toBeFalsy();
            });

            it('should add "dx-button-mode-outlined" class if the stylingMode is "outlined"', () => {
                const button = render({ stylingMode: 'outlined' });

                expect(button.hasClass('dx-button-mode-outlined')).toBeTruthy();
                expect(button.hasClass('dx-button-mode-text')).toBeFalsy();
                expect(button.hasClass('dx-button-mode-contained')).toBeFalsy();
            });
        });

        describe('text', () => {
            it('should render text', () => {
                const button = render({ text: 'My button' });

                expect(button.find('.dx-button-text').text()).toBe('My button');
            });
        });

        describe('type', () => {
            it('should use "normal" as a default value', () => {
                const button = render();

                expect(button.hasClass('dx-button-normal')).toBeTruthy();
            });

            it('should add "dx-button-*" if the type is defined', () => {
                const button = render({ type: 'custom' });

                expect(button.hasClass('dx-button-custom')).toBeTruthy();
                expect(button.hasClass('dx-button-normal')).toBeFalsy();
            });
        });

        describe('contentRender', () => {
            it('should render template', () => {
                const button = render({
                    text: 'My button',
                    contentRender: ({ text }) => (<div className="custom-content">{ text+'123' }</div>)
                });
                const buttonContentChildren = button.find('.dx-button-content').children();

                expect(buttonContentChildren.props().text).toBe('My button');
                expect(buttonContentChildren.render().text()).toBe('My button123');
            });
        });

        describe('iconPosition', () => {
            it('should render icon before text if iconPosition is left', () => {
                const button = render({
                    text: 'myButton',
                    icon: 'test',
                });

                const content = button.find('.dx-button-content');

                expect(content.children().at(0).is('.dx-icon.dx-icon-test'))
                    .toBeTruthy();
                expect(content.children().at(1).is('.dx-button-text'))
                    .toBeTruthy();
            });

            it('should render icon after text if iconPosition is right', () => {
                const button = render({
                    text: 'myButton',
                    icon: 'test',
                    iconPosition: 'right',
                });

                const content = button.find('.dx-button-content');

                expect(button.hasClass('dx-button-icon-right'))
                    .toBeTruthy();
                expect(content.children().at(0).is('.dx-button-text'))
                    .toBeTruthy();
                expect(content.children().at(1).is('.dx-icon.dx-icon-test.dx-icon-right'))
                    .toBeTruthy();
            });
        });
    });

    it('should have dx-button class', () => {
        const tree = render();

        expect(tree.is('.dx-button')).toBeTruthy();
    });
});
