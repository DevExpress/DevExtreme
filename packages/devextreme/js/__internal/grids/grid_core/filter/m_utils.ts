import { isFunction } from '@js/core/utils/type';
import variableWrapper from '@js/core/utils/variable_wrapper';
import { normalizeDataSourceOptions } from '@js/data/data_source/utils';

export function normalizeLookupDataSource(lookup) {
  let lookupDataSourceOptions;
  if (lookup.items) {
    lookupDataSourceOptions = lookup.items;
  } else {
    lookupDataSourceOptions = lookup.dataSource;
    if (isFunction(lookupDataSourceOptions) && !variableWrapper.isWrapped(lookupDataSourceOptions)) {
      lookupDataSourceOptions = lookupDataSourceOptions({});
    }
  }

  return normalizeDataSourceOptions(lookupDataSourceOptions);
}
