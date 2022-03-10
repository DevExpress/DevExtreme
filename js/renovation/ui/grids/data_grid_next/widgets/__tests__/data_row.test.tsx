import React from 'react';
import { mount } from 'enzyme';
import {
  DataRow, viewFunction as DataRowView,
} from '../data_row';
import { RowClassesGetter } from '../row_base';
import { Row } from '../../types';

describe('DataRow', () => {
  describe('View', () => {
    it('default render with cellTemplate', () => {
      const dataRow = new DataRow({
        row: {
          data: {},
          rowType: 'data',
        },
        columns: [{ cellTemplate: () => <span>Some value</span> }],
      });

      const tree = mount(<DataRowView {...dataRow as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('span').text()).toEqual('Some value');
    });

    it('default render with cellContainerTemplate', () => {
      const dataRow = new DataRow({
        row: {
          data: {},
          rowType: 'data',
        },
        columns: [{ cellContainerTemplate: () => <td className="myCell"><span>Some value</span></td> }],
      });

      const tree = mount(<DataRowView {...dataRow as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('td').hasClass('myCell')).toBe(true);
      expect(tree.find('td').find('span').text()).toEqual('Some value');
    });

    it('column with cssClass', () => {
      const dataRow = new DataRow({
        row: {
          data: {},
          rowType: 'data',
        },
        columns: [{ cssClass: 'my-class' }],
      });

      const tree = mount(<DataRowView {...dataRow as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('td').hasClass('my-class')).toBe(true);
    });

    it('column with format', () => {
      const dataRow = new DataRow({
        row: {
          data: { amount: 100 },
          rowType: 'data',
        },
        columns: [{ format: '$ #0', calculateCellValue: (data) => data.amount }],
      });

      const tree = mount(<DataRowView {...dataRow as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('td').text()).toBe('$ 100');
    });
  });

  describe('Effects', () => {
    it('should add dx-data-row class', () => {
      const row: Row = {
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

    it('should not add dx-data-row class', () => {
      const row: Row = {
        data: {},
        rowType: 'detail',
      };
      const dataRow = new DataRow({
        row,
      });
      dataRow.extendDataRowClasses();

      const classesGetter = dataRow.plugins.getValue(RowClassesGetter)!;
      expect(classesGetter(row)).toEqual({});
    });
  });
});
