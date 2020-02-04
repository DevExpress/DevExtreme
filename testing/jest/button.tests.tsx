import Button from '../../js/renovation/button.p.js';
import Widget from '../../js/renovation/widget.p.js';
import { createElement } from 'preact';
import { emit, emitKeyboard, EVENT, KEY } from './utils/events-mock';
import { mount, shallow } from 'enzyme';

describe('Button', () => {
  const render = (props = {}) => mount(createElement(Button, props)).childAt(0);
  const shallowRender = (props = {}) => shallow(createElement(Button, props));

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
            it('should render text', () => {
                const button = render({ text: 'My button' });

                expect(button.find('.dx-button-text').text()).toBe('My button');
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

        describe('icon', () => {
            it('should render icon', () => {
                const button = render({ icon: 'test' });

                expect(button.is('.dx-button-has-icon')).toBe(true);
                expect(button.exists('.dx-icon.dx-icon-test')).toBe(true);
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

        describe('focusStateEnabled', () => {
            it('should pass a default value into Widget component', () => {
                const button = render();

                expect(button.find(Widget).prop('focusStateEnabled')).toBe(true);
            });

            it('should pass a custom value into Widget component', () => {
                const button = render({ focusStateEnabled: false });

                expect(button.find(Widget).prop('focusStateEnabled')).toBe(false);
            });

            it('should change state by "focusIn" and "focusOut"', () => {
                const button =  shallowRender().dive();

                expect(button.hasClass('dx-state-focused')).toBe(false);

                emit(EVENT.focus);
                expect(button.hasClass('dx-state-focused')).toBe(true);

                emit(EVENT.blur);
                expect(button.hasClass('dx-state-focused')).toBe(false);
            });

            it('should not change state if disabled', () => {
                const button = shallowRender({ disabled: true }).dive();

                expect(button.hasClass('dx-state-disabled')).toBe(true);
                expect(button.hasClass('dx-state-focused')).toBe(false);

                expect(button.hasClass('dx-state-disabled')).toBe(true);
                expect(button.hasClass('dx-state-focus')).toBe(false);

                emit(EVENT.focus);
                expect(button.hasClass('dx-state-disabled')).toBe(true);
                expect(button.hasClass('dx-state-focus')).toBe(false);

                emit(EVENT.blur);
                expect(button.hasClass('dx-state-disabled')).toBe(true);
                expect(button.hasClass('dx-state-focus')).toBe(false);
            });
        });
    });

    it('should have dx-button class', () => {
        const tree = render();

        expect(tree.is('.dx-button')).toBe(true);
    });
});
