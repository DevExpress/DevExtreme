/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef } from 'react';
import { mount, shallow } from 'enzyme';
import DxNumberBox from '../../../ui/number_box';
import { viewFunction as NumberBoxView, NumberBoxProps, NumberBox } from '../number_box';

jest.mock('../../../ui/number_box');

describe('NumberBox', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('View', () => {
    it('default render', () => {
      const widgetRef = createRef();
      const props = {
        props: new NumberBoxProps(),
        widgetRef,
        restAttributes: { 'rest-attributes': 'true' },
      } as any as Partial<NumberBox>;
      const tree = mount<typeof NumberBoxView>(<NumberBoxView {...props as any} /> as any);

      expect(tree.find('div').props()).toEqual({
        className: '',
        'rest-attributes': 'true',
      });
      expect(tree.find('div').instance()).toBe(widgetRef.current);
    });

    it('set className', () => {
      const props = {
        props: {
          className: 'custom-class',
        },
      } as any as Partial<NumberBox>;

      const tree = shallow<NumberBox>(<NumberBoxView {...props as any} /> as any);

      expect(tree.props().className).toEqual('custom-class');
    });
  });

  describe('Logic', () => {
    it('getHtmlElement', () => {
      const widgetRef = {} as HTMLDivElement;
      const component = new NumberBox({});
      component.widgetRef = widgetRef;

      expect(component.getHtmlElement()).toEqual(widgetRef);
    });

    describe('properties', () => {
      it('picks props except valueChange', () => {
        const component = new NumberBox({
          valueChange: () => { },
          tabIndex: 2,
          disabled: true,
        });

        const { properties } = component;

        expect('valueChange' in properties).toStrictEqual(false);
        expect(properties.tabIndex).toStrictEqual(2);
        expect(properties.disabled).toStrictEqual(true);
      });

      it('default onValueChange', () => {
        const component = new NumberBox(new NumberBoxProps());

        const { onValueChanged } = component.properties;

        expect(onValueChanged!({ value: 5 })).toStrictEqual(undefined);
      });

      it('onValueChange wraps valueChange prop', () => {
        const fn = jest.fn();
        const component = new NumberBox({ valueChange: fn });
        const { onValueChanged } = component.properties;

        onValueChanged!({ value: 5 });

        expect(fn.mock.calls).toEqual([[5]]);
      });
    });

    describe('effects', () => {
      const widgetRef = {} as HTMLDivElement;
      const createWidget = () => {
        const component = new NumberBox({});
        component.widgetRef = widgetRef;
        return component;
      };

      it('setupWidget', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.setupWidget();

        expect(DxNumberBox).toBeCalledTimes(1);
        expect(DxNumberBox).toBeCalledWith(widgetRef, spy.mock.results[0].value);
      });

      it('setupWidget returns dispose widget callback', () => {
        const component = createWidget();
        const dispose = component.setupWidget();

        dispose();

        expect((DxNumberBox as any).mock.instances[0].dispose).toBeCalledTimes(1);
      });

      it('updateWidget. Widget is not initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.updateWidget();

        expect(DxNumberBox).toBeCalledTimes(0);
        expect(spy).toBeCalledTimes(0);
      });

      it('updateWidget. Widget is initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');
        (DxNumberBox as any).getInstance.mockReturnValue(new DxNumberBox('ref' as any as Element, {}));

        component.updateWidget();

        const DxNumberBoxMockInstance = (DxNumberBox as any).mock.instances[0];
        expect(DxNumberBoxMockInstance.option).toBeCalledWith(spy.mock.results[0].value);
      });
    });
  });
});
