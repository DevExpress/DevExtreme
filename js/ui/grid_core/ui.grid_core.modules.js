import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import Class from '../../core/class';
import Callbacks from '../../core/utils/callbacks';
import { grep } from '../../core/utils/common';
import { isFunction } from '../../core/utils/type';
import { inArray } from '../../core/utils/array';
import { each } from '../../core/utils/iterator';
import errors from '../widget/ui.errors';
import messageLocalization from '../../localization/message';
import { hasWindow } from '../../core/utils/window';

const WIDGET_WITH_LEGACY_CONTAINER_NAME = 'dxDataGrid';


const ModuleItem = Class.inherit({
    _endUpdateCore: function() { },

    ctor: function(component) {
        const that = this;
        that._updateLockCount = 0;
        that.component = component;
        that._actions = {};
        that._actionConfigs = {};

        each(this.callbackNames() || [], function(index, name) {
            const flags = that.callbackFlags(name) || {};

            flags.unique = true,
            flags.syncStrategy = true;

            that[this] = Callbacks(flags);
        });
    },

    init: function() { },

    callbackNames: function() { },

    callbackFlags: function() { },

    publicMethods: function() { },

    beginUpdate: function() {
        this._updateLockCount++;
    },

    endUpdate: function() {
        if(this._updateLockCount > 0) {
            this._updateLockCount--;
            if(!this._updateLockCount) {
                this._endUpdateCore();
            }
        }
    },

    option: function(name) {
        const component = this.component;
        const optionCache = component._optionCache;

        if(arguments.length === 1 && optionCache) {
            if(!(name in optionCache)) {
                optionCache[name] = component.option(name);
            }
            return optionCache[name];
        }

        return component.option.apply(component, arguments);
    },

    _silentOption: function(name, value) {
        const component = this.component;
        const optionCache = component._optionCache;

        if(optionCache) {
            optionCache[name] = value;
        }

        return component._setOptionWithoutOptionChange(name, value);
    },

    localize: function(name) {
        const optionCache = this.component._optionCache;

        if(optionCache) {
            if(!(name in optionCache)) {
                optionCache[name] = messageLocalization.format(name);
            }
            return optionCache[name];
        }

        return messageLocalization.format(name);
    },

    on: function() {
        return this.component.on.apply(this.component, arguments);
    },

    off: function() {
        return this.component.off.apply(this.component, arguments);
    },

    optionChanged: function(args) {
        if(args.name in this._actions) {
            this.createAction(args.name, this._actionConfigs[args.name]);
            args.handled = true;
        }
    },

    getAction: function(actionName) {
        return this._actions[actionName];
    },

    setAria: function(name, value, $target) {
        const target = $target.get(0);
        const prefix = (name !== 'role' && name !== 'id') ? 'aria-' : '';

        if(target.setAttribute) {
            target.setAttribute(prefix + name, value);
        } else {
            $target.attr(prefix + name, value);
        }
    },

    _createComponent: function() {
        return this.component._createComponent.apply(this.component, arguments);
    },

    getController: function(name) {
        return this.component._controllers[name];
    },

    createAction: function(actionName, config) {

        if(isFunction(actionName)) {
            const action = this.component._createAction(actionName.bind(this), config);
            return function(e) {
                action({ event: e });
            };
        } else {
            this._actions[actionName] = this.component._createActionByOption(actionName, config);
            this._actionConfigs[actionName] = config;
        }
    },

    executeAction: function(actionName, options) {
        const action = this._actions[actionName];

        return action && action(options);
    },

    dispose: function() {
        const that = this;
        each(that.callbackNames() || [], function() {
            that[this].empty();
        });
    },

    addWidgetPrefix: function(className) {
        const componentName = this.component.NAME;

        return 'dx-' + componentName.slice(2).toLowerCase() + (className ? '-' + className : '');
    },

    getWidgetContainerClass: function() {
        const containerName = this.component.NAME === WIDGET_WITH_LEGACY_CONTAINER_NAME ? null : 'container';

        return this.addWidgetPrefix(containerName);
    }
});

const Controller = ModuleItem;

const ViewController = Controller.inherit({
    getView: function(name) {
        return this.component._views[name];
    },

    getViews: function() {
        return this.component._views;
    }
});

const View = ModuleItem.inherit({
    _isReady: function() {
        return this.component.isReady();
    },

    _endUpdateCore: function() {
        this.callBase();

        if(!this._isReady() && this._requireReady) {
            this._requireRender = false;
            this.component._requireResize = false;
        }
        if(this._requireRender) {
            this._requireRender = false;
            this.render(this._$parent);
        }
    },

    _invalidate: function(requireResize, requireReady) {
        this._requireRender = true;
        this.component._requireResize = hasWindow() && (this.component._requireResize || requireResize);
        this._requireReady = this._requireReady || requireReady;
    },

    _renderCore: function() { },

    _resizeCore: function() { },

    _parentElement: function() {
        return this._$parent;
    },

    ctor: function(component) {
        this.callBase(component);
        this.renderCompleted = Callbacks();
        this.resizeCompleted = Callbacks();
    },

    element: function() {
        return this._$element;
    },

    getElementHeight: function() {
        const $element = this.element();

        if(!$element) return 0;

        const marginTop = parseFloat($element.css('marginTop')) || 0;
        const marginBottom = parseFloat($element.css('marginBottom')) || 0;
        const offsetHeight = $element.get(0).offsetHeight;

        return offsetHeight + marginTop + marginBottom;
    },

    isVisible: function() {
        return true;
    },

    getTemplate: function(name) {
        return this.component._getTemplate(name);
    },

    render: function($parent, options) {
        let $element = this._$element;
        const isVisible = this.isVisible();

        if(!$element && !$parent) return;

        this._requireReady = false;

        if(!$element) {
            $element = this._$element = $('<div>').appendTo($parent);
            this._$parent = $parent;
        }

        $element.toggleClass('dx-hidden', !isVisible);
        if(isVisible) {
            this.component._optionCache = {};
            this._renderCore(options);
            this.component._optionCache = undefined;
            this.renderCompleted.fire(options);
        }
    },

    resize: function() {
        this.isResizing = true;
        this._resizeCore();
        this.resizeCompleted.fire();
        this.isResizing = false;
    },

    focus: function() {
        eventsEngine.trigger(this.element(), 'focus');
    }
});

const MODULES_ORDER_MAX_INDEX = 1000000;

const processModules = function(that, componentClass) {
    const modules = componentClass.modules;
    const modulesOrder = componentClass.modulesOrder;
    const controllerTypes = componentClass.controllerTypes || {};
    const viewTypes = componentClass.viewTypes || {};

    if(!componentClass.controllerTypes) {
        if(modulesOrder) {
            modules.sort(function(module1, module2) {
                let orderIndex1 = inArray(module1.name, modulesOrder);
                let orderIndex2 = inArray(module2.name, modulesOrder);

                if(orderIndex1 < 0) {
                    orderIndex1 = MODULES_ORDER_MAX_INDEX;
                }

                if(orderIndex2 < 0) {
                    orderIndex2 = MODULES_ORDER_MAX_INDEX;
                }

                return orderIndex1 - orderIndex2;
            });
        }

        each(modules, function() {
            const controllers = this.controllers;
            const moduleName = this.name;
            const views = this.views;

            controllers && each(controllers, function(name, type) {
                if(controllerTypes[name]) {
                    throw errors.Error('E1001', moduleName, name);
                } else if(!(type && type.subclassOf && type.subclassOf(Controller))) {
                    type.subclassOf(Controller);
                    throw errors.Error('E1002', moduleName, name);
                }
                controllerTypes[name] = type;
            });
            views && each(views, function(name, type) {
                if(viewTypes[name]) {
                    throw errors.Error('E1003', moduleName, name);
                } else if(!(type && type.subclassOf && type.subclassOf(View))) {
                    throw errors.Error('E1004', moduleName, name);
                }
                viewTypes[name] = type;
            });
        });

        each(modules, function() {
            const extenders = this.extenders;

            if(extenders) {
                extenders.controllers && each(extenders.controllers, function(name, extender) {
                    if(controllerTypes[name]) {
                        controllerTypes[name] = controllerTypes[name].inherit(extender);
                    }
                });
                extenders.views && each(extenders.views, function(name, extender) {
                    if(viewTypes[name]) {
                        viewTypes[name] = viewTypes[name].inherit(extender);
                    }
                });
            }
        });

        componentClass.controllerTypes = controllerTypes;
        componentClass.viewTypes = viewTypes;
    }

    const registerPublicMethods = function(that, name, moduleItem) {
        const publicMethods = moduleItem.publicMethods();
        if(publicMethods) {
            each(publicMethods, function(index, methodName) {
                if(moduleItem[methodName]) {
                    if(!that[methodName]) {
                        that[methodName] = function() {
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

    const createModuleItems = function(moduleTypes) {
        const moduleItems = {};

        each(moduleTypes, function(name, moduleType) {
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

const callModuleItemsMethod = function(that, methodName, args) {
    args = args || [];
    if(that._controllers) {
        each(that._controllers, function() {
            this[methodName] && this[methodName].apply(this, args);
        });
    }
    if(that._views) {
        each(that._views, function() {
            this[methodName] && this[methodName].apply(this, args);
        });
    }
};

export default {
    modules: [],

    View: View,

    ViewController: ViewController,

    Controller: Controller,

    registerModule: function(name, module) {
        const modules = this.modules;

        for(let i = 0; i < modules.length; i++) {
            if(modules[i].name === name) {
                return;
            }
        }
        module.name = name;
        modules.push(module);
        delete this.controllerTypes;
        delete this.viewTypes;
    },

    registerModulesOrder: function(moduleNames) {
        this.modulesOrder = moduleNames;
    },

    unregisterModule: function(name) {
        this.modules = grep(this.modules, function(module) {
            return module.name !== name;
        });
        delete this.controllerTypes;
        delete this.viewTypes;
    },

    processModules: processModules,

    callModuleItemsMethod: callModuleItemsMethod
};
