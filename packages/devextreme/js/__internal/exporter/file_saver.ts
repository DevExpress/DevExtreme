/* eslint-disable no-param-reassign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* global Windows */
import domAdapter from '@js/core/dom_adapter';
import { logger } from '@js/core/utils/console';
import { isDefined, isFunction } from '@js/core/utils/type';
import { getNavigator, getWindow } from '@js/core/utils/window';
import errors from '@js/ui/widget/ui.errors';

const window = getWindow();
const navigator = getNavigator();

const FILE_EXTESIONS = {
  EXCEL: 'xlsx',
  CSS: 'css',
  PNG: 'png',
  JPEG: 'jpeg',
  GIF: 'gif',
  SVG: 'svg',
  PDF: 'pdf',
};

export const MIME_TYPES = {
  CSS: 'text/css',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
  PDF: 'application/pdf',
};

// Use github.com/eligrey/FileSaver.js library instead this method

export const fileSaver = {
  _revokeObjectURLTimeout: 30000,

  _getDataUri(format, data) {
    const mimeType = this._getMimeType(format);
    return `data:${mimeType};base64,${data}`;
  },

  _getMimeType(format) {
    return MIME_TYPES[format] || 'application/octet-stream';
  },

  _linkDownloader(fileName, href) {
    const exportLinkElement = domAdapter.createElement('a');
    // @ts-expect-error
    exportLinkElement.download = fileName;
    // @ts-expect-error
    exportLinkElement.href = href;
    // @ts-expect-error
    exportLinkElement.target = '_blank'; // cors policy

    return exportLinkElement;
  },

  _winJSBlobSave(blob, fileName, format) {
    // @ts-expect-error
    const savePicker = new Windows.Storage.Pickers.FileSavePicker();
    // @ts-expect-error
    savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;

    const fileExtension = FILE_EXTESIONS[format];
    if (fileExtension) {
      const mimeType = this._getMimeType(format);
      savePicker.fileTypeChoices.insert(mimeType, [`.${fileExtension}`]);
    }

    savePicker.suggestedFileName = fileName;

    savePicker.pickSaveFileAsync().then((file) => {
      if (file) {
        // @ts-expect-error
        file.openAsync(Windows.Storage.FileAccessMode.readWrite).then((outputStream) => {
          const inputStream = blob.msDetachStream();
          // @ts-expect-error
          Windows.Storage.Streams.RandomAccessStream.copyAsync(inputStream, outputStream).then(() => {
            outputStream.flushAsync().done(() => {
              inputStream.close();
              outputStream.close();
            });
          });
        });
      }
    });
  },

  _click(link) {
    try {
      link.dispatchEvent(new MouseEvent('click', { cancelable: true }));
    } catch (e) {
      const event = domAdapter.getDocument().createEvent('MouseEvents');
      event.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      link.dispatchEvent(event);
    }
  },

  _saveBlobAs(fileName, format, data) {
    this._blobSaved = false;

    // @ts-expect-error
    if (isDefined(navigator.msSaveOrOpenBlob)) {
      // @ts-expect-error
      navigator.msSaveOrOpenBlob(data, fileName);
      this._blobSaved = true;
      // @ts-expect-error
    } else if (isDefined(window.WinJS)) {
      this._winJSBlobSave(data, fileName, format);
      this._blobSaved = true;
    } else {
      // @ts-expect-error
      const URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL;

      if (isDefined(URL)) {
        const objectURL = URL.createObjectURL(data);
        const downloadLink = this._linkDownloader(fileName, objectURL);

        setTimeout(() => {
          URL.revokeObjectURL(objectURL);
          this._objectUrlRevoked = true;
        }, this._revokeObjectURLTimeout);

        this._click(downloadLink);
      } else {
        logger.warn('window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL is not defined');
      }
    }
  },

  saveAs(fileName, format, data) {
    const fileExtension = FILE_EXTESIONS[format];
    if (fileExtension) {
      fileName += `.${fileExtension}`;
    }

    // @ts-expect-error
    if (isFunction(window.Blob)) {
      this._saveBlobAs(fileName, format, data);
    } else {
      if (!isDefined(/iPad/i.exec(navigator.userAgent))) errors.log('E1034');

      const downloadLink = this._linkDownloader(fileName, this._getDataUri(format, data));
      this._click(downloadLink);
    }
  },
};
