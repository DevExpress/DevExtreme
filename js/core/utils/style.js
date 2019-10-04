var camelize = require("./inflector").camelize,
    callOnce = require("./call_once"),
    typeUtils = require("./type"),
    domAdapter = require("../dom_adapter").default;

var jsPrefixes = ["", "Webkit", "Moz", "O", "Ms"],
    cssPrefixes = {
        "": "",
        "Webkit": "-webkit-",
        "Moz": "-moz-",
        "O": "-o-",
        "ms": "-ms-"
    },
    getStyles = callOnce(function() {
        return domAdapter.createElement("dx").style;
    });

var forEachPrefixes = function(prop, callBack) {
    prop = camelize(prop, true);

    var result;

    for(var i = 0, cssPrefixesCount = jsPrefixes.length; i < cssPrefixesCount; i++) {
        var jsPrefix = jsPrefixes[i];
        var prefixedProp = jsPrefix + prop;
        var lowerPrefixedProp = camelize(prefixedProp);

        result = callBack(lowerPrefixedProp, jsPrefix);

        if(result === undefined) {
            result = callBack(prefixedProp, jsPrefix);
        }

        if(result !== undefined) {
            break;
        }
    }

    return result || "";
};

var styleProp = function(name) {
    if(name in getStyles()) {
        return name;
    }

    var originalName = name;
    name = name.charAt(0).toUpperCase() + name.substr(1);
    for(var i = 1; i < jsPrefixes.length; i++) {
        var prefixedProp = jsPrefixes[i].toLowerCase() + name;
        if(prefixedProp in getStyles()) {
            return prefixedProp;
        }
    }

    return originalName;
};

var stylePropPrefix = function(prop) {
    return forEachPrefixes(prop, function(specific, jsPrefix) {
        if(specific in getStyles()) {
            return cssPrefixes[jsPrefix];
        }
    });
};


var pxExceptions = [
    "fillOpacity",
    "columnCount",
    "flexGrow",
    "flexShrink",
    "fontWeight",
    "lineHeight",
    "opacity",
    "zIndex",
    "zoom"
];

var normalizeStyleProp = function(prop, value) {
    if(typeUtils.isNumeric(value) && pxExceptions.indexOf(prop) === -1) {
        value += "px";
    }

    return value;
};

var setDimensionProperty = function(elements, propertyName, value) {
    if(elements) {
        value = typeUtils.isNumeric(value) ? value += "px" : value;
        for(var i = 0; i < elements.length; ++i) {
            elements[i].style[propertyName] = value;
        }
    }
};

var setWidth = function(elements, value) {
    setDimensionProperty(elements, "width", value);
};

var setHeight = function(elements, value) {
    setDimensionProperty(elements, "height", value);
};

exports.styleProp = styleProp;
exports.stylePropPrefix = stylePropPrefix;
exports.normalizeStyleProp = normalizeStyleProp;
exports.setWidth = setWidth;
exports.setHeight = setHeight;
