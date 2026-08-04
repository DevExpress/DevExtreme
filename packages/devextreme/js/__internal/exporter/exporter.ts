import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isBoolean, isFunction } from '@js/core/utils/type';

import { fileSaver } from './file_saver';
import {
  /// #DEBUG
  asyncEach,
  /// #ENDDEBUG
  getData as getImageData,
  imageCreator,
  testFormats,
} from './image_creator';
import { getData } from './pdf_creator';
import { getData as getSvgData, svgCreator } from './svg_creator';

interface ExportEventArgs {
  fileName: string;
  format: string;
  cancel: boolean;
  selectedRowsOnly?: boolean;
  data?: unknown;
}

interface ExportOptions {
  fileName: string;
  format: string;
  selectedRowsOnly?: boolean;
  // TODO: Can the following actions be not defined?
  // (since they are provided by a widget not by a user)
  exportingAction?: (args: ExportEventArgs) => void;
  exportedAction?: () => void;
  fileSavingAction?: (args: ExportEventArgs) => void;
}

type GetBlob = (data: unknown, options: ExportOptions) => DeferredObj<unknown>;

function performExport(
  data: unknown,
  options: ExportOptions,
  getBlob: GetBlob,
): DeferredObj<unknown> {
  if (!data) {
    return Deferred<unknown>().resolve();
  }

  const { exportingAction, exportedAction, fileSavingAction } = options;

  const eventArgs: ExportEventArgs = {
    fileName: options.fileName,
    format: options.format,
    cancel: false,
  };

  if (isBoolean(options.selectedRowsOnly)) {
    eventArgs.selectedRowsOnly = options.selectedRowsOnly;
  }

  if (isFunction(exportingAction)) {
    exportingAction(eventArgs);
  }

  if (!eventArgs.cancel) {
    return getBlob(data, options).then((blob) => {
      if (isFunction(exportedAction)) {
        exportedAction();
      }

      if (isFunction(fileSavingAction)) {
        eventArgs.data = blob;
        fileSavingAction(eventArgs);
      }

      if (!eventArgs.cancel) {
        const format = options.format === 'xlsx' ? 'EXCEL' : options.format;
        fileSaver.saveAs(eventArgs.fileName, format, blob);
      }
    });
  }

  return Deferred<unknown>().resolve();
}

export {
  performExport as export,
  fileSaver,
};

export const image = {
  /// #DEBUG
  asyncEach,
  /// #ENDDEBUG
  creator: imageCreator,
  getData: getImageData,
  testFormats,
};

export const pdf = {
  getData,
};

export const svg = {
  creator: svgCreator,
  getData: getSvgData,
};
