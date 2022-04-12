import React from 'react';
import { mount } from 'enzyme';
import {
  HeaderRow, viewFunction as HeaderRowView,
} from '../header_row';

describe('HeaderRow', () => {
  describe('View', () => {
    it('default render with template', () => {
      const headerRow = new HeaderRow({
        columns: [{ headerTemplate: () => <span>Some value</span>, headerCssClass: 'myClass' }],
      });

      const tree = mount(<HeaderRowView {...headerRow as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('td').hasClass('myClass')).toBe(true);
      expect(tree.find('span').text()).toEqual('Some value');
    });
  });
});
