var gridCoreUtils = require("../grid_core/ui.grid_core.utils"),
    normalizeSortingInfo = require("../../data/utils").normalizeSortingInfo;

exports.createGroupFilter = function(path, storeLoadOptions) {
    var groups = normalizeSortingInfo(storeLoadOptions.group),
        i,

        filter = [];

    for(i = 0; i < path.length; i++) {
        filter.push([groups[i].selector, "=", path[i]]);
    }

    if(storeLoadOptions.filter) {
        filter.push(storeLoadOptions.filter);
    }
    return gridCoreUtils.combineFilters(filter);
};
