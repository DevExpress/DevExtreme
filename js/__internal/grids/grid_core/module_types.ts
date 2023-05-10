/* eslint-disable max-classes-per-file */
import {
  PropertyType as _PropertyType,
} from '@js/core/index';
import { GridBase, GridBaseOptions } from '@js/common/grids';
import { dxElementWrapper } from '@js/core/renderer';
import type {
  ModuleItem, ViewController,
} from './modules';

export type PropertyType<O, K extends string> = _PropertyType<O, K> extends never
  ? any
  : _PropertyType<O, K>;

export interface InternalGrid
  extends Omit<GridBase<unknown, unknown>, 'option'> {
  option: ModuleItem['option'];

  NAME: 'dxDataGrid' | 'dxTreeList';

  _views: any;

  _getTemplate: any;

  $element: () => dxElementWrapper;

  beginUpdate: () => void;
  endUpdate: () => void;

  isReady: () => boolean;

  _updateLockCount: number;

  _requireResize: boolean;

  _optionCache: any;

  _setOptionWithoutOptionChange: any;

  _createAction: any;

  _createActionByOption: any;

  _fireContentReadyAction: any;

  setAria: any;

  _renderDimensions: any;

  getView: ViewController['getView'];

  getController: ViewController['getController'];

  _optionsByReference: any;

  _disposed: any;

  _createComponent: ModuleItem['_createComponent'];
}

export type InternalGridOptions = GridBaseOptions<InternalGrid, unknown, unknown > & {
  loadingTimeout?: number;
};

export interface OptionChangedArgs<T extends string = string> {
  name: T extends `${infer TName}.${string}` ? TName : T;
  fullName: T;
  previousValue: PropertyType<InternalGridOptions, T>;
  value: PropertyType<InternalGridOptions, T>;
  handled: boolean;
}

export interface Controllers {
  data: import('./data_controller/module').DataController;
  columns: any;
  resizing: any;
  adaptiveColumns: any;
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
  [ P in keyof Controllers ]: new(component: any) => Controllers[P];
};

export interface Views {
  headerPanel: any;
  rowsView: any;
  columnChooserView: any;
}
type ViewTypes = {
  [ P in keyof Views ]: new(component: any) => Views[P];
};

export interface ClassStaticMembers {
  inherit: (obj: any) => any;
  subclassOf: (obj: any) => any;
}

export type ModuleType<T extends ModuleItem> = (new (component: any) => T) & ClassStaticMembers;

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

declare const exportVar: {
  Controller;
  View;
  ViewController;
};

export default exportVar;
