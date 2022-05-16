import React from 'react';
import { mount } from 'enzyme';
import { VirtualContent, VirtualContentProps, viewFunction as VirtualContentView } from '../virtual_content';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import { PlaceholderExtender } from '../../../../../utils/plugin/placeholder_extender';
import { TopRowPlaceholder, BottomRowPlaceholder } from '../../views/table_content';
import {
  TopVirtualRowHeightValue, BottomVirtualRowHeightValue,
} from '../plugins';
import { VirtualRow } from '../virtual_row';
import { Plugins } from '../../../../../utils/plugin/context';
import { VisibleColumns } from '../../plugins';

describe('Virtual content', () => {
  describe('View', () => {
    it('rendered with getters', () => {
      const viewProps = {
        topHeight: 0,
        bottomHeight: 0,
      } as Partial<VirtualContent>;

      const tree = mount(<VirtualContentView {...viewProps as any} />);
      const getters = tree.find(GetterExtender);

      expect(getters).toHaveLength(2);
      expect(getters.at(0).props().type).toBe(TopVirtualRowHeightValue);
      expect(getters.at(1).props().type).toBe(BottomVirtualRowHeightValue);
    });

    it('rendered with getters and top placeholder', () => {
      const viewProps = {
        topHeight: 10,
        bottomHeight: 0,
        cellClasses: ['a'],
      } as Partial<VirtualContent>;

      const tree = mount(<VirtualContentView {...viewProps as any} />);
      const getters = tree.find(GetterExtender);
      const placeholders = tree.find(PlaceholderExtender);

      expect(getters).toHaveLength(2);
      expect(getters.at(0).props().type).toBe(TopVirtualRowHeightValue);
      expect(getters.at(1).props().type).toBe(BottomVirtualRowHeightValue);
      expect(placeholders).toHaveLength(1);
      expect(placeholders.at(0).props().type).toBe(TopRowPlaceholder);

      const placeholderTemplate = placeholders.at(0).props().template();
      const placeholderTree = mount(placeholderTemplate, {
        attachTo: document.createElement('tbody'),
      });
      const virtualRow = placeholderTree.find(VirtualRow);

      expect(virtualRow).toHaveLength(1);
      expect(virtualRow.at(0).props()).toEqual({
        height: 10,
        cellClasses: ['a'],
        rowKey: -1,
      });
    });

    it('rendered with getters and bottom placeholder', () => {
      const viewProps = {
        topHeight: 0,
        bottomHeight: 10,
        cellClasses: ['a'],
      } as Partial<VirtualContent>;

      const tree = mount(<VirtualContentView {...viewProps as any} />);
      const getters = tree.find(GetterExtender);
      const placeholders = tree.find(PlaceholderExtender);

      expect(getters).toHaveLength(2);
      expect(getters.at(0).props().type).toBe(TopVirtualRowHeightValue);
      expect(getters.at(1).props().type).toBe(BottomVirtualRowHeightValue);
      expect(placeholders).toHaveLength(1);
      expect(placeholders.at(0).props().type).toBe(BottomRowPlaceholder);

      const placeholderTemplate = placeholders.at(0).props().template();
      const placeholderTree = mount(placeholderTemplate, {
        attachTo: document.createElement('tbody'),
      });
      const virtualRow = placeholderTree.find(VirtualRow);

      expect(virtualRow).toHaveLength(1);
      expect(virtualRow.at(0).props()).toEqual({
        height: 10,
        cellClasses: ['a'],
        rowKey: -2,
      });
    });

    it('rendered with getters and both placeholders', () => {
      const viewProps = {
        topHeight: 10,
        bottomHeight: 20,
        cellClasses: ['a'],
      } as Partial<VirtualContent>;

      const tree = mount(<VirtualContentView {...viewProps as any} />);
      const getters = tree.find(GetterExtender);
      const placeholders = tree.find(PlaceholderExtender);

      expect(getters).toHaveLength(2);
      expect(getters.at(0).props().type).toBe(TopVirtualRowHeightValue);
      expect(getters.at(1).props().type).toBe(BottomVirtualRowHeightValue);
      expect(placeholders).toHaveLength(2);
      expect(placeholders.at(0).props().type).toBe(TopRowPlaceholder);
      expect(placeholders.at(1).props().type).toBe(BottomRowPlaceholder);

      const placeholderTemplateTop = placeholders.at(0).props().template();
      const placeholderTreeTop = mount(placeholderTemplateTop, {
        attachTo: document.createElement('tbody'),
      });
      const virtualRowTop = placeholderTreeTop.find(VirtualRow);

      expect(virtualRowTop).toHaveLength(1);
      expect(virtualRowTop.at(0).props()).toEqual({
        height: 10,
        cellClasses: ['a'],
        rowKey: -1,
      });

      const placeholderTemplateBottom = placeholders.at(1).props().template();
      const placeholderTreeBottom = mount(placeholderTemplateBottom, {
        attachTo: document.createElement('tbody'),
      });
      const virtualRowBottom = placeholderTreeBottom.find(VirtualRow);

      expect(virtualRowBottom).toHaveLength(1);
      expect(virtualRowBottom.at(0).props()).toEqual({
        height: 20,
        cellClasses: ['a'],
        rowKey: -2,
      });
    });
  });

  describe('Effects', () => {
    describe('watchVisibleColumns', () => {
      it('should update cssClasses', () => {
        const virtualContent = new VirtualContent(new VirtualContentProps());
        virtualContent.plugins = new Plugins();
        virtualContent.plugins.extend(VisibleColumns, -1, () => [{ headerCssClass: 'a' }, { headerCssClass: 'b' }, {}]);

        virtualContent.watchVisibleColumns();

        expect(virtualContent.cellClasses).toEqual(['a', 'b', '']);
      });
    });

    describe('watchTopVirtualRowHeight', () => {
      it('should update topHeight', () => {
        const virtualContent = new VirtualContent(new VirtualContentProps());
        virtualContent.plugins = new Plugins();
        virtualContent.plugins.extend(TopVirtualRowHeightValue, -1, () => 5);

        virtualContent.watchTopVirtualRowHeight();

        expect(virtualContent.topHeight).toEqual(5);
      });
    });

    describe('watchBottomVirtualRowHeight', () => {
      it('should update bottomHeight', () => {
        const virtualContent = new VirtualContent(new VirtualContentProps());
        virtualContent.plugins = new Plugins();
        virtualContent.plugins.extend(BottomVirtualRowHeightValue, -1, () => 10);

        virtualContent.watchBottomVirtualRowHeight();

        expect(virtualContent.bottomHeight).toEqual(10);
      });
    });
  });
});
