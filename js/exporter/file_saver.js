/* global Windows */
var $ = require("../core/renderer"),
    domAdapter = require("../core/dom_adapter"),
    windowUtils = require("../core/utils/window"),
    window = windowUtils.getWindow(),
    navigator = windowUtils.getNavigator(),
    eventsEngine = require("../events/core/events_engine"),
    errors = require("../ui/widget/ui.errors"),
    typeUtils = require("../core/utils/type"),

    FILE_EXTESIONS = {
        EXCEL: "xlsx",
        CSS: "css",
        PNG: "png",
        JPEG: "jpeg",
        GIF: "gif",
        SVG: "svg",
        PDF: "pdf"
    };

var MIME_TYPES = exports.MIME_TYPES = {
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

    /* _cordovaDownloader: function(fileName, href, callback) {
        var transfer = new FileTransfer(),
            fileAlert = function(res) {
                navigator.notification.alert(res.nativeURL, null, DX.localization.message.format("dxFileSaver-fileExported"));
            };

        transfer.download(href, window.cordova.file.externalRootDirectory + fileName, fileAlert, fileAlert);
    }, */

    _linkDownloader: function(fileName, href, clickHandler) {
        var exportLinkElement = domAdapter.createElement('a'),
            attributes = {
                "download": fileName,
                "href": href,
                "target": "_blank"
            };

        eventsEngine.on($(exportLinkElement), "click", function() {
            $(exportLinkElement).remove();
            clickHandler && clickHandler.apply(this, arguments);
        });
        domAdapter.getBody().appendChild(exportLinkElement);
        $(exportLinkElement).css({ "display": "none" }).text("load").attr(attributes)[0].click();

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

    _saveBlobAs: function(fileName, format, data, linkClick) {
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
                var objectURL = URL.createObjectURL(data),
                    revokeObjectURLTimeout = that._revokeObjectURLTimeout,
                    clickHandler = function(e) {
                        setTimeout(function() {
                            URL.revokeObjectURL(objectURL);
                            ///#DEBUG
                            that._objectUrlRevoked = true;
                            ///#ENDDEBUG
                        }, revokeObjectURLTimeout);
                        ///#DEBUG
                        typeUtils.isFunction(linkClick) && linkClick.apply(this, arguments);
                        ///#ENDDEBUG
                    };

                return that._linkDownloader(fileName, objectURL, clickHandler);
            }
        }
    },

    saveAs: function(fileName, format, data, proxyURL, linkClick, forceProxy) {
        fileName += "." + FILE_EXTESIONS[format];

        /* if(commonUtils.isDefined(window.cordova)) {
            return this._cordovaDownloader(fileName, this._getDataUri(format, data), linkClick);
        } */

        if(forceProxy) {
            this._saveByProxy(proxyURL, fileName, format, data);
        } else if(typeUtils.isFunction(window.Blob)) {
            this._saveBlobAs(fileName, format, data, linkClick);
        } else {
            if(typeUtils.isDefined(proxyURL) && !typeUtils.isDefined(navigator.userAgent.match(/iPad/i))) {
                this._saveByProxy(proxyURL, fileName, format, data);
            } else {
                if(!typeUtils.isDefined(navigator.userAgent.match(/iPad/i))) errors.log("E1034");

                this._linkDownloader(fileName, this._getDataUri(format, data), linkClick);
            }
        }
    }
};
