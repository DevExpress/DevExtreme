/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay,
  TwoWay, Fragment, Consumer, Effect, InternalState,
} from '@devextreme-generator/declarations';
import { Plugins, PluginsContext, createValue } from '../../../../utils/plugin/context';

import { VisibleItems } from '../data_grid_light';
import { RowData } from '../types';

export const viewFunction = (): JSX.Element => <Fragment />;

@ComponentBindings()
export class PagingProps {
  @TwoWay()
  pageSize: number | 'all' = 20;

  @TwoWay()
  pageIndex = 0;

  @OneWay()
  enabled = true;
}

export interface PagingPluginData {
  pageCount: number;

  totalCount: number;

  pageSize: number | 'all';

  pageIndex: number;

  enabled: boolean;
}

export const PagingPlugin = createValue<PagingPluginData>();

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Paging extends JSXComponent(PagingProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  dataSource: RowData[] = [];

  @Effect()
  addPagingHandler(): () => void {
    return this.plugins.extend(VisibleItems, 1, (items): RowData[] => {
      this.dataSource = items;
      return this.calculateVisibleItems(items);
    });
  }

  @Effect()
  subscribeToPagingPluginUpdates(): void {
    this.plugins.watch(PagingPlugin, (prop: PagingPluginData) => {
      this.props.pageIndex = prop.pageIndex;
      this.props.pageSize = prop.pageSize;
    });
  }

  @Effect()
  updatePagingProps(): void {
    this.plugins.set(PagingPlugin, {
      ...this.plugins.getValue(PagingPlugin),
      enabled: this.props.enabled,
      pageSize: this.pageSize,
      pageIndex: this.props.pageIndex,
      totalCount: this.totalCount,
      pageCount: this.pageCount,
    });
  }

  calculateVisibleItems(dataSource: RowData[]): RowData[] {
    if (!this.props.enabled || this.pageSize === 'all') {
      return dataSource;
    }

    const start = (this.props.pageIndex as number) * (this.pageSize as number);
    const end = start + (this.pageSize as number);

    return dataSource.slice(start, end);
  }

  get totalCount(): number {
    return this.dataSource.length;
  }

  get pageCount(): number {
    if (this.pageSize === 'all') {
      return 1;
    }

    return Math.ceil(this.totalCount / (this.pageSize as number));
  }

  get pageSize(): number | 'all' {
    if (this.props.pageSize === 0) {
      return 'all';
    }

    return this.props.pageSize;
  }
}
