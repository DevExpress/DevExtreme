/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay,
  TwoWay, Fragment,
} from '@devextreme-generator/declarations';

import { ValueSetter } from '../../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../../utils/plugin/getter_extender';

import { VisibleItems } from '../data_grid_light';
import { RowData } from '../types';

import {
  PageIndex, PageSize, SetPageIndex, SetPageSize,
} from './plugins';

export const viewFunction = (viewModel: Paging): JSX.Element => (
  <Fragment>
    <ValueSetter type={PageIndex} value={viewModel.props.pageIndex} />
    <ValueSetter type={PageSize} value={viewModel.pageSize} />
    <ValueSetter type={SetPageIndex} value={viewModel.setPageIndex} />
    <ValueSetter type={SetPageSize} value={viewModel.setPageSize} />
    <GetterExtender type={VisibleItems} order={1} func={viewModel.calculateVisibleItems} />
  </Fragment>
);

@ComponentBindings()
export class PagingProps {
  @TwoWay()
  pageSize: number | 'all' = 20;

  @TwoWay()
  pageIndex = 0;

  @OneWay()
  enabled = true;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Paging extends JSXComponent(PagingProps) {
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

  calculateVisibleItems(dataSource: RowData[]): RowData[] {
    if (!this.props.enabled || this.pageSize === 'all') {
      return dataSource;
    }

    const pageSize = this.pageSize as number;
    const start = (this.props.pageIndex as number) * pageSize;
    const end = start + pageSize;

    return dataSource.slice(start, end);
  }
}
