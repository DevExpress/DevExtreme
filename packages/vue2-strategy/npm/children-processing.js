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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullAllChildren = void 0;
function pullAllChildren(directChildren, allChildren, config) {
    if (!directChildren || directChildren.length === 0) {
        return;
    }
    pullConfigComponents(directChildren, allChildren, config);
}
exports.pullAllChildren = pullAllChildren;
function pullConfigComponents(children, nodes, ownerConfig) {
    children.forEach(function (node) {
        nodes.push(node);
        if (!node.componentOptions) {
            return;
        }
        var configComponent = node.componentOptions.Ctor;
        if (!configComponent.$_optionName) {
            return;
        }
        var initialValues = __assign(__assign({}, configComponent.$_predefinedProps), node.componentOptions.propsData);
        var config = ownerConfig.createNested(configComponent.$_optionName, initialValues, configComponent.$_isCollectionItem, configComponent.$_expectedChildren);
        node.componentOptions.$_config = config;
        node.componentOptions.$_innerChanges = {};
        if (node.componentOptions.children) {
            pullConfigComponents(node.componentOptions.children, nodes, config);
        }
    });
}
