/* eslint-disable jest/no-standalone-expect */
import * as React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import devices from '../../../../core/devices';
import { convertRulesToOptions } from '../../../../core/options/utils';
import getElementComputedStyle from '../../../utils/get_computed_style';
import { current } from '../../../../ui/themes';
import {
  clear as clearEventHandlers,
} from '../../../test_utils/events_mock';
import {
  CheckBox, CheckBoxProps, defaultOptionRules, viewFunction,
} from '../check_box';
import { Editor } from '../internal/editor';

interface Mock extends jest.Mock {}

jest.mock('../../../utils/get_computed_style');

jest.mock('../../overlays/validation_message', () => ({ ValidationMessage: () => null }));

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  const isSimulator = actualDevices.isSimulator.bind(actualDevices);
  const real = actualDevices.real.bind(actualDevices);

  actualDevices.isSimulator = jest.fn(isSimulator);
  actualDevices.real = jest.fn(real);

  return actualDevices;
});

jest.mock('../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../ui/themes'),
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
      expect(checkBox.find('.dx-checkbox-container .dx-checkbox-icon').exists()).toBe(true);
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
        validationError: { message: 'error' },
        validationErrors: [],
        validationStatus: 'valid',
      };
      const cssClasses = 'cssClasses';
      const restAttributes = { attr1: 'value1', attr2: 'value2' };
      const onWidgetKeyDown = (): null => null;
      const onWidgetClick = (): null => null;
      const checkBox = mount(viewFunction({
        ...renderOptions,
        props: renderProps,
        restAttributes,
        cssClasses,
        onWidgetKeyDown,
        onWidgetClick,
      } as any));
      expect(checkBox.find(Editor).props()).toMatchObject({
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

      describe('updateIconFontSize', () => {
        it('should set icon font size on init', () => {
          const checkBox = new CheckBox({ iconSize: 22 });
          checkBox.iconRef = { current: { style: {} } } as any;
          const icon = checkBox.iconRef.current;

          checkBox.updateIconFontSize();

          expect(icon?.style.fontSize).toEqual('16px');
        });

        it('should change icon font size after runtime changing "iconSize" option', () => {
          const checkBox = new CheckBox({ iconSize: 22 });
          checkBox.iconRef = { current: { style: {} } } as any;
          const icon = checkBox.iconRef.current;

          checkBox.updateIconFontSize();
          checkBox.props.iconSize = 16;

          checkBox.updateIconFontSize();

          expect(icon?.style.fontSize).toEqual('12px');
        });

        it('should set default generic theme font-size if theme is not defined (e.g. in SSR)', () => {
          (current as Mock).mockImplementation(() => undefined);
          const checkBox = new CheckBox({ iconSize: 22 });
          checkBox.iconRef = React.createRef() as any;
          checkBox.iconRef.current = {
            style: {},
          } as any;
          const icon = checkBox.iconRef.current;

          checkBox.updateIconFontSize();

          expect(icon?.style.fontSize).toEqual('16px');
        });

        each(['material', 'generic', 'material-compact', 'generic-compact'])
          .it('should set fontSize properly for "%s" theme when iconSize is defined', (theme) => {
            (current as Mock).mockImplementation(() => theme);
            let iconSize = theme === 'material' ? 18 : 22;
            if (theme.includes('compact')) {
              iconSize = 16;
            }

            const checkBox = new CheckBox({ iconSize });
            checkBox.iconRef = React.createRef() as any;
            checkBox.iconRef.current = { style: {} } as any;
            const icon = checkBox.iconRef.current;

            checkBox.updateIconFontSize();

            const iconFontSizeRatio = theme.includes('compact') ? 12 / iconSize : 16 / iconSize;
            const expectedValue = `${Math.ceil(iconFontSizeRatio * iconSize)}px`;

            expect(icon?.style.fontSize).toEqual(expectedValue);
          });

        each(['material-compact', 'generic-compact', 'material', 'generic'])
          .it('should set fontSize properly for "%s" theme when iconSize is undefined', (theme) => {
            (current as Mock).mockImplementation(() => theme);

            let iconSize = theme === 'material' ? 18 : 22;
            if (theme.includes('compact')) {
              iconSize = 16;
            }

            (getElementComputedStyle as jest.Mock).mockReturnValue({
              width: iconSize,
              height: iconSize,
            });

            const checkBox = new CheckBox({});
            checkBox.iconRef = React.createRef() as any;
            checkBox.iconRef.current = { style: {} } as any;
            const icon = checkBox.iconRef.current;

            checkBox.updateIconFontSize();

            const iconFontSizeRatio = theme.includes('compact') ? 12 / iconSize : 16 / iconSize;
            const expectedValue = `${Math.ceil(iconFontSizeRatio * iconSize)}px`;

            expect(icon?.style.fontSize).toEqual(expectedValue);
          });

        it("should correctly change icon font size if 'iconSize' option is defined in pixels string", () => {
          (getElementComputedStyle as jest.Mock).mockReturnValue({ width: '22px', height: '22px' });

          const checkBox = new CheckBox({ iconSize: '22px' });
          checkBox.iconRef = React.createRef() as any;
          checkBox.iconRef.current = {
            style: {},
          } as any;
          checkBox.updateIconFontSize();

          const icon = checkBox.iconRef.current;
          expect(icon?.style.fontSize).toEqual('16px');
        });

        it("should use default icon size if 'getElementComputedStyle' util returns null", () => {
          (getElementComputedStyle as jest.Mock).mockReturnValue(null);

          const checkBox = new CheckBox({});
          checkBox.iconRef = React.createRef() as any;
          checkBox.iconRef.current = { style: {} } as any;
          checkBox.updateIconFontSize();

          const icon = checkBox.iconRef.current;
          expect(icon?.style.fontSize).toEqual('16px');
        });
      });

      describe('Events', () => {
        describe('Widget', () => {
          describe('Key down', () => {
            it('should call onKeyDown callback by Widget key down', () => {
              const onKeyDown = jest.fn(() => ({ cancel: true }));
              const originalEvent = {} as Event & { cancel: boolean };
              const options = { keyName: '', which: '', originalEvent };
              const checkBox = new CheckBox({ onKeyDown });
              checkBox.onWidgetKeyDown(options);
              expect(onKeyDown).toHaveBeenCalledTimes(1);
              expect(onKeyDown).toHaveBeenCalledWith(options);
            });

            it('should prevent key down event processing if onKeyDown event handler returns event.cancel="true"', () => {
              const onKeyDown = jest.fn(() => ({ cancel: true }));
              const onClick = jest.fn();
              const originalEvent = {} as Event & { cancel: boolean };
              const options = { keyName: 'enter', which: '', originalEvent };
              const checkBox = new CheckBox({ onKeyDown, onClick });
              checkBox.onWidgetKeyDown(options);
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
              checkBox.onWidgetKeyDown(options);
              expect(options.originalEvent.preventDefault).toBeCalled();
              expect(checkBox.onWidgetClick).toHaveBeenCalled();
            });

            it('should not simulate click by keys down except space', () => {
              const onClick = jest.fn();
              const checkBox = new CheckBox({ onClick });
              const originalEvent = {} as Event & { cancel: boolean };
              checkBox.onWidgetKeyDown({ keyName: 'enter', which: 'enter', originalEvent });
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
          });
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('icon styles', () => {
        it('should have "width","height" styles', () => {
          const checkBox = new CheckBox({ iconSize: 22 });

          checkBox.updateIconFontSize();

          expect(checkBox.iconStyles).toMatchObject({ width: '22px', height: '22px' });
        });

        each([22, '22px'])
          .it('should convert "%s" in "22px"', (value) => {
            expect(new CheckBox({
              iconSize: value,
            }).iconStyles).toMatchObject({ width: '22px', height: '22px' });
          });

        each(['50%', '1em', 'auto'])
          .it('should apply "%s" as it is', (value) => {
            expect(new CheckBox({
              iconSize: value, width: 44, height: 44,
            }).iconStyles).toMatchObject({ width: value, height: value });
          });
      });

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

    describe('Default options', () => {
      const getDefaultOptions = (): CheckBoxProps => Object.assign(new CheckBoxProps(),
        convertRulesToOptions(defaultOptionRules));

      beforeEach(() => {
        (devices.real as Mock).mockImplementation(() => ({ deviceType: 'desktop' }));
        (devices.isSimulator as Mock).mockImplementation(() => false);
        (current as Mock).mockImplementation(() => 'generic');
      });

      afterEach(() => jest.resetAllMocks());

      describe('focusStateEnabled', () => {
        it('should be false if device is not desktop', () => {
          (devices.real as Mock).mockImplementation(() => ({ deviceType: 'android' }));
          expect(getDefaultOptions().focusStateEnabled).toBe(false);
        });

        it('should be true on desktop and not simulator', () => {
          expect(getDefaultOptions().focusStateEnabled).toBe(true);
        });

        it('should be false on simulator', () => {
          (devices.isSimulator as Mock).mockImplementation(() => true);
          expect(getDefaultOptions().focusStateEnabled).toBe(false);
        });
      });
    });
  });
});
