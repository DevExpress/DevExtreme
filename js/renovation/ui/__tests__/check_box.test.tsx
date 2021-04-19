/* eslint-disable jest/no-standalone-expect */
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import { RefObject } from '@devextreme-generator/declarations';
import devices from '../../../core/devices';
import { convertRulesToOptions } from '../../../core/options/utils';
import { current } from '../../../ui/themes';
import {
  clear as clearEventHandlers,
} from '../../test_utils/events_mock';
import {
  CheckBox, CheckBoxProps, defaultOptionRules, viewFunction,
} from '../check_box';
import { Widget } from '../common/widget';
import { InkRipple } from '../common/ink_ripple';
import { ValidationMessage } from '../validation_message';

interface Mock extends jest.Mock {}

jest.mock('../validation_message', () => ({ ValidationMessage: () => null }));

jest.mock('../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../core/devices').default;
  const isSimulator = actualDevices.isSimulator.bind(actualDevices);
  const real = actualDevices.real.bind(actualDevices);

  actualDevices.isSimulator = jest.fn(isSimulator);
  actualDevices.real = jest.fn(real);

  return actualDevices;
});

jest.mock('../../../ui/themes', () => ({
  ...jest.requireActual('../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('CheckBox', () => {
  describe('render', () => {
    it('should render hidden input', () => {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const checkBox = shallow(viewFunction({ props: { value: false } } as any) as any);
      const input = checkBox.find('input');
      expect(input.props()).toMatchObject({
        type: 'hidden',
        value: 'false',
      });
    });

    each([true, false, undefined])
      .it('input should have value=%s attr if value is %s', (value) => {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        const checkBox = shallow(viewFunction({ props: { value } } as any) as any);
        const input = checkBox.find('input');
        expect(input.props()).toMatchObject({
          value: `${value}`,
        });
      });

    it('input should have name attr if name is defined', () => {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const checkBox = shallow(viewFunction({ props: { name: 'name' } } as any) as any);
      const input = checkBox.find('input');
      expect(input.props()).toMatchObject({
        name: 'name',
      });
    });

    it('input shouldn\'t have name attr if name is not defined', () => {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const checkBox = shallow(viewFunction({ props: {} } as any) as any);
      const input = checkBox.find('input');
      expect(input.props()).not.toHaveProperty('name');
    });

    it('should render InkRipple if useInkRipple is true', () => {
      const checkBox = shallow(viewFunction({
        props: { useInkRipple: true },
      } as any) as any); // eslint-disable-line  @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const checkBox = shallow(viewFunction({ props: { text: 'checkbox-text' } } as any) as any);
      const checkBoxText = checkBox.find('.dx-checkbox-container .dx-checkbox-text');
      expect(checkBoxText.text()).toBe('checkbox-text');
    });

    it('should not render text if option is not defined', () => {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const checkBox = shallow(viewFunction({ props: {} } as any) as any);
      const checkBoxText = checkBox.find('.dx-checkbox-text');
      expect(checkBoxText.exists()).toBe(false);
    });

    it('should always render icon', () => {
      const button = shallow(viewFunction({
        props: {},
      } as any) as any); // eslint-disable-line  @typescript-eslint/no-explicit-any
      expect(button.find('.dx-checkbox-container .dx-checkbox-icon').exists()).toBe(true);
    });

    it('should pass all necessary properties to the Widget', () => {
      const renderOptions = {
        aria: { role: 'aria' },
        onActive: (): null => null,
        onInactive: (): null => null,
        onFocusIn: (): null => null,
        onFocusOut: (): null => null,
      };
      const renderProps = {
        accessKey: 'A',
        activeStateEnabled: true,
        disabled: true,
        focusStateEnabled: true,
        height: 100,
        hint: 'hint',
        hoverStateEnabled: true,
        onContentReady: (): null => null,
        rtlEnabled: true,
        tabIndex: -2,
        visible: true,
        width: 200,
      };
      const cssClasses = 'cssClasses';
      const restAttributes = { attr1: 'value1', attr2: 'value2' };
      const onWidgetKeyDown = (): null => null;
      const onWidgetClick = (): null => null;
      const target = {};
      const checkBox = mount(viewFunction({
        target,
        ...renderOptions,
        props: renderProps,
        restAttributes,
        cssClasses,
        onWidgetKeyDown,
        onWidgetClick,
      } as any) as any); // eslint-disable-line  @typescript-eslint/no-explicit-any
      expect(checkBox.find(Widget).props()).toMatchObject({
        rootElementRef: target,
        ...renderOptions,
        ...renderProps,
        ...restAttributes,
        classes: cssClasses,
        onKeyDown: onWidgetKeyDown,
        onClick: onWidgetClick,
      });
    });

    describe('validation', () => {
      it('widget should pass correct props to validationMessage', () => {
        const ref = { current: {} } as RefObject<HTMLDivElement>;
        const validationErrors = [{ message: 'error message' }];
        const CustomTree = ({ target }: any) => (
          <div ref={ref as any}>
            {viewFunction({
              showValidationMessage: true,
              target,
              validationErrors,
              props: {
                isValid: false,
                validationErrors,
                validationStatus: 'invalid',
                validationMessageMode: 'always',
                rtlEnabled: false,
              },
              shouldShowValidationMessage: true,
              targetCurrent: target?.current,
            } as any)}
          </div>
        );
        const tree = mount(<CustomTree />);
        tree.setProps({ target: ref });
        tree.update();

        const validationMessage = tree.find(ValidationMessage);
        const props = validationMessage.props();
        expect(props.container).toBe(ref.current);
        expect(props.target).toBe(ref.current);
        expect(props.boundary).toBe(ref.current);
        expect(props.positionRequest).toBe('below');
        expect(props.mode).toBe('always');
        expect(props.rtlEnabled).toBe(false);
        expect(props.validationErrors).toEqual(validationErrors);
      });
    });

    it('validationMessage should not be rendered when widget is not rendered yet', () => {
      const ref = React.createRef();
      const validationErrors = [{ message: 'error message' }];
      const CustomTree = ({ target }: any) => (
        <div ref={ref as any}>
          {viewFunction({
            showValidationMessage: false,
            target,
            validationErrors,
            props: {
              isValid: false,
              validationErrors,
              validationStatus: 'invalid',
            },
          } as any)}
        </div>
      );
      const tree = mount(<CustomTree />);
      tree.setProps({ target: ref.current });
      tree.update();

      const validationMessage = tree.find(ValidationMessage);
      expect(validationMessage.exists()).toBe(false);
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      afterEach(clearEventHandlers);

      describe('contentReadyEffect', () => {
        it('should call "onContentReady" callback with the widget root node', () => {
          const onContentReady = jest.fn();
          const checkBox = new CheckBox({ onContentReady });
          checkBox.contentReadyEffect();
          expect(onContentReady).toHaveBeenCalledTimes(1);
          expect(onContentReady).toHaveBeenCalledWith({});
        });

        it('should not raise any error if contentReady is not defined', () => {
          const checkBox = new CheckBox({ onContentReady: undefined });
          expect(checkBox.contentReadyEffect.bind(checkBox)).not.toThrow();
        });
      });

      describe('updateValidationMessageVisibility', () => {
        it('should set showValidationMessage', () => {
          const checkBox = new CheckBox({
            isValid: false,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });
          expect(checkBox.showValidationMessage).toBe(false);

          checkBox.updateValidationMessageVisibility();
          expect(checkBox.showValidationMessage).toBe(true);
        });
      });

      describe('Methods', () => {
        describe('focus', () => {
          it('should focus main element', () => {
            const checkBox = new CheckBox({});
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            checkBox.widgetRef = { current: { focus: jest.fn() } } as any;
            checkBox.focus();

            expect(checkBox.widgetRef.current?.focus).toHaveBeenCalledTimes(1);
            expect(checkBox.widgetRef.current?.focus).toHaveBeenCalledWith();
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
              checkBox.onWidgetClick({} as Event);
              expect(checkBox.props.value).toBe(true);
            });

            it('should call saveValueChangeEvent by Widget click', () => {
              const saveValueChangeEvent = jest.fn();
              const checkBox = new CheckBox({
                saveValueChangeEvent,
                value: false,
              });
              const event = {} as Event;
              checkBox.onWidgetClick(event);
              expect(saveValueChangeEvent).toBeCalled();
              expect(saveValueChangeEvent).toBeCalledWith(event);
            });

            it('should not change value by Widget click of readOnly is true', () => {
              const checkBox = new CheckBox({
                value: false,
                readOnly: true,
              });
              checkBox.onWidgetClick({} as Event);
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
          current: {
            showWave: jest.fn(),
            hideWave: jest.fn(),
          },
        } as any; // eslint-disable-line  @typescript-eslint/no-explicit-any

        checkBox.onActive({} as Event);
        checkBox.onInactive({} as Event);
        expect(checkBox.inkRippleRef.current?.showWave).not.toHaveBeenCalled();
        expect(checkBox.inkRippleRef.current?.hideWave).not.toHaveBeenCalled();
      });

      it('should show inkripple effect on active action', () => {
        const checkBox = new CheckBox({ useInkRipple: true });
        const iconRef = { current: {} };
        const event = {} as Event;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        checkBox.iconRef = iconRef as any;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        checkBox.inkRippleRef = { current: { showWave: jest.fn() } } as any;
        checkBox.onActive(event);

        expect(checkBox.inkRippleRef.current?.showWave).toHaveBeenCalledTimes(1);
        expect(checkBox.inkRippleRef.current?.showWave).toHaveBeenCalledWith({
          event,
          element: iconRef.current,
          wave: 1,
        });
      });

      it('should hide inkripple effect on inactive action', () => {
        const checkBox = new CheckBox({ useInkRipple: true });
        const iconRef = { current: {} };
        const event = {} as Event;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        checkBox.iconRef = iconRef as any;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        checkBox.inkRippleRef = { current: { hideWave: jest.fn() } } as any;
        checkBox.onInactive(event);

        expect(checkBox.inkRippleRef.current?.hideWave).toHaveBeenCalledTimes(1);
        expect(checkBox.inkRippleRef.current?.hideWave).toHaveBeenCalledWith({
          event,
          element: iconRef.current,
          wave: 1,
        });
      });
    });

    describe('FocusIn/FocusOut', () => {
      it('should ignore inkripple effects if the useInkRipple is "false"', () => {
        const checkBox = new CheckBox({ useInkRipple: false });
        checkBox.inkRippleRef = {
          current: {
            showWave: jest.fn(),
            hideWave: jest.fn(),
          },
        } as any; // eslint-disable-line  @typescript-eslint/no-explicit-any

        checkBox.onFocusIn({} as Event);
        checkBox.onFocusOut({} as Event);
        expect(checkBox.inkRippleRef.current?.showWave).not.toHaveBeenCalled();
        expect(checkBox.inkRippleRef.current?.hideWave).not.toHaveBeenCalled();
      });

      it('should show inkripple effect on focusin action', () => {
        const checkBox = new CheckBox({ useInkRipple: true });
        const iconRef = { current: {} };
        const event = {} as Event;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        checkBox.iconRef = iconRef as any;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        checkBox.inkRippleRef = { current: { showWave: jest.fn() } } as any;
        checkBox.onFocusIn(event);

        expect(checkBox.inkRippleRef.current?.showWave).toHaveBeenCalledTimes(1);
        expect(checkBox.inkRippleRef.current?.showWave).toHaveBeenCalledWith({
          event,
          element: iconRef.current,
          wave: 0,
        });
      });

      it('should hide inkripple effect on focusout action', () => {
        const checkBox = new CheckBox({ useInkRipple: true });
        const iconRef = { current: {} };
        const event = {} as Event;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        checkBox.iconRef = iconRef as any;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        checkBox.inkRippleRef = { current: { hideWave: jest.fn() } } as any;
        checkBox.onFocusOut(event);

        expect(checkBox.inkRippleRef.current?.hideWave).toHaveBeenCalledTimes(1);
        expect(checkBox.inkRippleRef.current?.hideWave).toHaveBeenCalledWith({
          event,
          element: iconRef.current,
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

        each([true, false, null])
          .it('should have "checked=%s" if value=%s', (value) => {
            let expectedValue = `${value}`;
            if (value === null) {
              expectedValue = 'mixed';
            }
            expect(new CheckBox({ value }).aria)
              .toMatchObject({ checked: expectedValue });
          });

        each([true, false])
          .it('should have "readonly=%s if readOnly=%s', (readOnly) => {
            expect(new CheckBox({ readOnly }).aria)
              .toMatchObject({ readonly: `${readOnly}` });
          });

        each([true, false])
          .it('should have "invalid=%s" if isValid=%s', (isValid) => {
            expect(new CheckBox({ isValid }).aria)
              .toMatchObject({ invalid: `${!isValid}` });
          });

        /* eslint-disable spellcheck/spell-checker */
        it('should have no "describedby" when widget is valid', () => {
          expect(new CheckBox({}).aria)
            .not.toHaveProperty('describedby');
        });

        it('should have no "describedby" when widget "validationStatus" is not "invalid"', () => {
          expect(new CheckBox({ isValid: false, validationStatus: 'pending' }).aria)
            .not.toHaveProperty('describedby');
        });

        it('should have no "describedby" when there is no validation errors', () => {
          expect(new CheckBox({ isValid: false, validationStatus: 'invalid' }).aria)
            .not.toHaveProperty('describedby');
        });

        it('should have "describedby" when widget is invalid', () => {
          const { aria } = new CheckBox({
            isValid: false,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });
          expect(aria.describedby).not.toBeUndefined();
        });
        /* eslint-enable spellcheck/spell-checker */
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
          expect(new CheckBox({ value: null }).cssClasses)
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

      describe('validationErrors', () => {
        it('should return "validationErrors" props value when it is specified', () => {
          const validationErrors = [{ message: 'error message' }];
          expect(new CheckBox({ validationErrors }).validationErrors)
            .toEqual(validationErrors);
        });

        it('should return array with one element equal to "validationError" props value when "validationErrors" is not specified', () => {
          const validationError = { message: 'error message' };
          expect(new CheckBox({ validationError }).validationErrors)
            .toEqual([validationError]);
        });
      });

      describe('targetCurrent', () => {
        it('should return "this.target.current" value when it is specified', () => {
          const checkBox = new CheckBox({});
          const expectedCurrent = {};
          const ref = { current: expectedCurrent } as RefObject<HTMLDivElement>;
          checkBox.target = ref;

          expect(checkBox.targetCurrent).toEqual(expectedCurrent);
        });

        it('should return undefined when target is not specified', () => {
          const checkBox = new CheckBox({});

          expect(checkBox.targetCurrent).toEqual(undefined);
        });
      });

      describe('shouldShowValidationMessage', () => {
        it('should return true when isValid=false, validationStatus="invalid" and there are validation errors', () => {
          const checkBox = new CheckBox({
            isValid: false,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });

          expect(checkBox.shouldShowValidationMessage).toBe(true);
        });

        it('should return false if there is no validation errors', () => {
          const checkBox = new CheckBox({
            isValid: false,
            validationStatus: 'invalid',
          });

          expect(checkBox.shouldShowValidationMessage).toBe(false);
        });

        it('should return false if validationStatis not equal to "invalid"', () => {
          const checkBox = new CheckBox({
            isValid: false,
            validationStatus: 'pending',
            validationErrors: [{ message: 'error message' }],
          });

          expect(checkBox.shouldShowValidationMessage).toBe(false);
        });

        it('should return false if isValid is true', () => {
          const checkBox = new CheckBox({
            isValid: true,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });

          expect(checkBox.shouldShowValidationMessage).toBe(false);
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
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        (current as Mock).mockImplementation(() => 'generic');
      });

      afterEach(() => jest.resetAllMocks());

      describe('useInkRiple', () => {
        // eslint-disable-next-line
        it.skip('should be true if material theme', () => {
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          (current as Mock).mockImplementation(() => 'material');
          expect(getDefaultOptions().useInkRipple).toBe(true);
        });

        it('should be false if theme is not material', () => {
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          (current as Mock).mockImplementation(() => 'generic');
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
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          (devices as any).isSimulator.mockImplementation(() => true);
          expect(getDefaultOptions().focusStateEnabled).toBe(false);
        });
      });
    });
  });
});
