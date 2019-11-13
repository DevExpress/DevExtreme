/* global Windows */
import $ from "../core/renderer";
import domAdapter from "../core/dom_adapter";
import windowUtils from "../core/utils/window";
import eventsEngine from "../events/core/events_engine";
import errors from "../ui/widget/ui.errors";
import typeUtils from "../core/utils/type";

const window = windowUtils.getWindow();
const navigator = windowUtils.getNavigator();

const FILE_EXTESIONS = {
    EXCEL: "xlsx",
    CSS: "css",
    PNG: "png",
    JPEG: "jpeg",
    GIF: "gif",
    SVG: "svg",
    PDF: "pdf"
};

const MIME_TYPES = exports.MIME_TYPES = {
    CSS: "text/css",
    EXCEL: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    PNG: "image/png",
    JPEG: "image/jpeg",
    GIF: "image/gif",
    SVG: "image/svg+xml",
    PDF: "application/pdf"
};

// Use github.com/eligrey/FileSaver.js library instead this method

exports.fileSaver = {
    _revokeObjectURLTimeout: 30000,

    _getDataUri: function(format, data) {
        return "data:" + MIME_TYPES[format] + ";base64," + data;
    },

    _linkDownloader: function(fileName, href) {
        var exportLinkElement = domAdapter.createElement('a');
        exportLinkElement.download = fileName;
        exportLinkElement.href = href;

        exportLinkElement.target = "_blank"; // cors policy

        return exportLinkElement;
    },

    _formDownloader: function(proxyUrl, fileName, contentType, data) {
        var formAttributes = { method: "post", action: proxyUrl, enctype: "multipart/form-data" },
            exportForm = $("<form>").css({ "display": "none" }).attr(formAttributes);

        exportForm.append("<input type=\"hidden\" name=\"fileName\" value=\"" + fileName + "\" />");
        exportForm.append("<input type=\"hidden\" name=\"contentType\" value=\"" + contentType + "\" />");
        exportForm.append("<input type=\"hidden\" name=\"data\" value=\"" + data + "\" />");
        exportForm.appendTo("body");
        eventsEngine.trigger(exportForm, "submit");

        if(eventsEngine.trigger(exportForm, "submit")) exportForm.remove();
        ///#DEBUG
        return exportForm;
        ///#ENDDEBUG
    },

    _saveByProxy: function(proxyUrl, fileName, format, data) {
        return this._formDownloader(proxyUrl, fileName, MIME_TYPES[format], data);
    },

    _winJSBlobSave: function(blob, fileName, format) {
        var savePicker = new Windows.Storage.Pickers.FileSavePicker();
        savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
        savePicker.fileTypeChoices.insert(MIME_TYPES[format], ["." + FILE_EXTESIONS[format]]);
        savePicker.suggestedFileName = fileName;

        savePicker.pickSaveFileAsync().then(function(file) {
            if(file) {
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function(outputStream) {
                    var inputStream = blob.msDetachStream();
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
            var event = domAdapter.getDocument().createEvent('MouseEvents');
            event.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
            link.dispatchEvent(event);
        }
    },

    _saveBlobAs: function(fileName, format, data) {
        var that = this;

        that._blobSaved = false;

        if(typeUtils.isDefined(navigator.msSaveOrOpenBlob)) {
            navigator.msSaveOrOpenBlob(data, fileName);
            that._blobSaved = true;
        } else if(typeUtils.isDefined(window.WinJS)) {
            that._winJSBlobSave(data, fileName, format);
            that._blobSaved = true;
        } else {
            var URL = window.URL || window.webkitURL || window.mozURL || window.msURL || window.oURL;

            if(typeUtils.isDefined(URL)) {
                var objectURL = URL.createObjectURL(data);
                var downloadLink = that._linkDownloader(fileName, objectURL);

                setTimeout(() => {
                    URL.revokeObjectURL(objectURL);
                    that._objectUrlRevoked = true;
                }, this._revokeObjectURLTimeout);

                this._click(downloadLink);
            }
        }
    },

    saveAs: function(fileName, format, data, proxyURL, forceProxy) {
        fileName += "." + FILE_EXTESIONS[format];

        if(typeUtils.isDefined(proxyURL)) {
            errors.log("W0001", "Export", "proxyURL", "19.2", "This option is no longer required");
        }

        if(forceProxy) {
            this._saveByProxy(proxyURL, fileName, format, data);
        } else if(typeUtils.isFunction(window.Blob)) {
            this._saveBlobAs(fileName, format, data);
        } else {
            if(typeUtils.isDefined(proxyURL) && !typeUtils.isDefined(navigator.userAgent.match(/iPad/i))) {
                this._saveByProxy(proxyURL, fileName, format, data);
            } else {
                if(!typeUtils.isDefined(navigator.userAgent.match(/iPad/i))) errors.log("E1034");

                var downloadLink = this._linkDownloader(fileName, this._getDataUri(format, data));
                this._click(downloadLink);
            }
        }
    }
};
