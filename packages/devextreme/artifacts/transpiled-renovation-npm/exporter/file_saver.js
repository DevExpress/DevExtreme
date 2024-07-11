"use strict";

exports.fileSaver = exports.MIME_TYPES = void 0;
var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));
var _window = require("../core/utils/window");
var _ui = _interopRequireDefault(require("../ui/widget/ui.errors"));
var _type = require("../core/utils/type");
var _console = require("../core/utils/console");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* global Windows */

const window = (0, _window.getWindow)();
const navigator = (0, _window.getNavigator)();
const FILE_EXTESIONS = {
  EXCEL: 'xlsx',
  CSS: 'css',
  PNG: 'png',
  JPEG: 'jpeg',
  GIF: 'gif',
  SVG: 'svg',
  PDF: 'pdf'
};
const MIME_TYPES = exports.MIME_TYPES = {
  CSS: 'text/css',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
  PDF: 'application/pdf'
};

// Use github.com/eligrey/FileSaver.js library instead this method

const fileSaver = exports.fileSaver = {
  _revokeObjectURLTimeout: 30000,
  _getDataUri: function (format, data) {
    const mimeType = this._getMimeType(format);
    return `data:${mimeType};base64,${data}`;
  },
  _getMimeType: function (format) {
    return MIME_TYPES[format] || 'application/octet-stream';
  },
  _linkDownloader: function (fileName, href) {
    const exportLinkElement = _dom_adapter.default.createElement('a');
    exportLinkElement.download = fileName;
    exportLinkElement.href = href;
    exportLinkElement.target = '_blank'; // cors policy

    return exportLinkElement;
  },
  _winJSBlobSave: function (blob, fileName, format) {
    const savePicker = new Windows.Storage.Pickers.FileSavePicker();
    savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
    const fileExtension = FILE_EXTESIONS[format];
    if (fileExtension) {
      const mimeType = this._getMimeType(format);
      savePicker.fileTypeChoices.insert(mimeType, ['.' + fileExtension]);
    }
    savePicker.suggestedFileName = fileName;
    savePicker.pickSaveFileAsync().then(function (file) {
      if (file) {
        file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (outputStream) {
          const inputStream = blob.msDetachStream();
          Windows.Storage.Streams.RandomAccessStream.copyAsync(inputStream, outputStream).then(function () {
            outputStream.flushAsync().done(function () {
              inputStream.close();
              outputStream.close();
            });
          });
        });
      }
    });
  },
  _click: function (link) {
    try {
      // eslint-disable-next-line no-undef
      link.dispatchEvent(new MouseEvent('click', {
        cancelable: true
      }));
    } catch (e) {
      const event = _dom_adapter.default.getDocument().createEvent('MouseEvents');
      event.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      link.dispatchEvent(event);
    }
  },
  _saveBlobAs: function (fileName, format, data) {
    this._blobSaved = false;
    if ((0, _type.isDefined)(navigator.msSaveOrOpenBlob)) {
      navigator.msSaveOrOpenBlob(data, fileName);
      this._blobSaved = true;
    } else if ((0, _type.isDefined)(window.WinJS)) {
      this._winJSBlobSave(data, fileName, format);
      this._blobSaved = true;
    } else {
      const URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL;
      if ((0, _type.isDefined)(URL)) {
        const objectURL = URL.createObjectURL(data);
        const downloadLink = this._linkDownloader(fileName, objectURL);
        setTimeout(() => {
          URL.revokeObjectURL(objectURL);
          this._objectUrlRevoked = true;
        }, this._revokeObjectURLTimeout);
        this._click(downloadLink);
      } else {
        _console.logger.warn('window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL is not defined');
      }
    }
  },
  saveAs: function (fileName, format, data) {
    const fileExtension = FILE_EXTESIONS[format];
    if (fileExtension) {
      fileName += '.' + fileExtension;
    }
    if ((0, _type.isFunction)(window.Blob)) {
      this._saveBlobAs(fileName, format, data);
    } else {
      if (!(0, _type.isDefined)(navigator.userAgent.match(/iPad/i))) _ui.default.log('E1034');
      const downloadLink = this._linkDownloader(fileName, this._getDataUri(format, data));
      this._click(downloadLink);
    }
  }
};