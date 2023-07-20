/* eslint-disable jest/no-standalone-expect */
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import { RefObject } from '@devextreme-generator/declarations';
import devices from '../../../../../core/devices';
import {
  clear as clearEventHandlers,
} from '../../../../test_utils/events_mock';
import {
  CheckBox, CheckBoxProps, viewFunction,
} from '../check_box';
import { Editor } from '../../common/editor';
import { CheckBoxIcon } from '../check_box_icon';

interface Mock extends jest.Mock {}

jest.mock('../../../../utils/get_computed_style');

jest.mock('../../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../../core/devices').default;
  const isSimulator = actualDevices.isSimulator.bind(actualDevices);
  const real = actualDevices.real.bind(actualDevices);

  actualDevices.isSimulator = jest.fn(isSimulator);
  actualDevices.real = jest.fn(real);

  return actualDevices;
});

jest.mock('../../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('CheckBox', () => {
  describe('render', () => {
    it('should render hidden input', () => {
      const checkBox = shallow(viewFunction({ props: { value: false } } as CheckBox));
      const input = checkBox.find('input');
      expect(input.props()).toMatchObject({
        type: 'hidden',
        value: 'false',
      });
    });

    each([true, false, undefined])
      .it('input should have value=%s attr if value is %s', (value) => {
        const checkBox = shallow(viewFunction({ props: { value } } as CheckBox));
        const input = checkBox.find('input');
        expect(input.props()).toMatchObject({
          value: `${value}`,
        });
      });

    it('input should have name attr if name is defined', () => {
      const checkBox = shallow(viewFunction({ props: { name: 'name' } } as CheckBox));
      const input = checkBox.find('input');
      expect(input.props()).toMatchObject({
        name: 'name',
      });
    });

    it('input shouldn\'t have name attr if name is not defined', () => {
      const checkBox = shallow(viewFunction({ props: {} } as CheckBox));
      const input = checkBox.find('input');
      expect(input.props()).not.toHaveProperty('name');
    });

    it('should render text if text option is defined', () => {
      const checkBox = shallow(viewFunction({ props: { text: 'checkbox-text' } } as CheckBox));
      const checkBoxText = checkBox.find('.dx-checkbox-container .dx-checkbox-text');
      expect(checkBoxText.text()).toBe('checkbox-text');
    });

    it('should not render text if option is not defined', () => {
      const checkBox = shallow(viewFunction({ props: {} } as CheckBox));
      const checkBoxText = checkBox.find('.dx-checkbox-text');
      expect(checkBoxText.exists()).toBe(false);
    });

    it('should always render icon', () => {
      const checkBox = shallow(viewFunction({
        props: {},
      } as CheckBox));
      expect(checkBox.find(CheckBoxIcon).exists()).toBe(true);
    });

    it('should pass all necessary properties to Editor', () => {
      const renderOptions = {
        aria: { role: 'aria' },
      };
      const renderProps = {
        accessKey: 'A',
        activeStateEnabled: true,
        className: 'name',
        disabled: true,
        focusStateEnabled: true,
        height: 100,
        hint: 'hint',
        hoverStateEnabled: true,
        rtlEnabled: true,
        tabIndex: -2,
        visible: true,
        width: 200,
        isValid: true,
        validationMessageMode: 'auto',
        validationMessagePosition: 'bottom',
        validationError: { message: 'error' },
        validationErrors: [],
        validationStatus: 'valid',
      };
      const cssClasses = 'cssClasses';
      const restAttributes = { attr1: 'value1', attr2: 'value2' };
      const keyDown = (): null => null;
      const onWidgetClick = (): null => null;
      const checkBox = mount(viewFunction({
        ...renderOptions,
        props: renderProps,
        restAttributes,
        cssClasses,
        keyDown,
        onWidgetClick,
      } as any));
      expect(checkBox.find(Editor).props()).toMatchObject({
        ...renderOptions,
        ...renderProps,
        ...restAttributes,
        classes: cssClasses,
        onKeyDown: keyDown,
        onClick: onWidgetClick,
      });
    });

    it('should pass iconSize and isChecked to CheckBoxIcon', () => {
      const iconSize = 15;
      const checkBox = mount(viewFunction({
        props: { iconSize, value: true },
      } as any));
      expect(checkBox.find(CheckBoxIcon).props()).toMatchObject({
        size: iconSize,
        isChecked: true,
      });
    });
  });

  describe('Behavior', () => {
    describe('Events', () => {
      afterEach(clearEventHandlers);

      describe('Widget', () => {
        describe('Key down', () => {
          it('should call onKeyDown callback by Widget key down', () => {
            const onKeyDown = jest.fn(() => ({ cancel: true }));
            const originalEvent = {} as Event & { cancel: boolean };
            const options = { keyName: '', which: '', originalEvent };
            const checkBox = new CheckBox({ onKeyDown });
            checkBox.keyDown(options);
            expect(onKeyDown).toHaveBeenCalledTimes(1);
            expect(onKeyDown).toHaveBeenCalledWith(options);
          });

          it('should prevent key down event processing if onKeyDown event handler returns event.cancel="true"', () => {
            const onKeyDown = jest.fn(() => ({ cancel: true }));
            const onClick = jest.fn();
            const originalEvent = {} as Event & { cancel: boolean };
            const options = { keyName: 'enter', which: '', originalEvent };
            const checkBox = new CheckBox({ onKeyDown, onClick });
            checkBox.keyDown(options);
            expect(onKeyDown).toBeCalled();
            expect(onClick).not.toBeCalled();
          });

          it('should prevent default key down event and simulate click by space key', () => {
            const originalEvent = {
              preventDefault: jest.fn(),
            } as unknown as Event & { cancel: boolean };
            const options = {
              keyName: 'space',
              which: 'space',
              originalEvent,
            };
            const checkBox = new CheckBox({});
            checkBox.onWidgetClick = jest.fn();
            checkBox.keyDown(options);
            expect(options.originalEvent.preventDefault).toBeCalled();
            expect(checkBox.onWidgetClick).toHaveBeenCalled();
          });

          it('should not simulate click by keys down except space', () => {
            const onClick = jest.fn();
            const checkBox = new CheckBox({ onClick });
            const originalEvent = {} as Event & { cancel: boolean };
            checkBox.keyDown({ keyName: 'enter', which: 'enter', originalEvent });
            expect(onClick).not.toBeCalled();
          });
        });

        describe('Click', () => {
          it('should change value by Widget click', () => {
            const checkBox = new CheckBox({
              value: null,
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

          each`
            initial  | expected
            ${true}  | ${false}
            ${false} | ${null}
            ${null}  | ${true}
          `
            .it('value="$initial" should be changed to "$expected" by click if enableThreeStateBehavior is true', ({ initial, expected }) => {
              const checkBox = new CheckBox({
                enableThreeStateBehavior: true,
                value: initial,
              });
              checkBox.onWidgetClick({} as Event);
              expect(checkBox.props.value).toBe(expected);
            });
        });
      });
    });

    describe('Methods', () => {
      describe('focus', () => {
        it('should call editor focus method', () => {
          const checkBox = new CheckBox({});
          checkBox.editorRef = { current: { focus: jest.fn() } } as unknown as RefObject<Editor>;
          checkBox.focus();

          expect(checkBox.editorRef.current?.focus).toHaveBeenCalledTimes(1);
          expect(checkBox.editorRef.current?.focus).toHaveBeenCalledWith();
        });
      });

      describe('blur', () => {
        it('should call editor blur method', () => {
          const checkBox = new CheckBox({});
          checkBox.editorRef = { current: { blur: jest.fn() } } as unknown as RefObject<Editor>;
          checkBox.blur();

          expect(checkBox.editorRef.current?.blur).toHaveBeenCalledTimes(1);
        });
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
      });

      describe('cssClasses', () => {
        it('should have "dx-checkbox" class', () => {
          expect(new CheckBox({}).cssClasses)
            .toEqual(expect.stringMatching('dx-checkbox'));
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
      });
    });

    describe('focusStateEnabled', () => {
      afterEach(() => jest.resetAllMocks());

      it('should be true on desktop', () => {
        (devices.real as Mock).mockImplementation(() => ({ deviceType: 'desktop' }));
        (devices.isSimulator as Mock).mockImplementation(() => false);

        expect(new CheckBoxProps()).toMatchObject({ focusStateEnabled: true });
      });

      it('should be false is simulator', () => {
        (devices.real as Mock).mockImplementation(() => ({ deviceType: 'desktop' }));
        (devices.isSimulator as Mock).mockImplementation(() => true);

        expect(new CheckBoxProps()).toMatchObject({ focusStateEnabled: false });
      });

      it('should be false on not desktop', () => {
        (devices.real as Mock).mockImplementation(() => ({ deviceType: 'modile' }));
        (devices.isSimulator as Mock).mockImplementation(() => true);

        expect(new CheckBoxProps()).toMatchObject({ focusStateEnabled: false });
      });
    });
  });
});
