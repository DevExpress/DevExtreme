"use strict";

var $ = require("../core/renderer"),
    ajax = require("../core/utils/ajax"),
    isFunction = require("../core/utils/type").isFunction,
    getSvgMarkup = require("../core/utils/svg").getSvgMarkup,
    when = require("../integration/jquery/deferred").when;


exports.svgCreator = {
    _markup: "",
    _imageArray: {},
    _imageDeferreds: [],

    _getBinaryFile: function(src, callback) {
        ajax.sendRequest({
            url: src,
            method: "GET",
            responseType: "arraybuffer"
        }).done(callback).fail(function() {
            callback(false);
        });
    },

    _loadImages: function() {
        var that = this;

        $.each(that._imageArray, function(src) {
            var deferred = new $.Deferred();

            that._imageDeferreds.push(deferred);
            that._getBinaryFile(src, function(response) {
                if(!response) {
                    delete that._imageArray[src]; // ToDo Warning
                    deferred.resolve();
                    return;
                }

                var i,
                    binary = '',
                    bytes = new Uint8Array(response),
                    length = bytes.byteLength;

                for(i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                that._imageArray[src] = "data:image/png;base64," + btoa(binary);
                deferred.resolve();
            });
        });
    },

    _parseImages: function(element) {
        var href,
            that = this;

        if(element.tagName === "image") {
            href = $(element).attr("xlink:href");
            if(!that._imageArray[href]) {
                that._imageArray[href] = "";
            }
        }

        $.each(element.childNodes, function(_, element) {
            that._parseImages(element);
        });
    },

    _prepareImages: function(svgElem) {
        this._parseImages(svgElem);
        this._loadImages();

        return when.apply($, this._imageDeferreds);
    },

    getData: function(data, options) {
        var markup,
            that = this,
            xmlVersion = '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>',
            blob = $.Deferred(),
            parser = new DOMParser(),
            elem = parser.parseFromString(data, "image/svg+xml"),
            svgElem = elem.childNodes[0],
            $svgObject = $(svgElem);

        $svgObject.css("background-color", options.backgroundColor);
        markup = xmlVersion + getSvgMarkup($svgObject.get(0));

        that._prepareImages(svgElem).done(function() {
            $.each(that._imageArray, function(href, dataURI) {
                markup = markup.split(href).join(dataURI);
            });

            blob.resolve(isFunction(window.Blob) ? that._getBlob(markup) : that._getBase64(markup));
        });

        return blob;
    },

    _getBlob: function(markup) {
        return new Blob([markup], { type: "image/svg+xml" });
    },

    _getBase64: function(markup) {
        return window.btoa(markup);
    }
};

exports.getData = function(data, options, callback) {
    exports.svgCreator.getData(data, options).done(callback);
};
