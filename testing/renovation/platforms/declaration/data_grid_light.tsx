/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { DeepPartial } from '../../../../js/core';
import { DataGridLight, DataGridLightProps } from '../../../../js/renovation/ui/grids/data_grid_light/data_grid_light';
import { Pager, PagerProps } from '../../../../js/renovation/ui/grids/data_grid_light/pager/pager';
import { Paging, PagingProps } from '../../../../js/renovation/ui/grids/data_grid_light/paging/paging';
import { Selection, SelectionProps } from '../../../../js/renovation/ui/grids/data_grid_light/selection/selection';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type OptionsType = DeepPartial<
DataGridLightProps
& { pager: PagerProps }
& { selection: SelectionProps }
& { paging: PagingProps }
>;

export const viewFunction = ({
  options, pager, paging, selection, setPageIndex, setPageSize, setSelectedRowKeys,
}: App): JSX.Element => (
  <DataGridLight
    id="container"
    dataSource={options.dataSource}
    columns={options.columns}
    keyExpr={options.keyExpr}
  >
    {paging.enabled && (
    <Paging
      enabled={paging.enabled}
      pageIndex={paging.pageIndex}
      pageIndexChange={setPageIndex}
      pageSize={paging.pageSize}
      pageSizeChange={setPageSize}
    />
    )}

    {/* {pager.visible && ( */}
    <Pager
      visible={pager.visible}
      allowedPageSizes={pager.allowedPageSizes}
      showPageSizeSelector={pager.showPageSizeSelector}
      displayMode={pager.displayMode}
    />
    {/* )} */}

    {selection.mode !== 'none' && (
    <Selection
      allowSelectAll={selection.allowSelectAll}
      mode={selection.mode}
      selectAllMode={selection.selectAllMode}
      selectedRowKeys={selection.selectedRowKeys}
      selectedRowKeysChange={setSelectedRowKeys}
    />
    )}

    <span>
      pager visible:
      {' '}
      {pager.visible}
    </span>
  </DataGridLight>
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
  paging: Partial<PagingProps> = { enabled: false };

  @InternalState()
  pager: Partial<PagerProps> = { visible: false };

  @InternalState()
  selection: Partial<SelectionProps> = { mode: 'none' };

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

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (options: OptionsType) => void })
      .onOptionsUpdated = (newOptions) => {
        const {
          paging, pager, selection, ...rest
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
      };
  }
}
