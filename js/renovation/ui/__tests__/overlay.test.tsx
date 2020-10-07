/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { mount } from 'enzyme';
import DxOverlay from '../../../ui/overlay';
import { viewFunction as OverlayView, OverlayProps, Overlay } from '../overlay';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/overlay', () => jest.fn());

describe('Overlay', () => {
  describe('View', () => {
    it('default render', () => {
      const props = {
        props: new OverlayProps(),
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Overlay>;
      const tree = mount(<OverlayView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps: props.props,
        componentType: DxOverlay,
        'rest-attributes': 'true',
      });
    });
  });
});
