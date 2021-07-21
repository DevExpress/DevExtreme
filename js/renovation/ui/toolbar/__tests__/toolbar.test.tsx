import React from 'react';
import { shallow } from 'enzyme';
import { Toolbar, viewFunction as ToolbarView } from '../toolbar';
import { ToolbarItem, ToolbarProps } from '../toolbar_props';
import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import LegacyToolbar from '../../../../ui/toolbar';
import { ToolbarButtonGroupProps } from '../toolbar_button_group_props';
import { ToolbarButtonProps } from '../toolbar_button_props';
import { ToolbarDropDownButtonProps } from '../toolbar_dropdown_button';

describe('Toolbar', () => {
  describe('View', () => {
    it('default render', () => {
      const buttonItem = new ToolbarItem();
      buttonItem.options = new ToolbarButtonProps();

      const buttonGroupItem = new ToolbarItem();
      buttonGroupItem.options = new ToolbarButtonGroupProps();

      const dropDownButtonItem = new ToolbarItem();
      dropDownButtonItem.options = new ToolbarDropDownButtonProps();

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
