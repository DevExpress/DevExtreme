import devices from '../devices';
import { isEmptyObject, isFunction } from '../utils/type';
import { findBestMatches } from '../utils/common';
import { extend } from '../utils/extend';
import { compileGetter } from '../utils/data';

const cachedGetters = {};

export const convertRulesToOptions = (rules) => {
    const currentDevice = devices.current();
    return rules.reduce((options, { device, options: ruleOptions }) => {
        const deviceFilter = device || {};
        const match = isFunction(deviceFilter) ?
            deviceFilter(currentDevice) :
            deviceMatch(currentDevice, deviceFilter);

        if(match) {
            extend(true, options, ruleOptions);
        }
        return options;
    }, {});
};

export const normalizeOptions = (options, value) => {
    return typeof options !== 'string' ? options : { [options]: value };
};

export const deviceMatch = (device, filter) => isEmptyObject(filter) || findBestMatches(device, [filter]).length > 0;

export const getFieldName = fullName => fullName.substr(fullName.lastIndexOf('.') + 1);

export const getParentName = fullName => fullName.substr(0, fullName.lastIndexOf('.'));

export const getNestedOptionValue = function(optionsObject, name) {
    cachedGetters[name] = cachedGetters[name] || compileGetter(name);
    return cachedGetters[name](optionsObject, { functionsAsIs: true });
};

export const createDefaultOptionRules = (options = []) => options;
