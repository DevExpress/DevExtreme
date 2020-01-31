import Button from '../../js/renovation/button.p.js';
import { createElement } from 'preact';
import { emit, EVENT } from './utils/events-mock';
import { mount } from 'enzyme';

describe('Button', () => {
    const render = (props = {}) => mount(createElement(Button, props)).childAt(0);

    describe('Props', () => {
        describe('onClick', () => {
            it('should be called by mouse click', () => {
                const clickHandler = jest.fn();

                render({ onClick: clickHandler });
                expect(clickHandler).toHaveBeenCalledTimes(0);
                emit(EVENT.click);
                expect(clickHandler).toHaveBeenCalledTimes(1);
            });

            // it('should be called by Enter', () => {
            //     const clickHandler = jest.fn();

            //     render({ onClick: clickHandler });
            //     expect(clickHandler).toHaveBeenCalledTimes(0);
            //     emit(EVENT.click);
            //     expect(clickHandler).toHaveBeenCalledTimes(1);
            // });

            // it('should be called by Space', () => {
            //     const clickHandler = jest.fn();

            //     render({ onClick: clickHandler });
            //     expect(clickHandler).toHaveBeenCalledTimes(0);
            //     emit(EVENT.click);
            //     expect(clickHandler).toHaveBeenCalledTimes(1);
            // });
        });

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

        describe('activeStateEnabled', () => {
            it('should be enabled by default', () => {
                const widget = render();

                expect(widget.prop('activeStateEnabled')).toBeTruthy();
                expect(widget.hasClass('dx-state-active')).toBeFalsy();
            });
        });

        describe('contentRender', () => {
            it('should render template', () => {
                const button = render({
                    text: 'My button',
                    contentRender: ({ text }) => createElement('div', { className: 'custom-content', children: `${text}123`})
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
