"use strict";
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
exports.discover = exports.mountTemplate = void 0;
var VueType = __importStar(require("vue"));
var errors_1 = require("./errors");
var TEMPLATE_PROP = "template";
var Vue = VueType.default || VueType;
function asConfigurable(component) {
    if (!component.$vnode) {
        return undefined;
    }
    var configurable = component.$vnode.componentOptions;
    if (!configurable.$_config || !configurable.$_config.name) {
        return undefined;
    }
    return configurable;
}
function hasTemplate(component) {
    return TEMPLATE_PROP in component.$props && (component.$vnode.data && component.$vnode.data.scopedSlots);
}
function discover(component) {
    var templates = {};
    for (var slotName in component.$scopedSlots) {
        if (slotName === "default" && component.$slots.default) {
            continue;
        }
        var slot = component.$scopedSlots[slotName];
        if (!slot) {
            continue;
        }
        templates[slotName] = slot;
    }
    for (var _i = 0, _a = component.$children; _i < _a.length; _i++) {
        var childComponent = _a[_i];
        var configurable = asConfigurable(childComponent);
        if (!configurable) {
            continue;
        }
        var defaultSlot = childComponent.$scopedSlots.default;
        if (!defaultSlot || !hasTemplate(childComponent)) {
            continue;
        }
        var templateName = configurable.$_config.fullPath + "." + TEMPLATE_PROP;
        templates[templateName] = defaultSlot;
    }
    return templates;
}
exports.discover = discover;
function mountTemplate(getSlot, parent, data, name, placeholder) {
    return new Vue({
        el: placeholder,
        name: name,
        inject: ["eventBus"],
        parent: parent,
        created: function () {
            var _this = this;
            this.eventBus.$on("updated", function () {
                _this.$forceUpdate();
            });
        },
        render: function (createElement) {
            var content = getSlot()(data);
            if (!content) {
                return createElement("div");
            }
            if (content.length > 1) {
                throw new Error(errors_1.TEMPLATE_MULTIPLE_ROOTS_ERROR);
            }
            return content[0];
        },
        destroyed: function () {
            // T857821
            this.eventBus.$off("updated");
        }
    });
}
exports.mountTemplate = mountTemplate;
