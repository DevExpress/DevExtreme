/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/method-signature-style */
import messageLocalization from '@js/common/core/localization/message';
import type { Component } from '@js/core/component';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
// @ts-expect-error
import { grep } from '@js/core/utils/common';
import { each } from '@js/core/utils/iterator';
import { isFunction } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';

import type {
  Controllers, GridPropertyType, InternalGrid, InternalGridOptions, Module,
  OptionChanged,
  Views,
} from './m_types';
import type { ViewsWithBorder } from './views/utils/update_views_borders';
import { updateViewsBorders } from './views/utils/update_views_borders';

const WIDGET_WITH_LEGACY_CONTAINER_NAME = 'dxDataGrid';

export class ModuleItem {
  public _updateLockCount: any;

  public component!: InternalGrid;

  public _actions: any;

  public _actionConfigs: any;

  constructor(component) {
    const that = this;
    that._updateLockCount = 0;
    that.component = component;
    that._actions = {};
    that._actionConfigs = {};

    each(this.callbackNames() || [], function (index, name) {
      const flags = that.callbackFlags(name) || {};

      flags.unique = true;
      flags.syncStrategy = true;

      that[this] = Callbacks(flags);
    });
  }

  protected _endUpdateCore() { }

  public init() { }

  protected callbackNames(): string[] | undefined {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected callbackFlags(name): any { }

  public publicMethods(): string[] {
    return [];
  }

  public beginUpdate() {
    this._updateLockCount++;
  }

  public endUpdate() {
    if (this._updateLockCount > 0) {
      this._updateLockCount--;
      if (!this._updateLockCount) {
        this._endUpdateCore();
      }
    }
  }

  public option(): InternalGridOptions;
  public option(options: InternalGridOptions): void;
  public option<TPropertyName extends string>(name: TPropertyName): GridPropertyType<InternalGridOptions, TPropertyName>;
  public option<TPropertyName extends string>(name: TPropertyName, value: GridPropertyType<InternalGridOptions, TPropertyName>): void;
  public option(name?) {
    const { component } = this;
    const optionCache = component._optionCache;

    if (arguments.length === 1 && optionCache) {
      if (!(name in optionCache)) {
        optionCache[name] = component.option(name);
      }
      return optionCache[name];
    }

    // @ts-expect-error
    return component.option.apply(component, arguments);
  }

  protected _silentOption<TPropertyName extends string>(
    name: TPropertyName,
    value: GridPropertyType<InternalGridOptions, TPropertyName>,
  ): void {
    const { component } = this;
    const optionCache = component._optionCache;

    if (optionCache) {
      optionCache[name] = value;
    }

    return component._setOptionWithoutOptionChange(name, value);
  }

  protected localize(name) {
    const optionCache = this.component._optionCache;

    if (optionCache) {
      if (!(name in optionCache)) {
        optionCache[name] = messageLocalization.format(name);
      }
      return optionCache[name];
    }

    return messageLocalization.format(name);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected on(event, callback) {
    // @ts-expect-error
    return this.component.on.apply(this.component, arguments);
  }

  protected off() {
    // @ts-expect-error
    return this.component.off.apply(this.component, arguments);
  }

  public optionChanged(args: OptionChanged) {
    if (args.name in this._actions) {
      this.createAction(args.name, this._actionConfigs[args.name]);
      args.handled = true;
    }
  }

  protected getAction(actionName) {
    return this._actions[actionName];
  }

  public setAria(name, value, $target) {
    const target = $target.get(0);
    const prefix = name !== 'role' && name !== 'id' ? 'aria-' : '';

    if (target.setAttribute) {
      target.setAttribute(prefix + name, value);
    } else {
      $target.attr(prefix + name, value);
    }
  }

  public _createComponent<TComponent extends Component<any>>(
    $container: dxElementWrapper,
    component: new (...args) => TComponent,
    options?: TComponent extends Component<infer TOptions> ? TOptions : never,
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

  public createAction(actionName, config?) {
    if (isFunction(actionName)) {
      const action = this.component._createAction(actionName.bind(this), config);
      return function (e) {
        action({ event: e });
      };
    }
    this._actions[actionName] = this.component._createActionByOption(actionName, config);
    this._actionConfigs[actionName] = config;

    return undefined;
  }

  public executeAction(actionName, options) {
    const action = this._actions[actionName];

    return action && action(options);
  }

  public dispose() {
    const that = this;
    each(that.callbackNames() || [], function () {
      that[this].empty();
    });
  }

  public addWidgetPrefix(className) {
    const componentName = this.component.NAME;

    return `dx-${componentName.slice(2).toLowerCase()}${className ? `-${className}` : ''}`;
  }

  public getWidgetContainerClass() {
    const containerName = this.component.NAME === WIDGET_WITH_LEGACY_CONTAINER_NAME ? null : 'container';

    return this.addWidgetPrefix(containerName);
  }

  public elementIsInsideGrid($element) {
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
  protected _requireReady: any;

  public _requireRender: any;

  public _$element: any;

  public _$parent: any;

  public name: any;

  public renderCompleted: any;

  public isResizing: any;

  public resizeCompleted: any;

  constructor(component) {
    super(component);
    this.renderCompleted = Callbacks();
    this.resizeCompleted = Callbacks();
  }

  public _isReady() {
    return this.component.isReady();
  }

  protected _endUpdateCore() {
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

  public _invalidate(requireResize?, requireReady?) {
    this._requireRender = true;
    this.component._requireResize = hasWindow() && (this.component._requireResize || requireResize);
    this._requireReady = this._requireReady || requireReady;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _renderCore(options?): any { }

  protected _resizeCore() { }

  public _parentElement() {
    return this._$parent;
  }

  public element() {
    return this._$element;
  }

  public getElementHeight() {
    const $element = this.element();

    if (!$element) return 0;

    const marginTop = parseFloat($element.css('marginTop')) || 0;
    const marginBottom = parseFloat($element.css('marginBottom')) || 0;
    const { offsetHeight } = $element.get(0);

    return offsetHeight + marginTop + marginBottom;
  }

  public isVisible() {
    return true;
  }

  public getTemplate(name) {
    return this.component._getTemplate(name);
  }

  public getView(name) {
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

  public render($parent?, options?) {
    let $element = this._$element;
    const isVisible = this.isVisible();

    if (!$element && !$parent) return;

    this._requireReady = false;

    if (!$element) {
      $element = this._$element = $('<div>').appendTo($parent);
      this._$parent = $parent;
    }

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

  public resize() {
    this.isResizing = true;
    this._resizeCore();
    this.resizeCompleted.fire();
    this.isResizing = false;
  }

  public focus(preventScroll) {
    this.element().get(0).focus({ preventScroll });
  }
}

const MODULES_ORDER_MAX_INDEX = 1000000;

function getExtendedTypes(
  types: Record<string, unknown>,
  moduleExtenders: Record<string, unknown> = {},
): Record<string, typeof ModuleItem> {
  const extendTypes = { };
  Object.entries(moduleExtenders)
    .forEach(([name, extender]) => {
      const currentType = types[name];
      if (currentType) {
        if (isFunction(extender)) {
          extendTypes[name] = extender(currentType);
        } else {
          const classType = currentType as { inherit: (type: unknown) => unknown };
          extendTypes[name] = classType.inherit(extender);
        }
      }
    });
  return extendTypes;
}

function registerPublicMethods(componentInstance, name: string, moduleItem): void {
  const publicMethods = moduleItem.publicMethods();
  if (publicMethods) {
    each(publicMethods, (_, methodName) => {
      if (moduleItem[methodName]) {
        if (!componentInstance[methodName]) {
          componentInstance[methodName] = (...args: unknown[]): unknown => moduleItem[methodName](...args);
        } else {
          throw errors.Error('E1005', methodName);
        }
      } else {
        throw errors.Error('E1006', name, methodName);
      }
    });
  }
}
type ComponentInstanceType = Record<string, unknown>;
type ModuleItemTypeCore = new(componentInstance: ComponentInstanceType) => { name: string };
export function processModules(
  componentInstance: ComponentInstanceType,
  componentClass: { modules: [Module & { name: string }]; modulesOrder: any },
): void {
  const { modules } = componentClass;
  const { modulesOrder } = componentClass;

  function createModuleItems(
    moduleTypes: Record<string, ModuleItemTypeCore>,
  ): unknown {
    const moduleItems = {};

    each(moduleTypes, (name, moduleType) => {
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

  // eslint-disable-next-line no-param-reassign
  componentInstance._controllers = createModuleItems(controllerTypes);
  // eslint-disable-next-line no-param-reassign
  componentInstance._views = createModuleItems(viewTypes);
}

const callModuleItemsMethod = function (that, methodName, args?) {
  args = args || [];
  if (that._controllers) {
    each(that._controllers, function () {
      this[methodName] && this[methodName].apply(this, args);
    });
  }
  if (that._views) {
    each(that._views, function () {
      this[methodName] && this[methodName].apply(this, args);
    });
  }
};

export default {
  modules: [],

  View,

  ViewController,

  Controller,

  registerModule(name, module) {
    const { modules } = this;

    for (let i = 0; i < modules.length; i++) {
      if (modules[i].name === name) {
        return;
      }
    }
    module.name = name;
    modules.push(module);
  },

  registerModulesOrder(moduleNames) {
    this.modulesOrder = moduleNames;
  },

  unregisterModule(name) {
    this.modules = grep(this.modules, (module) => module.name !== name);
  },

  processModules,

  callModuleItemsMethod,
};
