import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as TooltipView, TooltipProps, Tooltip } from '../tooltip';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyTooltip from '../../../../ui/tooltip';

jest.mock('../../../../ui/tooltip', () => jest.fn());

describe('Tooltip', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new TooltipProps();
      const props = {
        props: componentProps,
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
});
