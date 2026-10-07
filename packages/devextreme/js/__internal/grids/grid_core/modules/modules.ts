/* eslint-disable max-classes-per-file */
import type { template } from '@js/common';
import messageLocalization from '@js/common/core/localization/message';
import type { Component } from '@js/core/component';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { FunctionTemplate } from '@js/core/templates/function_template';
import type { Callback } from '@js/core/utils/callbacks';
import Callbacks from '@js/core/utils/callbacks';
import type { DeferredObj } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isDefined, isFunction } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';
import type { ActionConfig } from '@ts/core/widget/component';
import type {
  Controllers,
  CreateComponentOptions,
  GridPropertyType,
  InternalGrid,
  InternalGridOptions,
  Module,
  ModuleItemAction,
  ModuleItemCallbackFlags,
  ModuleType,
  OptionChanged,
  Views,
} from '@ts/grids/grid_core/types';

import type {
  ComponentInstanceType,
  ModuleItemTypeCore,
  ModuleTypeExtender,
  RegisteredModule,
  ViewsWithBorder,
} from './types';
import { updateViewsBorders } from './update_views_borders';

const WIDGET_WITH_LEGACY_CONTAINER_NAME = 'dxDataGrid';

export class ModuleItem {
  public _updateLockCount: number;

  public component!: InternalGrid;

  public _actions: Record<string, ModuleItemAction | undefined>;

  public _actionConfigs: Record<string, ActionConfig | undefined>;

  constructor(component: InternalGrid) {
    this._updateLockCount = 0;
    this.component = component;
    this._actions = {};
    this._actionConfigs = {};

    (this.callbackNames() ?? []).forEach((name) => {
      const flags = this.callbackFlags(name) ?? {};

      flags.unique = true;
      flags.syncStrategy = true;

      this[name] = Callbacks(flags);
    });
  }

  protected _endUpdateCore(): void { }

  public init(): void { }

  protected callbackNames(): string[] | undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callbackFlags(name: string): ModuleItemCallbackFlags | undefined {
    return undefined;
  }

  public publicMethods(): string[] {
    return [];
  }

  public beginUpdate(): void {
    this._updateLockCount += 1;
  }

  public endUpdate(): void {
    if (this._updateLockCount > 0) {
      this._updateLockCount -= 1;
      if (!this._updateLockCount) {
        this._endUpdateCore();
      }
    }
  }

  public option(): InternalGridOptions;
  public option(options: InternalGridOptions): void;
  public option<TPropertyName extends string>(
    name: TPropertyName,
  ): GridPropertyType<InternalGridOptions, TPropertyName>;
  public option<TPropertyName extends string>(
    name: TPropertyName,
    value: GridPropertyType<InternalGridOptions, TPropertyName>,
  ): void;
  public option(...args: unknown[]): unknown {
    const optionCache = this.component._optionCache;

    if (args.length === 1 && optionCache) {
      const name = args[0] as string;
      if (!(name in optionCache)) {
        optionCache[name] = this.component.option(name);
      }
      return optionCache[name];
    }

    // @ts-expect-error a spread argument can't match the overloads of option()
    return this.component.option(...args);
  }

  protected _silentOption<TPropertyName extends string>(
    name: TPropertyName,
    value: GridPropertyType<InternalGridOptions, TPropertyName>,
  ): void {
    const optionCache = this.component._optionCache;

    if (optionCache) {
      optionCache[name] = value;
    }

    return this.component._setOptionWithoutOptionChange(name, value);
  }

  public localize(name: string): string {
    const optionCache = this.component._optionCache;

    if (optionCache) {
      if (!(name in optionCache)) {
        optionCache[name] = messageLocalization.format(name);
      }
      return optionCache[name] as string;
    }

    return messageLocalization.format(name);
  }

  protected on(event: string, callback: Function): unknown {
    return this.component.on(event, callback);
  }

  protected off(...args: unknown[]): unknown {
    // @ts-expect-error a spread argument can't match the overloads of off()
    return this.component.off(...args);
  }

  public optionChanged(args: OptionChanged): void {
    if (args.name in this._actions) {
      this.createAction(args.name, this._actionConfigs[args.name]);
      args.handled = true;
    }
  }

  protected getAction(actionName: string): ModuleItemAction | undefined {
    return this._actions[actionName];
  }

  public setAria(
    name: string,
    value: string | number | boolean | undefined,
    $target: dxElementWrapper,
  ): void {
    if (!isDefined(value)) {
      return;
    }

    const target = $target.get(0);
    const prefix = name !== 'role' && name !== 'id' ? 'aria-' : '';
    const normalizedValue = String(value).replace(/\s+/g, ' ').trim();

    if (target?.setAttribute) {
      target.setAttribute(prefix + name, normalizedValue);
    } else {
      $target.attr(prefix + name, normalizedValue);
    }
  }

  public _createComponent<TComponent extends Component<object>>(
    $container: dxElementWrapper,
    component: new (...args) => TComponent,
    options?: CreateComponentOptions<TComponent>,
  ): TComponent {
    return this.component._createComponent(
      $container,
      component,
      options,
    );
  }

  public getController<T extends keyof Controllers>(name: T): Controllers[T] {
    return this.component._controllers[name];
  }

  public createAction(actionName: string, config?: ActionConfig): undefined;
  public createAction(actionName: Function, config?: ActionConfig): (e: unknown) => void;
  public createAction(
    actionName: string | Function,
    config?: ActionConfig,
  ): ((e: unknown) => void) | undefined {
    if (isFunction(actionName)) {
      const action = this.component._createAction(actionName.bind(this), config);
      return function eventHandler(e: unknown): void {
        action({ event: e });
      };
    }
    this._actions[actionName] = this.component._createActionByOption(actionName, config);
    this._actionConfigs[actionName] = config;

    return undefined;
  }

  public executeAction(actionName: string, options: unknown): unknown {
    const action = this._actions[actionName];

    return action?.(options);
  }

  public dispose(): void {
    (this.callbackNames() ?? []).forEach((name) => {
      this[name].empty();
    });
  }

  public addWidgetPrefix(className?: string | null): string {
    const componentName = this.component.NAME;

    return `dx-${componentName.slice(2).toLowerCase()}${className ? `-${className}` : ''}`;
  }

  public getWidgetContainerClass(): string {
    const containerName = this.component.NAME === WIDGET_WITH_LEGACY_CONTAINER_NAME ? null : 'container';

    return this.addWidgetPrefix(containerName);
  }

  public elementIsInsideGrid($element: dxElementWrapper): boolean {
    const $gridElement = $element.closest(`.${this.getWidgetContainerClass()}`).parent();

    return $gridElement.is(this.component.$element());
  }
}

export class Controller extends ModuleItem {}

export class ViewController extends Controller {
  public getView<T extends keyof Views>(name: T): Views[T] {
    return this.component._views[name];
  }

  public getViews(): Views {
    return this.component._views;
  }
}

export class View extends ModuleItem {
  protected _requireReady?: boolean;

  public _requireRender?: boolean;

  public _$element?: dxElementWrapper;

  public _$parent?: dxElementWrapper;

  public name!: string;

  public renderCompleted: Callback<[unknown?]>;

  public isResizing?: boolean;

  public resizeCompleted: Callback<[]>;

  constructor(component: InternalGrid) {
    super(component);
    this.renderCompleted = Callbacks();
    this.resizeCompleted = Callbacks();
  }

  public _isReady(): boolean {
    return this.component.isReady();
  }

  protected _endUpdateCore(): void {
    super._endUpdateCore();

    if (!this._isReady() && this._requireReady) {
      this._requireRender = false;
      this.component._requireResize = false;
    }
    if (this._requireRender) {
      this._requireRender = false;
      this.render(this._$parent);
    }
  }

  public _invalidate(requireResize?: boolean, requireReady?: boolean): void {
    this._requireRender = true;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of two flags
    this.component._requireResize = hasWindow() && (this.component._requireResize || requireResize);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- OR of two flags
    this._requireReady = this._requireReady || requireReady;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-invalid-void-type -- a view that renders synchronously returns nothing
  protected _renderCore(options?: unknown): DeferredObj<unknown> | void { }

  protected _resizeCore(): void { }

  public _parentElement(): dxElementWrapper | undefined {
    return this._$parent;
  }

  public element(): dxElementWrapper | undefined {
    return this._$element;
  }

  public getElementHeight(): number {
    const $element = this.element();

    if (!$element) return 0;

    const marginTop = parseFloat($element.css('marginTop') ?? '') || 0;
    const marginBottom = parseFloat($element.css('marginBottom') ?? '') || 0;
    const { offsetHeight } = $element.get(0) as HTMLElement;

    return offsetHeight + marginTop + marginBottom;
  }

  public isVisible(): boolean {
    return true;
  }

  public getTemplate(name: template): FunctionTemplate {
    return this.component._getTemplate(name);
  }

  public getView<T extends keyof Views>(name: T): Views[T] {
    return this.component._views[name];
  }

  public _getBorderedViews(): ViewsWithBorder {
    return {
      columnHeadersView: this.component._views.columnHeadersView,
      rowsView: this.component._views.rowsView,
      filterPanelView: this.component._views.filterPanelView,
      footerView: this.component._views.footerView,
    };
  }

  public render($parent?: dxElementWrapper | null, options?: unknown): void {
    let $element = this._$element;
    const isVisible = this.isVisible();

    if (!$element) {
      if (!$parent) {
        return;
      }
      this._$element = $('<div>').appendTo($parent);
      $element = this._$element;
      this._$parent = $parent;
    }

    this._requireReady = false;

    $element.toggleClass('dx-hidden', !isVisible);

    if (this.component._views) {
      updateViewsBorders(this.name, this._getBorderedViews());
    }

    if (isVisible) {
      this.component._optionCache = {};
      const deferred = this._renderCore(options);
      this.component._optionCache = undefined;
      if (deferred) {
        deferred.done(() => {
          this.renderCompleted.fire(options);
        });
      } else {
        this.renderCompleted.fire(options);
      }
    }
  }

  public resize(): void {
    this.isResizing = true;
    this._resizeCore();
    this.resizeCompleted.fire();
    this.isResizing = false;
  }

  public focus(preventScroll?: boolean): void {
    // @ts-expect-error rendered view; get() is typed as Element
    this.element().get(0).focus({ preventScroll });
  }
}

const MODULES_ORDER_MAX_INDEX = 1000000;

function getExtendedTypes(
  types: Record<string, ModuleType<ModuleItem>>,
  moduleExtenders: Record<string, ModuleTypeExtender | undefined> = {},
): Record<string, ModuleType<ModuleItem>> {
  const extendTypes = { };
  Object.entries(moduleExtenders)
    .forEach(([name, extender]) => {
      const currentType = types[name];
      if (currentType && extender) {
        extendTypes[name] = extender(currentType);
      }
    });
  return extendTypes;
}

function registerPublicMethods(
  componentInstance: ComponentInstanceType,
  name: string,
  moduleItem: ModuleItem,
): void {
  const publicMethods = moduleItem.publicMethods();
  if (publicMethods) {
    publicMethods.forEach((methodName) => {
      if (moduleItem[methodName]) {
        if (!componentInstance[methodName]) {
          componentInstance[methodName] = (...args: unknown[]): unknown => (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- looked up by name
            moduleItem[methodName](...args)
          );
        } else {
          throw errors.Error('E1005', methodName);
        }
      } else {
        throw errors.Error('E1006', name, methodName);
      }
    });
  }
}
export function processModules(
  componentInstance: ComponentInstanceType,
  componentClass: { modules: RegisteredModule[]; modulesOrder?: string[] },
): void {
  const { modules } = componentClass;
  const { modulesOrder } = componentClass;

  function createModuleItems(
    moduleTypes: Record<string, ModuleItemTypeCore>,
  ): unknown {
    const moduleItems = {};

    Object.entries(moduleTypes).forEach(([name, moduleType]) => {
      // eslint-disable-next-line new-cap
      const moduleItem = new moduleType(componentInstance);
      moduleItem.name = name;
      registerPublicMethods(componentInstance, name, moduleItem);

      moduleItems[name] = moduleItem;
    });

    return moduleItems;
  }

  if (modulesOrder) {
    modules.sort((module1, module2) => {
      let orderIndex1 = modulesOrder.indexOf(module1.name);
      let orderIndex2 = modulesOrder.indexOf(module2.name);

      if (orderIndex1 < 0) {
        orderIndex1 = MODULES_ORDER_MAX_INDEX;
      }

      if (orderIndex2 < 0) {
        orderIndex2 = MODULES_ORDER_MAX_INDEX;
      }

      return orderIndex1 - orderIndex2;
    });
  }
  const rootControllerTypes = {};
  const rootViewTypes = {};
  modules.forEach(({ name: moduleName, controllers = {}, views = {} }) => {
    Object.entries(controllers)
      .forEach(([name, type]) => {
        if (rootControllerTypes[name]) {
          throw errors.Error('E1001', moduleName, name);
        } else if (!(type?.prototype instanceof Controller)) {
          throw errors.Error('E1002', moduleName, name);
        }
        rootControllerTypes[name] = type;
      });
    Object.entries(views)
      .forEach(([name, type]) => {
        if (rootViewTypes[name]) {
          throw errors.Error('E1003', moduleName, name);
        } else if (!(type?.prototype instanceof View)) {
          throw errors.Error('E1004', moduleName, name);
        }
        rootViewTypes[name] = type;
      });
  });
  const moduleExtenders = modules
    .filter(({ extenders }) => !!extenders);
  const controllerTypes = moduleExtenders.reduce(
    (types, { extenders }) => ({
      ...types,
      ...getExtendedTypes(types, extenders?.controllers),
    }),
    rootControllerTypes,
  );
  const viewTypes = moduleExtenders.reduce(
    (types, { extenders }) => ({
      ...types,
      ...getExtendedTypes(types, extenders?.views),
    }),
    rootViewTypes,
  );

  componentInstance._controllers = createModuleItems(controllerTypes);

  componentInstance._views = createModuleItems(viewTypes);
}

const callModuleItemsMethod = function callModuleItemsMethod(
  that: Partial<Pick<InternalGrid, '_controllers' | '_views'>>,
  methodName: string,
  args?: unknown[],
): void {
  const methodArgs = args ?? [];
  if (that._controllers) {
    each(that._controllers, function callControllerMethod() {
      if (this[methodName]) {
        this[methodName](...methodArgs);
      }
    });
  }
  if (that._views) {
    each(that._views, function callViewMethod() {
      if (this[methodName]) {
        this[methodName](...methodArgs);
      }
    });
  }
};

export default {
  modules: [] as RegisteredModule[],

  View,

  ViewController,

  Controller,

  registerModule(
    name: string,
    module: (Module | Record<string, unknown>) & { name?: string },
  ): void {
    const { modules } = this;

    for (const registeredModule of modules) {
      if (registeredModule.name === name) {
        return;
      }
    }
    module.name = name;
    modules.push(module);
  },

  registerModulesOrder(moduleNames: string[]): void {
    this.modulesOrder = moduleNames;
  },

  unregisterModule(this: { modules: RegisteredModule[] }, name: string): void {
    this.modules = this.modules.filter((module) => module.name !== name);
  },

  processModules,

  callModuleItemsMethod,
};
