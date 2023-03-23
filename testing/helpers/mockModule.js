/* global System */
import $ from 'jquery';

export const mock = (module, value) => {
    const normalizedName = System.resolve(module);
    console.log(module, normalizedName);
    System.delete(normalizedName);
    value.__esModule = true;
    $.extend({ default: value });
    System.set(normalizedName, $.extend({ default: value }, value));
    return value;
};
