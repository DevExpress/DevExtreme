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
exports.getInnerChanges = exports.getConfig = exports.initOptionChangedFunc = exports.DxConfiguration = void 0;
var VueType = __importStar(require("vue"));
var Vue = VueType.default || VueType;
var configuration_1 = require("./configuration");
function getConfig(vueInstance) {
    if (!vueInstance.$vnode) {
        return;
    }
    var componentOptions = vueInstance.$vnode.componentOptions;
    return componentOptions && componentOptions.$_config;
}
exports.getConfig = getConfig;
function getInnerChanges(vueInstance) {
    if (!vueInstance.$vnode) {
        return;
    }
    var componentOptions = vueInstance.$vnode.componentOptions;
    return componentOptions && componentOptions.$_innerChanges;
}
exports.getInnerChanges = getInnerChanges;
function initOptionChangedFunc(config, vueInstance, innerChanges) {
    if (!config) {
        return;
    }
    config.init(Object.keys(vueInstance.$props));
    configuration_1.setEmitOptionChangedFunc(config, vueInstance, innerChanges);
}
exports.initOptionChangedFunc = initOptionChangedFunc;
function getComponentInfo(_a, removed) {
    var name = _a.name, isCollectionItem = _a.isCollectionItem, ownerConfig = _a.ownerConfig;
    var parentPath = ownerConfig && ownerConfig.fullPath;
    var optionPath = name && parentPath ? parentPath + "." + name : name || "";
    return {
        optionPath: optionPath,
        isCollection: isCollectionItem,
        removed: removed
    };
}
var DxConfiguration = function () { return Vue.extend({
    beforeMount: function () {
        var config = getConfig(this);
        var innerChanges = getInnerChanges(this);
        initOptionChangedFunc(config, this, innerChanges);
        configuration_1.bindOptionWatchers(config, this, innerChanges);
    },
    mounted: function () {
        if (this.$parent.$_instance) {
            this.$parent.$_config.componentsCountChanged
                .push(getComponentInfo(getConfig(this)));
        }
    },
    beforeDestroy: function () {
        this.$parent.$_config.componentsCountChanged
            .push(getComponentInfo(getConfig(this), true));
    },
    render: function (createElement) {
        return createElement();
    }
}); };
exports.DxConfiguration = DxConfiguration;
