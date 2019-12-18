var renderer = require('core/renderer');
var typeUtils = require('core/utils/type');

var originalCSSMethod = renderer.fn.css;

var validateStyleName = function(name) {
    if(name.indexOf('-') > -1) {
        throw new Error('CSS property \'' + name + '\' should be described in camelCase.');
    }
};

renderer.fn.css = function(name) {
    if(typeUtils.isString(name)) {
        validateStyleName(name);
    } else if(typeUtils.isPlainObject(name)) {
        for(var key in name) {
            validateStyleName(key);
        }
    }

    return originalCSSMethod.apply(this, arguments);
};
