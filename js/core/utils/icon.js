import $ from "../../core/renderer";

const ICON_CLASS = "dx-icon";

const getImageSourceType = (source) => {
    if(!source || typeof source !== "string") {
        return false;
    }

    if(/<\s*svg[^>]*>(.*?)<\s*\/\s*svg>/.test(source)) {
        return "svg";
    }

    if(/data:.*base64|\.|\//.test(source)) {
        return "image";
    }

    if(/^[\w-_]+$/.test(source)) {
        return "dxIcon";
    }

    return "fontIcon";
};

const getImageContainer = (source) => {
    switch(getImageSourceType(source)) {
        case "image":
            return $("<img>").attr("src", source).addClass(ICON_CLASS);
        case "fontIcon":
            return $("<i>").addClass(ICON_CLASS + " " + source);
        case "dxIcon":
            return $("<i>").addClass(ICON_CLASS + " " + ICON_CLASS + "-" + source);
        case "svg":
            return $("<i>").addClass(ICON_CLASS).append(source);
        default:
            return null;
    }
};

exports.getImageSourceType = getImageSourceType;
exports.getImageContainer = getImageContainer;
