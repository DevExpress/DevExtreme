import React from 'react';
import { mount } from 'enzyme';
import {
  SetExpanded, IsExpanded, MasterDetailTemplate,
} from '../plugins';
import { generateItems } from '../../__tests__/test_data';
import {
  MasterDetail, MasterDetailProps, viewFunction as MasterDetailView,
} from '../master_detail';
import {
  VisibleColumns, VisibleRows,
} from '../../data_grid_light';
import { GetterExtender } from '../../../../../utils/plugin/getter_extender';
import { MasterDetailRow } from '../master_detail_row';

describe('Master Detail', () => {
  describe('View', () => {
    it('should render GetterExtender', () => {
      const viewProps = {
        props: new MasterDetailProps(),
        processVisibleRows: () => [],
      } as Partial<MasterDetail>;
      const tree = mount(<MasterDetailView {...viewProps as any} />);

      expect(tree.find(GetterExtender).at(0).props()).toEqual({
        type: VisibleRows, order: 2, func: viewProps.processVisibleRows,
      });
    });
  });

  describe('Effects', () => {
    describe('setMasterDetailTemplate', () => {
      it('should set the master detail template', () => {
        const masterDetailTemplate = () => <div>Some value</div>;
        const masterDetail = new MasterDetail({
          template: masterDetailTemplate,
        });
        masterDetail.setMasterDetailTemplate();

        expect(masterDetail.plugins.getValue(MasterDetailTemplate)).toEqual(masterDetailTemplate);
      });
    });

    describe('addVisibleColumnsHandler', () => {
      it('should add expand column', () => {
        const masterDetail = new MasterDetail({
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
        const masterDetail = new MasterDetail({
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
        const masterDetail = new MasterDetail({ template: () => (<div />) });
        masterDetail.addPluginMethods();

        expect(masterDetail.plugins.getValue(SetExpanded)).toBe(masterDetail.setExpanded);
        expect(masterDetail.plugins.getValue(IsExpanded)).toBe(masterDetail.isExpanded);
      });
    });
  });

  describe('Methods', () => {
    describe('isExpanded', () => {
      it('should work', () => {
        const masterDetail = new MasterDetail({
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
        const masterDetail = new MasterDetail({
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
        const visibleRows = generateItems(2);

        it('should return original visibleRows', () => {
          const masterDetail = new MasterDetail({
            expandedRowKeys: [],
            template: () => (<div />),
          });

          expect(masterDetail.processVisibleRows(visibleRows)).toEqual(visibleRows);
        });

        it('should return visibleRows with master detail row', () => {
          const masterDetail = new MasterDetail({
            expandedRowKeys: [1],
            template: () => (<div />),
          });

          expect(masterDetail.processVisibleRows(visibleRows)).toEqual([
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
          const masterDetail = new MasterDetail({
            expandedRowKeys: [],
            template: () => (<div />),
          });

          expect(masterDetail.processVisibleRows([
            ...visibleRows,
            {
              ...visibleRows[1],
              rowType: 'detail',
              template: MasterDetailRow,
            },
          ])).toEqual(visibleRows);
        });
      });
    });
  });
});
