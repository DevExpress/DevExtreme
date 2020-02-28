import Button, { defaultOptions } from '../../js/renovation/button.p.js';
import Widget from '../../js/renovation/widget.p.js';
import Icon from '../../js/renovation/icon.p.js';
import { h } from 'preact';
import { clear as clearEventHandlers, defaultEvent, emit, emitKeyboard, EVENT, KEY } from './utils/events-mock';
import { mount } from 'enzyme';
import devices from '../../js/core/devices';
import themes from '../../js/ui/themes';

jest.mock('../../js/core/devices', () => {
    const actualDevices = require.requireActual('../../js/core/devices');
    return {
        ...actualDevices,
        ...actualDevices.__proto__,
        isSimulator: jest.fn(() => false),
        real: jest.fn(() => ({ deviceType: 'desktop' })),
    };
});

jest.mock('../../js/ui/themes', () => ({
    ...require.requireActual('../../js/ui/themes'),
    current: jest.fn(() => 'generic'),
}));

describe('Button', () => {
    const render = (props = {}) => mount(<Button {...props} />).childAt(0);

    beforeEach(() => {
        (devices.real as any).mockImplementation(() => ({ deviceType: 'desktop' }));
        (devices as any).isSimulator.mockImplementation(() => false);
        (themes.current as any).mockImplementation(() => 'generic');
    });

    afterEach(() => {
        jest.resetAllMocks();
        clearEventHandlers();
    });

    describe('Props', () => {
        describe('useInkRipple', () => {
            it('should be "false" by default', () => {
                const button = render();
                const content = button.find('.dx-button-content').getDOMNode();
                const { onActive } = button.find(Widget).props();

                onActive(defaultEvent);
                expect(content.querySelectorAll('.dx-inkripple')).toHaveLength(0);
            });

            it('should render on active event and clear on inactive event', () => {
                const button = render({ useInkRipple: true });
                const content = button.find('.dx-button-content').getDOMNode();
                const { onActive, onInactive } = button.find(Widget).props();

                expect(content.querySelectorAll('.dx-inkripple-wave')).toHaveLength(0);
                expect(content.querySelectorAll('.dx-inkripple-hiding')).toHaveLength(0);
                onActive(defaultEvent);
                expect(content.querySelectorAll('.dx-inkripple-wave')).toHaveLength(1);
                expect(content.querySelectorAll('.dx-inkripple-hiding')).toHaveLength(0);
                onInactive(defaultEvent);
                expect(content.querySelectorAll('.dx-inkripple-hiding')).toHaveLength(1);
            });
        });

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

            it('should submit form by space press', () => {
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

            it('should be called with passed event', () => {
                const clickHandler = jest.fn();
                const button = render({ onClick: clickHandler });

                emit(EVENT.dxClick, defaultEvent, button.getDOMNode());
                expect(clickHandler).toHaveBeenCalledWith({ event: defaultEvent });
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
            const contentRender = ({ model: { text } }) => <div className={'custom-content'}>{`${text}123`}</div>;

            it('should render contentRender', () => {
                const button = render({
                    contentRender,
                    text: 'My button',
                });
                const customRender = button.find(contentRender);

                expect(customRender.exists()).toBe(true);
                expect(customRender.exists('.custom-content')).toBe(true);

                expect(customRender.props().model.text).toBe('My button');
                expect(customRender.text()).toBe('My button123');
            });

            it('should rerender contentRender in runtime', () => {
                const button = mount(<Button text="My button" />);

                expect(button.exists(contentRender)).toBe(false);

                button.setProps({ contentRender });
                expect(button.exists(contentRender)).toBe(true);

                button.setProps({ contentRender: undefined });
                expect(button.exists(contentRender)).toBe(false);
            });

            it('should change properties in runtime', () => {
                const button = mount(<Button text="My button" contentRender={contentRender} />);
                let buttonContent = button.find(contentRender);

                expect(buttonContent.props().model.text).toBe('My button');
                expect(buttonContent.text()).toBe('My button123');

                button.setProps({ text: 'New value' });
                buttonContent = button.find(contentRender);

                expect(buttonContent.props().model.text).toBe('New value');
                expect(buttonContent.text()).toBe('New value123');
            });

            it('should get original icon prop', () => {
                const button = render({
                    contentRender: ({ icon }) => <div>{icon}</div>,
                    icon: 'testicon',
                    text: 'My button',
                });
                const buttonContentChildren = button.find('.dx-button-content').children();

                expect(buttonContentChildren.props().model.icon).toBe('testicon');
            });
        });

        describe('icon', () => {
            it('should not render icon by default', () => {
                const button = render();

                expect(button.is('.dx-button-has-icon')).toBe(false);
                expect(button.exists(Icon)).toBe(false);
            });

            it('should render icon', () => {
                const button = render({ icon: 'test' });

                expect(button.is('.dx-button-has-icon')).toBe(true);
                const { source } = button.find(Icon).props();
                expect(source).toEqual('test');
            });
        });

        describe('iconPosition', () => {
            it('should render icon before text if iconPosition is left (by default)', () => {
                const button = render({
                    icon: 'test',
                    text: 'myButton',
                });

                const elements = button.find('.dx-button-content').children();

                expect(elements.at(0).is(Icon)).toBe(true);
                expect(elements.at(1).is('.dx-button-text')).toBe(true);
                expect(elements.at(0).props().position).toEqual('left');
            });

            it('should render icon after text if iconPosition is right', () => {
                const button = render({
                    icon: 'test',
                    iconPosition: 'right',
                    text: 'myButton',
                });

                const elements = button.find('.dx-button-content').children();

                expect(button.hasClass('dx-button-icon-right')).toBe(true);
                expect(elements.at(0).is('.dx-button-text')).toBe(true);
                expect(elements.at(1).is(Icon)).toBe(true);
                expect(elements.at(1).props().position).toEqual('right');
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

        describe('visible', () => {
            it('should pass the default value into Widget component', () => {
                const tree = render();

                expect(tree.find(Widget).prop('visible')).toBe(true);
            });

            it('should pass the custom value into Widget component', () => {
                const tree = render({ visible: false });

                expect(tree.find(Widget).prop('visible')).toBe(false);
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

    describe('ARIA accessibility', () => {
        it('should use `text` value as aria-label', () => {
            const tree = render({ text: 'button-text' });

            expect(tree.find(Widget).prop('aria')).toStrictEqual({ label: 'button-text' });
        });

        it('should use `icon` name as aria-label', () => {
            const tree = render({ text: '', icon: 'find' });

            expect(tree.find(Widget).prop('aria')).toStrictEqual({ label: 'find' });
        });

        it('should use `icon` file name as aria-label if local icon is used', () => {
            const tree = render({ text: '', icon: '/path/file.png' });

            expect(tree.find(Widget).prop('aria')).toStrictEqual({ label: 'file' });
        });

        it('should not define aria-label if properties are not defined', () => {
            const tree = render({ text: '', icon: '' });

            expect(tree.find(Widget).prop('aria')).toStrictEqual({});
        });

        it('should not parse icon if icon-type is base64 for aria-label', () => {
            const tree = render({ text: '', icon: 'data:image/png;base64,' });

            expect(tree.find(Widget).prop('aria')).toStrictEqual({ label: 'Base64' });
        });
    });

    it('should have dx-button class', () => {
        const tree = render();

        expect(tree.is('.dx-button')).toBe(true);
    });

    describe('DefaultOptionRules', () => {
        const getDefaultProps = () => {
            defaultOptions({
                device: () => false,
                options: {},
            });
            return Button.defaultProps;
        };

        describe('focusStateEnabled', () => {
            it('should be false if device is not desktop', () => {
                (devices.real as any).mockImplementation(() => ({ deviceType: 'android' }));
                expect(getDefaultProps().focusStateEnabled).toBe(false);
            });

            it('should be true on desktop and not simulator', () => {
                expect(getDefaultProps().focusStateEnabled).toBe(true);
            });

            it('should be false on simulator', () => {
                (devices as any).isSimulator.mockImplementation(() => true);

                expect(getDefaultProps().focusStateEnabled).toBe(false);
            });
        });

        describe('useInkRiple', () => {
            it('should be true if material theme', () => {
                (themes.current as any).mockImplementation(() => 'material');
                expect(getDefaultProps().useInkRipple).toBe(true);
            });

            it('should be false if theme is not material', () => {
                (themes.current as any).mockImplementation(() => 'generic');
                expect(getDefaultProps().useInkRipple).toBe(false);
            });
        });
    });
});
