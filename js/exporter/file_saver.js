/* global Windows */
import $ from '../core/renderer';
import domAdapter from '../core/dom_adapter';
import { getWindow, getNavigator } from '../core/utils/window';
import eventsEngine from '../events/core/events_engine';
import errors from '../ui/widget/ui.errors';
import { isDefined, isFunction } from '../core/utils/type';
import { logger } from '../core/utils/console';

const window = getWindow();
const navigator = getNavigator();

const FILE_EXTESIONS = {
    EXCEL: 'xlsx',
    CSS: 'css',
    PNG: 'png',
    JPEG: 'jpeg',
    GIF: 'gif',
    SVG: 'svg',
    PDF: 'pdf'
};

export const MIME_TYPES = {
    CSS: 'text/css',
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PNG: 'image/png',
    JPEG: 'image/jpeg',
    GIF: 'image/gif',
    SVG: 'image/svg+xml',
    PDF: 'application/pdf'
};

// Use github.com/eligrey/FileSaver.js library instead this method

export const fileSaver = {
    _revokeObjectURLTimeout: 30000,

    _getDataUri: function(format, data) {
        const mimeType = this._getMimeType(format);
        return `data:${mimeType};base64,${data}`;
    },

    _getMimeType: function(format) {
        return MIME_TYPES[format] || 'application/octet-stream';
    },

    _linkDownloader: function(fileName, href) {
        const exportLinkElement = domAdapter.createElement('a');
        exportLinkElement.download = fileName;
        exportLinkElement.href = href;
        exportLinkElement.target = '_blank'; // cors policy

        return exportLinkElement;
    },

    _formDownloader: function(proxyUrl, fileName, contentType, data) {
        const formAttributes = { method: 'post', action: proxyUrl, enctype: 'multipart/form-data' };
        const exportForm = $('<form>').css({ 'display': 'none' }).attr(formAttributes);

        function setAttributes(element, attributes) {
            for(const key in attributes) {
                element.setAttribute(key, attributes[key]);
            }

            return element;
        }

        exportForm.append(setAttributes(domAdapter.createElement('input'), { type: 'hidden', name: 'fileName', value: fileName }));
        exportForm.append(setAttributes(domAdapter.createElement('input'), { type: 'hidden', name: 'contentType', value: contentType }));
        exportForm.append(setAttributes(domAdapter.createElement('input'), { type: 'hidden', name: 'data', value: data }));

        exportForm.appendTo('body');
        eventsEngine.trigger(exportForm, 'submit');

        if(eventsEngine.trigger(exportForm, 'submit')) exportForm.remove();
        ///#DEBUG
        return exportForm;
        ///#ENDDEBUG
    },

    _saveByProxy: function(proxyUrl, fileName, format, data) {
        const contentType = this._getMimeType(format);
        return this._formDownloader(proxyUrl, fileName, contentType, data);
    },

    _winJSBlobSave: function(blob, fileName, format) {
        const savePicker = new Windows.Storage.Pickers.FileSavePicker();
        savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;

        const fileExtension = FILE_EXTESIONS[format];
        if(fileExtension) {
            const mimeType = this._getMimeType(format);
            savePicker.fileTypeChoices.insert(mimeType, ['.' + fileExtension]);
        }

        savePicker.suggestedFileName = fileName;

        savePicker.pickSaveFileAsync().then(function(file) {
            if(file) {
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function(outputStream) {
                    const inputStream = blob.msDetachStream();
                    Windows.Storage.Streams.RandomAccessStream.copyAsync(inputStream, outputStream).then(function() {
                        outputStream.flushAsync().done(function() {
                            inputStream.close();
                            outputStream.close();
                        });
                    });
                });
            }
        });
    },

    _click: function(link) {
        try {
            // eslint-disable-next-line no-undef
            link.dispatchEvent(new MouseEvent('click', { cancelable: true }));
        } catch(e) {
            const event = domAdapter.getDocument().createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
            link.dispatchEvent(event);
        }
    },

    _saveBlobAs: function(fileName, format, data) {
        this._blobSaved = false;

        if(isDefined(navigator.msSaveOrOpenBlob)) {
            navigator.msSaveOrOpenBlob(data, fileName);
            this._blobSaved = true;
        } else if(isDefined(window.WinJS)) {
            this._winJSBlobSave(data, fileName, format);
            this._blobSaved = true;
        } else {
            const URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL;

            if(isDefined(URL)) {
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

    saveAs: function(fileName, format, data, proxyURL, forceProxy) {
        const fileExtension = FILE_EXTESIONS[format];
        if(fileExtension) {
            fileName += '.' + fileExtension;
        }

        if(isDefined(proxyURL)) {
            errors.log('W0001', 'Export', 'proxyURL', '19.2', 'This option is no longer required');
        }

        if(forceProxy) {
            this._saveByProxy(proxyURL, fileName, format, data);
        } else if(isFunction(window.Blob)) {
            this._saveBlobAs(fileName, format, data);
        } else {
            if(isDefined(proxyURL) && !isDefined(navigator.userAgent.match(/iPad/i))) {
                this._saveByProxy(proxyURL, fileName, format, data);
            } else {
                if(!isDefined(navigator.userAgent.match(/iPad/i))) errors.log('E1034');

                const downloadLink = this._linkDownloader(fileName, this._getDataUri(format, data));
                this._click(downloadLink);
            }
        }
    }
};
