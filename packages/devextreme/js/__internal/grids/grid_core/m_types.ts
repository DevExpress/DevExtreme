/* eslint-disable spellcheck/spell-checker */
/* eslint-disable max-classes-per-file */
import type { GridBase, GridBaseOptions, SelectionBase } from '@js/common/grids';
import type { Component } from '@js/core/component';
import type { PropertyType } from '@js/core/index';
import type { dxElementWrapper } from '@js/core/renderer';
import type { Properties as DataGridOptions } from '@js/ui/data_grid';
import type Widget from '@js/ui/widget/ui.widget';

type GridPropertyType<T, TProp extends string> = PropertyType<T, TProp> extends never ? never : PropertyType<T, TProp> | undefined;

// Data types
export type RowKey = unknown;

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
  _views: View[];

  _controllers: Controller[];

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
    options: TComponent extends Component<infer TOptions> ? TOptions : never
  ) => TComponent;
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

interface InternalSelection extends SelectionBase {
  alwaysSelectByShift?: boolean;
}

export interface InternalGridOptions extends GridBaseOptions<InternalGrid, unknown, unknown>, TemporarlyOptionsTakenFromDataGrid {
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
  data: import('./data_controller/m_data_controller').DataController;
  columns: import('./columns_controller/m_columns_controller').ColumnsController;
  resizing: any;
  adaptiveColumns: any;
  columnChooser: any;
  editorFactory: any; // import('./editor_factory/module').EditorFactory;
  editing: any; // import('./editing/m_editing').EditingController;
  keyboardNavigation: import('./keyboard_navigation/m_keyboard_navigation').KeyboardNavigationController;
  focus: any;
  columnsResizer: any;
  validating: any;
  export: any;
  draggingHeader: any;
  selection: import('./selection/m_selection').SelectionController;
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

type SilentOptionType = <TPropertyName extends string>(
  optionName: TPropertyName,
  optionValue: GridPropertyType<InternalGridOptions, TPropertyName>
) => void;

type ActionParameters<
  TActionName extends keyof InternalGridOptions,
> = Omit<Parameters<InternalGridOptions[TActionName]>[0], 'component' | 'element'>;

export interface ClassStaticMembers {
  inherit: (obj: any) => any;
  subclassOf: (obj: any) => any;
}
export type ModuleType<T extends ModuleItem> = (new (component: any) => T) & ClassStaticMembers;
declare class ModuleItem {
  _updateLockCount: number;

  component: InternalGrid;

  name: string;

  _createComponent: InternalGrid['_createComponent'];

  getController: InternalGrid['getController'];

  option: InternalGrid['option'];

  _silentOption: SilentOptionType;

  _endUpdateCore(): void;

  ctor(): void;

  init(): void;

  callbackNames(): string[];

  callbackFlags(name?: string): any | undefined;

  publicMethods(): string[];

  beginUpdate(): void;

  endUpdate(): void;

  localize(str: string): string;

  on(...args: any[]): void;

  off(...args: any[]): void;

  optionChanged(e: OptionChanged): void;

  getAction(name: string): any;

  setAria(...args: any[]): void;

  createAction(...args: any[]): void;

  executeAction<T extends keyof InternalGridOptions>(
    actionName: T,
    args: ActionParameters<T>
  ): void;

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
