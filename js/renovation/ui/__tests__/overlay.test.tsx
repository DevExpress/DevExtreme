/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef } from 'react';
import { mount } from 'enzyme';
import DxOverlay from '../../../ui/overlay';
import { viewFunction as OverlayView, OverlayProps, Overlay } from '../overlay';

jest.mock('../../../ui/overlay');

describe('Overlay', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('View', () => {
    it('default render', () => {
      const widgetRef = createRef();
      const props = {
        props: new OverlayProps(),
        widgetRef,
      } as any as Partial<Overlay>;
      const tree = mount<
            typeof OverlayView>(<OverlayView {...props as any} /> as any);

      expect(tree.find('div').instance()).toBe(widgetRef.current);
    });
  });

  describe('Logic', () => {
    describe('properties', () => {
      it('picks props', () => {
        const props = {
          integrationOptions: {},
          templatesRenderAsynchronously: false,
          shading: false,
          width: 100,
          height: 200,
          closeOnOutsideClick: true,
          closeOnTargetScroll: true,
          animation: null,
          visible: true,
          container: '#container',
          propagateOutsideClick: true,
          _checkParentVisibility: true,
          rtlEnabled: true,
          template: 'content template',
          maxWidth: 500,
        };

        const component = new Overlay(props);

        const { properties } = component;

        expect(properties).toEqual(props);
      });
    });

    describe('effects', () => {
      const widgetRef = {} as HTMLDivElement;
      const createWidget = () => {
        const component = new Overlay({});
        component.widgetRef = widgetRef;
        return component;
      };

      it('setupWidget', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.setupWidget();

        expect(DxOverlay).toBeCalledTimes(1);
        expect(DxOverlay).toBeCalledWith(widgetRef, spy.mock.results[0].value);
      });

      it('setupWidget returns dispose widget callback', () => {
        const component = createWidget();
        const dispose = component.setupWidget();

        dispose();

        expect((DxOverlay as any).mock.instances[0].dispose).toBeCalledTimes(1);
      });

      it('updateWidget. Widget is not initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');

        component.updateWidget();

        expect(DxOverlay).toBeCalledTimes(0);
        expect(spy).toBeCalledTimes(0);
      });

      it('updateWidget. Widget is initialized', () => {
        const component = createWidget();
        const spy = jest.spyOn(component, 'properties', 'get');
        (DxOverlay as any).getInstance.mockReturnValue(new DxOverlay('ref' as any as Element, {}));

        component.updateWidget();

        const DxOverlayMockInstance = (DxOverlay as any).mock.instances[0];
        expect(DxOverlayMockInstance.option).toBeCalledWith(spy.mock.results[0].value);
      });
    });
  });
});
