import React from 'react';
import { mount } from 'enzyme';
import { NoDataText, viewFunction as NoDataTextView } from '../no_data_text';

describe('NoDataText', () => {
  describe('View', () => {
    it('default render', () => {
      const noDataText = new NoDataText({});

      const tree = mount(
        <NoDataTextView {...noDataText} text={noDataText.text} />,
      );

      expect(tree.html()).toMatchInlineSnapshot(
        '"<div class=\\"dx-datagrid-nodata\\">No data</div>"',
      );
    });

    it('render with template', () => {
      const noDataText = new NoDataText({
        template: () => <span>myValue</span>,
      });

      const tree = mount(
        <NoDataTextView {...noDataText} text={noDataText.text} />,
      );

      expect(tree.html()).toMatchInlineSnapshot(
        '"<div class=\\"dx-datagrid-nodata\\"><span>myValue</span></div>"',
      );
    });
  });
});
