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
  Column, ColumnUserConfig, KeyExpr, RowData,
} from './types';

import { TableContent } from './views/table_content';
import { TableHeader } from './views/table_header';
import { Footer } from './views/footer';

export const VisibleItems = createGetter<RowData[]>([]);
export const VisibleColumns = createGetter<Column[]>([]);
export const DataSource = createValue<RowData[]>();
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
      <TableContent columns={viewModel.visibleColumns} dataSource={viewModel.visibleItems} />
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
  visibleItems: RowData[] = [];

  @InternalState()
  visibleColumns: Column[] = [];

  @Effect()
  updateTotalCount(): void {
    this.plugins.set(TotalCount, this.props.dataSource.length);
  }

  updateVisibleItems(): () => void {
    return this.plugins.watch(VisibleItems, (items) => {
      this.visibleItems = items;
    });
  }

  @Effect()
  setDataSourceToVisibleItems(): () => void {
    return this.plugins.extend(
      VisibleItems, -1, () => this.props.dataSource,
    );
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
    this.plugins.set(DataSource, this.props.dataSource);
  }

  get columns(): Column[] {
    const userColumns = this.props.columns;

    return userColumns.map((userColumn) => ({
      dataField: userColumn,
    }));
  }
}
