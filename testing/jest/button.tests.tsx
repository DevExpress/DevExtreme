
import devices from '../../js/core/devices';
import themes from '../../js/ui/themes';
import { h, createRef } from 'preact';
import { clear as clearEventHandlers, defaultEvent, emit, emitKeyboard, eventHandlers, fakeClickEvent, EVENT, KEY } from './utils/events-mock';
import { mount } from 'enzyme';
import Button, { defaultOptions, ButtonRef } from '../../js/renovation/button.p.js';
import Icon from '../../js/renovation/icon.p.js';
import Widget from '../../js/renovation/widget.p.js';

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
            describe('Wave position and size', () => {
                it('should calc correct position and size for the back button', () => {
                    const button = render({ useInkRipple: true, type: 'back' });
                    const content = button.find('.dx-button-content').getDOMNode();
                    const { onActive } = button.find(Widget).props();

                    content.style.width = '10px';
                    content.style.height = '10px';
                    onActive(fakeClickEvent);

                    const wave = content.querySelectorAll('.dx-inkripple-wave')[0];

                    expect(wave.style).toMatchObject({ left: '-2px', top: '-2px', width: '14px', height: '14px' });
                });

                it('should calc correct position and size for the icon only button', () => {
                    const button = render({ useInkRipple: true, text: '', icon: 'icon' });
                    const content = button.find('.dx-button-content').getDOMNode();
                    const { onActive } = button.find(Widget).props();

                    content.style.width = '10px';
                    content.style.height = '10px';
                    onActive(fakeClickEvent);

                    const wave = content.querySelectorAll('.dx-inkripple-wave')[0];

                    expect(wave.style).toMatchObject({ left: '-2px', top: '-2px', width: '14px', height: '14px' });
                });

                it('should calc correct position and size for the regular button', () => {
                    const button = render({ useInkRipple: true });
                    const content = button.find('.dx-button-content').getDOMNode();
                    const { onActive } = button.find(Widget).props();

                    content.style.width = '10px';
                    content.style.height = '10px';
                    onActive(fakeClickEvent);

                    const wave = content.querySelectorAll('.dx-inkripple-wave')[0];

                    expect(wave.style).toMatchObject({ left: '-14px', top: '-14px', width: '28px', height: '28px' });
                });
            });

            it('should be `false` by default', () => {
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
            it('should be `false` by default', () => {
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
                const onSubmit = ({ event }) => event.stopPropagation();
                const button = render({ useSubmitBehavior: true, onSubmit });
                const submitInput = button.find('input.dx-button-submit-input');
                const e = { ...defaultEvent, stopPropagation: jest.fn() };

                expect(e.stopPropagation).toHaveBeenCalledTimes(0);
                emit(EVENT.click, e, submitInput.getDOMNode());
                expect(e.stopPropagation).toHaveBeenCalledTimes(1);
            });
        });

        describe('stylingMode', () => {
            it('should use `contained` as a default value', () => {
                const button = render();

                expect(button.hasClass('dx-button-mode-contained')).toBe(true);
                expect(button.hasClass('dx-button-mode-text')).toBe(false);
                expect(button.hasClass('dx-button-mode-outlined')).toBe(false);
            });

            it('should add `dx-button-mode-text` class if the stylingMode is `text`', () => {
                const button = render({ stylingMode: 'text' });

                expect(button.hasClass('dx-button-mode-text')).toBe(true);
                expect(button.hasClass('dx-button-mode-contained')).toBe(false);
                expect(button.hasClass('dx-button-mode-outlined')).toBe(false);
            });

            it('should add `dx-button-mode-contained` class if the stylingMode is `contained`', () => {
                const button = render({ stylingMode: 'contained' });

                expect(button.hasClass('dx-button-mode-contained')).toBe(true);
                expect(button.hasClass('dx-button-mode-text')).toBe(false);
                expect(button.hasClass('dx-button-mode-outlined')).toBe(false);
            });

            it('should add `dx-button-mode-outlined` class if the stylingMode is `outlined`', () => {
                const button = render({ stylingMode: 'outlined' });

                expect(button.hasClass('dx-button-mode-outlined')).toBe(true);
                expect(button.hasClass('dx-button-mode-text')).toBe(false);
                expect(button.hasClass('dx-button-mode-contained')).toBe(false);
            });
        });

        describe('text', () => {
            it('should render `text`', () => {
                const button = render({ text: 'My button' });

                expect(button.find('.dx-button-text').text()).toBe('My button');
            });

            it('should not render `text` by default', () => {
                const button = render();

                expect(button.hasClass('dx-button')).toBe(true);
                expect(button.hasClass('dx-button-has-text')).toBe(false);
                expect(button.exists('.dx-button-text')).toBe(false);
            });
        });

        describe('type', () => {
            it('should use `normal` as a default value', () => {
                const button = render();

                expect(button.hasClass('dx-button-normal')).toBe(true);
            });

            it('should add `dx-button-*` if the type is defined', () => {
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

        describe('template', () => {
            const template = ({ text }) => <div className={'custom-content'}>{`${text}123`}</div>;

            it('should render template', () => {
                const button = render({
                    render: template,
                    text: 'My button',
                });
                const customRender = button.find(template);

                expect(customRender.exists()).toBe(true);
                expect(customRender.exists('.custom-content')).toBe(true);

                expect(customRender.props().text).toBe('My button');
                expect(customRender.text()).toBe('My button123');
            });

            it('should rerender template in runtime', () => {
                const button = mount(<Button text="My button" />);

                expect(button.exists(template)).toBe(false);

                button.setProps({ render: template });
                expect(button.exists(template)).toBe(true);

                button.setProps({ render: undefined });
                expect(button.exists(template)).toBe(false);
            });

            it('should change properties in runtime', () => {
                const button = mount(<Button text="My button" render={template} />);
                let buttonContent = button.find(template);

                expect(buttonContent.props().text).toBe('My button');
                expect(buttonContent.text()).toBe('My button123');

                button.setProps({ text: 'New value' });
                buttonContent = button.find(template);

                expect(buttonContent.props().text).toBe('New value');
                expect(buttonContent.text()).toBe('New value123');
            });

            it('should get original icon prop', () => {
                const button = render({
                    render: ({ icon }) => <div>{icon}</div>,
                    icon: 'testicon',
                    text: 'My button',
                });
                const buttonContentChildren = button.find('.dx-button-content').children();

                expect(buttonContentChildren.props().icon).toBe('testicon');
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

        describe('onKeyDown', () => {
            it('should call custom handler on key press', () => {
                const onClick = jest.fn();
                const onKeyDown = jest.fn();

                render({ onClick, onKeyDown });

                expect(onClick).toHaveBeenCalledTimes(0);
                expect(onKeyDown).toHaveBeenCalledTimes(0);

                emitKeyboard(KEY.space);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onKeyDown).toHaveBeenCalledTimes(1);

                emitKeyboard(KEY.a);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(onKeyDown).toHaveBeenCalledTimes(2);
            });

            it('should call custom handler on press specific key', () => {
                const onClick = jest.fn();
                const customHandler = jest.fn();

                render({
                    onClick,
                    onKeyDown: (event, { keyName, which }) => {
                        if(keyName === 'a' || which === 'a') {
                            customHandler();
                        }
                    }
                });

                expect(onClick).toHaveBeenCalledTimes(0);
                expect(customHandler).toHaveBeenCalledTimes(0);

                emitKeyboard(KEY.space);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(customHandler).toHaveBeenCalledTimes(0);

                emitKeyboard(KEY.a);
                expect(onClick).toHaveBeenCalledTimes(1);
                expect(customHandler).toHaveBeenCalledTimes(1);
            });

            it('should not call onClick on press Enter and Space if prevented', () => {
                const onClick = jest.fn();
                const customHandler = jest.fn();

                render({
                    onClick,
                    onKeyDown: (event, { keyName, which }) => {
                        if(keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
                            customHandler();
                            event.cancel = true;
                            return event;
                        }
                    }
                });

                expect(onClick).toHaveBeenCalledTimes(0);
                expect(customHandler).toHaveBeenCalledTimes(0);

                emitKeyboard(KEY.space);
                expect(onClick).toHaveBeenCalledTimes(0);
                expect(customHandler).toHaveBeenCalledTimes(1);

                emitKeyboard(KEY.enter);
                expect(onClick).toHaveBeenCalledTimes(0);
                expect(customHandler).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('Events', () => {
        describe('onSubmit', () => {
            it('should be called on submit input `click` event', () => {
                const onSubmit = jest.fn();
                const button = render({ useSubmitBehavior: true, onSubmit });
                const submitInput = button.find('input.dx-button-submit-input');

                expect(onSubmit).toHaveBeenCalledTimes(0);
                emit(EVENT.click, defaultEvent, submitInput.getDOMNode());
                expect(onSubmit).toHaveBeenCalledTimes(1);
            });

            it('should detach `click` event before rerendering', () => {
                const button = mount(<Button useSubmitBehavior={true} />);

                expect(eventHandlers[EVENT.click].length).toBe(1);
                button.setProps({ useSubmitBehavior: false });
                expect(eventHandlers[EVENT.click].length).toBe(0);
            });
        });

        describe('onClick', () => {
            it('should be called on `click` event', () => {
                const onClick = jest.fn();
                const button = render({ onClick });

                expect(onClick).toHaveBeenCalledTimes(0);
                emit(EVENT.dxClick, defaultEvent, button.getDOMNode());
                expect(onClick).toHaveBeenCalledTimes(1);
            });

            it('should be called with passed event', () => {
                const onClick = jest.fn();
                const button = render({ onClick });

                emit(EVENT.dxClick, defaultEvent, button.getDOMNode());
                expect(onClick).toHaveBeenCalledWith({ event: defaultEvent });
            });

            it('should be called by Enter', () => {
                const onClick = jest.fn();

                render({ onClick });
                expect(onClick).toHaveBeenCalledTimes(0);
                emitKeyboard(KEY.enter);
                expect(onClick).toHaveBeenCalledTimes(1);
                emitKeyboard(KEY.a, KEY.enter);
                expect(onClick).toHaveBeenCalledTimes(2);
            });

            it('should be called by Space', () => {
                const onClick = jest.fn();

                render({ onClick });
                expect(onClick).toHaveBeenCalledTimes(0);
                emitKeyboard(KEY.space);
                expect(onClick).toHaveBeenCalledTimes(1);
                emitKeyboard(KEY.a, KEY.space);
                expect(onClick).toHaveBeenCalledTimes(2);
            });

            it('should be called by key press with passed event', () => {
                const onClick = jest.fn();

                render({ onClick });
                emitKeyboard(KEY.enter);
                expect(onClick).toHaveBeenCalledWith({ event: defaultEvent });
            });

            it('should respond to Enter or Space keys only', () => {
                const onClick = jest.fn();

                render({ onClick });
                emitKeyboard(KEY.a);
                expect(onClick).toHaveBeenCalledTimes(0);
            });
        });

        describe('onContentReady', () => {
            it('should be called after rendering', () => {
                const onContentReady = jest.fn(({ element }) =>
                    expect(element.classList.contains('dx-button')).toBe(true));

                render({ onContentReady });
                expect(onContentReady).toHaveBeenCalledTimes(1);
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

    describe('Default option rules', () => {
        const getDefaultProps = () => {
            defaultOptions({
                device: () => false,
                options: {},
            });
            return (Button as any).defaultProps;
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

    describe('API', () => {
        describe('Focus', () => {
            it('should call Widget.focus API', () => {
                const apiRef = createRef<ButtonRef>()
                const button = render({ ref: apiRef, focusStateEnabled: true });
                const { ref: widgetRef } = button.find(Widget).props();
                const widgetFocusApi = jest.fn();
                widgetRef.current.focus = widgetFocusApi;

                apiRef.current.focus();

                expect(widgetFocusApi).toHaveBeenCalledTimes(1);
            });
        });
    });

    it('should have dx-button class', () => {
        const tree = render();

        expect(tree.is('.dx-button')).toBe(true);
    });
});
