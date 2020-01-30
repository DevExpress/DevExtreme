import React from 'react';
import { shallow } from 'enzyme';
import Button, { viewModelFunction, viewFunction } from '../../js/renovation/button';

describe('Button', () => {
    const render = (props = {}) => shallow(
        viewFunction(viewModelFunction({ ...new Button(), ...props } as Button)),
    );

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
                    contentRender: ({ text }) => (<div className="custom-content">{`${text}123`}</div>),
                });
                const buttonContentChildren = button.find('.dx-button-content').children();

                expect(buttonContentChildren.props().text).toBe('My button');
                expect(buttonContentChildren.render().text()).toBe('My button123');
            });
        });

        describe('hoverStateEnabled', () => {
            it('should have default value', () => {
                const button = render();

                expect(button.prop('hoverStateEnabled')).toBe(true);
            });

            it('should provide custom value', () => {
                const button = render({ hoverStateEnabled: false });

                expect(button.prop('hoverStateEnabled')).toBe(false);
            });
        });
    });

    it('should have dx-button class', () => {
        const tree = render();

        expect(tree.is('.dx-button')).toBeTruthy();
    });
});
