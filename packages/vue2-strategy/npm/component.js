"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseComponent = exports.DxComponent = void 0;
var VueType = __importStar(require("vue"));
var events_1 = require("devextreme/events");
var children_processing_1 = require("./children-processing");
var configuration_1 = __importStar(require("./configuration"));
var configuration_component_1 = require("./configuration-component");
var constants_1 = require("./constants");
var helpers_1 = require("./helpers");
var templates_manager_1 = require("./templates-manager");
var Vue = VueType.default || VueType;
var BaseComponent = function () { return Vue.extend({
    inheritAttrs: false,
    data: function () {
        return {
            eventBus: new Vue()
        };
    },
    provide: function () {
        return {
            eventBus: this.eventBus
        };
    },
    render: function (createElement) {
        var children = [];
        if (this.$_config.cleanNested) {
            this.$_config.cleanNested();
        }
        children_processing_1.pullAllChildren(this.$slots.default, children, this.$_config);
        this.$_processChildren(children);
        return createElement("div", {
            attrs: { id: this.$attrs.id }
        }, children);
    },
    beforeUpdate: function () {
        this.$_config.setPrevNestedOptions(this.$_config.getNestedOptionValues());
    },
    updated: function () {
        var _a, _b;
        this.$children.forEach(function (child) { return configuration_component_1.initOptionChangedFunc(configuration_component_1.getConfig(child), child, configuration_component_1.getInnerChanges(child)); });
        this.$_templatesManager.discover();
        this.$_instance.beginUpdate();
        this.$_applyConfigurationChanges();
        if (this.$_templatesManager.isDirty) {
            this.$_instance.option("integrationOptions.templates", this.$_templatesManager.templates);
            var props = (_b = (_a = this.$vnode) === null || _a === void 0 ? void 0 : _a.componentOptions) === null || _b === void 0 ? void 0 : _b.propsData;
            for (var _i = 0, _c = Object.keys(this.$_templatesManager.templates); _i < _c.length; _i++) {
                var name_1 = _c[_i];
                this.$_instance.option(helpers_1.getTemplatePropName(props, name_1), name_1);
            }
            this.$_templatesManager.resetDirtyFlag();
        }
        for (var _d = 0, _e = Object.keys(this.$_pendingOptions); _d < _e.length; _d++) {
            var name_2 = _e[_d];
            this.$_instance.option(name_2, this.$_pendingOptions[name_2]);
        }
        this.$_pendingOptions = {};
        this.$_instance.endUpdate();
        this.eventBus.$emit("updated");
    },
    beforeDestroy: function () {
        var instance = this.$_instance;
        if (instance) {
            events_1.triggerHandler(this.$el, constants_1.DX_REMOVE_EVENT);
            instance.dispose();
        }
    },
    created: function () {
        var _this = this;
        this.$_config = new configuration_1.default(function (n, v) { return _this.$_pendingOptions[n] = v; }, null, this.$options.propsData && __assign({}, this.$options.propsData), this.$_expectedChildren);
        this.$_innerChanges = {};
        this.$_config.init(this.$props && Object.keys(this.$props));
    },
    methods: {
        $_applyConfigurationChanges: function () {
            var _this = this;
            this.$_config.componentsCountChanged.forEach(function (_a) {
                var optionPath = _a.optionPath, isCollection = _a.isCollection, removed = _a.removed;
                var options = _this.$_config.getNestedOptionValues();
                if (!isCollection && removed) {
                    _this.$_instance.resetOption(optionPath);
                }
                else {
                    _this.$_instance.option(optionPath, helpers_1.getOptionValue(options, optionPath));
                }
            });
            this.$_config.cleanComponentsCountChanged();
        },
        $_createWidget: function (element) {
            var thisComponent = this;
            thisComponent.$_pendingOptions = {};
            thisComponent.$_templatesManager = new templates_manager_1.TemplatesManager(this);
            var config = this.$_config;
            var options = __assign(__assign(__assign(__assign({}, this.$options.propsData), config.initialValues), config.getNestedOptionValues()), this.$_getIntegrationOptions());
            var instance = new this.$_WidgetClass(element, options);
            thisComponent.$_instance = instance;
            instance.on("optionChanged", function (args) { return config.onOptionChanged(args); });
            configuration_1.setEmitOptionChangedFunc(config, this, this.$_innerChanges);
            configuration_1.bindOptionWatchers(config, this, this.$_innerChanges);
            this.$_createEmitters(instance);
        },
        $_getIntegrationOptions: function () {
            var _a, _b;
            var result = __assign({ integrationOptions: {
                    watchMethod: this.$_getWatchMethod(),
                } }, this.$_getExtraIntegrationOptions());
            if (this.$_templatesManager.isDirty) {
                var templates = this.$_templatesManager.templates;
                result.integrationOptions.templates = templates;
                var props = (_b = (_a = this.$vnode) === null || _a === void 0 ? void 0 : _a.componentOptions) === null || _b === void 0 ? void 0 : _b.propsData;
                for (var _i = 0, _c = Object.keys(templates); _i < _c.length; _i++) {
                    var name_3 = _c[_i];
                    result[helpers_1.getTemplatePropName(props, name_3)] = name_3;
                }
                this.$_templatesManager.resetDirtyFlag();
            }
            return result;
        },
        $_getWatchMethod: function () {
            var _this = this;
            return function (valueGetter, valueChangeCallback, options) {
                options = options || {};
                if (!options.skipImmediate) {
                    valueChangeCallback(valueGetter());
                }
                return _this.$watch(function () {
                    return valueGetter();
                }, function (newValue, oldValue) {
                    if (helpers_1.toComparable(oldValue) !== helpers_1.toComparable(newValue) || options.deep) {
                        valueChangeCallback(newValue);
                    }
                }, {
                    deep: options.deep
                });
            };
        },
        $_getExtraIntegrationOptions: function () {
            return {};
        },
        $_processChildren: function (_children) {
            return;
        },
        $_createEmitters: function (instance) {
            var _this = this;
            Object.keys(this.$listeners).forEach(function (listenerName) {
                var eventName = helpers_1.camelize(listenerName);
                instance.on(eventName, function (e) {
                    _this.$emit(listenerName, e);
                });
            });
        }
    }
}); };
exports.BaseComponent = BaseComponent;
function cleanWidgetNode(node) {
    var removedNodes = [];
    helpers_1.forEachChildNode(node, function (childNode) {
        var parent = childNode.parentNode;
        var isExtension = childNode.hasAttribute && childNode.hasAttribute("isExtension");
        if ((childNode.nodeName === "#comment" || isExtension) && parent) {
            removedNodes.push(childNode);
            parent.removeChild(childNode);
        }
    });
    return removedNodes;
}
function restoreNodes(el, nodes) {
    nodes.forEach(function (node) {
        el.appendChild(node);
    });
}
var DxComponent = function () { return BaseComponent().extend({
    methods: {
        $_getExtraIntegrationOptions: function () {
            return {
                onInitializing: function () {
                    this.beginUpdate();
                }
            };
        },
        $_processChildren: function (children) {
            children.forEach(function (childNode) {
                if (!childNode.componentOptions) {
                    return;
                }
                childNode.componentOptions.$_hasOwner = true;
            });
        },
    },
    mounted: function () {
        var _this = this;
        var nodes = cleanWidgetNode(this.$el);
        this.$_createWidget(this.$el);
        this.$_instance.endUpdate();
        restoreNodes(this.$el, nodes);
        if (this.$slots && this.$slots.default) {
            this.$slots.default.forEach(function (child) {
                var childExtension = child.componentInstance;
                if (childExtension && childExtension.$_isExtension) {
                    childExtension.attachTo(_this.$el);
                }
            });
        }
    }
}); };
exports.DxComponent = DxComponent;
