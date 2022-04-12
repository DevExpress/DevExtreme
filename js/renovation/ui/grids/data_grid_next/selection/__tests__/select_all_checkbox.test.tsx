import React from 'react';
import { mount } from 'enzyme';
import {
  SelectAllCheckbox, viewFunction as SelectAllCheckboxView,
} from '../select_all_checkbox';
import { CheckBox } from '../../../../editors/check_box/check_box';
import {
  ClearSelection, SelectableCount, SelectAll, SelectedCount,
} from '../plugins';

describe('SelectionCheckbox', () => {
  describe('View', () => {
    it('default render', () => {
      const checkbox: Partial<SelectAllCheckbox> = {
        value: true,
        onValueChange: jest.fn(),
      };

      const tree = mount(<SelectAllCheckboxView {...checkbox as any} />);
      expect(tree.find(CheckBox).props()).toEqual({
        className: 'dx-select-checkbox dx-datagrid-checkbox-size',
        value: true,
        valueChange: checkbox.onValueChange,
      });
    });
  });

  describe('Effects', () => {
    describe('updateSelectableCount', () => {
      it('should update selectableCount', () => {
        const checkbox = new SelectAllCheckbox({});
        checkbox.plugins.set(SelectableCount, 10);
        checkbox.updateSelectableCount();

        expect(checkbox.selectableCount).toEqual(10);
      });
    });

    describe('updateSelectedCount', () => {
      it('should update selectableCount', () => {
        const checkbox = new SelectAllCheckbox({});
        checkbox.plugins.set(SelectedCount, 10);
        checkbox.updateSelectedCount();

        expect(checkbox.selectedCount).toEqual(10);
      });
    });
  });

  describe('Getters', () => {
    describe('value', () => {
      const checkbox = new SelectAllCheckbox({});

      it('should be false if no items selected', () => {
        checkbox.selectedCount = 0;
        expect(checkbox.value).toEqual(false);
      });

      it('should be null if some items are selected', () => {
        checkbox.selectedCount = 5;
        checkbox.selectableCount = 10;
        expect(checkbox.value).toEqual(null);
      });

      it('should be true if all items are selected', () => {
        checkbox.selectedCount = 10;
        checkbox.selectableCount = 10;
        expect(checkbox.value).toEqual(true);
      });
    });
  });

  describe('Callbacks', () => {
    describe('onValueChange', () => {
      const selectAll = jest.fn();
      const clearSelection = jest.fn();

      const checkbox = new SelectAllCheckbox({});
      checkbox.plugins.set(SelectAll, selectAll);
      checkbox.plugins.set(ClearSelection, clearSelection);

      it('should call selectAll if value is true', () => {
        checkbox.onValueChange(true);
        expect(selectAll).toBeCalled();
      });

      it('should call clearSelection if value is false', () => {
        checkbox.onValueChange(false);
        expect(clearSelection).toBeCalled();
      });
    });
  });
});
