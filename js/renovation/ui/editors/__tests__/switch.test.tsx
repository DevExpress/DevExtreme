import React from 'react';
import { shallow } from 'enzyme';
import { Switch, SwitchProps, viewFunction as SwitchView } from '../switch';
import { EditorStateProps } from '../common/editor_state_props';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacySwitch from '../../../../ui/switch';

jest.mock('../../../../ui/switch', () => jest.fn());

describe('Switch', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = { ...new SwitchProps(), ...new EditorStateProps() };
      const props = {
        componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Switch>;
      const tree = shallow(<SwitchView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacySwitch,
        'rest-attributes': 'true',
      });
    });
  });
});
