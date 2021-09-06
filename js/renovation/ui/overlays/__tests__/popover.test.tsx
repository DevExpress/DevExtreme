/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as PopoverView, PopoverProps, Popover } from '../popover';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyPopover from '../../../../ui/popover';

jest.mock('../../../../ui/popover', () => jest.fn());

describe('Popover', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new PopoverProps();
      const props = {
        props: componentProps,
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
    describe('Events', () => {
      it('should not fail if ref has no "current"', () => {
        const toolbar: any = new Popover({
          ...new PopoverProps(),
          visible: true,
        });

        toolbar.wrapperRef = {};

        toolbar.saveInstance();
      });

      it('should set the "onHiding" event listener', () => {
        const mockCallback = jest.fn();
        const toolbar: any = new Popover({
          ...new PopoverProps(),
          visible: true,
        });

        toolbar.wrapperRef = {
          current: {
            getInstance: () => ({ option: mockCallback }),
          },
        };

        toolbar.saveInstance();

        toolbar.setListeners();
        expect(mockCallback).toBeCalledTimes(1);

        mockCallback.mock.calls[0][1]();
        expect(toolbar.props.visible).toBe(false);
      });
    });
  });
});
