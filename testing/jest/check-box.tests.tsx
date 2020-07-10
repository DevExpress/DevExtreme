import { mount, shallow } from 'enzyme';
import devices from '../../js/core/devices';
import { convertRulesToOptions } from '../../js/core/options/utils';
import themes from '../../js/ui/themes';
import {
  clear as clearEventHandlers,
} from './utils/events-mock';
import {
  CheckBox, CheckBoxProps, defaultOptionRules, viewFunction,
} from '../../js/renovation/check-box';
import { Widget } from '../../js/renovation/widget';
import { InkRipple } from '../../js/renovation/ink-ripple';

type Mock = jest.Mock;

jest.mock('../../js/core/devices', () => {
  const actualDevices = require.requireActual('../../js/core/devices').default;
  const isSimulator = actualDevices.isSimulator.bind(actualDevices);
  const real = actualDevices.real.bind(actualDevices);

  actualDevices.isSimulator = jest.fn(isSimulator);
  actualDevices.real = jest.fn(real);

  return actualDevices;
});

jest.mock('../../js/ui/themes', () => ({
  ...require.requireActual('../../js/ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('CheckBox', () => {
  describe('render', () => {
    it('should render hidden input', () => {
      const checkBox = shallow(viewFunction({ props: { value: false } } as any) as any);
      const input = checkBox.find('input');
      expect(input.props()).toMatchObject({
        type: 'hidden',
        value: 'false',
      });
    });

    [true, false, undefined].forEach((value) => {
      it(`input should have value=${value} attr if value is ${value}`, () => {
        const checkBox = shallow(viewFunction({ props: { value } } as any) as any);
        const input = checkBox.find('input');
        expect(input.props()).toMatchObject({
          value: `${value}`,
        });
      });
    });

    it('input should have name attr if name is defined', () => {
      const checkBox = shallow(viewFunction({ props: { name: 'name' } } as any) as any);
      const input = checkBox.find('input');
      expect(input.props()).toMatchObject({
        name: 'name',
      });
    });

    it('input shouldn\'t have name attr if name is not defined', () => {
      const checkBox = shallow(viewFunction({ props: {} } as any) as any);
      const input = checkBox.find('input');
      expect(input.props()).not.toHaveProperty('name');
    });

    it('should render InkRipple if useInkRipple is true', () => {
      const checkBox = shallow(viewFunction({
        props: { useInkRipple: true },
      } as any) as any);
      expect(checkBox.find(InkRipple).props()).toMatchObject({
        config: {
          waveSizeCoefficient: 2.5,
          useHoldAnimation: false,
          wavesNumber: 2,
          isCentered: true,
        },
      });
    });

    it('should render text if text option is defined', () => {
      const checkBox = shallow(viewFunction({ props: { text: 'checkbox-text' } } as any) as any);
      const checkBoxText = checkBox.find('.dx-checkbox-container .dx-checkbox-text');
      expect(checkBoxText.text()).toBe('checkbox-text');
    });

    it('should not render text if option is not defined', () => {
      const checkBox = shallow(viewFunction({ props: {} } as any) as any);
      const checkBoxText = checkBox.find('.dx-checkbox-text');
      expect(checkBoxText.exists()).toBe(false);
    });

    it('should always render icon', () => {
      const button = shallow(viewFunction({
        props: {},
      } as any) as any);
      expect(button.find('.dx-checkbox-container .dx-checkbox-icon').exists()).toBe(true);
    });

    it('should pass all necessary properties to the Widget', () => {
      const renderOptions = {
        aria: 'area',
        onActive: () => null,
        onInactive: () => null,
        onFocusIn: () => null,
        onFocusOut: () => null,
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
      const checkBox = mount(viewFunction({
        ...renderOptions,
        props: renderProps,
        restAttributes,
        cssClasses,
        onWidgetKeyDown,
        onWidgetClick,
      } as any) as any);
      expect(checkBox.find(Widget).props()).toMatchObject({
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
        it('should call "onContentReady" callback with the widget root node', () => {
          const onContentReady = jest.fn();
          const checkBox = new CheckBox({ onContentReady });
          const node = {};
          checkBox.widgetRef = node as any;
          checkBox.contentReadyEffect();
          expect(onContentReady).toHaveBeenCalledTimes(1);
          expect(onContentReady).toHaveBeenCalledWith({ element: node });
        });
      });

      describe('Methods', () => {
        describe('focus', () => {
          it('should focus main element', () => {
            const checkBox = new CheckBox({});
            checkBox.widgetRef = { focus: jest.fn() } as any;
            checkBox.focus();

            expect(checkBox.widgetRef.focus).toHaveBeenCalledTimes(1);
            expect(checkBox.widgetRef.focus).toHaveBeenCalledWith();
          });
        });
      });

      describe('Events', () => {
        describe('Widget', () => {
          describe('Key down', () => {
            it('should call onKeyDown callback by Widget key down', () => {
              const onKeyDown = jest.fn(() => ({ cancel: true }));
              const options = {};
              const checkBox = new CheckBox({ onKeyDown });
              checkBox.onWidgetKeyDown(options);
              expect(onKeyDown).toHaveBeenCalledTimes(1);
              expect(onKeyDown).toHaveBeenCalledWith(options);
            });

            it('should prevent key down event processing if onKeyDown event handler returns event.cancel="true"', () => {
              const onKeyDown = jest.fn(() => ({ cancel: true }));
              const onClick = jest.fn();
              const options = { keyName: 'enter' };
              const checkBox = new CheckBox({ onKeyDown, onClick });
              checkBox.onWidgetKeyDown(options);
              expect(onKeyDown).toBeCalled();
              expect(onClick).not.toBeCalled();
            });

            it('should prevent default key down event and simulate click by space key', () => {
              const options = {
                keyName: 'space',
                originalEvent: {
                  preventDefault: jest.fn(),
                },
              };
              const checkBox = new CheckBox({});
              checkBox.onWidgetClick = jest.fn();
              checkBox.onWidgetKeyDown(options);
              expect(options.originalEvent.preventDefault).toBeCalled();
              expect(checkBox.onWidgetClick).toHaveBeenCalled();
            });

            it('should not simulate click by keys down except space', () => {
              const onClick = jest.fn();
              const checkBox = new CheckBox({ onClick });
              checkBox.onWidgetKeyDown({ keyName: 'enter' });
              expect(onClick).not.toBeCalled();
            });
          });

          describe('Click', () => {
            it('should change value by Widget click', () => {
              const checkBox = new CheckBox({
                value: false,
              });
              checkBox.onWidgetClick();
              expect(checkBox.props.value).toBe(true);
            });

            it('should not change value by Widget click of readOnly is true', () => {
              const checkBox = new CheckBox({
                value: false,
                readOnly: true,
              });
              checkBox.onWidgetClick();
              expect(checkBox.props.value).toBe(false);
            });
          });
        });
      });
    });

    describe('Active/Inactive', () => {
      it('should ignore inkripple effects if the useInkRipple is "false"', () => {
        const checkBox = new CheckBox({ useInkRipple: false });
        checkBox.inkRippleRef = {
          showWave: jest.fn(),
          hideWave: jest.fn(),
        } as any;

        checkBox.onActive({} as Event);
        checkBox.onInactive({} as Event);
        expect(checkBox.inkRippleRef.showWave).not.toHaveBeenCalled();
        expect(checkBox.inkRippleRef.hideWave).not.toHaveBeenCalled();
      });

      it('should show inkripple effect on active action', () => {
        const checkBox = new CheckBox({ useInkRipple: true });
        const iconRef = {};
        const event = {} as Event;
        checkBox.iconRef = iconRef as any;
        checkBox.inkRippleRef = { showWave: jest.fn() } as any;
        checkBox.onActive(event);

        expect(checkBox.inkRippleRef.showWave).toHaveBeenCalledTimes(1);
        expect(checkBox.inkRippleRef.showWave).toHaveBeenCalledWith({
          event,
          element: iconRef,
          wave: 1,
        });
      });

      it('should hide inkripple effect on inactive action', () => {
        const checkBox = new CheckBox({ useInkRipple: true });
        const iconRef = {};
        const event = {} as Event;
        checkBox.iconRef = iconRef as any;
        checkBox.inkRippleRef = { hideWave: jest.fn() } as any;
        checkBox.onInactive(event);

        expect(checkBox.inkRippleRef.hideWave).toHaveBeenCalledTimes(1);
        expect(checkBox.inkRippleRef.hideWave).toHaveBeenCalledWith({
          event,
          element: iconRef,
          wave: 1,
        });
      });
    });

    describe('FocusIn/FocusOut', () => {
      it('should ignore inkripple effects if the useInkRipple is "false"', () => {
        const checkBox = new CheckBox({ useInkRipple: false });
        checkBox.inkRippleRef = {
          showWave: jest.fn(),
          hideWave: jest.fn(),
        } as any;

        checkBox.onFocusIn({} as Event);
        checkBox.onFocusOut({} as Event);
        expect(checkBox.inkRippleRef.showWave).not.toHaveBeenCalled();
        expect(checkBox.inkRippleRef.hideWave).not.toHaveBeenCalled();
      });

      it('should show inkripple effect on focusin action', () => {
        const checkBox = new CheckBox({ useInkRipple: true });
        const iconRef = {};
        const event = {} as Event;
        checkBox.iconRef = iconRef as any;
        checkBox.inkRippleRef = { showWave: jest.fn() } as any;
        checkBox.onFocusIn(event);

        expect(checkBox.inkRippleRef.showWave).toHaveBeenCalledTimes(1);
        expect(checkBox.inkRippleRef.showWave).toHaveBeenCalledWith({
          event,
          element: iconRef,
          wave: 0,
        });
      });

      it('should hide inkripple effect on focusout action', () => {
        const checkBox = new CheckBox({ useInkRipple: true });
        const iconRef = {};
        const event = {} as Event;
        checkBox.iconRef = iconRef as any;
        checkBox.inkRippleRef = { hideWave: jest.fn() } as any;
        checkBox.onFocusOut(event);

        expect(checkBox.inkRippleRef.hideWave).toHaveBeenCalledTimes(1);
        expect(checkBox.inkRippleRef.hideWave).toHaveBeenCalledWith({
          event,
          element: iconRef,
          wave: 0,
        });
      });

      it('should raise onFocusIn prop event', () => {
        const onFocusIn = jest.fn();
        const checkBox = new CheckBox({ onFocusIn });
        const event = {} as Event;

        checkBox.onFocusIn(event);

        expect(onFocusIn).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('aria', () => {
        it('should have role = "checkbox"', () => {
          expect(new CheckBox({}).aria).toMatchObject({ role: 'checkbox' });
        });

        [true, false, undefined].forEach((value) => {
          it(`should have "checked=${value}" if value=${value}`, () => {
            let expectedValue = `${value}`;
            if (value === undefined) {
              expectedValue = 'mixed';
            }
            expect(new CheckBox({ value }).aria)
              .toMatchObject({ checked: expectedValue });
          });
        });

        [true, false].forEach((readOnly) => {
          it(`should have "readonly=${readOnly}" if readOnly=${readOnly}`, () => {
            expect(new CheckBox({ readOnly }).aria)
              .toMatchObject({ readonly: `${readOnly}` });
          });
        });

        [true, false].forEach((isValid) => {
          it(`should have "invalid=${!isValid}" if isValid=${isValid}`, () => {
            expect(new CheckBox({ isValid }).aria)
              .toMatchObject({ invalid: `${!isValid}` });
          });
        });
      });

      describe('cssClasses', () => {
        it('should have "dx-checkbox" class', () => {
          expect(new CheckBox({}).cssClasses)
            .toEqual(expect.stringMatching('dx-checkbox'));
        });

        it('should have "dx-state-readonly" class if readOnly option is true', () => {
          expect(new CheckBox({ readOnly: true }).cssClasses)
            .toEqual(expect.stringMatching('dx-state-readonly'));
        });

        it('should have "dx-checkbox-checked" class if value option is true', () => {
          expect(new CheckBox({ value: true }).cssClasses)
            .toEqual(expect.stringMatching('dx-checkbox-checked'));
        });

        it('should have "dx-checkbox-indeterminate" class if value option is undefined', () => {
          expect(new CheckBox({ value: undefined }).cssClasses)
            .toEqual(expect.stringMatching('dx-checkbox-indeterminate'));
        });

        it('should have "dx-checkbox-has-text" class if text option is defined', () => {
          expect(new CheckBox({ text: 'text' }).cssClasses)
            .toEqual(expect.stringMatching('dx-checkbox-has-text'));
        });

        it('should have "dx-invalid" class if isValid option is false', () => {
          expect(new CheckBox({ isValid: false }).cssClasses)
            .toEqual(expect.stringMatching('dx-invalid'));
        });
      });
    });

    describe('Default options', () => {
      const getDefaultOptions = (): CheckBoxProps => Object.assign(new CheckBoxProps(),
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
