import { h } from 'preact';
import { mount, shallow } from 'enzyme';
import devices from '../../core/devices';
import { convertRulesToOptions } from '../../core/options/utils';
import themes from '../../ui/themes';
import {
  clear as clearEventHandlers,
  defaultEvent,
  emit,
  getEventHandlers,
  EVENT,
} from './utils/events_mock';
import {
  Button, ButtonProps, defaultOptionRules, viewFunction,
} from '../button';
import { Widget } from '../widget';
import { Icon } from '../icon';
import { InkRipple } from '../ink-ripple';

type Mock = jest.Mock;

jest.mock('../../core/devices', () => {
  const actualDevices = require.requireActual('../../core/devices').default;
  const isSimulator = actualDevices.isSimulator.bind(actualDevices);
  const real = actualDevices.real.bind(actualDevices);

  actualDevices.isSimulator = jest.fn(isSimulator);
  actualDevices.real = jest.fn(real);

  return actualDevices;
});

jest.mock('../../ui/themes', () => ({
  ...require.requireActual('../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('Button', () => {
  describe('Render', () => {
    it('should render InkRipple if useInkRipple is true', () => {
      const button = shallow(viewFunction({
        props: { useInkRipple: true },
        inkRippleConfig: { isConfig: true },
      } as any) as any);
      expect(button.find(InkRipple).props()).toMatchObject({
        config: { isConfig: true },
      });
    });

    it('should render submit input if useSubmitBehavior is true', () => {
      const button = shallow(viewFunction({ props: { useSubmitBehavior: true } } as any) as any);
      const submitInput = button.find('input.dx-button-submit-input');
      expect(submitInput.props()).toMatchObject({
        type: 'submit',
        tabIndex: -1,
      });
    });

    it('should render text', () => {
      const button = shallow(viewFunction({ props: { text: 'button-text' } } as any) as any);
      const buttonText = button.find('.dx-button-content .dx-button-text');
      expect(buttonText.text()).toBe('button-text');
    });

    it('should not render text if template is defined', () => {
      const button = shallow(viewFunction({
        props: {
          text: 'button-text',
          template: () => <div />,
        },
      } as any) as any);
      const buttonText = button.find('.dx-button-content .dx-button-text');
      expect(buttonText.exists()).toBe(false);
    });

    it('should not render icon component if iconSource is not defined', () => {
      const button = shallow(viewFunction({
        props: {
          text: 'button-text',
          iconPosition: 'left',
        },
      } as any) as any);
      expect(button.find(Icon).exists()).toBe(false);
    });

    it('should not render icon component if template is defined', () => {
      const button = shallow(viewFunction({
        props: {
          text: 'button-text',
          template: () => <div />,
        },
        iconSource: 'icon-source',
      } as any) as any);
      expect(button.find(Icon).exists()).toBe(false);
    });

    it.skip('should render icon component on the left side', () => {
      const button = shallow(viewFunction({
        props: {
          text: 'button-text',
          iconPosition: 'left',
        },
        iconSource: 'icon-source',
      } as any) as any);
      const buttonContent = button.find('.dx-button-content');
      expect(buttonContent.childAt(0).is(Icon)).toBe(true);
      expect(buttonContent.find(Icon).props()).toEqual({
        source: 'icon-surce',
        position: 'left',
      });
    });

    it.skip('should render icon component on the right side', () => {
      const button = shallow(viewFunction({
        props: {
          text: 'button-text',
          iconPosition: 'right',
        },
        iconSource: 'icon-source',
      } as any) as any);
      const buttonContent = button.find('.dx-button-content');
      expect(buttonContent.childAt(1).is(Icon)).toBe(true);
      expect(buttonContent.childAt(0).text()).toBe('button-text');
      expect(buttonContent.find(Icon).props()).toEqual({
        source: 'icon-surce',
        position: 'right',
      });
    });

    it('should render template', () => {
      const template = ({ data: { text } }) => <div className="custom-content">{`${text}_text`}</div>;
      const button = mount(viewFunction({
        props: { template, text: 'button', icon: 'icon' },
      } as any) as any);

      const buttonContent = button.find('.dx-button-content');
      const templateContent = buttonContent.find(template);
      const customContent = templateContent.find('.custom-content');
      expect(templateContent.props().data.text).toBe('button');
      expect(templateContent.props().data.icon).toBe('icon');
      expect(customContent.text()).toBe('button_text');
    });

    it('should pass all necessary properties to the Widget', () => {
      const renderOptions = {
        aria: 'area',
        onActive: () => null,
        onInactive: () => null,
      };
      const renderProps = {
        accessKey: 'A',
        activeStateEnabled: true,
        disabled: true,
        focusStateEnabled: true,
        height: 100,
        hint: 'hint',
        hoverStateEnabled: true,
        onContentReady: () => null,
        rtlEnabled: true,
        tabIndex: -2,
        visible: true,
        width: 200,
      };
      const cssClasses = 'cssClasses';
      const restAttributes = { attr1: 'value1', attr2: 'value2' };
      const onWidgetKeyDown = () => null;
      const onWidgetClick = () => null;
      const button = mount(viewFunction({
        ...renderOptions,
        props: renderProps,
        restAttributes,
        cssClasses,
        onWidgetKeyDown,
        onWidgetClick,
      } as any) as any);
      expect(button.find(Widget).props()).toMatchObject({
        ...renderOptions,
        ...renderProps,
        ...restAttributes,
        classes: cssClasses,
        onKeyDown: onWidgetKeyDown,
        onClick: onWidgetClick,
      });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      afterEach(clearEventHandlers);

      describe('contentReadyEffect', () => {
        it('should call "onContentReady" callback with the content node\'s parent', () => {
          const onContentReady = jest.fn();
          const button = new Button({ onContentReady });
          const parentNode = {};
          button.contentRef = { parentNode } as any;
          button.contentReadyEffect();
          expect(onContentReady).toHaveBeenCalledTimes(1);
          expect(onContentReady).toHaveBeenCalledWith({ element: parentNode });
        });
      });

      describe('submitEffect', () => {
        it('should be ignored if the "useSubmitBehavior" is false', () => {
          const button = new Button({ useSubmitBehavior: false, onSubmit: () => false });
          expect(button.submitEffect()).toBe(undefined);
          expect(getEventHandlers(EVENT.click)).toBeUndefined();
        });

        it('should be ignored if the "onSubmit" is empty', () => {
          const button = new Button({ useSubmitBehavior: true, onSubmit: undefined });
          expect(button.submitEffect()).toBe(undefined);
          expect(getEventHandlers(EVENT.click)).toBeUndefined();
        });

        it('should call "onSubmit" callback by submit input click ', () => {
          const onSubmit = jest.fn();
          const button = new Button({ useSubmitBehavior: true, onSubmit });
          button.submitInputRef = {} as any;
          button.submitEffect();
          emit(EVENT.click, defaultEvent, button.submitInputRef as any);
          expect(onSubmit).toHaveBeenCalledTimes(1);
          expect(onSubmit).toHaveBeenCalledWith(
            { event: defaultEvent, submitInput: button.submitInputRef },
          );
        });

        it('should return event detach callback', () => {
          const onSubmit = jest.fn();
          const button = new Button({ useSubmitBehavior: true, onSubmit });
          button.submitInputRef = {} as any;
          const detach = button.submitEffect() as () => undefined;
          expect(getEventHandlers(EVENT.click).length).toBe(1);
          detach();
          expect(getEventHandlers(EVENT.click).length).toBe(0);
        });
      });
    });

    describe('Methods', () => {
      describe('focus', () => {
        it('should focus main element', () => {
          const button = new Button({});
          button.widgetRef = { focus: jest.fn() } as any;
          button.focus();

          expect(button.widgetRef.focus).toHaveBeenCalledTimes(1);
          expect(button.widgetRef.focus).toHaveBeenCalledWith();
        });
      });
    });

    describe('Events', () => {
      describe('Widget', () => {
        describe('Key down', () => {
          it('should call onKeyDown callback by Widget key down', () => {
            const onKeyDown = jest.fn(() => ({ cancel: true }));
            const options = {};
            const button = new Button({ onKeyDown });
            button.onWidgetKeyDown(options);
            expect(onKeyDown).toHaveBeenCalledTimes(1);
            expect(onKeyDown).toHaveBeenCalledWith(options);
          });

          it('should prevent key down event processing if onKeyDown event handler returns event.cancel="true"', () => {
            const onKeyDown = jest.fn(() => ({ cancel: true }));
            const onClick = jest.fn();
            const options = { keyName: 'enter' };
            const button = new Button({ onKeyDown, onClick });
            button.onWidgetKeyDown(options);
            expect(onKeyDown).toBeCalled();
            expect(onClick).not.toBeCalled();
          });

          it('should prevent default key down event and simulate click by space/enter keys', () => {
            const onClick = jest.fn();
            const options = {
              keyName: 'enter',
              originalEvent: {
                preventDefault: jest.fn(),
              },
            };
            const button = new Button({ onClick, validationGroup: 'vGroup' });
            button.onWidgetKeyDown(options);
            expect(options.originalEvent.preventDefault).toBeCalled();
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onClick).toHaveBeenCalledWith({
              event: options.originalEvent, validationGroup: 'vGroup',
            });
          });

          it('should not simulate click by common keys down', () => {
            const onClick = jest.fn();
            const button = new Button({ onClick, validationGroup: 'vGroup' });
            button.onWidgetKeyDown({ keyName: 'A' });
            expect(onClick).not.toBeCalled();
          });
        });

        describe('Click', () => {
          it('should call onClick callback by Widget click', () => {
            const onClick = jest.fn();
            const event = {} as Event;
            const button = new Button({ onClick, validationGroup: 'vGroup' });
            button.onWidgetClick(event);
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onClick).toHaveBeenCalledWith({
              event, validationGroup: 'vGroup',
            });
          });

          it('should force form submit by Widget click if the "useSubmitBehavior" is true', () => {
            const event = {} as Event;
            const button = new Button({ useSubmitBehavior: true });
            button.submitInputRef = { click: jest.fn() } as any;
            button.onWidgetClick(event);
            expect(button.submitInputRef.click).toHaveBeenCalledTimes(1);
          });

          it('should not force form submit by Widget click if the "useSubmitBehavior" is false', () => {
            const event = {} as Event;
            const button = new Button({ useSubmitBehavior: false });
            button.submitInputRef = { click: jest.fn() } as any;
            button.onWidgetClick(event);
            expect(button.submitInputRef.click).not.toBeCalled();
          });
        });

        describe('Active/Inactive', () => {
          it('should ignore inkripple effects if the useInkRipple is "false"', () => {
            const button = new Button({ useInkRipple: false });
            button.inkRippleRef = {
              showWave: jest.fn(),
              hideWave: jest.fn(),
            } as any;

            button.onActive({} as Event);
            button.onInactive({} as Event);
            expect(button.inkRippleRef.showWave).not.toHaveBeenCalled();
            expect(button.inkRippleRef.hideWave).not.toHaveBeenCalled();
          });

          it('should show inkripple effect on active action', () => {
            const button = new Button({ useInkRipple: true });
            const contentRef = {};
            const event = {} as Event;
            button.contentRef = contentRef as any;
            button.inkRippleRef = { showWave: jest.fn() } as any;
            button.onActive(event);

            expect(button.inkRippleRef.showWave).toHaveBeenCalledTimes(1);
            expect(button.inkRippleRef.showWave).toHaveBeenCalledWith({
              element: contentRef, event,
            });
          });

          it('should hide inkripple effect on inactive action', () => {
            const button = new Button({ useInkRipple: true });
            const contentRef = {};
            const event = {} as Event;
            button.contentRef = contentRef as any;
            button.inkRippleRef = { hideWave: jest.fn() } as any;
            button.onInactive(event);

            expect(button.inkRippleRef.hideWave).toHaveBeenCalledTimes(1);
            expect(button.inkRippleRef.hideWave).toHaveBeenCalledWith({
              element: contentRef, event,
            });
          });
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('aria', () => {
        it('should compile label value from the icon if the icon source type is "image"', () => {
          let button = new Button({ icon: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==' });
          expect(button.aria).toEqual({ label: 'Base64', role: 'button' });

          button = new Button({ icon: '.' });
          expect(button.aria).toEqual({ label: '.', role: 'button' });
        });

        it('should not return label if the text and the icon are empty', () => {
          expect(new Button({}).aria).toEqual({ role: 'button' });
        });

        it('should return icon value if the text is empty', () => {
          expect(new Button({ icon: 'icon' }).aria)
            .toEqual({ label: 'icon', role: 'button' });
        });
      });

      describe('cssClasses', () => {
        it('should add button styling mode class', () => {
          expect(new Button({ stylingMode: 'text' }).cssClasses)
            .toEqual(expect.stringMatching('dx-button-mode-text'));
        });

        it('should add "contained" button styling mode class by default', () => {
          expect(new Button({}).cssClasses)
            .toEqual(expect.stringMatching('dx-button-mode-contained'));
        });

        it('should add button type class', () => {
          expect(new Button({ type: 'back' }).cssClasses)
            .toEqual(expect.stringMatching('dx-button-back'));
        });

        it('should add "normal" button type class by default', () => {
          expect(new Button({}).cssClasses)
            .toEqual(expect.stringMatching('dx-button-normal'));
        });

        it('should add "right" icon position class if iconPosition is not "left"', () => {
          expect(new Button({}).cssClasses)
            .toEqual(expect.stringMatching('dx-button-icon-right'));

          expect(new Button({ iconPosition: 'center' }).cssClasses)
            .toEqual(expect.stringMatching('dx-button-icon-right'));
        });

        it('should not add icon position class if iconPosition is "left"', () => {
          expect(new Button({ iconPosition: 'left' }).cssClasses)
            .toEqual(expect.not.stringMatching('dx-button-icon-'));
        });

        it('should add "dx-button" class', () => {
          expect(new Button({}).cssClasses)
            .toEqual(expect.stringMatching(/dx-button(\s|$)/));
        });

        it('should add button text class', () => {
          expect(new Button({ text: 'text' }).cssClasses)
            .toEqual(expect.stringMatching('dx-button-has-text'));
        });

        it('should add button icon class', () => {
          expect(new Button({ icon: 'icon' }).cssClasses)
            .toEqual(expect.stringMatching('dx-button-has-icon'));
        });

        it('should not add button text class by default', () => {
          expect(new Button({}).cssClasses)
            .toEqual(expect.not.stringMatching('dx-button-has-text'));
        });

        it('should not add button icon class by default', () => {
          expect(new Button({}).cssClasses)
            .toEqual(expect.not.stringMatching('dx-button-has-icon'));
        });
      });

      describe('iconSource', () => {
        it('should return "icon" property value if defined', () => {
          expect(new Button({ icon: 'icon' }).iconSource).toBe('icon');
        });

        it('should return "icon" property value if the type is "back"', () => {
          expect(new Button({ icon: 'icon', type: 'back' }).iconSource)
            .toBe('icon');
        });

        it('should return "back" property value for the back button', () => {
          expect(new Button({ type: 'back' }).iconSource).toBe('back');
        });

        it('should return empty string if the icon property value is empty', () => {
          expect(new Button({}).iconSource).toBe('');
        });

        it('should return empty string if the type property value is not "back"', () => {
          expect(new Button({ type: 'normal' }).iconSource).toBe('');
        });
      });

      describe('inkRippleConfig', () => {
        const rippleConfig = {
          isCentered: true,
          useHoldAnimation: false,
          waveSizeCoefficient: 1,
        };

        it('should return empty config for the text button', () => {
          expect(new Button({ text: 'text' }).inkRippleConfig).toEqual({});
        });

        it('should return config for the icon only button', () => {
          expect(new Button({ icon: 'icon' }).inkRippleConfig)
            .toEqual(rippleConfig);
        });

        it('should return config for the back button', () => {
          expect(new Button({ type: 'back' }).inkRippleConfig)
            .toEqual(rippleConfig);
        });
      });
    });

    describe('Default options', () => {
      const getDefaultOptions = (): ButtonProps => Object.assign(new ButtonProps(),
        convertRulesToOptions(defaultOptionRules));

      beforeEach(() => {
        (devices.real as Mock).mockImplementation(() => ({ deviceType: 'desktop' }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (devices as any).isSimulator.mockImplementation(() => false);
        ((themes as any).current as Mock).mockImplementation(() => 'generic');
      });

      afterEach(() => jest.resetAllMocks());

      describe('useInkRiple', () => {
        it('should be true if material theme', () => {
          ((themes as any).current as Mock).mockImplementation(() => 'material');
          expect(getDefaultOptions().useInkRipple).toBe(true);
        });

        it('should be false if theme is not material', () => {
          ((themes as any).current as Mock).mockImplementation(() => 'generic');
          expect(getDefaultOptions().useInkRipple).toBe(false);
        });
      });

      describe('focusStateEnabled', () => {
        it('should be false if device is not desktop', () => {
          (devices.real as Mock).mockImplementation(() => ({ deviceType: 'android' }));
          expect(getDefaultOptions().focusStateEnabled).toBe(false);
        });

        it('should be true on desktop and not simulator', () => {
          expect(getDefaultOptions().focusStateEnabled).toBe(true);
        });

        it('should be false on simulator', () => {
          (devices as any).isSimulator.mockImplementation(() => true);
          expect(getDefaultOptions().focusStateEnabled).toBe(false);
        });
      });
    });
  });
});
