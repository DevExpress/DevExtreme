/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { DataGridNext, DataGridNextProps } from '../../../../js/renovation/ui/grids/data_grid_next/data_grid_next';
import { DataGridNextPager, DataGridNextPagerProps } from '../../../../js/renovation/ui/grids/data_grid_next/pager/pager';
import { DataGridNextPaging, DataGridNextPagingProps } from '../../../../js/renovation/ui/grids/data_grid_next/paging/paging';
import { DataGridNextSelection, DataGridNextSelectionProps } from '../../../../js/renovation/ui/grids/data_grid_next/selection/selection';
import { DataGridNextMasterDetail, DataGridNextMasterDetailProps } from '../../../../js/renovation/ui/grids/data_grid_next/master_detail/master_detail';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type OptionsType = Partial<
DataGridNextProps
& { pager: DataGridNextPagerProps }
& { selection: DataGridNextSelectionProps }
& { paging: DataGridNextPagingProps }
& { masterDetail: DataGridNextMasterDetailProps }
>;

export const viewFunction = ({
  options,
  pager,
  paging,
  selection,
  masterDetail,
  setPageIndex,
  setPageSize,
  setSelectedRowKeys,
  setExpandedRowKeys,
}: App): JSX.Element => (
  <DataGridNext
    id="container"
    dataSource={options.dataSource}
    columns={options.columns}
    keyExpr={options.keyExpr}
    noDataTemplate={options.noDataTemplate}
  >
    {paging.enabled && (
    <DataGridNextPaging
      enabled={paging.enabled}
      pageIndex={paging.pageIndex}
      pageIndexChange={setPageIndex}
      pageSize={paging.pageSize}
      pageSizeChange={setPageSize}
    />
    )}

    {/* {pager.visible && ( */}
    <DataGridNextPager
      visible={pager.visible}
      allowedPageSizes={pager.allowedPageSizes}
      showPageSizeSelector={pager.showPageSizeSelector}
      displayMode={pager.displayMode}
    />
    {/* )} */}

    {selection.mode !== 'none' && (
    <DataGridNextSelection
      allowSelectAll={selection.allowSelectAll}
      mode={selection.mode}
      selectAllMode={selection.selectAllMode}
      selectedRowKeys={selection.selectedRowKeys}
      selectedRowKeysChange={setSelectedRowKeys}
    />
    )}

    { masterDetail.enabled && (
    <DataGridNextMasterDetail
      enabled={masterDetail.enabled}
      template={masterDetail.template}
      expandedRowKeys={masterDetail.expandedRowKeys}
      expandedRowKeysChange={setExpandedRowKeys}
    />
    )}
  </DataGridNext>
);
@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() options: OptionsType = {};

  @InternalState()
  paging: Partial<DataGridNextPagingProps> = { enabled: false };

  @InternalState()
  pager: Partial<DataGridNextPagerProps> = { visible: false };

  @InternalState()
  selection: Partial<DataGridNextSelectionProps> = { mode: 'none' };

  @InternalState()
  masterDetail: Partial<DataGridNextMasterDetailProps> = { enabled: false };

  setPageIndex(pageIndex: number): void {
    this.paging = {
      ...this.paging,
      pageIndex,
    };
  }

  setPageSize(pageSize: number | 'all'): void {
    this.paging = {
      ...this.paging,
      pageSize,
    };
  }

  setSelectedRowKeys(selectedRowKeys: unknown[]): void {
    this.selection = {
      ...this.selection,
      selectedRowKeys,
    };
  }

  setExpandedRowKeys(expandedRowKeys: unknown[]): void {
    this.masterDetail = {
      ...this.masterDetail,
      expandedRowKeys,
    };
  }

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (options: OptionsType) => void })
      .onOptionsUpdated = (newOptions) => {
        const {
          paging, pager, selection, masterDetail, ...rest
        } = newOptions;

        this.options = {
          ...this.options,
          ...rest,
        };

        this.pager = {
          ...this.pager,
          ...pager,
        };

        this.paging = {
          ...this.paging,
          ...paging,
        };

        this.selection = {
          ...this.selection,
          ...selection,
        };

        this.masterDetail = {
          ...this.masterDetail,
          ...masterDetail,
        };
      };
  }
}
