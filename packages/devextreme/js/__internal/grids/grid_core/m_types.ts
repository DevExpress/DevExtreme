/* eslint-disable spellcheck/spell-checker */
/* eslint-disable max-classes-per-file */
import type { GridBase, GridBaseOptions, SelectionBase } from '@js/common/grids';
import type { Component } from '@js/core/component';
import type { PropertyType } from '@js/core/index';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridOptions } from '@js/ui/data_grid';
import type { Properties as TreeListdOptions } from '@js/ui/tree_list';
import type Widget from '@js/ui/widget/ui.widget';

import type { EditingController } from './editing/m_editing';
import type { ModuleItem } from './m_modules';

export type GridPropertyType<T, TProp extends string> = PropertyType<T, TProp> extends never ? never : PropertyType<T, TProp> | undefined;

// Data types
export type RowKey = unknown;

export interface ColumnPoint {
  index: number;
  columnIndex: number;
  x: number;
  y: number;
}

// todo: move to upper .d.ts
type OptionsMethod<TOptions> =
  (() => TOptions) &
  ((options: TOptions) => void) &
  (
    <TPropertyName extends string>(
      optionName: TPropertyName
    ) => GridPropertyType<TOptions, TPropertyName>
  ) & (
    <TPropertyName extends string>(
      optionName: TPropertyName,
      optionValue: GridPropertyType<TOptions, TPropertyName>
    ) => void
  );

type GridBaseType = GridBase<unknown, unknown> & Omit<Widget<InternalGridOptions>, 'option'>;

export interface InternalGrid extends GridBaseType {
  _views: Views;

  _controllers: Controllers;

  option: OptionsMethod<InternalGridOptions>;

  NAME: 'dxDataGrid' | 'dxTreeList';

  _updateLockCount: number;

  _requireResize: boolean;

  _optionCache: any;

  _fireContentReadyAction: any;

  setAria: any;

  _renderDimensions: any;

  getView: <T extends keyof Views>(name: T) => Views[T];

  getController: <T extends keyof Controllers>(name: T) => Controllers[T];

  _optionsByReference: any;

  _disposed: any;

  _createComponent: <TComponent extends Component<any>>(
    $container: dxElementWrapper,
    component: new (...args) => TComponent,
    options?: TComponent extends Component<infer TOptions> ? TOptions : never
  ) => TComponent;

  _createAction: any;

  _createActionByOption: any;
  isReady: any;

  _setOptionWithoutOptionChange: any;
}

type TemporarlyOptionsTakenFromDataGrid = Pick<DataGridOptions,
'onFocusedCellChanged' |
'onRowClick' |
'onRowDblClick' |
'onRowPrepared' |
'onCellPrepared' |
'onCellClick' |
'onCellHoverChanged' |
'onCellDblClick' |
'onFocusedCellChanging' |
'onFocusedRowChanged' |
'onFocusedRowChanging' |
'onEditingStart' |
'toolbar'
>;

type TemporarlyOptionsTakenFromTreeList = Pick<TreeListdOptions,
'onNodesInitialized' |
'expandedRowKeys'
>;
interface InternalSelection extends SelectionBase {
  alwaysSelectByShift?: boolean;
}

export interface InternalGridOptions extends GridBaseOptions<InternalGrid, unknown, unknown>, TemporarlyOptionsTakenFromDataGrid, TemporarlyOptionsTakenFromTreeList {
  dataRowTemplate?: any;

  loadingTimeout?: number;

  useLegacyKeyboardNavigation?: boolean;

  rowTemplate?: any;

  forceApplyBindings?: any;

  loadItemsOnExportingSelectedItems?: boolean | undefined;

  selection?: InternalSelection;
}

// todo: move to upper .d.ts files
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

// todo: move to upper .d.ts files
type DecrementalCounter = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// todo: move to upper .d.ts files
type IsObject<T> =
  0 extends (1 & T)
    ? false
    : T extends any[]
      ? false
      : string extends keyof T
        ? false
        : T extends object
          ? true
          : false;

// todo: move to upper .d.ts files
type DotNestedKeys<T, RLIMIT extends number = 10> =
(
  IsObject<T> extends true ?
    (
      RLIMIT extends 1 ? keyof T :
        {
          [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K], DecrementalCounter[RLIMIT]>>}` | K
        }[Exclude<keyof T, symbol>]
    ) :
    ''
) extends infer D ? Extract<D, string> : never;

// todo: move to upper .d.ts files
interface OptionChangedArgs<T extends string = string> {
  name: T extends `${infer TName}.${string}` ? TName : T;
  fullName: T;
  previousValue: GridPropertyType<InternalGridOptions, T>;
  value: GridPropertyType<InternalGridOptions, T>;
  handled: boolean;
}

// todo: move to upper .d.ts files
type OptionNames = DotNestedKeys<Required<InternalGridOptions>>;

// todo: move to upper .d.ts files
export type OptionChanged = {
  [P in OptionNames]: OptionChangedArgs<P>;
}[OptionNames];

export interface Controllers {
  adaptiveColumns: import('./adaptivity/m_adaptivity').AdaptiveColumnsController;
  applyFilter: import('./filter/m_filter_row').ApplyFilterViewController;
  columnChooser: import('./column_chooser/m_column_chooser').ColumnChooserController;
  columns: import('./columns_controller/m_columns_controller').ColumnsController;
  columnsResizer: import('./columns_resizing_reordering/m_columns_resizing_reordering').ColumnsResizerViewController;
  contextMenu: import('./context_menu/m_context_menu').ContextMenuController;
  data: import('./data_controller/m_data_controller').DataController;
  draggingHeader: import('./columns_resizing_reordering/m_columns_resizing_reordering').DraggingHeaderViewController;
  // todo: export is dataGrid-only controller
  editing: import('./editing/m_editing').EditingController;
  editorFactory: import('./editor_factory/m_editor_factory').EditorFactory;
  errorHandling: import('./error_handling/m_error_handling').ErrorHandlingController;
  export: import('../data_grid/export/m_export').ExportController;
  filterSync: import('./filter/m_filter_sync').FilterSyncController;
  focus: import('./focus/m_focus').FocusController;
  headerFilter: import('./header_filter/m_header_filter').HeaderFilterController;
  keyboardNavigation: import('./keyboard_navigation/m_keyboard_navigation').KeyboardNavigationController;
  resizing: import('./views/m_grid_view').ResizingController;
  selection: import('./selection/m_selection').SelectionController;
  validating: import('./validating/m_validating').ValidatingController;
  stateStoring: import('./state_storing/m_state_storing_core').StateStoringController;
  synchronizeScrolling: import('./views/m_grid_view').SynchronizeScrollingController;
  tablePosition: import('./columns_resizing_reordering/m_columns_resizing_reordering').TablePositionViewController;
}

type ControllerTypes = {
  [ P in keyof Controllers ]: new(component: any) => Controllers[P];
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
  filterBuilderView: import('./filter/m_filter_builder').FilterBuilderView;
  filterPanelView: import('./filter/m_filter_panel').FilterPanelView;
}

export interface EditingControllerRequired {
  _editingController: EditingController;
}

type ViewTypes = {
  [ P in keyof Views ]: new(component: any) => Views[P];
};

export type ModuleType<T extends ModuleItem> = (new (...args: any[]) => T);

type ControllersExtender = {
  [P in keyof Controllers]: ((Base: ModuleType<Controllers[P]>) => ModuleType<Controllers[P]>)
  | Record<string, any>;
};

type ViewsExtender = {
  [P in keyof Views]: ((Base: ModuleType<Views[P]>) => ModuleType<Views[P]>)
  | Record<string, any>;
};

export interface Module {
  controllers?: Partial<ControllerTypes>;
  views?: Partial<ViewTypes>;
  extenders?: {
    controllers?: Partial<ControllersExtender>;
    views?: Partial<ViewsExtender>;
  };
  defaultOptions?: () => InternalGridOptions;
}
