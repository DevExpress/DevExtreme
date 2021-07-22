import React from 'react';
import { shallow } from 'enzyme';
import { Toolbar, viewFunction as ToolbarView } from '../toolbar';
import {
  ToolbarItem, ToolbarButtonProps, ToolbarButtonGroupProps,
  ToolbarDropDownButtonProps, ToolbarProps, ToolbarTextBoxProps, ToolbarCheckBoxProps,
} from '../toolbar_props';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyToolbar from '../../../../ui/toolbar';

describe('Toolbar', () => {
  describe('View', () => {
    it('default render', () => {
      const buttonItem = new ToolbarItem();
      buttonItem.options = new ToolbarButtonProps();

      const buttonGroupItem = new ToolbarItem();
      buttonGroupItem.options = new ToolbarButtonGroupProps();

      const dropDownButtonItem = new ToolbarItem();
      dropDownButtonItem.options = new ToolbarDropDownButtonProps();

      const checkBoxItem = new ToolbarItem();
      checkBoxItem.options = new ToolbarCheckBoxProps();

      const textBoxItem = new ToolbarItem();
      textBoxItem.options = new ToolbarTextBoxProps();

      const componentProps = new ToolbarProps();
      componentProps.items = [buttonItem, buttonGroupItem, dropDownButtonItem];
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
