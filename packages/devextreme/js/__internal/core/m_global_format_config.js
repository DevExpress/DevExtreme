import config from '@js/core/config';
import { locale as getCurrentLocale } from '@js/common/core/localization/core';
import parentLocales from '@ts/core/localization/cldr-data/parent_locales';
import getParentLocale from '@ts/core/localization/parentLocale';
import { isFunction, isPlainObject, isString } from '@js/core/utils/type';

const hasOwn = Object.prototype.hasOwnProperty;

const resolveByLocaleMap = (localeMap) => {
    let currentLocale = getCurrentLocale();

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

const resolveGlobalFormat = (optionName) => {
    const optionValue = config()[optionName];

    if(optionValue === undefined) {
        return undefined;
    }

    if(isString(optionValue) || isFunction(optionValue)) {
        return optionValue;
    }

    if(isPlainObject(optionValue)) {
        return resolveByLocaleMap(optionValue);
    }

    return undefined;
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

export default {
    getGlobalFormatByDataType,
};
