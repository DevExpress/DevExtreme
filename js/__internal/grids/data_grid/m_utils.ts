import gridCoreUtils from '@js/ui/grid_core/ui.grid_core.utils';
// @ts-expect-error
import { normalizeSortingInfo } from '@js/data/utils';

export function createGroupFilter(path, storeLoadOptions) {
  const groups = normalizeSortingInfo(storeLoadOptions.group);

  const filter: any = [];

  for (let i = 0; i < path.length; i++) {
    filter.push([groups[i].selector, '=', path[i]]);
  }

  if (storeLoadOptions.filter) {
    filter.push(storeLoadOptions.filter);
  }
  return gridCoreUtils.combineFilters(filter);
}
