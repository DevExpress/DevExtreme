/* eslint-disable max-classes-per-file */
import DataGrid, { Properties } from '../data_grid';
import { PropertyType as _PropertyType, DeepPartial, OmitInternal } from '../../core/index';
import { Component } from '../../core/component';
import { dxElementWrapper } from '../../core/renderer';

type PropertyType<O, K extends string> = _PropertyType<O, K> extends never ? any : _PropertyType<O, K>;

export interface InternalGrid extends Omit<DataGrid<unknown, unknown>, 'option'> {
  option: (<TPropertyName extends string>(optionName: TPropertyName) => PropertyType<InternalGridOptions, TPropertyName>) & (<TPropertyName extends string>(optionName: TPropertyName, optionValue: PropertyType<InternalGridOptions, TPropertyName>) => void) & (() => InternalGridOptions) & ((options: InternalGridOptions) => void);

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

  _createComponent: <TComponent extends Component<any>>($container: dxElementWrapper, component: new (...args) => TComponent, options: TComponent extends Component<infer TOptions> ? TOptions : never) => TComponent;
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

export interface ControllersPrivate {
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
}

export interface ViewsPrivate {
  headerPanel: import('./ui.grid_core.header_panel').HeaderPanel;
  rowsView: import('./ui.grid_core.rows').RowsView;
  columnChooserView: import('./ui.grid_core.column_chooser').ColumnChooserView;
}

type MapOmitThis<T> = {
  [P in keyof T]: OmitThisParameter<T[P]>;
};

export type Controllers = {
  [P in keyof ControllersPrivate]: OmitInternal<MapOmitThis<ControllersPrivate[P]>>;
};

export type Views = {
  [P in keyof ViewsPrivate]: OmitInternal<MapOmitThis<ViewsPrivate[P]>>;
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

  _createComponent: InternalGrid['_createComponent'];

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
  controllers?: DeepPartial<ControllersPrivate>;
  views?: DeepPartial<ViewsPrivate>;
  extenders?: {
    controllers?: DeepPartial<ControllersPrivate>;
    views?: DeepPartial<ViewsPrivate>;
  };
  defaultOptions?: () => InternalGridOptions;
}

declare const exportVar: {
  Controller;
  View;
  ViewController;
};

export default exportVar;
