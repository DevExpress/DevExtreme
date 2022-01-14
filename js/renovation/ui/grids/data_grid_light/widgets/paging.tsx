/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay,
  TwoWay, Fragment,
} from '@devextreme-generator/declarations';
import {
  createValue, createSelector,
} from '../../../../utils/plugin/context';

import { ValueSetter } from '../../../../utils/plugin/value_setter';
// import { GetterExtender } from '../../../../utils/plugin/getter_extender';

import { TotalCount } from '../data_grid_light';
import { RowData } from '../types';

export const PageIndex = createValue<number>();
export const SetPageIndex = createValue<(pageIndex: number) => void>();
export const PageSize = createValue<number | 'all'>();
export const SetPageSize = createValue<(pageSize: number | 'all') => void>();

export const PageCount = createSelector(
  [TotalCount, PageSize],
  (totalCount, pageSize) => {
    if (pageSize === 'all') {
      return 1;
    }
    return Math.ceil(totalCount / pageSize);
  },
);

export const viewFunction = (viewModel: Paging): JSX.Element => (
  <Fragment>
    <ValueSetter type={PageIndex} func={viewModel.props.pageIndex} />
    <ValueSetter type={PageSize} value={viewModel.pageSize} />
    <ValueSetter type={SetPageIndex} value={viewModel.setPageIndex} />
    <ValueSetter type={SetPageSize} value={viewModel.setPageSize} />
    {/* <GetterExtender type={VisibleItems} order={1} func={viewModel.calculateVisibleItems} /> */}
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
