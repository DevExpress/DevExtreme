import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';
import { isFunction, isPlainObject, isString } from '@js/core/utils/type';
import type { Format } from '@js/localization';
import parentLocales from '@ts/core/localization/cldr-data/parent_locales';
import getParentLocale from '@ts/core/localization/parentLocale';

type LocaleMap = Record<string, Format>;

type GlobalFormatValue = Format | LocaleMap;

type GlobalFormatOptionName = 'dateFormat' | 'dateTimeFormat' | 'timeFormat' | 'numberFormat';

const hasOwn = Object.prototype.hasOwnProperty;

const resolveByLocaleMap = (localeMap: LocaleMap): Format | undefined => {
  let currentLocale: string | false = coreLocalization.locale();

  while (currentLocale) {
    if (hasOwn.call(localeMap, currentLocale) && localeMap[currentLocale] !== undefined) {
      return localeMap[currentLocale];
    }

    currentLocale = getParentLocale(parentLocales, currentLocale);
  }

  if (hasOwn.call(localeMap, 'default')) {
    return localeMap.default;
  }

  return undefined;
};

const resolveConfigValue = (value: GlobalFormatValue): Format | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (isString(value) || isFunction(value)) {
    return value;
  }

  if (isPlainObject(value)) {
    // NOTE: any plain object is treated as a locale map ({ 'de-DE': format, default: format }).
    // A FormatObject or Intl options object has no locale keys, so it resolves to undefined.
    return resolveByLocaleMap(value as LocaleMap);
  }

  return undefined;
};

const resolveGlobalFormat = (optionName: GlobalFormatOptionName): Format | undefined => {
  const { [optionName]: optionValue } = config();

  return resolveConfigValue(optionValue);
};

export const getGlobalFormatByDataType = (dataType: string): Format | undefined => {
  switch (dataType) {
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

export const resolvePresetOverride = (presetName: string): Format | undefined => {
  const { dateTimeFormatPresets: presets } = config();

  if (!presets || !isPlainObject(presets)) {
    return undefined;
  }

  const lowerName = presetName.toLowerCase();
  const matchedKey = Object.keys(presets).find((key) => key.toLowerCase() === lowerName);

  if (matchedKey === undefined) {
    return undefined;
  }

  return resolveConfigValue(presets[matchedKey]);
};

export default {
  getGlobalFormatByDataType,
  resolvePresetOverride,
};
