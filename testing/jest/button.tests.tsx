import Button from '../../js/renovation/button.p.js';
import Widget from '../../js/renovation/widget.p.js';
import { h } from 'preact';
import { clear as clearEventHandlers, defaultEvent, emit, emitKeyboard, EVENT, KEY } from './utils/events-mock';
import { mount } from 'enzyme';

describe('Button', () => {
    const render = (props = {}) => mount(<Button {...props} />).childAt(0);

    beforeEach(clearEventHandlers);

    describe('Props', () => {
        describe('useSubmitBehavior', () => {
            it('should be "false" by default', () => {
                const button = render();

                expect(button.exists('.dx-button-submit-input')).toBe(false);
            });

            it('should render submit input', () => {
                const button = render({ useSubmitBehavior: true });
                const submitInput = button.find('input.dx-button-submit-input');

                expect(submitInput.props()).toMatchObject({
                    tabIndex: -1,
                    type: 'submit',
                });
            });

            it('should submit form by button click', () => {
                const button = render({ useSubmitBehavior: true });
                const submitInput = button.find('input.dx-button-submit-input');
                const submitInputClick = jest.fn();

                submitInput.getDOMNode().click = submitInputClick;
                expect(submitInputClick).toHaveBeenCalledTimes(0);
                emit(EVENT.dxClick, defaultEvent, button.getDOMNode());
                expect(submitInputClick).toHaveBeenCalledTimes(1);
            });

            it('should submit form by submit input click', () => {
                const onSubmit = jest.fn();
                const button = render({ useSubmitBehavior: true, onSubmit });
                const submitInput = button.find('input.dx-button-submit-input');

                expect(onSubmit).toHaveBeenCalledTimes(0);
                emit(EVENT.click, defaultEvent, submitInput.getDOMNode());
                expect(onSubmit).toHaveBeenCalledTimes(1);
            });

            it('should submit form by enter press', () => {
                const button = render({ useSubmitBehavior: true });
                const submitInput = button.find('input.dx-button-submit-input');
                const submitInputClick = jest.fn();

                submitInput.getDOMNode().click = submitInputClick;
                expect(submitInputClick).toHaveBeenCalledTimes(0);
                emitKeyboard(KEY.enter);
                expect(submitInputClick).toHaveBeenCalledTimes(1);
            });

            it('should submit form by sapce press', () => {
                const button = render({ useSubmitBehavior: true });
                const submitInput = button.find('input.dx-button-submit-input');
                const submitInputClick = jest.fn();

                submitInput.getDOMNode().click = submitInputClick;
                expect(submitInputClick).toHaveBeenCalledTimes(0);
                emitKeyboard(KEY.space);
                expect(submitInputClick).toHaveBeenCalledTimes(1);
            });

            it('should stop event propagation', () => {
                const button = render({ useSubmitBehavior: true });
                const submitInput = button.find('input.dx-button-submit-input');
                const e = { ...defaultEvent, stopPropagation: jest.fn() };

                expect(e.stopPropagation).toHaveBeenCalledTimes(0);
                emit(EVENT.click, e, submitInput.getDOMNode());
                expect(e.stopPropagation).toHaveBeenCalledTimes(1);
            });
        });

        describe('onClick', () => {
            it('should be called by mouse click', () => {
                const clickHandler = jest.fn();
                const button = render({ onClick: clickHandler });

                expect(clickHandler).toHaveBeenCalledTimes(0);
                emit(EVENT.dxClick, defaultEvent, button.getDOMNode());
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
                expect(button.exists('.dx-button-text')).toBe(false);
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
                    contentRender: ({ text }) => <div className={'custom-content'}>{text + 123}</div>,
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

        describe('tabIndex', () => {
            it('should pass a default value into Widget component', () => {
                const tree = render();

                expect(tree.find(Widget).prop('tabIndex')).toBe(0);
            });

            it('should pass a custom value into Widget component', () => {
                const tree = render({ tabIndex: 10 });

                expect(tree.find(Widget).prop('tabIndex')).toBe(10);
            });
        });
    });

    it('should have dx-button class', () => {
        const tree = render();

        expect(tree.is('.dx-button')).toBe(true);
    });
});
