/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { viewFunction as OverlayView, OverlayProps, Overlay } from '../overlay';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyOverlay from '../../../../ui/overlay/ui.overlay';

jest.mock('../../../../ui/overlay/ui.overlay', () => jest.fn());

describe('Overlay', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new OverlayProps();
      const props = {
        props: componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Overlay>;
      const tree = shallow(<OverlayView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyOverlay,
        'rest-attributes': 'true',
      });
    });
  });
});
