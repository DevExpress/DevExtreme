import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as PopoverView, PopoverProps, Popover } from '../popover';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyPopover from '../../../../ui/popover/ui.popover';

jest.mock('../../../../ui/popover/ui.popover', () => jest.fn());

describe('Popover', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new PopoverProps();
      const props = {
        componentProps: { restProps: componentProps },
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Popover>;
      const tree = shallow(<PopoverView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyPopover,
        'rest-attributes': 'true',
      });
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      describe('saveInstance', () => {
        it('should save instance', () => {
          const mockCallback = jest.fn();
          const popover: any = new Popover({
            ...new PopoverProps(),
            visible: true,
          });
          const instance = { option: mockCallback };

          popover.domComponentWrapperRef = {
            current: {
              getInstance: () => instance,
            },
          };

          popover.saveInstance();
          expect(popover.instance).toEqual(instance);
        });

        it('should not fail if ref has no "current"', () => {
          const popover: any = new Popover({
            ...new PopoverProps(),
            visible: true,
          });
          popover.domComponentWrapperRef = {};

          expect(() => { popover.saveInstance(); }).not.toThrow();
        });
      });

      describe('setHideEventListener', () => {
        it('should set the "onHiding" event listener to instance', () => {
          const mockCallback = jest.fn();
          const popover: any = new Popover({
            ...new PopoverProps(),
            visible: true,
          });

          popover.instance = { option: mockCallback };

          popover.setHideEventListener();
          expect(mockCallback).toBeCalledTimes(1);
        });

        it('should set correct "onHiding" event', () => {
          const mockCallback = jest.fn();
          const popover: any = new Popover({
            ...new PopoverProps(),
            visible: true,
          });

          popover.instance = { option: mockCallback };

          popover.setHideEventListener();
          const onHiding = mockCallback.mock.calls[0][1];
          onHiding();

          expect(popover.props.visible).toBe(false);
        });
      });
    });
  });
});
