import $ from '@js/core/renderer';
import Class from '@js/core/class';
import Callbacks from '@js/core/utils/callbacks';
import { grep } from '@js/core/utils/common';
import { isFunction } from '@js/core/utils/type';
import { each } from '@js/core/utils/iterator';
import messageLocalization from '@js/localization/message';
import { hasWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';

const WIDGET_WITH_LEGACY_CONTAINER_NAME = 'dxDataGrid';

const ModuleItem = Class.inherit({
  _endUpdateCore() { },

  ctor(component) {
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
  },

  init() { },

  callbackNames() { },

  callbackFlags() { },

  publicMethods() { },

  beginUpdate() {
    this._updateLockCount++;
  },

  endUpdate() {
    if (this._updateLockCount > 0) {
      this._updateLockCount--;
      if (!this._updateLockCount) {
        this._endUpdateCore();
      }
    }
  },

  option(name) {
    const { component } = this;
    const optionCache = component._optionCache;

    if (arguments.length === 1 && optionCache) {
      if (!(name in optionCache)) {
        optionCache[name] = component.option(name);
      }
      return optionCache[name];
    }

    return component.option.apply(component, arguments);
  },

  _silentOption(name, value) {
    const { component } = this;
    const optionCache = component._optionCache;

    if (optionCache) {
      optionCache[name] = value;
    }

    return component._setOptionWithoutOptionChange(name, value);
  },

  localize(name) {
    const optionCache = this.component._optionCache;

    if (optionCache) {
      if (!(name in optionCache)) {
        optionCache[name] = messageLocalization.format(name);
      }
      return optionCache[name];
    }

    return messageLocalization.format(name);
  },

  on() {
    return this.component.on.apply(this.component, arguments);
  },

  off() {
    return this.component.off.apply(this.component, arguments);
  },

  optionChanged(args) {
    if (args.name in this._actions) {
      this.createAction(args.name, this._actionConfigs[args.name]);
      args.handled = true;
    }
  },

  getAction(actionName) {
    return this._actions[actionName];
  },

  setAria(name, value, $target) {
    const target = $target.get(0);
    const prefix = name !== 'role' && name !== 'id' ? 'aria-' : '';

    if (target.setAttribute) {
      target.setAttribute(prefix + name, value);
    } else {
      $target.attr(prefix + name, value);
    }
  },

  _createComponent() {
    return this.component._createComponent.apply(this.component, arguments);
  },

  getController(name) {
    return this.component._controllers[name];
  },

  createAction(actionName, config) {
    if (isFunction(actionName)) {
      const action = this.component._createAction(actionName.bind(this), config);
      return function (e) {
        action({ event: e });
      };
    }
    this._actions[actionName] = this.component._createActionByOption(actionName, config);
    this._actionConfigs[actionName] = config;
  },

  executeAction(actionName, options) {
    const action = this._actions[actionName];

    return action && action(options);
  },

  dispose() {
    const that = this;
    each(that.callbackNames() || [], function () {
      that[this].empty();
    });
  },

  addWidgetPrefix(className) {
    const componentName = this.component.NAME;

    return `dx-${componentName.slice(2).toLowerCase()}${className ? `-${className}` : ''}`;
  },

  getWidgetContainerClass() {
    const containerName = this.component.NAME === WIDGET_WITH_LEGACY_CONTAINER_NAME ? null : 'container';

    return this.addWidgetPrefix(containerName);
  },

  elementIsInsideGrid($element) {
    const $gridElement = $element.closest(`.${this.getWidgetContainerClass()}`).parent();

    return $gridElement.is(this.component.$element());
  },
});

const Controller = ModuleItem;

const ViewController = Controller.inherit({
  getView(name) {
    return this.component._views[name];
  },

  getViews() {
    return this.component._views;
  },
});

const View = ModuleItem.inherit({
  _isReady() {
    return this.component.isReady();
  },

  _endUpdateCore() {
    this.callBase();

    if (!this._isReady() && this._requireReady) {
      this._requireRender = false;
      this.component._requireResize = false;
    }
    if (this._requireRender) {
      this._requireRender = false;
      this.render(this._$parent);
    }
  },

  _invalidate(requireResize, requireReady) {
    this._requireRender = true;
    this.component._requireResize = hasWindow() && (this.component._requireResize || requireResize);
    this._requireReady = this._requireReady || requireReady;
  },

  _renderCore() { },

  _resizeCore() { },

  _parentElement() {
    return this._$parent;
  },

  ctor(component) {
    this.callBase(component);
    this.renderCompleted = Callbacks();
    this.resizeCompleted = Callbacks();
  },

  element() {
    return this._$element;
  },

  getElementHeight() {
    const $element = this.element();

    if (!$element) return 0;

    const marginTop = parseFloat($element.css('marginTop')) || 0;
    const marginBottom = parseFloat($element.css('marginBottom')) || 0;
    const { offsetHeight } = $element.get(0);

    return offsetHeight + marginTop + marginBottom;
  },

  isVisible() {
    return true;
  },

  getTemplate(name) {
    return this.component._getTemplate(name);
  },

  render($parent, options) {
    let $element = this._$element;
    const isVisible = this.isVisible();

    if (!$element && !$parent) return;

    this._requireReady = false;

    if (!$element) {
      $element = this._$element = $('<div>').appendTo($parent);
      this._$parent = $parent;
    }

    $element.toggleClass('dx-hidden', !isVisible);
    if (isVisible) {
      this.component._optionCache = {};
      this._renderCore(options);
      this.component._optionCache = undefined;
      this.renderCompleted.fire(options);
    }
  },

  resize() {
    this.isResizing = true;
    this._resizeCore();
    this.resizeCompleted.fire();
    this.isResizing = false;
  },

  focus(preventScroll) {
    this.element().get(0).focus({ preventScroll });
  },
});

const MODULES_ORDER_MAX_INDEX = 1000000;

const processModules = function (that, componentClass) {
  const { modules } = componentClass;
  const { modulesOrder } = componentClass;
  const controllerTypes = componentClass.controllerTypes || {};
  const viewTypes = componentClass.viewTypes || {};

  if (!componentClass.controllerTypes) {
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

    each(modules, function () {
      const { controllers } = this;
      const moduleName = this.name;
      const { views } = this;

      controllers && each(controllers, (name, type) => {
        if (controllerTypes[name]) {
          throw errors.Error('E1001', moduleName, name);
        } else if (!(type && type.subclassOf && type.subclassOf(Controller))) {
          type.subclassOf(Controller);
          throw errors.Error('E1002', moduleName, name);
        }
        controllerTypes[name] = type;
      });
      views && each(views, (name, type) => {
        if (viewTypes[name]) {
          throw errors.Error('E1003', moduleName, name);
        } else if (!(type && type.subclassOf && type.subclassOf(View))) {
          throw errors.Error('E1004', moduleName, name);
        }
        viewTypes[name] = type;
      });
    });

    each(modules, function () {
      const { extenders } = this;

      if (extenders) {
        extenders.controllers && each(extenders.controllers, (name, extender) => {
          if (controllerTypes[name]) {
            controllerTypes[name] = controllerTypes[name].inherit(extender);
          }
        });
        extenders.views && each(extenders.views, (name, extender) => {
          if (viewTypes[name]) {
            viewTypes[name] = viewTypes[name].inherit(extender);
          }
        });
      }
    });

    componentClass.controllerTypes = controllerTypes;
    componentClass.viewTypes = viewTypes;
  }

  const registerPublicMethods = function (that, name, moduleItem) {
    const publicMethods = moduleItem.publicMethods();
    if (publicMethods) {
      each(publicMethods, (index, methodName) => {
        if (moduleItem[methodName]) {
          if (!that[methodName]) {
            that[methodName] = function () {
              return moduleItem[methodName].apply(moduleItem, arguments);
            };
          } else {
            throw errors.Error('E1005', methodName);
          }
        } else {
          throw errors.Error('E1006', name, methodName);
        }
      });
    }
  };

  const createModuleItems = function (moduleTypes) {
    const moduleItems = {};

    each(moduleTypes, (name, moduleType) => {
      // eslint-disable-next-line new-cap
      const moduleItem = new moduleType(that);
      moduleItem.name = name;
      registerPublicMethods(that, name, moduleItem);

      moduleItems[name] = moduleItem;
    });

    return moduleItems;
  };

  that._controllers = createModuleItems(controllerTypes);
  that._views = createModuleItems(viewTypes);
};

const callModuleItemsMethod = function (that, methodName, args) {
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
    delete this.controllerTypes;
    delete this.viewTypes;
  },

  registerModulesOrder(moduleNames) {
    this.modulesOrder = moduleNames;
  },

  unregisterModule(name) {
    this.modules = grep(this.modules, (module) => module.name !== name);
    delete this.controllerTypes;
    delete this.viewTypes;
  },

  processModules,

  callModuleItemsMethod,
};
