/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings,
  OneWay, Effect, InternalState, Provider, Slot, TwoWay, Event, Method, Template, JSXTemplate,
} from '@devextreme-generator/declarations';

import {
  createValue, createGetter, Plugins, PluginsContext, createSelector,
} from '../../../utils/plugin/context';
import { ValueSetter } from '../../../utils/plugin/value_setter';
import { GetterExtender } from '../../../utils/plugin/getter_extender';

import { Widget } from '../../common/widget';
import { BaseWidgetProps } from '../../common/base_props';

import type {
  ColumnInternal, Column, KeyExprInternal, RowData, Row, KeyExpr, DataState, DataSource,
} from './types';
import type Store from '../../../../data/abstract_store';
import type { LoadOptions } from '../../../../data';

import { TableContent } from './views/table_content';
import { TableHeader } from './views/table_header';
import { Footer } from './views/footer';

import CLASSES from './classes';

export const LocalData = createValue<RowData[] | undefined>();
export const LocalVisibleItems = createGetter<RowData[] | undefined>([]);
export const VisibleRows = createGetter<Row[]>([]);
export const RemoteOperations = createValue<boolean>();

export const LoadOptionsValue = createGetter<LoadOptions>({});
export const DataStateValue = createValue<DataState>();

export const Columns = createValue<ColumnInternal[]>();
export const VisibleColumns = createGetter<ColumnInternal[]>([]);
export const LocalDataState = createGetter<DataState | undefined>(undefined);

export const KeyExprPlugin = createValue<KeyExprInternal>();
export const TotalCount = createSelector<number>(
  [DataStateValue],
  (dataState: DataState) => dataState.totalCount ?? dataState.data.length,
);

export const VisibleDataRows = createSelector<Row[]>(
  [
    DataStateValue, KeyExprPlugin,
  ],
  (
    dataStateValue: DataState, keyExpr: KeyExprInternal,
  ): Row[] => dataStateValue.data.map((data) => ({
    key: keyExpr ? data[keyExpr] : data,
    data,
    rowType: 'data',
  })),
);

export const CalculateLocalDataState = createSelector(
  [LocalVisibleItems, LocalData],
  (visibleItems, localData): DataState | undefined => (Array.isArray(localData) ? {
    data: visibleItems ?? [],
    totalCount: localData.length,
  } : undefined),
);

function isStore(dataSource: DataSource): dataSource is Store {
  return dataSource !== undefined && !Array.isArray(dataSource);
}

const defaultDataState: DataState = { data: [], totalCount: 0 };

export const viewFunction = (viewModel: DataGridNext): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    accessKey={viewModel.props.accessKey}
    activeStateEnabled={viewModel.props.activeStateEnabled}
    aria={viewModel.aria}
    className={viewModel.props.className}
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
    <ValueSetter type={LocalData} value={viewModel.localData} />
    <ValueSetter type={Columns} value={viewModel.columns} />
    <ValueSetter type={KeyExprPlugin} value={viewModel.keyExpr} />
    <ValueSetter type={RemoteOperations} value={viewModel.props.remoteOperations} />
    <ValueSetter type={DataStateValue} value={viewModel.dataState} />
    <GetterExtender type={VisibleColumns} order={-1} value={Columns} />
    <GetterExtender type={LocalVisibleItems} order={-1} value={LocalData} />
    <GetterExtender type={VisibleRows} order={-1} value={VisibleDataRows} />
    <GetterExtender type={LocalDataState} order={-1} value={CalculateLocalDataState} />

    <div className={`${CLASSES.dataGrid} ${CLASSES.gridBaseContainer}`} role="grid" aria-label="Data grid">
      <TableHeader columns={viewModel.visibleColumns} />
      <TableContent
        columns={viewModel.visibleColumns}
        visibleRows={viewModel.visibleRows}
        noDataTemplate={viewModel.props.noDataTemplate}
      />
      <Footer />
      { viewModel.props.children }
    </div>
  </Widget>
);

@ComponentBindings()
export class DataGridNextProps extends BaseWidgetProps {
  @OneWay()
  dataSource?: DataSource;

  @OneWay()
  remoteOperations = false;

  @OneWay()
  cacheEnabled = true;

  @TwoWay()
  dataState: DataState | undefined = undefined;

  @OneWay()
  keyExpr?: KeyExpr;

  @OneWay()
  columns: Column[] = [];

  @Event()
  onDataErrorOccurred?: (e: { error: Error }) => void;

  @Slot()
  children?: JSX.Element | JSX.Element[];

  @Template()
  noDataTemplate?: JSXTemplate;
}

const aria = {
  role: 'presentation',
};

@Component({
  defaultOptionRules: null,
  angular: { innerComponent: false },
  view: viewFunction,
})
export class DataGridNext extends JSXComponent(DataGridNextProps) {
  // eslint-disable-next-line class-methods-use-this
  get aria(): Record<string, string> {
    return aria;
  }

  get dataState(): DataState {
    return this.props.dataState ?? defaultDataState;
  }

  @Provider(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  visibleRows: Row[] = [];

  @InternalState()
  visibleColumns: ColumnInternal[] = [];

  @InternalState()
  loadedData?: RowData[];

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

  @Effect()
  updateDataStateFromLocal(): () => void {
    return this.plugins.watch(LocalDataState, (dataState) => {
      if (dataState !== undefined) {
        this.props.dataState = dataState;
      }
    });
  }

  @Effect()
  loadDataSource(): () => void {
    const { dataSource, cacheEnabled } = this.props;
    let prevLoadOptions: LoadOptions | undefined = undefined;
    return this.plugins.watch(LoadOptionsValue, (loadOptions) => {
      if (!cacheEnabled || JSON.stringify(loadOptions) !== JSON.stringify(prevLoadOptions)) {
        prevLoadOptions = loadOptions;
        this.loadDataSourceIfNeed(dataSource, loadOptions);
      }
    });
  }

  @Method()
  refresh(): void {
    const loadOptions = this.plugins.getValue(LoadOptionsValue) ?? {};

    this.loadDataSourceIfNeed(this.props.dataSource, loadOptions);
  }

  get keyExpr(): KeyExprInternal {
    const { dataSource } = this.props;
    const storeKey = isStore(dataSource) ? (dataSource.key() as string) : null;
    return this.props.keyExpr ?? storeKey ?? null;
  }

  get columns(): ColumnInternal[] {
    const userColumns = this.props.columns;

    return userColumns.map((userColumn) => ({
      dataField: userColumn,
    }));
  }

  get localData(): RowData[] | undefined {
    const { dataSource } = this.props;
    return Array.isArray(dataSource) ? dataSource : this.loadedData;
  }

  loadDataSourceIfNeed(dataSource: DataSource, loadOptions: LoadOptions): void {
    if (isStore(dataSource)) {
      this.loadStore(dataSource, loadOptions);
    }
  }

  loadStore(store: Store, loadOptions: LoadOptions): void {
    store.load(loadOptions).then(((data, extra) => {
      if (this.props.remoteOperations) {
        if (Array.isArray(data)) {
          this.props.dataState = {
            dataOffset: loadOptions.skip,
            data,
            ...extra,
          };
        } else {
          this.props.dataState = { ...data, dataOffset: loadOptions.skip };
        }
      } else {
        this.loadedData = data;
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any, (error) => {
      this.props.onDataErrorOccurred?.({ error });
    });
  }
}
