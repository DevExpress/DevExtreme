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
exports.createExtensionComponent = exports.createConfigurationComponent = exports.createComponent = void 0;
var VueType = __importStar(require("vue"));
var Vue = VueType.default || VueType;
var component_1 = require("./component");
var configuration_component_1 = require("./configuration-component");
var extension_component_1 = require("./extension-component");
function createComponent(config) {
    config.extends = component_1.DxComponent();
    return Vue.extend(config);
}
exports.createComponent = createComponent;
function createConfigurationComponent(config) {
    config.extends = configuration_component_1.DxConfiguration();
    return Vue.extend(config);
}
exports.createConfigurationComponent = createConfigurationComponent;
function createExtensionComponent(config) {
    config.extends = extension_component_1.DxExtensionComponent();
    return Vue.extend(config);
}
exports.createExtensionComponent = createExtensionComponent;
