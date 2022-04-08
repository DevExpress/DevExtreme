import React from 'react';
import { mount } from 'enzyme';
import {
  DataGridNext, viewFunction as DataGridView, DataGridNextProps,
} from '../data_grid_next_full';
import {
  DataGridNext as DataGridNextBase,
} from '../data_grid_next';
import { DataGridNextPaging, DataGridNextPagingProps } from '../paging/paging';
import { DataGridNextPager, DataGridNextPagerProps } from '../pager/pager';
import { DataGridNextSelection, DataGridNextSelectionProps } from '../selection/selection';
import { DataGridNextMasterDetail, DataGridNextMasterDetailProps } from '../master_detail/master_detail';

describe('DataGridNextFull', () => {
  describe('View', () => {
    it('default render', () => {
      const props = new DataGridNextProps();
      props.dataSource = [];
      props.columns = [];
      const viewModel = {
        props,
        masterDetailEnabled: false,
        selectionMode: 'none',
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<DataGridNext>;
      const tree = mount(<DataGridView {...viewModel as any} /> as any);

      expect(tree.find(DataGridNextBase).first().props()['rest-attributes']).toEqual('true');
      expect(tree.find(DataGridNextBase).first().props().cacheEnabled).toEqual(true);
      expect(tree.find(DataGridNextBase).first().props().remoteOperations).toEqual(false);
      expect(tree.find(DataGridNextBase).first().props().dataSource).toEqual(props.dataSource);
      expect(tree.find(DataGridNextBase).first().props().columns).toEqual(props.columns);

      expect(tree.find(DataGridNextPaging).first().props().enabled).toEqual(true);
      expect(tree.find(DataGridNextPager).first().props().visible).toEqual(true);
      expect(tree.find(DataGridNextSelection).first().props().mode).toEqual('none');
      expect(tree.find(DataGridNextMasterDetail).first().props().enabled).toEqual(false);
    });

    it('render with nested options', () => {
      const props = new DataGridNextProps();
      props.paging = new DataGridNextPagingProps();
      props.pager = new DataGridNextPagerProps();
      props.selection = new DataGridNextSelectionProps();
      props.masterDetail = new DataGridNextMasterDetailProps();
      const viewModel = {
        props,
      } as Partial<DataGridNext>;
      const tree = mount(<DataGridView {...viewModel as any} /> as any);

      expect(tree.find(DataGridNextPaging).first().props().enabled).toEqual(true);
      expect(tree.find(DataGridNextPager).first().props().visible).toEqual(true);
      expect(tree.find(DataGridNextSelection).first().props().mode).toEqual('single');
      expect(tree.find(DataGridNextMasterDetail).first().props().enabled).toEqual(true);
    });
  });

  describe('Getters', () => {
    describe('masterDetailEnabled', () => {
      it('should have default value false', () => {
        expect(new DataGridNext({}).masterDetailEnabled).toEqual(false);
      });

      it('should be true if masterDetail.enabled is enabled', () => {
        expect(new DataGridNext({
          masterDetail: {
            enabled: true,
            expandedRowKeys: [],
          },
        }).masterDetailEnabled).toEqual(true);
      });
    });

    describe('selectionMode', () => {
      it('should have default value "none"', () => {
        expect(new DataGridNext({}).selectionMode).toEqual('none');
      });

      it('should be equal selection.mode if it is defined', () => {
        expect(new DataGridNext({
          selection: {
            mode: 'multiple',
          } as DataGridNextSelectionProps,
        }).selectionMode).toEqual('multiple');
      });
    });
  });

  describe('Methods', () => {
    describe('refresh', () => {
      it('refresh method should call internal refresh method', () => {
        const grid = new DataGridNext({});
        grid.dataGrid = {
          current: {
            refresh: jest.fn(),
          },
        } as any;

        grid.refresh();

        expect(grid.dataGrid.current?.refresh).toHaveBeenCalled();
      });
    });
  });
});
