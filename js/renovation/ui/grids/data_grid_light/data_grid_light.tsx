/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  OneWay, Effect, InternalState, Provider, Slot,
} from '@devextreme-generator/declarations';

import {
  createValue, createGetter, Plugins, PluginsContext,
} from '../../../utils/plugin/context';
import { Widget } from '../../common/widget';
import { BaseWidgetProps } from '../../common/base_props';

import type {
  Column, ColumnUserConfig, KeyExpr, RowData, Row,
} from './types';

import { TableContent } from './views/table_content';
import { TableHeader } from './views/table_header';
import { Footer } from './views/footer';

export const VisibleItems = createGetter<RowData[]>([]);
export const VisibleRows = createGetter<Row[]>([]);
export const VisibleColumns = createGetter<Column[]>([]);
export const Items = createValue<RowData[]>();
export const KeyExprPlugin = createValue<KeyExpr>();
export const TotalCount = createValue<number>();

export const viewFunction = (viewModel: DataGridLight): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    accessKey={viewModel.props.accessKey}
    activeStateEnabled={viewModel.props.activeStateEnabled}
    aria={viewModel.aria}
    disabled={viewModel.props.disabled}
    focusStateEnabled={viewModel.props.focusStateEnabled}
    height={viewModel.props.height}
    hint={viewModel.props.hint}
    hoverStateEnabled={viewModel.props.hoverStateEnabled}
    rtlEnabled={viewModel.props.rtlEnabled}
    tabIndex={viewModel.props.tabIndex}
    visible={viewModel.props.visible}
    width={viewModel.props.width}
    {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  >
    <div className="dx-datagrid dx-gridbase-container" role="grid" aria-label="Data grid">
      <TableHeader columns={viewModel.visibleColumns} />
      <TableContent columns={viewModel.visibleColumns} dataSource={viewModel.visibleRows} />
      <Footer />
      { viewModel.props.children }
    </div>
  </Widget>
);

@ComponentBindings()
export class DataGridLightProps extends BaseWidgetProps {
  @OneWay()
  dataSource: RowData[] = [];

  @OneWay()
  keyExpr?: KeyExpr;

  @OneWay()
  columns: ColumnUserConfig[] = [];

  @Slot()
  children?: JSX.Element | JSX.Element[];
}

const aria = {
  role: 'presentation',
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export class DataGridLight extends JSXComponent(DataGridLightProps) {
  // eslint-disable-next-line class-methods-use-this
  get aria(): Record<string, string> {
    return aria;
  }

  @Provider(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  visibleRows: Row[] = [];

  @InternalState()
  visibleColumns: Column[] = [];

  @Effect()
  updateTotalCount(): void {
    this.plugins.set(TotalCount, this.props.dataSource.length);
  }

  @Effect()
  updateVisibleRowsByVisibleItems(): () => void {
    return this.plugins.watch(VisibleItems, () => {
      this.visibleRows = this.plugins.getValue(VisibleRows) as Row[];
    });
  }

  @Effect()
  updateVisibleRows(): () => void {
    return this.plugins.watch(VisibleRows, (visibleRows) => {
      this.visibleRows = visibleRows;
    });
  }

  @Effect()
  setDataSourceToVisibleItems(): () => void {
    return this.plugins.extend(VisibleItems, -1, () => this.props.dataSource);
  }

  @Effect()
  setVisibleRowsByVisibleItems(): () => void {
    return this.plugins.extend(VisibleRows, -1, () => {
      const visibleItems = this.plugins.getValue(VisibleItems) as RowData[];

      return this.processVisibleItems(visibleItems);
    });
  }

  @Effect()
  updateVisibleColumns(): () => void {
    return this.plugins.watch(VisibleColumns, (columns) => {
      this.visibleColumns = columns;
    });
  }

  @Effect()
  setInitialColumnsToVisibleColumns(): () => void {
    return this.plugins.extend(
      VisibleColumns, -1, () => this.columns,
    );
  }

  @Effect()
  updateKeyExpr(): void {
    this.plugins.set(KeyExprPlugin, this.props.keyExpr);
  }

  @Effect()
  updateDataSource(): void {
    this.plugins.set(Items, this.props.dataSource);
  }

  get columns(): Column[] {
    const userColumns = this.props.columns;

    return userColumns.map((userColumn) => ({
      dataField: userColumn,
    }));
  }

  processVisibleItems(visibleItems: RowData[]): Row[] {
    const keyExpr = this.props.keyExpr as string;

    return visibleItems.map((data) => ({
      key: data[keyExpr],
      data,
      rowType: 'data',
    }));
  }
}
