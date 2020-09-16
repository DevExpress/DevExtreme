/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef } from 'react';
import { mount } from 'enzyme';
import DxValidationMessage from '../../../ui/validationMessage';
import { viewFunction as ValidationMessageView, ValidationMessageProps, ValidationMessage } from '../validationMessage';

jest.mock('../../../ui/validationMessage');

describe('ValidationMessage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('View', () => {
    it('default render', () => {
      const widgetRef = createRef();
      const props = {
        props: new ValidationMessageProps(),
        widgetRef,
        restAttributes: { 'rest-attributes': 'true' },
      } as any as Partial<ValidationMessage>;
      const tree = mount<
            typeof ValidationMessageView>(<ValidationMessageView {...props as any} /> as any);

      expect(tree.find('div').instance()).toBe(widgetRef.current);
    });
  });

  describe('Logic', () => {
    describe('properties', () => {
      it('picks props', () => {
        const validationErrors = [{ message: 'error message' }];
        const element = '#container';
        const component = new ValidationMessage({
          validationErrors,
          tabIndex: 2,
          disabled: true,
          boundary: element,
          mode: 'always',
          positionRequest: 'below',
        });

        const { properties } = component;

        expect(properties.validationErrors).toEqual(validationErrors);
        expect(properties.tabIndex).toStrictEqual(2);
        expect(properties.disabled).toStrictEqual(true);
        expect(properties.boundary).toStrictEqual(element);
        expect(properties.mode).toStrictEqual('always');
        expect(properties.positionRequest).toStrictEqual('below');
      });
    });

    describe('effects', () => {
      const widgetRef = {} as HTMLDivElement;
      const createWidget = () => {
        const component = new ValidationMessage({});
        component.widgetRef = widgetRef;
        return component;
      };

      it('setupWidget', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.setupWidget();

        expect(DxValidationMessage).toBeCalledTimes(1);
        expect(DxValidationMessage).toBeCalledWith(widgetRef, spy.mock.results[0].value);
      });

      it('setupWidget returns dispose widget callback', () => {
        const component = createWidget();
        const dispose = component.setupWidget();

        dispose();

        expect((DxValidationMessage as any).mock.instances[0].dispose).toBeCalledTimes(1);
      });

      it('updateWidget. Widget is not initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.updateWidget();

        expect(DxValidationMessage).toBeCalledTimes(0);
        expect(spy).toBeCalledTimes(0);
      });

      it('updateWidget. Widget is initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');
        (DxValidationMessage as any).getInstance.mockReturnValue(new DxValidationMessage('ref' as any as Element, {}));

        component.updateWidget();

        const DxValidationMessageMockInstance = (DxValidationMessage as any).mock.instances[0];
        expect(DxValidationMessageMockInstance.option).toBeCalledWith(spy.mock.results[0].value);
      });
    });
  });
});
