import React from 'react';
import { mount } from 'enzyme';
import {
  SetExpanded, IsExpanded, MasterDetailTemplate,
} from '../plugins';
import { generateRows } from '../../__tests__/test_data';
import {
  AddMasterDetailRows,
  DataGridNextMasterDetail, DataGridNextMasterDetailProps, viewFunction as MasterDetailView,
} from '../master_detail';
import {
  VisibleColumns, VisibleRows,
} from '../../data_grid_next';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import { MasterDetailRow } from '../master_detail_row';

describe('Master Detail', () => {
  describe('View', () => {
    it('should render GetterExtender', () => {
      const viewProps = {
        props: new DataGridNextMasterDetailProps(),
        processVisibleRows: () => [],
      } as Partial<DataGridNextMasterDetail>;
      const tree = mount(<MasterDetailView {...viewProps as any} />);

      expect(tree.find(GetterExtender).at(0).props()).toEqual({
        type: VisibleRows, order: 2, value: AddMasterDetailRows,
      });
    });
  });

  describe('Effects', () => {
    describe('setMasterDetailTemplate', () => {
      it('should set the master detail template', () => {
        const masterDetailTemplate = () => <div>Some value</div>;
        const masterDetail = new DataGridNextMasterDetail({
          template: masterDetailTemplate,
        });
        masterDetail.setMasterDetailTemplate();

        expect(masterDetail.plugins.getValue(MasterDetailTemplate)).toEqual(masterDetailTemplate);
      });
    });

    describe('addVisibleColumnsHandler', () => {
      it('should add expand column', () => {
        const masterDetail = new DataGridNextMasterDetail({
          enabled: true,
          template: () => (<div />),
        });
        masterDetail.addVisibleColumnsHandler();

        const visibleColumns = masterDetail.plugins.getValue(VisibleColumns);
        expect(visibleColumns).toMatchObject([{
          cellContainerTemplate: expect.any(Function),
          headerCssClass: 'dx-command-expand dx-datagrid-group-space',
        }]);
      });

      it('should not add expand column when enabled property is false', () => {
        const masterDetail = new DataGridNextMasterDetail({
          enabled: false,
          template: () => (<div />),
        });
        masterDetail.addVisibleColumnsHandler();

        const visibleColumns = masterDetail.plugins.getValue(VisibleColumns);
        expect(visibleColumns).toEqual([]);
      });
    });

    describe('addPluginMethods', () => {
      it('should set methods', () => {
        const masterDetail = new DataGridNextMasterDetail({ template: () => (<div />) });
        masterDetail.addPluginMethods();

        expect(masterDetail.plugins.getValue(SetExpanded)).toBe(masterDetail.setExpanded);
        expect(masterDetail.plugins.getValue(IsExpanded)).toBe(masterDetail.isExpanded);
      });
    });
  });

  describe('Methods', () => {
    describe('isExpanded', () => {
      it('should work', () => {
        const masterDetail = new DataGridNextMasterDetail({
          expandedRowKeys: [2, 3],
          template: () => (<div />),
        });

        expect(masterDetail.isExpanded(1)).toEqual(false);
        expect(masterDetail.isExpanded(2)).toEqual(true);
        expect(masterDetail.isExpanded(3)).toEqual(true);
        expect(masterDetail.isExpanded(4)).toEqual(false);
      });
    });

    describe('setExpanded', () => {
      it('should work', () => {
        const masterDetail = new DataGridNextMasterDetail({
          expandedRowKeys: [],
          template: () => (<div />),
        });

        masterDetail.setExpanded(1, true);
        masterDetail.setExpanded(2, true);
        expect(masterDetail.props.expandedRowKeys).toEqual([1, 2]);

        masterDetail.setExpanded(1, false);
        expect(masterDetail.props.expandedRowKeys).toEqual([2]);
      });

      describe('processVisibleRows', () => {
        const visibleRows = generateRows(2);

        it('should return original visibleRows', () => {
          const masterDetail = new DataGridNextMasterDetail({
            expandedRowKeys: [],
            template: () => (<div />),
          });
          const isExpanded = masterDetail.isExpanded.bind(masterDetail);

          expect(AddMasterDetailRows.func(
            visibleRows,
            isExpanded,
          )).toEqual(visibleRows);
        });

        it('should return visibleRows with master detail row', () => {
          const masterDetail = new DataGridNextMasterDetail({
            expandedRowKeys: [1],
            template: () => (<div />),
          });
          const isExpanded = masterDetail.isExpanded.bind(masterDetail);

          expect(AddMasterDetailRows.func(
            visibleRows,
            isExpanded,
          )).toEqual([
            visibleRows[0],
            visibleRows[1],
            {
              ...visibleRows[1],
              rowType: 'detail',
              template: MasterDetailRow,
            },
          ]);
        });

        it('should return visibleRows without master detail row', () => {
          const masterDetail = new DataGridNextMasterDetail({
            expandedRowKeys: [],
            template: () => (<div />),
          });
          const isExpanded = masterDetail.isExpanded.bind(masterDetail);

          expect(AddMasterDetailRows.func([
            ...visibleRows,
            {
              ...visibleRows[1],
              rowType: 'detail',
              template: MasterDetailRow,
            },
          ], isExpanded)).toEqual(visibleRows);
        });
      });
    });
  });
});
