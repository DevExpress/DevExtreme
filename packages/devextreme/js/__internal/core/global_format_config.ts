import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';
import { isFunction, isPlainObject, isString } from '@js/core/utils/type';
import type { Format, FormatObject } from '@js/localization';
import parentLocales from '@ts/core/localization/cldr-data/parent_locales';
import getParentLocale from '@ts/core/localization/parentLocale';

type LocaleMap = Record<string, Format>;

type GlobalFormatValue = Format | LocaleMap;

type GlobalFormatOptionName = 'dateFormat' | 'dateTimeFormat' | 'timeFormat' | 'numberFormat';

const hasOwn = Object.prototype.hasOwnProperty;

const GLOBAL_FORMAT_DATA_TYPES = ['time', 'datetime', 'date'];

const DEFAULT_IMPLICIT_PRESET_BY_DATA_TYPE = {
  date: 'shortdate',
  datetime: 'shortdateshorttime',
  time: 'shorttime',
};

export type FormatLocale = string | (() => string);

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

const resolveFormatLocaleProperty = (formatObject: FormatObject): string | undefined => {
  const formatLocale = formatObject.locale;

  return isFunction(formatLocale) ? formatLocale() : formatLocale;
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

const getOwnFormatLocale = (format: Format | undefined): string | undefined => (
  isPlainObject(format) ? resolveFormatLocaleProperty(format as FormatObject) : undefined
);

const getFormatType = (format: Format | undefined): string | undefined => (
  isPlainObject(format) ? (format as FormatObject).type : undefined
);

const resolveDataTypeFromGlobalConfig = (presetName: string | undefined): string | undefined => {
  if (!presetName) {
    return undefined;
  }

  const lowerPreset = String(presetName).toLowerCase();

  for (const dataType of GLOBAL_FORMAT_DATA_TYPES) {
    const globalFormatType = getFormatType(getGlobalFormatByDataType(dataType));

    if (globalFormatType?.toLowerCase() === lowerPreset) {
      return dataType;
    }
  }

  for (const dataType of GLOBAL_FORMAT_DATA_TYPES) {
    if (DEFAULT_IMPLICIT_PRESET_BY_DATA_TYPE[dataType] === lowerPreset) {
      return dataType;
    }
  }

  return undefined;
};

const inferDataTypeFromFormatObject = (format: Format): string | undefined => {
  if (!isPlainObject(format)) {
    return undefined;
  }

  const {
    hour, minute, second, year, month, day, weekday,
  } = format as Intl.DateTimeFormatOptions;
  const hasTime = hour !== undefined || minute !== undefined || second !== undefined;
  const hasDate = year !== undefined
    || month !== undefined
    || day !== undefined
    || weekday !== undefined;

  if (hasTime && hasDate) {
    return 'datetime';
  }

  if (hasTime) {
    return 'time';
  }

  if (hasDate) {
    return 'date';
  }

  return undefined;
};

export const getFormatterOptions = (format: Format): Format => {
  if (!isPlainObject(format) || !Object.hasOwnProperty.call(format, 'locale')) {
    return format;
  }

  const stripped = { ...format } as FormatObject;
  delete stripped.locale;

  return stripped;
};

export const getEffectiveFormatLocale = (
  format: Format,
  dataType?: string,
  presetName?: string,
): string => {
  const ownLocale = getOwnFormatLocale(format);

  if (ownLocale) {
    return ownLocale;
  }

  const resolvedDataType = dataType
    ?? resolveDataTypeFromGlobalConfig(presetName ?? getFormatType(format))
    ?? inferDataTypeFromFormatObject(format);

  if (resolvedDataType) {
    const globalFormatLocale = getOwnFormatLocale(getGlobalFormatByDataType(resolvedDataType));

    if (globalFormatLocale) {
      return globalFormatLocale;
    }
  }

  return coreLocalization.locale();
};

export const getDateFormatLocale = (
  sourceFormat: Format,
  resolvedFormat: Format = sourceFormat,
): string => {
  const localeSource = getOwnFormatLocale(sourceFormat) ? sourceFormat : resolvedFormat;
  const sourcePresetName = isString(sourceFormat)
    ? sourceFormat
    : getFormatType(sourceFormat) ?? (isString(resolvedFormat) ? resolvedFormat : undefined);

  return getEffectiveFormatLocale(
    isPlainObject(localeSource) ? localeSource : undefined,
    undefined,
    sourcePresetName,
  );
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
  getEffectiveFormatLocale,
  getDateFormatLocale,
  getFormatterOptions,
};
