/* eslint-disable jest/no-standalone-expect */
import * as React from 'react';
import { RefObject } from '@devextreme-generator/declarations';
import each from 'jest-each';
import { mount } from 'enzyme';

import { Widget } from '../../../common/widget';
import { Editor, viewFunction } from '../editor';
import { ValidationMessage } from '../../../overlays/validation_message';

describe('Editor', () => {
  describe('Render', () => {
    it('should pass all necessary properties to Widget', () => {
      const renderOptions = {
        aria: { role: 'aria' },
      };
      const onWidgetKeyDown = (): null => null;
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
        onKeyDown: onWidgetKeyDown,
      };
      const cssClasses = 'cssClasses';
      const restAttributes = { attr1: 'value1', attr2: 'value2' };
      const target = {};
      const checkBox = mount(viewFunction({
        rootElementRef: target,
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
        const ref = { current: {} } as RefObject<HTMLDivElement>;
        const validationErrors = [{ message: 'error message' }];
        const CustomTree = ({ target }: any) => (
          <div ref={ref}>
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
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('updateValidationMessageVisibility', () => {
        it('should set showValidationMessage to true when isValid=false, validationStatus="invalid" and there are validation errors', () => {
          const editor = new Editor({
            isValid: false,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });

          editor.updateValidationMessageVisibility();

          expect(editor.showValidationMessage).toBe(true);
        });

        it('should set showValidationMessage to false if there is no validation errors', () => {
          const editor = new Editor({
            isValid: false,
            validationStatus: 'invalid',
          });

          editor.updateValidationMessageVisibility();

          expect(editor.showValidationMessage).toBe(false);
        });

        it('should set showValidationMessage to false if validationStatus is not invalid but isValid=false', () => {
          const editor = new Editor({
            isValid: false,
            validationStatus: 'pending',
            validationErrors: [{ message: 'error message' }],
          });

          editor.updateValidationMessageVisibility();

          expect(editor.showValidationMessage).toBe(true);
        });

        it('should set showValidationMessage to false if isValid is true but validationStatus="invalid"', () => {
          const editor = new Editor({
            isValid: true,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });

          editor.updateValidationMessageVisibility();

          expect(editor.showValidationMessage).toBe(true);
        });
      });
    });

    describe('Methods', () => {
      describe('focus', () => {
        it('should focus main element', () => {
          const editor = new Editor({});
          editor.widgetRef = { current: { focus: jest.fn() } } as unknown as RefObject<Widget>;
          editor.focus();

          expect(editor.widgetRef.current?.focus).toHaveBeenCalledTimes(1);
          expect(editor.widgetRef.current?.focus).toHaveBeenCalledWith();
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

        /* eslint-disable spellcheck/spell-checker */
        it('should have no "describedby" when widget is valid', () => {
          expect(new Editor({}).aria)
            .not.toHaveProperty('describedby');
        });

        it('should have no "describedby" when widget "validationStatus" is not "invalid"', () => {
          expect(new Editor({ isValid: false, validationStatus: 'pending' }).aria)
            .not.toHaveProperty('describedby');
        });

        it('should have no "describedby" when there is no validation errors', () => {
          expect(new Editor({ isValid: false, validationStatus: 'invalid' }).aria)
            .not.toHaveProperty('describedby');
        });

        it('should have "describedby" when widget is invalid', () => {
          const { aria } = new Editor({
            isValid: false,
            validationStatus: 'invalid',
            validationErrors: [{ message: 'error message' }],
          });
          expect(aria.describedby).not.toBeUndefined();
        });
        /* eslint-enable spellcheck/spell-checker */
      });

      describe('targetCurrent', () => {
        it('should return "this.target.current" value when it is specified', () => {
          const editor = new Editor({});
          const expectedCurrent = {};
          const ref = { current: expectedCurrent } as RefObject<HTMLDivElement>;
          editor.target = ref;

          expect(editor.targetCurrent).toEqual(expectedCurrent);
        });

        it('should return undefined when target is not specified', () => {
          const editor = new Editor({});

          expect(editor.targetCurrent).toEqual(undefined);
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
    });
  });
});
