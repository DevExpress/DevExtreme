"use strict";

/* global $ */

window.XMLHttpRequestMock = function() {
    var xhrList = [];
    var LOAD_TIMEOUT = this.LOAD_TIMEOUT = 500;
    var PROGRESS_INTERVAL = this.PROGRESS_INTERVAL = 100;
    var STATUS = this.STATUS = 200;

    this.getInstanceAt = function(index) {
        index = index || 0;
        return xhrList[index];
    };

    this.getLastInstance = function() {
        return xhrList[xhrList.length - 1];
    };

    this.setStatus = function(status) {
        STATUS = this.STATUS = status;
    };

    this.dispose = function() {
        $.each(xhrList, function(_, request) {
            clearTimeout(request._timeout);
        });
    };

    this.XMLHttpRequest = function() {
        this._headers = {};

        this._opened = false;
        this._fileSize = 0;

        this.url = null;
        this.loadedSize = 0;
        this.status = 0;

        this.uploadStarted = false;
        this.uploaded = false;
        this.uploadAborted = false;
        this.uploadFailed = false;

        this._timeout = null;

        this._getLoadedSize = function() {
            return (this.onProgressCallCount + 1) * this._stepSize;
        };

        this._isStatusError = function() {
            return 400 <= STATUS && STATUS < 500;
        };

        this._isStatusSuccess = function() {
            return 200 <= STATUS && STATUS < 300;
        };

        this._progressHandler = function() {
            if(this.uploadAborted) {
                return;
            }

            var progressEvent = {
                loaded: this._getLoadedSize(),
                total: this._fileSize
            };

            this.loadedSize = progressEvent.loaded;
            this.onProgressCallCount++;
            this.upload["onprogress"](progressEvent);

            if(progressEvent.loaded >= progressEvent.total) {
                var readyStateEvent = {
                    currentTarget: {
                        status: STATUS,
                        readyState: 4
                    }
                };

                this.uploaded = true;
                this.upload.onload(progressEvent);
                this["onreadystatechange"](readyStateEvent);
            } else {
                this._timeout = setTimeout($.proxy(this._progressHandler, this), PROGRESS_INTERVAL);
            }
        };

        this._errorHandler = function() {
            var errorEvent = {
                loaded: 0,
                total: 0
            };

            var readyStateEvent = {
                currentTarget: {
                    status: STATUS,
                    readyState: 4
                }
            };

            this.uploadFailed = true;
            this.upload.onerror(errorEvent);
            this["onreadystatechange"](readyStateEvent);
        };

        this.setRequestHeader = function(name, value) {
            this._headers[name] = value;
        };

        this.open = function(method, url, async) {
            this._method = method;
            this._opened = true;
            this.url = url;
        };

        this.send = function(data) {
            if(!this._opened) {
                throw Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
            }

            this.uploadStarted = true;

            if(this._isStatusError()) {
                this._errorHandler();
                return;
            }

            this.loadedSize = 0;
            this.uploaded = false;
            this.onProgressCallCount = 0;

            var file = data.getTopElement && data.getTopElement().fieldValue;
            this._fileSize = file && file.size;

            this._stepSize = this._fileSize * PROGRESS_INTERVAL / LOAD_TIMEOUT;
            this.upload["onloadstart"]();
            this._progressHandler();
        };

        this.abort = function() {
            this.uploadAborted = true;
            this.upload["onabort"]();
        };

        this["onreadystatechange"] = $.noop;

        this.upload = {
            "onabort": $.noop,
            "onprogress": $.noop,
            "onload": $.noop,
            "onerror": $.noop,
            "onloadstart": $.noop
        };

        xhrList.push(this);
    };
};

window.FormDataMock = function() {
    var formDataArray = this.formDataArray = [];

    this.getInstanceAt = function(index) {
        index = index || 0;
        return formDataArray[index];
    };

    this.getLastInstance = function() {
        return formDataArray[formDataArray.length - 1];
    };

    this.FormData = function() {
        this.fields = [];

        this.append = function(fieldName, fieldValue) {
            this.fields.push({ "fieldName": fieldName, "fieldValue": fieldValue });
        };

        this.getTopElement = function() {
            return this.fields.length ? this.fields[0] : null;
        };

        formDataArray.push(this);
    };
};
