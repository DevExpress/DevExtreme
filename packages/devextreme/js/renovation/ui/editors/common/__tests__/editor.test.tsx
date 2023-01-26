/* eslint-disable jest/no-standalone-expect */
import * as React from 'react';
import { RefObject } from '@devextreme-generator/declarations';
import each from 'jest-each';
import { mount } from 'enzyme';

import { Widget } from '../../../common/widget';
import { Editor, viewFunction } from '../editor';
import { ValidationMessage } from '../../../overlays/validation_message';

jest.mock('../../../overlays/validation_message', () => ({ ValidationMessage: () => null }));

describe('Editor', () => {
  describe('Render', () => {
    it('should pass all necessary properties to Widget', () => {
      const renderOptions = {
        aria: { role: 'aria' },
      };
      const keyDown = (): null => null;
      const onWidgetClick = (): null => null;
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
        onClick: onWidgetClick,
        onKeyDown: keyDown,
      };
      const cssClasses = 'cssClasses';
      const restAttributes = { attr1: 'value1', attr2: 'value2' };
      const checkBox = mount(viewFunction({
        ...renderOptions,
        props: renderProps,
        restAttributes,
        cssClasses,
      } as any));
      expect(checkBox.find(Widget).props()).toMatchObject({
        ...renderOptions,
        ...renderProps,
        ...restAttributes,
        classes: cssClasses,
      });
    });

    describe('validation', () => {
      it('widget should pass correct props to validationMessage', () => {
        const rootElementRef = { current: {} } as RefObject<HTMLDivElement>;

        const validationErrors = [{ message: 'error message' }];
        const CustomTree = () => (
          <div>
            {viewFunction({
              validationMessageTarget: rootElementRef.current,
              validationErrors,
              props: {
                isValid: false,
                validationErrors,
                validationStatus: 'invalid',
                validationMessageMode: 'always',
                validationMessagePosition: 'bottom',
                rtlEnabled: false,
              },
              isValidationMessageVisible: true,
            } as any)}
          </div>
        );
        const tree = mount(<CustomTree />);

        const validationMessage = tree.find(ValidationMessage);
        const props = validationMessage.props();
        expect(props.visualContainer).toBe(rootElementRef.current);
        expect(props.target).toBe(rootElementRef.current);
        expect(props.boundary).toBe(rootElementRef.current);
        expect(props.positionSide).toBe('bottom');
        expect(props.mode).toBe('always');
        expect(props.rtlEnabled).toBe(false);
        expect(props.validationErrors).toEqual(validationErrors);
      });

      it('should render ValidationMessage if isValidationMessageVisible=true', () => {
        const CustomTree = () => (
          <div>
            {viewFunction({
              isValidationMessageVisible: true,
              props: {},
            } as any)}
          </div>
        );
        const tree = mount(<CustomTree />);

        const validationMessage = tree.find(ValidationMessage);
        expect(validationMessage.exists()).toBe(true);
      });

      it('should not render ValidationMessage if isValidationMessageVisible=false', () => {
        const CustomTree = () => (
          <div>
            {viewFunction({
              isValidationMessageVisible: false,
              props: {},
            } as any)}
          </div>
        );
        const tree = mount(<CustomTree />);

        const validationMessage = tree.find(ValidationMessage);
        expect(validationMessage.exists()).toBe(false);
      });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('updateValidationMessageVisibility', () => {
        it('should set isValidationMessageVisible to true if shouldShowValidationMessage is true', () => {
          const editor = new Editor({
            isValid: false,
            validationError: { message: 'error' },
          });

          editor.updateValidationMessageVisibility();

          expect(editor.isValidationMessageVisible).toEqual(true);
        });

        it('should set isValidationMessageVisible to false if shouldShowValidationMessage is false', () => {
          const editor = new Editor({});

          editor.updateValidationMessageVisibility();

          expect(editor.isValidationMessageVisible).toEqual(false);
        });
      });
    });

    describe('Methods', () => {
      describe('focus', () => {
        it('should call widget focus method', () => {
          const editor = new Editor({});
          editor.widgetRef = { current: { focus: jest.fn() } } as unknown as RefObject<Widget>;
          editor.focus();

          expect(editor.widgetRef.current?.focus).toHaveBeenCalledTimes(1);
          expect(editor.widgetRef.current?.focus).toHaveBeenCalledWith();
        });
      });

      describe('blur', () => {
        it('should call widget blur method', () => {
          const editor = new Editor({});
          editor.widgetRef = { current: { blur: jest.fn() } } as unknown as RefObject<Widget>;
          editor.blur();

          expect(editor.widgetRef.current?.blur).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('Events', () => {
      describe('FocusIn', () => {
        it('should raise onFocusIn prop event', () => {
          const onFocusIn = jest.fn();
          const editor = new Editor({ onFocusIn });
          const event = {} as Event;

          editor.onFocusIn(event);

          expect(onFocusIn).toHaveBeenCalledTimes(1);
        });

        it('should not raise any error if onFocusIn prop is not passed', () => {
          const editor = new Editor({});
          const event = {} as Event;

          expect(() => { editor.onFocusIn(event); }).not.toThrow();
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('validationErrors', () => {
        it('should return "validationErrors" props value when it is specified', () => {
          const validationErrors = [{ message: 'error message' }];
          expect(new Editor({ validationErrors }).validationErrors)
            .toEqual(validationErrors);
        });

        it('returned array should not be reference to a passed array', () => {
          const validationErrors = [{ message: 'error message' }];
          expect(new Editor({ validationErrors }).validationErrors)
            .not.toBe(validationErrors);
        });

        it('should return array with one element equal to "validationError" props value when "validationErrors" is not specified', () => {
          const validationError = { message: 'error message' };
          expect(new Editor({ validationError }).validationErrors)
            .toEqual([validationError]);
        });
      });

      describe('cssClasses', () => {
        it('should have "dx-invalid" class', () => {
          const editor = new Editor({
            isValid: false,
            validationError: { message: 'error' },
            validationStatus: 'invalid',
          });

          expect(editor.cssClasses).toContain('dx-invalid');
        });

        it('should have "dx-state-readonly" class', () => {
          const editor = new Editor({
            readOnly: true,
          });

          expect(editor.cssClasses).toContain('dx-state-readonly');
        });
      });

      describe('aria', () => {
        each([true, false])
          .it('should have "readonly=%s if readOnly=%s', (readOnly) => {
            expect(new Editor({ readOnly }).aria)
              .toMatchObject({ readonly: `${readOnly}` });
          });

        each([true, false])
          .it('should have "invalid=%s" if isValid=%s', (isValid: boolean) => {
            expect(new Editor({ isValid }).aria)
              .toMatchObject({ invalid: `${!isValid}` });
          });

        it('should have "describedBy" equal to validationMessageGuid if shouldShowValidationMessage=true', () => {
          const editor = new Editor({
            isValid: false,
            validationError: {},
          });

          editor.validationMessageGuid = 'guid';

          expect(editor.aria.describedBy).toBe('guid');
        });

        it('should not have "describedBy" if shouldShowValidationMessage=false', () => {
          const editor = new Editor({});

          expect(editor.aria).not.toHaveProperty('describedBy');
        });
      });

      describe('shouldShowValidationMessage', () => {
        it('should return true when isValid=false, validationStatus="invalid" and there are validation errors', () => {
          const editor = new Editor({
            isValid: false,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });

          expect(editor.shouldShowValidationMessage).toBe(true);
        });

        it('should return false if there is no validation errors', () => {
          const editor = new Editor({
            isValid: false,
            validationStatus: 'invalid',
          });

          expect(editor.shouldShowValidationMessage).toBe(false);
        });

        it('should return false if validationStatus not equal to "invalid" but isValid=false', () => {
          const editor = new Editor({
            isValid: false,
            validationStatus: 'pending',
            validationErrors: [{ message: 'error message' }],
          });

          expect(editor.shouldShowValidationMessage).toBe(true);
        });

        it('should return false if isValid is true but validationStatus="invalid', () => {
          const editor = new Editor({
            isValid: true,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });

          expect(editor.shouldShowValidationMessage).toBe(true);
        });
      });

      describe('validationMessageTarget', () => {
        it('should return roolElementRef.current', () => {
          const editor = new Editor({});
          editor.rootElementRef = { current: {} } as RefObject<HTMLDivElement>;

          expect(editor.validationMessageTarget).toEqual(editor.rootElementRef.current);
        });

        it('should not raise any error if rootElementRef is not initialized', () => {
          const editor = new Editor({});

          expect(() => editor.validationMessageTarget).not.toThrow();
        });
      });
    });
  });
});
