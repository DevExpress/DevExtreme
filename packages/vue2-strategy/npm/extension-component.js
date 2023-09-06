"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DxExtensionComponent = void 0;
var component_1 = require("./component");
var DxExtensionComponent = function () { return component_1.BaseComponent().extend({
    created: function () {
        this.$_isExtension = true;
    },
    mounted: function () {
        this.$el.setAttribute("isExtension", "true");
        if (this.$vnode && this.$vnode.componentOptions.$_hasOwner) {
            return;
        }
        this.attachTo(this.$el);
    },
    methods: {
        attachTo: function (element) {
            this.$_createWidget(element);
        }
    }
}); };
exports.DxExtensionComponent = DxExtensionComponent;
