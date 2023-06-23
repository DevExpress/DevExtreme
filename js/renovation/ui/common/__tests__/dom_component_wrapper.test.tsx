/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef } from 'react';
import { mount, shallow } from 'enzyme';
import { RefObject } from '@devextreme-generator/declarations';
// eslint-disable-next-line import/no-relative-packages
import { renderTemplate } from '../../../../../node_modules/@devextreme/runtime/cjs/declarations/index';
import { DomComponentWrapper, DomComponentWrapperProps, viewFunction as DomComponentWrapperView } from '../dom_component_wrapper';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getUpdatedOptions } from '../utils/get_updated_options';

jest.mock('../../../../../node_modules/@devextreme/runtime/esm/declarations/index', () => ({ hasTemplate: jest.fn(() => true), renderTemplate: jest.fn() }));
jest.mock('../../../../../node_modules/@devextreme/runtime/cjs/declarations/index', () => ({ hasTemplate: jest.fn(() => true), renderTemplate: jest.fn() }));

jest.mock('../utils/get_updated_options', () => {
  const defaultImplementation = jest.requireActual('../utils/get_updated_options');
  return defaultImplementation;
});

describe('DomComponentWrapper', () => {
  describe('View', () => {
    it('default render', () => {
      const widgetRef = createRef();
      const props = {
        props: {
          componentProps: {},
        },
        widgetRef,
        restAttributes: { 'rest-attributes': 'true' },
      } as any as Partial<DomComponentWrapper>;
      const tree = mount(
        <DomComponentWrapperView {...props as any} /> as any,
      );

      expect(tree.find('div').props()).toEqual({
        'rest-attributes': 'true',
      });
      expect(tree.find('div').instance()).toBe(widgetRef.current);
    });

    it('set className', () => {
      const props = {
        props: {
          componentProps: {
            className: 'custom-class',
          },
        },
      } as Partial<DomComponentWrapperProps>;

      const tree = shallow(<DomComponentWrapperView {...props as any} /> as any);

      expect((tree.props() as any).className).toEqual('custom-class');
    });
  });

  describe('Logic', () => {
    describe('properties', () => {
      it('itemTemplate', () => {
        const component = new DomComponentWrapper({
          templateNames: ['itemTemplate'],
          componentProps: {
            itemTemplate: () => 'some Template',
            tabIndex: 2,
            disabled: true,
          },
        } as Partial<DomComponentWrapperProps> as any);

        const { properties } = component;
        expect(renderTemplate).not.toHaveBeenCalled();
        (properties as any).itemTemplate();
        expect(renderTemplate).toHaveBeenCalledTimes(1);
        expect('itemTemplate' in properties).toStrictEqual(true);
        expect(properties.tabIndex).toStrictEqual(2);
        expect(properties.disabled).toStrictEqual(true);
      });

      it('haven`t template', () => {
        jest.resetAllMocks();
        const component = new DomComponentWrapper({
          templateNames: ['itemTemplate'],
          componentProps: {
            itemTemplate: () => 'some Template',
          },
        } as Partial<DomComponentWrapperProps> as any);

        const { properties } = component;
        expect(renderTemplate).not.toHaveBeenCalled();
        (properties as any).itemTemplate();
        expect(renderTemplate).not.toHaveBeenCalled();
      });

      it('picks props except valueChange', () => {
        const component = new DomComponentWrapper({
          templateNames: [],
          componentProps: {
            valueChange: () => { },
            tabIndex: 2,
            disabled: true,
          },
        } as Partial<DomComponentWrapperProps> as any);

        const { properties } = component;

        expect('valueChange' in properties).toStrictEqual(false);
        expect(properties.tabIndex).toStrictEqual(2);
        expect(properties.disabled).toStrictEqual(true);
      });

      describe('rtlEnabled', () => {
        it('get from props', () => {
          const component = new DomComponentWrapper({
            templateNames: [],
            componentProps: { rtlEnabled: true },
          } as Partial<DomComponentWrapperProps> as any);
          component.config = { rtlEnabled: false };
          expect(component.properties.rtlEnabled).toBe(true);
        });

        it('get from context', () => {
          const component = new DomComponentWrapper({
            templateNames: [],
            componentProps: {},
          } as Partial<DomComponentWrapperProps> as any);
          component.config = { rtlEnabled: true };
          expect(component.properties.rtlEnabled).toBe(true);
        });

        it('should be undefined', () => {
          const component = new DomComponentWrapper({
            templateNames: [],
            componentProps: {},
          } as Partial<DomComponentWrapperProps> as any);
          expect(component.properties.rtlEnabled).toBe(false);
        });

        it('should be false when it is passed as undefined', () => {
          const component = new DomComponentWrapper({
            templateNames: [],
            componentProps: { rtlEnabled: undefined },
          } as any);

          expect(component.properties)
            .toEqual({
              isRenovated: true,
              rtlEnabled: false,
            });
        });
      });

      it('default onValueChange', () => {
        const component = new DomComponentWrapper({
          templateNames: [],
          componentProps: {},
        } as Partial<DomComponentWrapperProps> as any);

        const { onValueChanged } = component.properties;

        expect(onValueChanged).toBeUndefined();
      });

      it('onValueChange wraps valueChange prop', () => {
        const fn = jest.fn();
        const component = new DomComponentWrapper({
          templateNames: [],
          componentProps: { valueChange: fn },
        } as Partial<DomComponentWrapperProps> as any);
        const { onValueChanged } = component.properties;

        (onValueChanged as ((e: { value: number }) => any))({ value: 5 });

        expect(fn.mock.calls).toEqual([[5]]);
      });

      it('should remove undefined properties', () => {
        const component = new DomComponentWrapper({
          templateNames: [],
          componentProps: { valueChange: undefined },
        } as any);

        expect(component.properties)
          .toEqual({
            isRenovated: true,
            rtlEnabled: false,
          });
      });
    });

    describe('effects', () => {
      beforeEach(() => {
        jest.resetAllMocks();
      });

      const DomComponentMock = jest.fn();
      const createWidget = () => {
        const component = new DomComponentWrapper({
          componentProps: {},
          componentType: DomComponentMock as any,
          templateNames: [],
        } as DomComponentWrapperProps);
        return component;
      };

      it('setupWidget', () => {
        const widgetRef = { current: {} } as RefObject<HTMLDivElement>;
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');
        component.widgetRef = widgetRef;

        component.setupWidget();

        expect(DomComponentMock).toHaveBeenCalledTimes(1);
        expect(DomComponentMock).toHaveBeenCalledWith(widgetRef.current, spy.mock.results[0].value);
      });

      it('setupWidget returns dispose widget callback', () => {
        const disposeDom = jest.fn();
        DomComponentMock.mockImplementation(() => ({ dispose: disposeDom }));

        const component = createWidget();
        component.widgetRef = { current: {} } as RefObject<HTMLDivElement>;
        const dispose = component.setupWidget();
        dispose();

        expect((disposeDom as any).mock.instances[0].dispose).toHaveBeenCalledTimes(1);
      });

      it('updateWidget. Widget is not initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.updateWidget();

        expect(DomComponentMock).toHaveBeenCalledTimes(0);
        expect(spy).toHaveBeenCalledTimes(0);
      });

      it('updateWidget. Widget is initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');
        const instance = { option: jest.fn(), beginUpdate: jest.fn(), endUpdate: jest.fn() };
        component.instance = instance as any;

        component.updateWidget();

        expect(instance.beginUpdate).toHaveBeenCalledTimes(1);
        expect(spy.mock.results[0].value).toEqual(component.properties);
        expect(instance.endUpdate).toHaveBeenCalledTimes(1);
      });

      it('updateWidget. Properties are not changed', () => {
        const component = createWidget();
        const instance = { option: jest.fn(), beginUpdate: jest.fn(), endUpdate: jest.fn() };
        component.instance = instance as any;

        (getUpdatedOptions as jest.Mock) = jest.fn(() => []);
        component.updateWidget();

        expect(instance.beginUpdate).toHaveBeenCalledTimes(0);
        expect(instance.option).toHaveBeenCalledTimes(0);
        expect(instance.endUpdate).toHaveBeenCalledTimes(0);
      });

      it('updateWidget. Properties are changed', () => {
        const component = createWidget();
        const instance = { option: jest.fn(), beginUpdate: jest.fn(), endUpdate: jest.fn() };
        component.instance = instance as any;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (getUpdatedOptions as jest.Mock) = jest.fn(() => [
          { path: 'someProp', value: 'someValue' },
        ]);
        component.updateWidget();

        expect(instance.beginUpdate).toHaveBeenCalledTimes(1);
        expect(instance.option).toHaveBeenCalledWith('someProp', 'someValue');
        expect(instance.endUpdate).toHaveBeenCalledTimes(1);
      });
    });
  });
});
