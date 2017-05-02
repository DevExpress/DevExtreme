"use strict";

var DataSourceAdapter = require("../grid_core/ui.grid_core.data_source_adapter");

module.exports = {
    extend: function(extender) {
        DataSourceAdapter = DataSourceAdapter.inherit(extender);
    },
    create: function(component) {
        return new DataSourceAdapter(component);
    }
};
