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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesManager = void 0;
var config_1 = require("./config");
var templates_discovering_1 = require("./templates-discovering");
var dom_adapter_1 = __importDefault(require("devextreme/core/dom_adapter"));
var events_1 = require("devextreme/events");
var constants_1 = require("./constants");
var helpers_1 = require("./helpers");
var TemplatesManager = /** @class */ (function () {
    function TemplatesManager(component) {
        this._slots = {};
        this._templates = {};
        this._isDirty = false;
        this._component = component;
        this.discover();
    }
    TemplatesManager.prototype.discover = function () {
        var slots = templates_discovering_1.discover(this._component);
        this._slots = __assign(__assign({}, this._slots), slots);
        if (!helpers_1.allKeysAreEqual(this._templates, slots)) {
            this._prepareTemplates();
        }
    };
    Object.defineProperty(TemplatesManager.prototype, "templates", {
        get: function () {
            return this._templates;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TemplatesManager.prototype, "isDirty", {
        get: function () {
            return this._isDirty;
        },
        enumerable: false,
        configurable: true
    });
    TemplatesManager.prototype.resetDirtyFlag = function () {
        this._isDirty = false;
    };
    TemplatesManager.prototype._prepareTemplates = function () {
        this._templates = {};
        for (var _i = 0, _a = Object.keys(this._slots); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            this._templates[name_1] = this.createDxTemplate(name_1);
        }
        this._isDirty = true;
    };
    TemplatesManager.prototype.createDxTemplate = function (name) {
        var _this = this;
        return {
            render: function (data) {
                var scopeData = config_1.getOption("useLegacyTemplateEngine")
                    ? data.model
                    : { data: data.model, index: data.index };
                var container = data.container.get ? data.container.get(0) : data.container;
                var placeholder = document.createElement("div");
                container.appendChild(placeholder);
                var mountedTemplate = templates_discovering_1.mountTemplate(function () { return _this._slots[name]; }, _this._component, scopeData, name, placeholder);
                var element = mountedTemplate.$el;
                dom_adapter_1.default.setClass(element, constants_1.DX_TEMPLATE_WRAPPER_CLASS, true);
                if (element.nodeType === Node.TEXT_NODE) {
                    var removalListener = document.createElement(container.nodeName === "TABLE" ? "tbody" : "span");
                    removalListener.style.display = "none";
                    container.appendChild(removalListener);
                    events_1.one(removalListener, constants_1.DX_REMOVE_EVENT, mountedTemplate.$destroy.bind(mountedTemplate));
                }
                else {
                    events_1.one(element, constants_1.DX_REMOVE_EVENT, mountedTemplate.$destroy.bind(mountedTemplate));
                }
                return element;
            }
        };
    };
    return TemplatesManager;
}());
exports.TemplatesManager = TemplatesManager;
