import React from 'react';
import { mount } from 'enzyme';
import {
  DataRow, viewFunction as DataRowView,
} from '../data_row';
import { RowClassesGetter } from '../row_base';

describe('DataRow', () => {
  describe('View', () => {
    it('default render with template', () => {
      const dataRow = new DataRow({
        row: {
          data: {},
          rowType: 'data',
        },
        columns: [{ cellTemplate: () => <span>Some value</span> }],
      });

      const tree = mount(<DataRowView {...dataRow as any} />);
      expect(tree.find('span').text()).toEqual('Some value');
    });
  });

  describe('Effects', () => {
    it('should add dx-data-row class', () => {
      const row = {
        data: {},
        rowType: 'data',
      };
      const dataRow = new DataRow({
        row,
      });
      dataRow.extendDataRowClasses();

      const classesGetter = dataRow.plugins.getValue(RowClassesGetter)!;
      expect(classesGetter(row)).toEqual({
        'dx-data-row': true,
      });
    });
  });
});
