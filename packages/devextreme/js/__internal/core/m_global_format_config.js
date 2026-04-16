import config from '@js/core/config';
import coreLocalization from '@js/common/core/localization/core';
import parentLocales from '@ts/core/localization/cldr-data/parent_locales';
import getParentLocale from '@ts/core/localization/parentLocale';
import { isFunction, isPlainObject, isString } from '@js/core/utils/type';

const hasOwn = Object.prototype.hasOwnProperty;

const resolveByLocaleMap = (localeMap) => {
    let currentLocale = coreLocalization.locale();

    while(currentLocale) {
        if(hasOwn.call(localeMap, currentLocale) && localeMap[currentLocale] !== undefined) {
            return localeMap[currentLocale];
        }

        currentLocale = getParentLocale(parentLocales, currentLocale);
    }

    if(hasOwn.call(localeMap, 'default')) {
        return localeMap.default;
    }

    return undefined;
};

const resolveConfigValue = (value) => {
    if(value === undefined) {
        return undefined;
    }

    if(isString(value) || isFunction(value)) {
        return value;
    }

    if(isPlainObject(value)) {
        return resolveByLocaleMap(value);
    }

    return undefined;
};

const resolveGlobalFormat = (optionName) => {
    const optionValue = config()[optionName];
    return resolveConfigValue(optionValue);
};

export const getGlobalFormatByDataType = (dataType) => {
    switch(dataType) {
        case 'date':
            return resolveGlobalFormat('dateFormat');
        case 'datetime':
            return resolveGlobalFormat('dateTimeFormat');
        case 'time':
            return resolveGlobalFormat('timeFormat');
        case 'number':
            return resolveGlobalFormat('numberFormat');
        default:
            return undefined;
    }
};

export const resolvePresetOverride = (presetName) => {
    const presets = config().dateTimeFormatPresets;

    if(!presets || !isPlainObject(presets)) {
        return undefined;
    }

    const lowerName = presetName.toLowerCase();
    const keys = Object.keys(presets);

    for(let i = 0; i < keys.length; i++) {
        if(keys[i].toLowerCase() === lowerName) {
            return resolveConfigValue(presets[keys[i]]);
        }
    }

    return undefined;
};

export default {
    getGlobalFormatByDataType,
    resolvePresetOverride,
};
