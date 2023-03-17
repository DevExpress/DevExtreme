/* global System */
import $ from 'jquery';

export const mock = (module, value) => {
    // const normalizedName = System.normalizeSync(module);
    // System.delete(normalizedName);
    // value.__esModule = true;
    // $.extend({ default: value });
    // System.set(normalizedName, System.newModule($.extend({ default: value }, value)));
    return value;
};
