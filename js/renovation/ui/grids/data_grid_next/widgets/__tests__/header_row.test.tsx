import React from 'react';
import { mount } from 'enzyme';
import {
  HeaderRow, viewFunction as HeaderRowView,
} from '../header_row';

describe('HeaderRow', () => {
  describe('View', () => {
    it('default render with template', () => {
      const headerRow = new HeaderRow({
        columns: [{ headerCellTemplate: () => <span>Some value</span>, headerCssClass: 'myClass' }],
      });

      const tree = mount(<HeaderRowView {...headerRow as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('td').hasClass('myClass')).toBe(true);
      expect(tree.find('span').text()).toEqual('Some value');
    });

    it('cssClass', () => {
      const headerRow = new HeaderRow({
        columns: [{ cssClass: 'my-class', caption: 'My Caption' }],
      });

      const tree = mount(<HeaderRowView {...headerRow as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('td').hasClass('my-class')).toBe(true);
      expect(tree.find('td').text()).toEqual('My Caption');
    });
  });
});
