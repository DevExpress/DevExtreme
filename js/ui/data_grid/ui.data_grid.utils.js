import gridCoreUtils from '../grid_core/ui.grid_core.utils';
import { normalizeSortingInfo as normalizeSortingInfo } from '../../data/utils';

exports.createGroupFilter = function(path, storeLoadOptions) {
    var groups = normalizeSortingInfo(storeLoadOptions.group),
        i,

        filter = [];

    for(i = 0; i < path.length; i++) {
        filter.push([groups[i].selector, '=', path[i]]);
    }

    if(storeLoadOptions.filter) {
        filter.push(storeLoadOptions.filter);
    }
    return gridCoreUtils.combineFilters(filter);
};
