import renderer from 'core/renderer';
import typeUtils from 'core/utils/type';

const originalCSSMethod = renderer.fn.css;

const validateStyleName = function(name) {
    if(name.indexOf('-') > -1) {
        throw new Error('CSS property \'' + name + '\' should be described in camelCase.');
    }
};

renderer.fn.css = function(name) {
    if(typeUtils.isString(name)) {
        validateStyleName(name);
    } else if(typeUtils.isPlainObject(name)) {
        for(const key in name) {
            validateStyleName(key);
        }
    }

    return originalCSSMethod.apply(this, arguments);
};
