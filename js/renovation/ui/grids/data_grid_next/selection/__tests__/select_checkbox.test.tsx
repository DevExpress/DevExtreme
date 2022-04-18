import React from 'react';
import { mount } from 'enzyme';
import {
  SelectionCheckbox, viewFunction as SelectionCheckboxView,
} from '../select_checkbox';
import { CheckBox } from '../../../../editors/check_box/check_box';
import { IsSelected, SetSelected } from '../plugins';

describe('SelectionCheckbox', () => {
  describe('View', () => {
    it('default render', () => {
      const checkbox = new SelectionCheckbox({} as any);
      checkbox.isSelected = true;

      const tree = mount(<SelectionCheckboxView {...checkbox as any} />);
      expect(tree.find(CheckBox).props()).toEqual({
        className: 'dx-select-checkbox dx-datagrid-checkbox-size',
        value: true,
      });
    });
  });

  describe('Effects', () => {
    describe('updateIsSelected', () => {
      it('should update isSelected', () => {
        const checkbox = new SelectionCheckbox({
          data: { id: 1 },
        });

        checkbox.plugins.set(IsSelected, (data) => data.id === 1);
        checkbox.updateIsSelected();

        expect(checkbox.isSelected).toEqual(true);
      });
    });
  });

  describe('Callbacks', () => {
    describe('setSelected', () => {
      it('should call SetSelected', () => {
        const checkbox = new SelectionCheckbox({
          data: { id: 1 },
        });

        const setSelected = jest.fn();
        checkbox.plugins.set(SetSelected, setSelected);
        checkbox.setSelected(true);

        expect(setSelected).toBeCalledWith({ id: 1 }, true);
      });
    });
  });
});
