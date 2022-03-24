import React from 'react';
import { shallow } from 'enzyme';
import { Switch, SwitchProps, viewFunction as SwitchView } from '../switch';
import { Editor } from '../editor_wrapper';
import LegacySwitch from '../../../../ui/switch';

jest.mock('../../../../ui/switch', () => jest.fn());

describe('Switch', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new SwitchProps();
      const props = {
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Switch>;
      const tree = shallow(<SwitchView {...props as any} /> as any);

      expect(tree.find(Editor).props()).toMatchObject({
        componentProps,
        componentType: LegacySwitch,
        'rest-attributes': 'true',
      });
    });
  });
});
