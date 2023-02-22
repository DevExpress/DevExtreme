/* eslint-disable max-classes-per-file */
import DataGrid, { Properties } from '../data_grid';
import { PropertyType as _PropertyType, DeepPartial } from '../../core/index';

type PropertyType<O, K extends string> = _PropertyType<O, K> extends never ? any : _PropertyType<O, K>;

export interface InternalGrid extends Omit<DataGrid<unknown, unknown>, 'option'> {
  option<TPropertyName extends string>(optionName: TPropertyName): PropertyType<InternalGridOptions, TPropertyName>;

  option<TPropertyName extends string>(optionName: TPropertyName, optionValue: PropertyType<InternalGridOptions, TPropertyName>): void;

  option(): InternalGridOptions;

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
}

export type InternalGridOptions = Properties & {
  loadingTimeout?: number;
};

export interface OptionChangedArgs<T extends string = string> {
  name: T extends `${infer TName}.${string}` ? TName : T;
  fullName: T;
  previousValue: PropertyType<InternalGridOptions, T>;
  value: PropertyType<InternalGridOptions, T>;
  handled: boolean;
}

export type Controllers = {
  data: import('./ui.grid_core.data_controller').DataController;
  columns: import('./ui.grid_core.columns_controller').ColumnsController;
  resizing: import('./ui.grid_core.grid_view').ResizingController;
  adaptiveColumns: import('./ui.grid_core.adaptivity').AdaptiveColumnsController;
  columnChooser: import('./ui.grid_core.column_chooser').ColumnChooserController;
  editorFactory: import('./ui.grid_core.editor_factory').EditorFactory;
  editing: import('./ui.grid_core.editing').EditingController;
  keyboardNavigation: import('./keyboard_navigation/types').KeyboardNavigationController;
  focus: import('./ui.grid_core.focus').FocusController;
  columnsResizer: any;
  validating: any;
  export: any;
  draggingHeader: any;
  selection: any;
};

export type Views = {
  headerPanel: import('./ui.grid_core.header_panel').HeaderPanel;
  rowsView: import('./ui.grid_core.rows').RowsView;
  columnChooserView: import('./ui.grid_core.column_chooser').ColumnChooserView;
};

declare class ModuleItem {
  component: InternalGrid;

  callBase: any;

  _endUpdateCore: (this: this) => void;

  ctor: (this: this) => void;

  init: (this: this) => void;

  callbackNames: (this: this) => string[];

  callbackFlags: (this: this) => any;

  publicMethods: (this: this) => string[];

  beginUpdate: (this: this) => void;

  endUpdate: (this: this) => void;

  option: InternalGrid['option'];

  _silentOption: <TPropertyName extends string>(optionName: TPropertyName, optionValue: PropertyType<InternalGridOptions, TPropertyName>) => void;

  localize: (this: this, str: string) => string;

  on: (this: this, ...args: any[]) => void;

  off: (this: this, ...args: any[]) => void;

  optionChanged: (this: this, e: OptionChangedArgs) => void;

  getAction: (this: this, name: string) => any;

  setAria: (this: this, ...args: any[]) => void;

  _createComponent: (this: this, ...args: any[]) => any;

  getController: InternalGrid['getController'];

  createAction: (this: this, ...args: any[]) => void;

  executeAction: (this: this, ...args: any[]) => void;

  dispose: (this: this) => void;

  addWidgetPrefix: (this: this, className: string) => string;

  getWidgetContainerClass: (this: this) => string;

  elementIsInsideGrid: (this: this, element: any) => boolean;

  name: string;

  static inherit: (obj: any) => any;
}

export class Controller extends ModuleItem {
}

export class ViewController extends Controller {
  getView: InternalGrid['getView'];

  getViews: (this: this) => View[];
}

export class View extends ModuleItem {
  _endUpdateCore: (this: this) => void;

  _invalidate: (this: this, requireResize?: any, requireReady?: any) => void;

  _renderCore: (this: this) => void;

  _resizeCore: (this: this) => void;

  _parentElement: (this: this) => any;

  element: (this: this) => any;

  getElementHeight: (this: this) => number;

  isVisible: (this: this) => boolean;

  getTemplate: (this: this, name: string) => any;

  render: (this: this, $parent?: any, options?: any) => void;

  resize: (this: this) => void;

  focus: (this: this, preventScroll?: boolean) => void;
}

export interface Module {
  controllers?: DeepPartial<Controllers>;
  views?: DeepPartial<Views>;
  extenders?: {
    controllers?: DeepPartial<Controllers>;
    views?: DeepPartial<Views>;
  };
  defaultOptions?: () => InternalGridOptions;
}

declare const exportVar: {
  Controller;
  View;
  ViewController;
};

export default exportVar;
