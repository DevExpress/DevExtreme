/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  OneWay, Effect, InternalState, Provider, Slot,
} from '@devextreme-generator/declarations';

import {
  createValue, createGetter, Plugins, PluginsContext, createSelector,
} from '../../../utils/plugin/context';
import { ValueSetter } from '../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../utils/plugin/getter_extender';

import { Widget } from '../../common/widget';
import { BaseWidgetProps } from '../../common/base_props';

import type {
  ColumnInternal, Column, KeyExprInternal, RowData, Row, KeyExpr,
} from './types';

import { TableContent } from './views/table_content';
import { TableHeader } from './views/table_header';
import { Footer } from './views/footer';

import CLASSES from './classes';

export const AllItems = createValue<RowData[]>();
export const VisibleItems = createGetter<RowData[]>([]);
export const VisibleRows = createGetter<Row[]>([]);

export const Columns = createValue<ColumnInternal[]>();
export const VisibleColumns = createGetter<ColumnInternal[]>([]);

export const KeyExprPlugin = createValue<KeyExprInternal>();
export const TotalCount = createSelector<number>(
  [AllItems],
  (allItems: RowData[]) => allItems.length,
);

export const VisibleDataRows = createSelector<Row[]>(
  [VisibleItems, KeyExprPlugin],
  (visibleItems: RowData[], keyExpr: KeyExprInternal): Row[] => visibleItems.map((data) => ({
    key: keyExpr ? data[keyExpr] : data,
    data,
    rowType: 'data',
  })),
);

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
    <ValueSetter type={AllItems} value={viewModel.props.dataSource} />
    <ValueSetter type={Columns} value={viewModel.columns} />
    <ValueSetter type={KeyExprPlugin} value={viewModel.keyExpr} />
    <GetterExtender type={VisibleColumns} order={-1} value={Columns} />
    <GetterExtender type={VisibleItems} order={-1} value={AllItems} />
    <GetterExtender type={VisibleRows} order={-1} value={VisibleDataRows} />

    <div className={`${CLASSES.dataGrid} ${CLASSES.gridBaseContainer}`} role="grid" aria-label="Data grid">
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
  columns: Column[] = [];

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
  visibleColumns: ColumnInternal[] = [];

  @Effect()
  updateVisibleRowsByVisibleItems(): () => void {
    return this.plugins.watch(VisibleItems, () => {
      this.visibleRows = this.plugins.getValue(VisibleRows) ?? [];
    });
  }

  @Effect()
  updateVisibleRows(): () => void {
    return this.plugins.watch(VisibleRows, (visibleRows) => {
      this.visibleRows = visibleRows;
    });
  }

  @Effect()
  updateVisibleColumns(): () => void {
    return this.plugins.watch(VisibleColumns, (columns) => {
      this.visibleColumns = columns;
    });
  }

  get keyExpr(): KeyExprInternal {
    return this.props.keyExpr ?? null;
  }

  get columns(): ColumnInternal[] {
    const userColumns = this.props.columns;

    return userColumns.map((userColumn) => ({
      dataField: userColumn,
    }));
  }
}
