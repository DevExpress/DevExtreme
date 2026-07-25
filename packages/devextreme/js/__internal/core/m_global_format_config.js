import config from '@js/core/config';
import coreLocalization from '@js/common/core/localization/core';
import parentLocales from '@ts/core/localization/cldr-data/parent_locales';
import getParentLocale from '@ts/core/localization/parentLocale';
import { isFunction, isPlainObject, isString } from '@js/core/utils/type';

const hasOwn = Object.prototype.hasOwnProperty;

const GLOBAL_FORMAT_DATA_TYPES = ['time', 'datetime', 'date'];

const DEFAULT_IMPLICIT_PRESET_BY_DATA_TYPE = {
    date: 'shortdate',
    datetime: 'shortdateshorttime',
    time: 'shorttime',
};

const resolveFormatLocaleProperty = (formatObject) => {
    const formatLocale = formatObject.locale;

    return isFunction(formatLocale) ? formatLocale() : formatLocale;
};

const getGlobalFormatLocale = (dataType) => {
    const globalFormat = getGlobalFormatByDataType(dataType);

    if(isPlainObject(globalFormat) && globalFormat.locale) {
        return resolveFormatLocaleProperty(globalFormat);
    }

    return undefined;
};

const resolveDataTypeFromGlobalConfig = (presetName) => {
    if(!presetName) {
        return undefined;
    }

    const lowerPreset = String(presetName).toLowerCase();

    for(let i = 0; i < GLOBAL_FORMAT_DATA_TYPES.length; i++) {
        const dataType = GLOBAL_FORMAT_DATA_TYPES[i];
        const globalFormat = getGlobalFormatByDataType(dataType);

        if(isPlainObject(globalFormat) && globalFormat.type?.toLowerCase() === lowerPreset) {
            return dataType;
        }
    }

    for(let i = 0; i < GLOBAL_FORMAT_DATA_TYPES.length; i++) {
        const dataType = GLOBAL_FORMAT_DATA_TYPES[i];

        if(DEFAULT_IMPLICIT_PRESET_BY_DATA_TYPE[dataType] === lowerPreset) {
            return dataType;
        }
    }

    return undefined;
};

const inferDataTypeFromFormatObject = (format) => {
    if(!isPlainObject(format)) {
        return undefined;
    }

    const hasTime = format.hour !== undefined
        || format.minute !== undefined
        || format.second !== undefined;
    const hasDate = format.year !== undefined
        || format.month !== undefined
        || format.day !== undefined
        || format.weekday !== undefined;

    if(hasTime && hasDate) {
        return 'datetime';
    }

    if(hasTime) {
        return 'time';
    }

    if(hasDate) {
        return 'date';
    }

    return undefined;
};

export const getEffectiveFormatLocale = (format, dataType, presetName) => {
    if(isPlainObject(format) && format.locale) {
        return resolveFormatLocaleProperty(format);
    }

    let resolvedDataType = dataType;

    if(!resolvedDataType) {
        const preset = presetName ?? (isPlainObject(format) ? format.type : undefined);

        resolvedDataType = resolveDataTypeFromGlobalConfig(preset);
    }

    if(!resolvedDataType && isPlainObject(format)) {
        resolvedDataType = inferDataTypeFromFormatObject(getFormatterOptions(format));
    }

    if(resolvedDataType) {
        const globalFormatLocale = getGlobalFormatLocale(resolvedDataType);

        if(globalFormatLocale) {
            return globalFormatLocale;
        }
    }

    return coreLocalization.locale();
};

export const getFormatterOptions = (format) => {
    if(!isPlainObject(format) || !format.locale) {
        return format;
    }

    const stripped = { ...format };
    delete stripped.locale;

    return stripped;
};

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
    getEffectiveFormatLocale,
    getFormatterOptions,
};
