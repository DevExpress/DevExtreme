/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef } from 'react';
import { mount, shallow } from 'enzyme';
import { DomComponentWrapper, DomComponentWrapperProps, viewFunction as DomComponentWrapperView } from '../dom_component_wrapper';
import { renderTemplate } from '../../../utils/render_template';

jest.mock('../../../utils/render_template', () => ({ renderTemplate: jest.fn() }));

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
          componentProps: {
            itemTemplate: 'some template',
            tabIndex: 2,
            disabled: true,
          },
        } as Partial<DomComponentWrapperProps> as any);

        const { properties } = component;
        expect(renderTemplate).not.toBeCalled();
        (properties as any).itemTemplate();
        expect(renderTemplate).toBeCalledTimes(1);
        expect('itemTemplate' in properties).toStrictEqual(true);
        expect(properties.tabIndex).toStrictEqual(2);
        expect(properties.disabled).toStrictEqual(true);
      });

      it('picks props except valueChange', () => {
        const component = new DomComponentWrapper({
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
            componentProps: { rtlEnabled: true },
          } as Partial<DomComponentWrapperProps> as any);
          component.config = { rtlEnabled: false };
          expect(component.properties.rtlEnabled).toBe(true);
        });

        it('get from context', () => {
          const component = new DomComponentWrapper({
            componentProps: {},
          } as DomComponentWrapperProps);
          component.config = { rtlEnabled: true };
          expect(component.properties.rtlEnabled).toBe(true);
        });

        it('should be undefined', () => {
          const component = new DomComponentWrapper({
            componentProps: {},
          } as DomComponentWrapperProps);
          expect(component.properties.rtlEnabled).toBe(false);
        });
      });

      it('default onValueChange', () => {
        const component = new DomComponentWrapper({
          componentProps: {},
        } as DomComponentWrapperProps);

        const { onValueChanged } = component.properties;

        expect(onValueChanged).toBeUndefined();
      });

      it('onValueChange wraps valueChange prop', () => {
        const fn = jest.fn();
        const component = new DomComponentWrapper({
          componentProps: { valueChange: fn },
        } as Partial<DomComponentWrapperProps> as any);
        const { onValueChanged } = component.properties;

        (onValueChanged as Function)({ value: 5 });

        expect(fn.mock.calls).toEqual([[5]]);
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
        } as DomComponentWrapperProps);
        return component;
      };

      it('setupWidget', () => {
        const widgetRef = {} as HTMLDivElement;
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');
        component.widgetRef = widgetRef;

        component.setupWidget();

        expect(DomComponentMock).toBeCalledTimes(1);
        expect(DomComponentMock).toBeCalledWith(widgetRef, spy.mock.results[0].value);
      });

      it('setupWidget returns dispose widget callback', () => {
        const disposeDom = jest.fn();
        DomComponentMock.mockImplementation(() => ({ dispose: disposeDom }));

        const component = createWidget();
        const dispose = component.setupWidget();
        dispose();

        expect((disposeDom as any).mock.instances[0].dispose).toBeCalledTimes(1);
      });

      it('updateWidget. Widget is not initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.updateWidget();

        expect(DomComponentMock).toBeCalledTimes(0);
        expect(spy).toBeCalledTimes(0);
      });

      it('updateWidget. Widget is initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');
        const instance = { option: jest.fn() };
        component.instance = instance as any;

        component.updateWidget();

        expect(instance.option).toBeCalledWith(spy.mock.results[0].value);
      });

      it('setRootElementRef, set rootElementRef to div ref', () => {
        const widgetRef = {} as HTMLDivElement;
        const component = new DomComponentWrapper({
          rootElementRef: {} as HTMLDivElement,
        } as DomComponentWrapperProps);
        component.widgetRef = widgetRef;
        component.setRootElementRef();

        expect(component.props.rootElementRef).toBe(component.widgetRef);
      });

      it('setRootElementRef, hasnt rootElementRef', () => {
        const component = new DomComponentWrapper({ } as DomComponentWrapperProps);
        component.widgetRef = {} as HTMLDivElement;
        component.setRootElementRef();
        expect(component.props.rootElementRef).toBeUndefined();
      });
    });
  });
});
