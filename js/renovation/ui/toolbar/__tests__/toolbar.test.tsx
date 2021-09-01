import React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
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
      componentProps.items = [buttonItem, buttonGroupItem,
        dropDownButtonItem, checkBoxItem, textBoxItem];

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

    it('pass items as string', () => {
      const toolbarProps = new ToolbarProps();
      toolbarProps.items = ['item1', 'item2'];

      const props = {
        props: toolbarProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Toolbar>;
      const tree = shallow(<ToolbarView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps: toolbarProps,
        componentType: LegacyToolbar,
        'rest-attributes': 'true',
      });
    });

    it('not crash without items', () => {
      const toolbarProps = new ToolbarProps();
      const initialProps = {
        props: toolbarProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Toolbar>;
      const tree = shallow(<ToolbarView {...initialProps as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentType: LegacyToolbar,
        'rest-attributes': 'true',
      });
    });

    each([false, true, undefined]).describe('rtlEnabled: %o', (isRtlEnabled) => {
      it('correctly pass rtlEnabled', () => {
        const buttonItem = new ToolbarItem();
        const buttonGroupItem = new ToolbarItem();
        const dropDownButtonItem = new ToolbarItem();
        const checkBoxItem = new ToolbarItem();
        const textBoxItem = new ToolbarItem();
        const toolbarProps = new ToolbarProps();
        toolbarProps.items = [buttonItem, buttonGroupItem,
          dropDownButtonItem, checkBoxItem, textBoxItem];

        toolbarProps.rtlEnabled = isRtlEnabled;
        const viewModel = new Toolbar(toolbarProps);

        const tree = mount(ToolbarView(viewModel));
        const resultProps = tree.find(DomComponentWrapper).props().componentProps;
        resultProps.items.forEach((item) => {
          expect(item.options.rtlEnabled).toEqual(isRtlEnabled ?? false);
        });
      });
    });
  });
});
