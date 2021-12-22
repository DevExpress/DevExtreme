/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { DataGridLight, DataGridLightProps } from '../../../../js/renovation/ui/grids/data_grid_light/data_grid_light';
import { Pager, PagerProps } from '../../../../js/renovation/ui/grids/data_grid_light/widgets/pager';
import { Paging, PagingProps } from '../../../../js/renovation/ui/grids/data_grid_light/widgets/paging';

export const viewFunction = ({
  options, pager, paging, setPageIndex, setPageSize,
}: App): JSX.Element => (
  <DataGridLight
    id="container"
    dataSource={options.dataSource}
    columns={options.columns}
  >
    <Paging
      enabled={paging.enabled}
      pageIndex={paging.pageIndex}
      pageIndexChange={setPageIndex}
      pageSize={paging.pageSize}
      pageSizeChange={setPageSize}
    />
    <Pager
      visible={pager.visible}
      allowedPageSizes={pager.allowedPageSizes}
      showPageSizeSelector={pager.showPageSizeSelector}
      displayMode={pager.displayMode}
    />
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
  @InternalState() options: Partial<DataGridLightProps> = {
    columns: ['id', 'text'],
    dataSource: [
      { id: 1, text: 'text 1' },
      { id: 2, text: 'text 2' },
      { id: 3, text: 'text 3' },
      { id: 4, text: 'text 4' },
      { id: 5, text: 'text 5' },
    ],
  };

  @InternalState()
  paging: Partial<PagingProps> = {
    pageSize: 2,
    pageIndex: 0,
    enabled: true,
  };

  @InternalState()
  pager: Partial<PagerProps> = {
    visible: true,
    allowedPageSizes: [2, 4, 'all'],
    showPageSizeSelector: true,
    displayMode: 'full',
  };

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

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (unknown) => void })
      .onOptionsUpdated = (newOptions) => {
        const { paging, pager, ...rest } = newOptions;

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
      };
  }
}
