/* eslint-disable max-classes-per-file */
import {
  PropertyType as _PropertyType,
  DeepPartial,
  OmitInternal,
} from '@js/core/index';
import { Component } from '@js/core/component';
import { dxElementWrapper } from '@js/core/renderer';
import DataGrid, { Properties } from '@js/ui/data_grid';

type PropertyType<O, K extends string> = _PropertyType<O, K> extends never
  ? any
  : _PropertyType<O, K>;

type GetOptionValueType = (<TPropertyName extends string>(
  optionName: TPropertyName) =>
  PropertyType<InternalGridOptions, TPropertyName>);

type SetOptionValueType = (<TPropertyName extends string>(
  optionName: TPropertyName,
  optionValue: PropertyType<InternalGridOptions, TPropertyName>) => void);

type SetOptionsType = ((options: InternalGridOptions) => void);

export interface InternalGrid
  extends Omit<DataGrid<unknown, unknown>, 'option'> {
  option: GetOptionValueType &
  SetOptionValueType &
  (() => InternalGridOptions) &
  SetOptionsType;

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
    options: TComponent extends Component<infer TOptions> ? TOptions : never
  ) => TComponent;
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
  // @ts-expect-error
  data: import('@js/ui/grid_core/ui.grid_core.data_controller').DataController;
  columns: any;
  resizing: any;
  adaptiveColumns: import('./adaptivity/module_types').AdaptiveColumnsController;
  columnChooser: any;
  editorFactory: import('./editor_factory/module_types').EditorFactory;
  editing: any;
  keyboardNavigation: import('./keyboard_navigation/module').KeyboardNavigationController;
  focus: any;
  columnsResizer: any;
  validating: any;
  export: any;
  draggingHeader: any;
  selection: any;
}

type ControllerTypes = {
  [ P in keyof ControllersPrivate ]: new(component: any) => ControllersPrivate[P];
};

export interface ViewsPrivate {
  headerPanel: any;
  rowsView: any;
  columnChooserView: any;
}

type MapOmitThis<T> = {
  [P in keyof T]: OmitThisParameter<T[P]>;
};

export type Controllers = {
  [P in keyof ControllersPrivate]: OmitInternal<
  MapOmitThis<ControllersPrivate[P]>
  >;
};

export type Views = {
  [P in keyof ViewsPrivate]: OmitInternal<MapOmitThis<ViewsPrivate[P]>>;
};

type SilentOptionType = <TPropertyName extends string>(
  optionName: TPropertyName,
  optionValue: PropertyType<InternalGridOptions, TPropertyName>
) => void;

export interface ClassStaticMembers {
  inherit: (obj: any) => any;
  subclassOf: (obj: any) => any;
}
export type ModuleType<T extends ModuleItem> = (new (component: any) => T) & ClassStaticMembers;
declare class ModuleItem {
  component: InternalGrid;

  name: string;

  callBase: any;

  _createComponent: InternalGrid['_createComponent'];

  getController: InternalGrid['getController'];

  option: InternalGrid['option'];

  _silentOption: SilentOptionType;

  _endUpdateCore(): void;

  ctor(): void;

  init(): void;

  callbackNames(): string[];

  callbackFlags(): any;

  publicMethods(): string[];

  beginUpdate(): void;

  endUpdate(): void;

  localize(str: string): string;

  on(...args: any[]): void;

  off(...args: any[]): void;

  optionChanged(e: OptionChangedArgs): void;

  getAction(name: string): any;

  setAria(...args: any[]): void;

  createAction(...args: any[]): void;

  executeAction(...args: any[]): void;

  dispose(): void;

  addWidgetPrefix(className: string): string;

  getWidgetContainerClass(): string;

  elementIsInsideGrid(element: any): boolean;

  static inherit(obj: any): any;
  static subclassOf(obj: any): any;
}

export declare class Controller extends ModuleItem {}

export declare class ViewController extends Controller {
  getView: InternalGrid['getView'];

  getViews(): View[];
}

export declare class View extends ModuleItem {
  _endUpdateCore(): void;

  _invalidate(requireResize?: any, requireReady?: any): void;

  _renderCore(): void;

  _resizeCore(): void;

  _parentElement(): any;

  element(): any;

  getElementHeight(): number;

  isVisible(): boolean;

  getTemplate(name: string): any;

  render($parent?: any, options?: any): void;

  resize(): void;

  focus(preventScroll?: boolean): void;
}

export interface Module {
  controllers?: Partial<ControllerTypes>;
  views?: Partial<ViewsPrivate>;
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
