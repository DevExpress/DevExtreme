/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
    describe('Events', () => {
      it('should not fail if ref has no "current"', () => {
        const toolbar: any = new Tooltip({
          ...new TooltipProps(),
          visible: true,
        });

        toolbar.wrapperRef = {};

        toolbar.saveInstance();
      });

      it('should set the "onHiding" event listener', () => {
        const mockCallback = jest.fn();
        const toolbar: any = new Tooltip({
          ...new TooltipProps(),
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
