"use strict";

var extend = require("../../core/utils/extend").extend,
    modules = require("../grid_core/ui.grid_core.modules");

extend(exports, modules, {
    modules: [],

    foreachNodes: function(nodes, callBack) {
        for(var i = 0; i < nodes.length; i++) {
            if(callBack(nodes[i]) !== false && nodes[i].hasChildren && nodes[i].children.length) {
                this.foreachNodes(nodes[i].children, callBack);
            }
        }
    }
});

