/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import errors from '@js/core/errors';
import { isDefined, isObject } from '@js/core/utils/type';

import { Export } from './common/export';

const HOW_TO_MIGRATE_ARTICLE = 'https://supportcenter.devexpress.com/ticket/details/t1077554';

function _getFullOptions(options) {
  if (!(isDefined(options) && isObject(options))) {
    throw Error('The "exportDataGrid" method requires a configuration object.');
  }
  // @ts-expect-error
  if (!(isDefined(options.component) && isObject(options.component) && options.component.NAME === 'dxDataGrid')) {
    throw Error('The "component" field must contain a DataGrid instance.');
  }
  // @ts-expect-error
  if (!(isDefined(options.jsPDFDocument) && isObject(options.jsPDFDocument))) {
    throw Error('The "jsPDFDocument" field must contain a jsPDF instance.');
  }
  // @ts-expect-error
  if (isDefined(options.autoTableOptions)) {
    errors.log('W0001', 'Export', 'autoTableOptions', '22.1', `You can migrate from exporting to PDF with the AutoTable plugin to a new export system. See the following topic for more information: ${HOW_TO_MIGRATE_ARTICLE}`);
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
