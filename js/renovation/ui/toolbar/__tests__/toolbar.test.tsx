import React from 'react';
import { shallow } from 'enzyme';
import { Toolbar, ToolbarProps, viewFunction as ToolbarView } from '../toolbar';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyToolbar from '../../../../ui/toolbar';

jest.mock('../../../../ui/number_box', () => jest.fn());

describe('Toolbar', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new ToolbarProps();
      const props = {
        props: componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Toolbar>;
      const tree = shallow(<ToolbarView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyToolbar,
        'rest-attributes': 'true',
      });
    });
  });
});
