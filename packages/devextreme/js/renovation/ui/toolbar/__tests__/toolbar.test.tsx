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

    it('pass items as string', () => {
      const toolbarProps = new ToolbarProps();
      toolbarProps.items = ['item1', 'item2'];

      const viewModel = new Toolbar(toolbarProps);
      const tree = mount(ToolbarView(viewModel));

      const resultProps = tree.find(DomComponentWrapper).props().componentProps;
      expect(resultProps.items[0]).toEqual('item1');
      expect(resultProps.items[1]).toEqual('item2');
    });

    it('Not crashed if items is undefined', () => {
      const toolbarProps = new ToolbarProps();

      const viewModel = new Toolbar(toolbarProps);
      const tree = mount(ToolbarView(viewModel));

      const resultProps = tree.find(DomComponentWrapper).props().componentProps;
      expect(resultProps.items).toEqual(undefined);
    });

    each([false, true, undefined]).describe('rtlEnabled: %o', (isRtlEnabled) => {
      it('correctly pass rtlEnabled', () => {
        const toolbarProps = new ToolbarProps();
        toolbarProps.items = [new ToolbarItem(), new ToolbarItem(),
          new ToolbarItem(), new ToolbarItem(), new ToolbarItem()];

        toolbarProps.rtlEnabled = isRtlEnabled;
        const viewModel = new Toolbar(toolbarProps);

        const tree = mount(ToolbarView(viewModel));
        const resultProps = tree.find(DomComponentWrapper).props().componentProps;
        resultProps.items.forEach((item) => {
          expect(item.options.rtlEnabled).toEqual(isRtlEnabled ?? false);
        });
      });

      it('rtlEnabled from item options is not overridden', () => {
        const buttonItem = new ToolbarItem();
        buttonItem.options = new ToolbarButtonProps();
        buttonItem.options.rtlEnabled = true;

        const buttonGroupItem = new ToolbarItem();
        buttonGroupItem.options = new ToolbarButtonGroupProps();
        buttonGroupItem.options.rtlEnabled = true;

        const dropDownButtonItem = new ToolbarItem();
        dropDownButtonItem.options = new ToolbarDropDownButtonProps();
        dropDownButtonItem.options.rtlEnabled = true;

        const checkBoxItem = new ToolbarItem();
        checkBoxItem.options = new ToolbarCheckBoxProps();
        checkBoxItem.options.rtlEnabled = true;

        const textBoxItem = new ToolbarItem();
        textBoxItem.options = new ToolbarTextBoxProps();
        textBoxItem.options.rtlEnabled = true;

        const toolbarProps = new ToolbarProps();
        toolbarProps.items = [buttonItem, buttonGroupItem,
          dropDownButtonItem, checkBoxItem, textBoxItem];

        toolbarProps.rtlEnabled = isRtlEnabled;
        const viewModel = new Toolbar(toolbarProps);

        const tree = mount(ToolbarView(viewModel));
        const resultProps = tree.find(DomComponentWrapper).props().componentProps;
        resultProps.items.forEach((item) => {
          expect(item.options.rtlEnabled).toEqual(true);
        });
      });
    });
  });
});
