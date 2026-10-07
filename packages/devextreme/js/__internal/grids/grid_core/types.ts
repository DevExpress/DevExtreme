/* eslint-disable spellcheck/spell-checker */
import type {
  ColumnCustomizeTextArg, GridBase, GridBaseOptions, SelectionBase,
} from '@js/common/grids';
import type { PropertyType } from '@js/core';
import type { Component } from '@js/core/component';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { Format } from '@js/localization';
import type {
  Properties as DataGridOptions,
  Scrolling as DataGridScrolling,
  SummaryTotalItem,
} from '@js/ui/data_grid';
import type { Properties as TreeListdOptions, Scrolling as TreeListScrolling } from '@js/ui/tree_list';
import type Widget from '@js/ui/widget/ui.widget';
import type { ActionConfig } from '@ts/core/widget/component';
import type { NormalizedDataSourceOptions, StoreLoadOptions } from '@ts/data/data_source/types';
import type { FilterValue } from '@ts/grids/grid_core/filter/types';
import type { ModuleItem } from '@ts/grids/grid_core/modules/modules';

export type GridPropertyType<T, TProp extends string> = PropertyType<T, TProp> extends never
  ? never
  : PropertyType<T, TProp> | undefined;

// Data types
export type RowKey = unknown;

export interface ColumnPoint {
  index: number;
  columnIndex: number;
  x: number;
  y: number;
}

export interface SelectionRange {
  selectionStart: number;
  selectionEnd: number;
}

export interface FormatOptions {
  format?: Format;
  getDisplayFormat?: (valueText: string) => string;
  customizeText?: (cellInfo: ColumnCustomizeTextArg & { valueText: string }) => string;
  target?: string;
  groupInterval?: string | number;
  trueText?: string;
  falseText?: string;
}

/** @architectureLeak data_grid/summary: core renders summary texts in group rows */
export interface SummaryTextItem extends Pick<SummaryTotalItem, 'displayFormat' | 'valueFormat' | 'customizeText'> {
  summaryType: string;
  value?: unknown;
  columnCaption?: string;
}

export interface LoadPanelPosition {
  of: dxElementWrapper | undefined;
  boundary?: dxElementWrapper;
  collision?: 'fit';
}

export type WidgetElementData = Record<string, unknown> & { dxComponents?: string[] };

export interface ColumnPointProps extends ColumnPoint {
  item: Element | undefined;
  isLeftBoundary?: boolean;
  isRightBoundary?: boolean;
}

export type HeaderFilterGroupSelector = (data: unknown) => unknown;

export interface HeaderFilterGroupDescriptor {
  selector: string | HeaderFilterGroupSelector | undefined;
  groupInterval?: string | number;
  isExpanded?: boolean;
  compare?: (value1: unknown, value2: unknown) => number;
}

export type HeaderFilterGroupItem = HeaderFilterGroupDescriptor | HeaderFilterGroupSelector;

export type HeaderFilterGroup = HeaderFilterGroupSelector | HeaderFilterGroupItem[];

export interface ExpandCellTemplateOptions {
  value?: unknown;
  data?: { isContinuation?: boolean };
  row: { isNewRow?: boolean };
  component: InternalGrid;
}

export interface ExpandCellTemplate {
  allowRenderToDetachedContainer: boolean;
  render: (container: dxElementWrapper, options: ExpandCellTemplateOptions) => void;
}

export type TextSelectionElement = Element & {
  selectionStart?: number | null;
  selectionEnd?: number | null;
  setSelectionRange?: (start: number, end: number) => void;
};

export interface OptionsReader {
  option: (name: string) => unknown;
}

export type WrappedLookupDataSource = NormalizedDataSourceOptions & {
  __dataGridSourceFilter: unknown;
  load: (loadOptions: StoreLoadOptions) => DeferredObj<unknown>;
  key: string | undefined;
  byKey: (key: unknown) => Promise<unknown>;
};

export type LookupDataSource = never[] | NormalizedDataSourceOptions | WrappedLookupDataSource;

type OptionsMethod<TOptions> = (() => TOptions)
  & ((options: TOptions) => void)
  & (
    <TPropertyName extends string>(
      optionName: TPropertyName,
    ) => GridPropertyType<TOptions, TPropertyName>
  ) & (
    <TPropertyName extends string>(
      optionName: TPropertyName,
      optionValue: GridPropertyType<TOptions, TPropertyName>,
    ) => void
  );

type GridBaseType = GridBase<unknown, unknown> & Omit<Widget<InternalGridOptions>, 'option'>;

export type CreateComponentOptions<TComponent> = TComponent extends {
  _getDefaultOptions: () => infer TOptions;
}
  ? string extends keyof TOptions
    ? object
    : Partial<TOptions> & { integrationOptions?: Record<string, unknown> }
  : TComponent extends Component<infer TOptions>
    ? Partial<TOptions> | Record<string, unknown>
    : Record<string, unknown>;

export type CreateComponent<TComponent extends Component<object>> = (
  $container: dxElementWrapper,
  component: new (...args) => TComponent,
  options?: CreateComponentOptions<TComponent>,
) => TComponent;

export interface InternalGrid extends GridBaseType {
  _views: Views;

  _controllers: Controllers;

  option: OptionsMethod<InternalGridOptions>;

  NAME: 'dxDataGrid' | 'dxTreeList';

  _updateLockCount: number;

  _requireResize?: boolean;

  _optionCache?: Record<string, unknown>;

  _fireContentReadyAction: () => Promise<void> | DeferredObj<void> | void;

  setAria: (name: string, value: string, $target: dxElementWrapper) => void;

  _renderDimensions: () => void;

  getView: <T extends keyof Views>(name: T) => Views[T];

  getController: <T extends keyof Controllers>(name: T) => Controllers[T];

  _optionsByReference: Record<string, boolean>;

  _disposed?: boolean;

  _createComponent: <TComponent extends Component<object>>(
    $container: dxElementWrapper,
    component: new (...args) => TComponent,
    options?: CreateComponentOptions<TComponent>,
  ) => TComponent;

  _createAction: (actionSource: unknown, config?: ActionConfig) => ModuleItemAction;

  _createActionByOption: (optionName: string, config?: ActionConfig) => ModuleItemAction;
  isReady: () => boolean;

  _setOptionWithoutOptionChange: (name: string, value: unknown) => void;
}

type TemporarlyOptionsTakenFromDataGrid = Pick<DataGridOptions,
'onFocusedCellChanged'
| 'dataRowTemplate'
| 'onRowClick'
| 'onRowDblClick'
| 'onRowPrepared'
| 'onCellPrepared'
| 'onCellClick'
| 'onCellHoverChanged'
| 'onCellDblClick'
| 'onFocusedCellChanging'
| 'onFocusedRowChanged'
| 'onFocusedRowChanging'
| 'onEditingStart'
| 'toolbar'
| 'summary'
| 'remoteOperations'
| 'keyExpr'
| 'selectionFilter'
| 'sortByGroupSummaryInfo'
>;

type TemporarlyOptionsTakenFromTreeList = Pick<TreeListdOptions<unknown, RowKey>,
'onNodesInitialized'
| 'expandedRowKeys'
>;
interface InternalSelection extends SelectionBase {
  alwaysSelectByShift?: boolean;
}

export interface InternalGridOptions extends
  GridBaseOptions<InternalGrid, unknown, unknown>,
  TemporarlyOptionsTakenFromDataGrid,
  TemporarlyOptionsTakenFromTreeList {
  loadingTimeout?: number;

  useLegacyKeyboardNavigation?: boolean;

  forceApplyBindings?: () => void;

  loadItemsOnExportingSelectedItems?: boolean | undefined;

  selection?: InternalSelection;

  scrolling?: DataGridScrolling | TreeListScrolling;

  filterValue?: FilterValue;
}

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DecrementalCounter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

type IsObject<T> = 0 extends (1 & T)
  ? false
  : T extends unknown[]
    ? false
    : string extends keyof T
      ? false
      : T extends object
        ? true
        : false;

type DotNestedKeys<T, RLIMIT extends number = 10> = (
  IsObject<T> extends true
    ? (
      RLIMIT extends 1 ? keyof T
        : {
          [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K], DecrementalCounter[RLIMIT]>>}` | K
        }[Exclude<keyof T, symbol>]
    )
    : ''
) extends infer D ? Extract<D, string> : never;

interface OptionChangedArgs<TOptions, T extends string = string> {
  name: T extends `${infer TName}.${string}` ? TName : T;
  fullName: T;
  previousValue: GridPropertyType<TOptions, T>;
  value: GridPropertyType<TOptions, T>;
  handled: boolean;
}

// A feature outside grid_core unions its own slice in, e.g.
// `OptionChanged | OptionChangedFor<Pick<Properties, 'grouping'>>`.
export type OptionChangedFor<TOptions> = {
  [P in DotNestedKeys<Required<TOptions>>]: OptionChangedArgs<TOptions, P>;
}[DotNestedKeys<Required<TOptions>>];

export type OptionChanged = OptionChangedFor<InternalGridOptions>;

export interface Controllers {
  adaptiveColumns: import('./adaptivity/m_adaptivity').AdaptiveColumnsController;
  applyFilter: import('./filter_row/m_filter_row').ApplyFilterViewController;
  columnChooser: import('./column_chooser/m_column_chooser').ColumnChooserController;
  columns: import('./columns_controller/columns_controller').ColumnsController;
  columnsResizer: import('./columns_resizing_reordering/m_columns_resizing_reordering').ColumnsResizerViewController;
  contextMenu: import('./context_menu/m_context_menu').ContextMenuController;
  data: import('./data_controller/data_controller').DataController;
  dataSource: import('./data_source/data_source_controller').DataSourceController;
  draggingHeader: import('./columns_resizing_reordering/m_columns_resizing_reordering').DraggingHeaderViewController;
  editing: import('./editing/m_editing').EditingController;
  editorFactory: import('./editor_factory/m_editor_factory').EditorFactory;
  errorHandling: import('./error_handling/error_handling_view_controller').ErrorHandlingViewController;
  // todo: export is dataGrid-only controller
  export: import('../data_grid/export/m_export').ExportController;
  filter: import('./filter/filter_controller').FilterController;
  filterSync: import('./filter_sync/filter_sync').FilterSyncController;
  filterBuilder: import('./filter_builder/m_filter_builder').FilterBuilderController;
  focus: import('./focus/m_focus').FocusController;
  headerFilter: import('./header_filter/m_header_filter').HeaderFilterController;
  keyboardNavigation: import('./keyboard_navigation/m_keyboard_navigation').KeyboardNavigationController;
  columnFocusDispatcher: import('./keyboard_navigation/column_focus_dispatcher').ColumnFocusDispatcher;
  headersKeyboardNavigation: import('./keyboard_navigation/m_headers_keyboard_navigation').HeadersKeyboardNavigationController;
  groupPanelKeyboardNavigation: import('../data_grid/keyboard_navigation/m_group_panel_keyboard_navigation').GroupPanelKeyboardNavigationController;
  resizing: import('./views/m_grid_view').ResizingController;
  selection: import('./selection/m_selection').SelectionController;
  validating: import('./validating/m_validating').ValidatingController;
  searchPanel: import('./search/m_search').SearchPanelViewController;
  stateStoring: import('./state_storing/state_storing_controller_core').StateStoringController;
  synchronizeScrolling: import('./views/m_grid_view').SynchronizeScrollingController;
  tablePosition: import('./columns_resizing_reordering/m_columns_resizing_reordering').TablePositionViewController;
  toastViewController: import('./toast/toast_controller').ToastViewController;
  aiColumn: import('./ai_column/controllers/ai_column_controller').AIColumnController;
  aiPromptEditor: import('./ai_column/controllers/ai_prompt_editor_view_controller').AIPromptEditorViewController;
  aiAssistant: import('./ai_assistant/ai_assistant_controller').AIAssistantController;
  aiAssistantViewController: import('./ai_assistant/ai_assistant_view_controller').AIAssistantViewController;
}

type ControllerTypes = {
  [ P in keyof Controllers ]: new(component: InternalGrid) => Controllers[P];
};

export interface Views {
  columnChooserView: import('./column_chooser/m_column_chooser').ColumnChooserView;
  columnHeadersView: import('./column_headers/m_column_headers').ColumnHeadersView;
  headerPanel: import('./header_panel/m_header_panel').HeaderPanel;
  headerFilterView: import('./header_filter/m_header_filter_core').HeaderFilterView;
  rowsView: import('./views/m_rows_view').RowsView;
  pagerView: import('./pager/m_pager').PagerView;
  columnsSeparatorView: import('./columns_resizing_reordering/m_columns_resizing_reordering').ColumnsSeparatorView;
  blockSeparatorView: import('./columns_resizing_reordering/m_columns_resizing_reordering').BlockSeparatorView;
  draggingHeaderView: import('./columns_resizing_reordering/m_columns_resizing_reordering').DraggingHeaderView;
  trackerView: import('./columns_resizing_reordering/m_columns_resizing_reordering').TrackerView;
  contextMenuView: import('./context_menu/m_context_menu').ContextMenuView;
  footerView: import('../data_grid/summary/m_summary').FooterView;
  gridView: import('./views/m_grid_view').GridView;
  filterBuilderView: import('./filter_builder/m_filter_builder').FilterBuilderView;
  filterPanelView: import('./filter_panel/m_filter_panel').FilterPanelView;
  toastView: import('./toast/toast_view').ToastView;
  aiPromptEditorView: import('./ai_column/views/ai_prompt_editor_view').AIPromptEditorView;
  aiAssistantView: import('./ai_assistant/ai_assistant_view').AIAssistantView;
}

type ViewTypes = {
  [ P in keyof Views ]: new(component: InternalGrid) => Views[P];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mixin constructors need any[]
export type ModuleType<T extends ModuleItem> = (new (...args: any[]) => T);

type ControllersExtender = {
  [P in keyof Controllers]: (Base: ModuleType<Controllers[P]>) => ModuleType<Controllers[P]>;
};

type ViewsExtender = {
  [P in keyof Views]: (Base: ModuleType<Views[P]>) => ModuleType<Views[P]>;
};

export interface ModuleItemCallbackFlags {
  stopOnFalse?: boolean;
  unique?: boolean;
  syncStrategy?: boolean;
}

export type ModuleItemAction = (event?: unknown) => unknown;

export interface Module {
  controllers?: Partial<ControllerTypes>;
  views?: Partial<ViewTypes>;
  extenders?: {
    controllers?: Partial<ControllersExtender>;
    views?: Partial<ViewsExtender>;
  };
  defaultOptions?: () => InternalGridOptions;
}
