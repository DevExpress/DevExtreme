import React from 'react';
import { mount } from 'enzyme';
import {
  MasterDetailRow, MasterDetailRowProps, viewFunction as MasterDetailRowView,
} from '../master_detail_row';
import { RowClassesGetter } from '../../widgets/row_base';
import { VisibleColumns } from '../../plugins';
import { Row } from '../../types';
import { MasterDetailTemplate } from '../plugins';

describe('DataRow', () => {
  describe('View', () => {
    it('default render with template', () => {
      const viewProps = {
        props: new MasterDetailRowProps(),
        masterDetailRowTemplate: () => <div>Some value</div>,
        colSpan: 3,
      } as Partial<MasterDetailRow>;

      const tree = mount(<MasterDetailRowView {...viewProps as any} />, {
        attachTo: document.createElement('tbody'),
      });
      expect(tree.find('td').prop('colSpan')).toEqual(3);
      expect(tree.find('div').text()).toEqual('Some value');
    });
  });

  describe('Effects', () => {
    it('should update colSpan', () => {
      const masterDetailRow = new MasterDetailRow({});
      masterDetailRow.plugins.extend(VisibleColumns, 1, () => [{}, {}]);
      masterDetailRow.updateColSpan();

      expect(masterDetailRow.colSpan).toEqual(2);
    });

    it('should update template', () => {
      const template = () => <div>Some value</div>;
      const masterDetailRow = new MasterDetailRow({});
      masterDetailRow.plugins.set(MasterDetailTemplate, template);
      masterDetailRow.updateTemplate();

      expect(masterDetailRow.masterDetailRowTemplate).toEqual(template);
    });

    it('should add dx-master-detail-row class', () => {
      const row: Row = {
        data: {},
        rowType: 'detail',
      };
      const masterDetailRow = new MasterDetailRow({});
      masterDetailRow.extendMasterDetailRowClasses();

      const classesGetter = masterDetailRow.plugins.getValue(RowClassesGetter)!;
      expect(classesGetter(row)).toEqual({
        'dx-master-detail-row': true,
      });
    });

    it('should not add dx-master-detail-row class', () => {
      const row: Row = {
        data: {},
        rowType: 'data',
      };
      const masterDetailRow = new MasterDetailRow({});
      masterDetailRow.extendMasterDetailRowClasses();

      const classesGetter = masterDetailRow.plugins.getValue(RowClassesGetter)!;
      expect(classesGetter(row)).toEqual({});
    });
  });
});
