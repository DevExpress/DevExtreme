/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay,
  TwoWay, Fragment,
} from '@devextreme-generator/declarations';

import { ValueSetter } from '../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../utils/plugin/getter_extender';

import { LoadOptionsValue, LocalVisibleItems } from '../data_grid_next';

import {
  PageIndex, PageSize, SetPageIndex, SetPageSize, PagingEnabled,
  ApplyPagingToVisibleItems, AddPagingToLoadOptions,
} from './plugins';

export const viewFunction = (viewModel: DataGridNextPaging): JSX.Element => (
  <Fragment>
    <ValueSetter type={PageIndex} value={viewModel.props.pageIndex} />
    <ValueSetter type={PageSize} value={viewModel.pageSize} />
    <ValueSetter type={PagingEnabled} value={viewModel.props.enabled} />
    <ValueSetter type={SetPageIndex} value={viewModel.setPageIndex} />
    <ValueSetter type={SetPageSize} value={viewModel.setPageSize} />
    <GetterExtender type={LocalVisibleItems} order={1} value={ApplyPagingToVisibleItems} />
    <GetterExtender type={LoadOptionsValue} order={1} value={AddPagingToLoadOptions} />
  </Fragment>
);

@ComponentBindings()
export class DataGridNextPagingProps {
  @TwoWay()
  pageSize: number | 'all' = 20;

  @TwoWay()
  pageIndex = 0;

  @OneWay()
  enabled = true;
}

@Component({
  defaultOptionRules: null,
  angular: {
    innerComponent: false,
  },
  view: viewFunction,
})
export class DataGridNextPaging extends JSXComponent(DataGridNextPagingProps) {
  get pageSize(): number | 'all' {
    if (this.props.pageSize === 0) {
      return 'all';
    }
    return this.props.pageSize;
  }

  setPageIndex(pageIndex: number): void {
    this.props.pageIndex = pageIndex;
  }

  setPageSize(pageSize: number | 'all'): void {
    this.props.pageSize = pageSize;
  }
}
