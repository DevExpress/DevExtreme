import DataGrid, { Properties } from '@js/ui/data_grid';
import { PropertyType } from '@js/core/index';

export interface InternalGrid extends Omit<DataGrid<unknown, unknown>, 'option'> {
  option: (<TPropertyName extends string>(optionName: TPropertyName) => PropertyType<Properties, TPropertyName>) & (<TPropertyName extends string>(optionName: TPropertyName, optionValue: PropertyType<Properties, TPropertyName>) => void);

  NAME: 'dxDataGrid' | 'dxTreeList';

  _updateLockCount: number;

  _requireResize: boolean;
}

export interface OptionChangedArgs {
  name: any;
  fullName: any;
  previousValue: any;
  value: any;
  handled: any;
}

export interface Controllers {
  data: any;
  columns: any;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Views {

}

interface ModuleItem {
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

  _silentOption: <TPropertyName extends string>(optionName: TPropertyName, optionValue: PropertyType<Properties, TPropertyName>) => void;

  localize: (this: this, str: string) => string;

  on: (this: this, ...args: any[]) => void;

  off: (this: this, ...args: any[]) => void;

  optionChanged: (this: this, e: OptionChangedArgs) => void;

  getAction: (this: this, name: string) => any;

  setAria: (this: this, ...args: any[]) => void;

  _createComponent: (this: this, ...args: any[]) => void;

  getController: <T extends keyof Controllers>(this: this, name: T) => Controllers[T];

  createAction: (this: this, ...args: any[]) => void;

  executeAction: (this: this, ...args: any[]) => void;

  dispose: (this: this) => void;

  addWidgetPrefix: (this: this, className: string) => string;

  getWidgetContainerClass: (this: this) => string;

  elementIsInsideGrid: (this: this, element: any) => boolean;
}

export interface Controller extends ModuleItem {
}

export interface ViewController extends Controller {
  getView: <T extends keyof Views>(this: this, name: T) => Views[T];
  getViews: (this: this) => View[];
}

export interface View extends ModuleItem {
  _endUpdateCore: () => void;

  _invalidate: (requireResize?: any, requireReady?: any) => void;

  _renderCore: () => void;

  _resizeCore: () => void;

  _parentElement: () => any;

  element: () => any;

  getElementHeight: () => number;

  isVisible: () => boolean;

  getTemplate: (name) => any;

  render: ($parent?: any, options?: any) => void;

  resize: () => void;

  focus: (preventScroll?: boolean) => void;

}

declare const exportVar: {
  Controller: { inherit: (obj: any) => any };
  View: { inherit: (obj: any) => any };
};

export default exportVar;
