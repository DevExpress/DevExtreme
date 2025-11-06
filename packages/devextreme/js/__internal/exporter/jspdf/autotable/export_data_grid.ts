/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isDefined, isObject } from '@js/core/utils/type';

import { Export } from './export';

function _getFullOptions(options) {
  if (!(isDefined(options) && isObject(options))) {
    throw Error('The "exportDataGrid" method requires a configuration object.');
  }
  // @ts-expect-error
  if (!(isDefined(options.component) && isObject(options.component) && options.component.NAME === 'dxDataGrid')) {
    throw Error('The "component" field must contain a DataGrid instance.');
  }
  // @ts-expect-error
  if (!isDefined(options.selectedRowsOnly)) {
  // @ts-expect-error
    options.selectedRowsOnly = false;
  }
  return Export.getFullOptions(options);
}

function exportDataGrid(options) {
  return Export.export(_getFullOptions(options));
}

// #DEBUG
exportDataGrid.__internals = { _getFullOptions };
// #ENDDEBUG

export { exportDataGrid };
