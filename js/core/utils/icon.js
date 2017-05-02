"use strict";

var $ = require("../../core/renderer");

var getImageSourceType = function(source) {
    if(!source || typeof source !== "string") {
        return false;
    }

    if(/data:.*base64|\.|\//.test(source)) {
        return "image";
    }

    if(/^[\w-_]+$/.test(source)) {
        return "dxIcon";
    }

    return "fontIcon";
};

var getImageContainer = function(source) {
    var imageType = getImageSourceType(source),
        ICON_CLASS = "dx-icon";
    switch(imageType) {
        case "image":
            return $("<img>", { src: source }).addClass(ICON_CLASS);
        case "fontIcon":
            return $("<i>", { "class": ICON_CLASS + " " + source });
        case "dxIcon":
            return $("<i>", { "class": ICON_CLASS + " " + ICON_CLASS + "-" + source });
        default:
            return null;
    }
};

exports.getImageSourceType = getImageSourceType;
exports.getImageContainer = getImageContainer;
