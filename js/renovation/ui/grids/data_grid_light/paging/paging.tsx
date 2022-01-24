/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay,
  TwoWay, Fragment, Consumer, Effect, InternalState,
} from '@devextreme-generator/declarations';

import { Plugins, PluginsContext } from '../../../../utils/plugin/context';
import { ValueSetter } from '../../../../utils/plugin/value_setter';
// import { GetterExtender } from '../../../../utils/plugin/getter_extender';

import { VisibleItems } from '../data_grid_light';
import { RowData } from '../types';

import {
  PageIndex, PageSize, SetPageIndex, SetPageSize,
} from './plugins';

export const viewFunction = (viewModel: Paging): JSX.Element => (
  <Fragment>
    <ValueSetter type={PageIndex} value={viewModel.props.pageIndex} />
    <ValueSetter type={PageSize} value={viewModel.pageSize} />
    {/* <ValueSetter type={SetPageIndex} value={viewModel.setPageIndex} /> */}
    {/* <ValueSetter type={SetPageSize} value={viewModel.setPageSize} /> */}
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
  jQuery: { register: true },
  view: viewFunction,
})
export class Paging extends JSXComponent(PagingProps) {
  @Consumer(PluginsContext)
  plugins!: Plugins;

  @InternalState() forceCounter = 1;

  @Effect()
  updateVisibleItems(): () => void {
    return this.plugins.extend(
      VisibleItems,
      1,
      this.calculateVisibleItems.bind(this),
    );
  }

  @Effect()
  updatePageIndexSetter(): void {
    this.plugins.set(
      SetPageIndex,
      this.setPageIndex.bind(this),
    );
  }

  @Effect()
  updatePageSizeSetter(): void {
    this.plugins.set(
      SetPageSize,
      this.setPageSize.bind(this),
    );
  }

  get pageSize(): number | 'all' {
    if (this.props.pageSize === 0) {
      return 'all';
    }
    return this.props.pageSize;
  }

  setPageIndex(pageIndex: number): void {
    this.props.pageIndex = pageIndex;
    this.forceCounter += 1;
  }

  setPageSize(pageSize: number | 'all'): void {
    this.props.pageSize = pageSize;
    this.forceCounter += 1;
  }

  calculateVisibleItems(dataSource: RowData[]): RowData[] {
    let { forceCounter } = this;
    /* istanbul ignore next */
    if (!forceCounter) { forceCounter = 0; }
    if (!this.props.enabled || this.pageSize === 'all') {
      return dataSource;
    }

    const start = (this.props.pageIndex as number) * (this.pageSize as number);
    const end = start + (this.pageSize as number);

    return dataSource.slice(start, end);
  }
}
