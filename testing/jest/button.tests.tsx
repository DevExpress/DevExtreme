import Button from '../../js/renovation/button.p.js';
import Widget from '../../js/renovation/widget.p.js';
import { createElement } from 'preact';
import { emit, emitKeyboard, EVENT, KEY } from './utils/events-mock';
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

            it('should be called by Enter', () => {
                const clickHandler = jest.fn();

                render({ onClick: clickHandler });
                expect(clickHandler).toHaveBeenCalledTimes(0);
                emitKeyboard(KEY.enter);
                expect(clickHandler).toHaveBeenCalledTimes(1);
            });

            it('should be called by Space', () => {
                const clickHandler = jest.fn();

                render({ onClick: clickHandler });
                expect(clickHandler).toHaveBeenCalledTimes(0);
                emitKeyboard(KEY.space);
                expect(clickHandler).toHaveBeenCalledTimes(1);
            });
        });

        describe('stylingMode', () => {
            it('should use "contained" as a default value', () => {
                const button = render();

                expect(button.hasClass('dx-button-mode-contained')).toBe(true);
                expect(button.hasClass('dx-button-mode-text')).toBe(false);
                expect(button.hasClass('dx-button-mode-outlined')).toBe(false);
            });

            it('should add "dx-button-mode-text" class if the stylingMode is "text"', () => {
                const button = render({ stylingMode: 'text' });

                expect(button.hasClass('dx-button-mode-text')).toBe(true);
                expect(button.hasClass('dx-button-mode-contained')).toBe(false);
                expect(button.hasClass('dx-button-mode-outlined')).toBe(false);
            });

            it('should add "dx-button-mode-contained" class if the stylingMode is "contained"', () => {
                const button = render({ stylingMode: 'contained' });

                expect(button.hasClass('dx-button-mode-contained')).toBe(true);
                expect(button.hasClass('dx-button-mode-text')).toBe(false);
                expect(button.hasClass('dx-button-mode-outlined')).toBe(false);
            });

            it('should add "dx-button-mode-outlined" class if the stylingMode is "outlined"', () => {
                const button = render({ stylingMode: 'outlined' });

                expect(button.hasClass('dx-button-mode-outlined')).toBe(true);
                expect(button.hasClass('dx-button-mode-text')).toBe(false);
                expect(button.hasClass('dx-button-mode-contained')).toBe(false);
            });
        });

        describe('text', () => {
            it('should render "text"', () => {
                const button = render({ text: 'My button' });

                expect(button.find('.dx-button-text').text()).toBe('My button');
            });

            it('should not render "text" by default', () => {
                const button = render();

                expect(button.hasClass('dx-button')).toBe(true);
                expect(button.hasClass('dx-button-has-text')).toBe(false);
                expect(button.find('.dx-button-text').exists()).toBe(false);
            });
        });

        describe('type', () => {
            it('should use "normal" as a default value', () => {
                const button = render();

                expect(button.hasClass('dx-button-normal')).toBe(true);
            });

            it('should add "dx-button-*" if the type is defined', () => {
                const button = render({ type: 'custom' });

                expect(button.hasClass('dx-button-custom')).toBe(true);
                expect(button.hasClass('dx-button-normal')).toBe(false);
            });
        });

        describe('activeStateEnabled', () => {
            it('should be enabled by default', () => {
                const button = render();

                expect(button.prop('activeStateEnabled')).toBe(true);
                expect(button.hasClass('dx-state-active')).toBe(false);
            });
        });

        describe('contentRender', () => {
            it('should render template', () => {
                const button = render({
                    text: 'My button',
                    contentRender: ({ text }) => createElement('div', { className: 'custom-content', children: `${text}123` }),
                });
                const buttonContentChildren = button.find('.dx-button-content').children();

                expect(buttonContentChildren.props().text).toBe('My button');
                expect(buttonContentChildren.render().text()).toBe('My button123');
            });
        });

        describe('hoverStateEnabled', () => {
            it('should pass a default value into Widget component', () => {
                const tree = render();

                expect(tree.find(Widget).prop('hoverStateEnabled')).toBe(true);
            });

            it('should pass a custom value into Widget component', () => {
                const tree = render({ hoverStateEnabled: false });

                expect(tree.find(Widget).prop('hoverStateEnabled')).toBe(false);
            });
        });
    });

    it('should have dx-button class', () => {
        const tree = render();

        expect(tree.is('.dx-button')).toBe(true);
    });
});
