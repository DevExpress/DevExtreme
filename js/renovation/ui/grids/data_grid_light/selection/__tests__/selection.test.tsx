import React from 'react';
import { mount } from 'enzyme';
import { Plugins } from '../../../../../utils/plugin/context';
import {
  ClearSelection, SelectAll, ToggleSelected,
} from '../plugins';
import {
  Selection, SelectionProps, viewFunction as SelectionView,
} from '../selection';
import { SelectionCheckbox } from '../select_checkbox';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import { ValueSetter } from '../../../../../utils/plugin/value_setter';
import { TemplateSetter } from '../../../../../utils/plugin/template_setter';
import { RowClick } from '../../views/table_content';
import { generateRows } from '../../__tests__/test_data';

describe('Selection', () => {
  describe('View', () => {
    it('should contain plugins', () => {
      const viewProps = {
        props: new SelectionProps(),
      } as Partial<Selection>;
      const tree = mount(<SelectionView {...viewProps as any} />);

      expect(tree.find(GetterExtender)).toHaveLength(3);
      expect(tree.find(ValueSetter)).toHaveLength(5);
      expect(tree.find(TemplateSetter)).toHaveLength(2);
    });

    it('TemplateSetter should contain SelectionCheckbox inside template', () => {
      const viewProps = {
        props: new SelectionProps(),
      } as Partial<Selection>;
      const data = {};
      const tree = mount(<SelectionView {...viewProps as any} />);
      const {
        template,
      }: {
        template: (props) => JSX.Element;
      } = tree.find(TemplateSetter).first().props();

      const templateTree = mount(template({ data }));

      expect(templateTree.is(SelectionCheckbox)).toBe(true);
    });
  });

  describe('Effects', () => {
    describe('setRowClickEvent', () => {
      it('should call ToggleSelected on click', () => {
        const selection = new Selection(new SelectionProps());
        const toggleSelectedMock = jest.fn();
        const testRow = generateRows(1)[0];
        selection.plugins = new Plugins();
        selection.plugins.set(ToggleSelected, toggleSelectedMock);

        selection.setRowClickEvent();
        const rowClickHandler = selection.plugins.getValue(RowClick)!;

        rowClickHandler(testRow);

        expect(toggleSelectedMock).toHaveBeenCalledWith(testRow.data);
      });
    });
  });

  describe('Methods', () => {
    describe('clearSelection', () => {
      it('should call ClearSelection action', () => {
        const selection = new Selection({});
        const clearSelectionMock = jest.fn();

        selection.plugins = new Plugins();
        selection.plugins.set(ClearSelection, clearSelectionMock);

        selection.clearSelection();

        expect(clearSelectionMock).toHaveBeenCalled();
      });
    });

    describe('selectAll', () => {
      it('should call SelectAll action', () => {
        const selection = new Selection({});
        const selectAllMock = jest.fn();

        selection.plugins = new Plugins();
        selection.plugins.set(SelectAll, selectAllMock);

        selection.selectAll();

        expect(selectAllMock).toHaveBeenCalled();
      });
    });

    describe('setSelectedRoeKeys', () => {
      it('should set selectedRowKeys', () => {
        const selection = new Selection({});
        const keys = [1, 2, 3];

        selection.setSelectedRowKeys(keys);

        expect(selection.props.selectedRowKeys).toEqual(keys);
      });
    });
  });
});
