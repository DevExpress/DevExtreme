import gridCoreUtils from '../grid_core/ui.grid_core.utils';
import { normalizeSortingInfo } from '../../data/utils';

export function createGroupFilter(path, storeLoadOptions) {
    const groups = normalizeSortingInfo(storeLoadOptions.group);

    const filter = [];

    for(let i = 0; i < path.length; i++) {
        filter.push([groups[i].selector, '=', path[i]]);
    }

    if(storeLoadOptions.filter) {
        filter.push(storeLoadOptions.filter);
    }
    return gridCoreUtils.combineFilters(filter);
}
