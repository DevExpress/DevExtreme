import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TooltipView, TooltipProps, Tooltip } from '../tooltip';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyTooltip from '../../../../ui/tooltip';
import { BaseWidgetProps } from '../../common/base_props';

jest.mock('../../../../ui/tooltip', () => jest.fn());

describe('Tooltip', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new TooltipProps();
      const props = {
        componentProps: { restProps: componentProps },
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Tooltip>;
      const tree = shallow(<TooltipView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyTooltip,
        'rest-attributes': 'true',
      });
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      describe('saveInstance', () => {
        it('should save instance', () => {
          const mockCallback = jest.fn();
          const tooltip: any = new Tooltip({
            ...new TooltipProps(),
            visible: true,
          });
          const instance = { option: mockCallback };

          tooltip.domComponentWrapperRef = {
            current: {
              getInstance: () => instance,
            },
          };

          tooltip.saveInstance();
          expect(tooltip.instance).toEqual(instance);
        });

        it('should not fail if ref has no "current"', () => {
          const tooltip: any = new Tooltip({
            ...new TooltipProps(),
            visible: true,
          });

          tooltip.domComponentWrapperRef = {};

          expect(() => { tooltip.saveInstance(); }).not.toThrow();
        });
      });

      describe('setHideEventListener', () => {
        it('should set the "onHiding" event listener to instance', () => {
          const mockCallback = jest.fn();
          const tooltip: any = new Tooltip({
            ...new TooltipProps(),
            visible: true,
          });

          tooltip.instance = { option: mockCallback };

          tooltip.setHideEventListener();
          expect(mockCallback).toBeCalledTimes(1);
        });

        it('should set correct "onHiding" event', () => {
          const mockCallback = jest.fn();
          const tooltip: any = new Tooltip({
            ...new TooltipProps(),
            visible: true,
          });

          tooltip.instance = { option: mockCallback };

          tooltip.setHideEventListener();
          const onHiding = mockCallback.mock.calls[0][1];
          onHiding();

          expect(tooltip.props.visible).toBe(false);
        });
      });
    });
  });

  describe('Default options', () => {
    it('should define necessary properties', () => {
      const defaultProps = new TooltipProps();

      expect(defaultProps).toEqual({
        ...new BaseWidgetProps(),
        animation: {
          show: { type: 'fade', from: 0, to: 1 },
          hide: { type: 'fade', to: 0 },
        },
        hideOnOutsideClick: true,
        contentTemplate: 'content',
        deferRendering: true,
        disabled: false,
        wrapperAttr: {},
        focusStateEnabled: true,
        fullScreen: false,
        height: 'auto',
        hoverStateEnabled: false,
        maxHeight: null,
        maxWidth: null,
        minHeight: null,
        minWidth: null,
        position: 'bottom',
        rtlEnabled: false,
        shading: false,
        shadingColor: '',
        visible: true,
        width: 'auto',
      });
    });
  });
});
