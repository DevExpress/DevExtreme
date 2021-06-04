/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { createTestRef } from '../../test_utils/create_ref';
import LegacyOverlay from '../../../ui/overlay/ui.overlay';
import { viewFunction as OverlayView, OverlayProps, Overlay } from '../overlay';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/overlay/ui.overlay', () => jest.fn());

describe('Overlay', () => {
  describe('View', () => {
    it('default render', () => {
      const rootElementRef = createTestRef();
      const componentProps = new OverlayProps();
      const props = {
        props: { rootElementRef },
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Overlay>;
      const tree = shallow(<OverlayView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        rootElementRef: {},
        componentProps,
        componentType: LegacyOverlay,
        'rest-attributes': 'true',
      });
    });
  });

  describe('Logic', () => {
    it('componentProps', () => {
      const props = new OverlayProps();
      const validationMessage = new Overlay({ ...props });

      expect(validationMessage.componentProps).toMatchObject(props);
    });
  });
});
