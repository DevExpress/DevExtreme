import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';
import {
  isDefined, isFunction, isPlainObject, isString,
} from '@js/core/utils/type';
import type { Format, FormatObject } from '@js/localization';
import parentLocales from '@ts/core/localization/cldr-data/parent_locales';
import getParentLocale from '@ts/core/localization/parentLocale';

type LocaleMap = Record<string, Format>;

type GlobalFormatValue = Format | LocaleMap;

type GlobalFormatOptionName = 'dateFormat' | 'dateTimeFormat' | 'timeFormat' | 'numberFormat';

const hasOwn = Object.prototype.hasOwnProperty;

const DATA_TYPE_FORMAT_PRESET: Record<string, string> = {
  datetime: 'shortDateShortTime',
  time: 'shortTime',
};

export const isLocaleOnlyFormat = (format: Format | undefined): format is FormatObject => {
  if (!isPlainObject(format)) {
    return false;
  }

  const formatObject = format as FormatObject;
  const definedKeys = Object.entries(formatObject)
    .filter(([, value]) => value !== undefined);

  return definedKeys.length === 1
    && definedKeys[0][0] === 'locale'
    && isDefined(formatObject.locale);
};

// A locale-only object has no date or time fields. Intl then formats it as a date,
// so datetime and time values lose their time. Attach the preset for that data type.
export const applyDataTypePreset = (
  format: Format | undefined,
  dataType?: string,
): Format | undefined => {
  const preset = dataType ? DATA_TYPE_FORMAT_PRESET[dataType] : undefined;

  if (!preset || !isLocaleOnlyFormat(format)) {
    return format;
  }

  return {
    ...format,
    type: preset,
  };
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

export const getRawGlobalFormatByDataType = (dataType: string): Format | undefined => {
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

export const getGlobalFormatByDataType = (dataType: string): Format | undefined => (
  applyDataTypePreset(getRawGlobalFormatByDataType(dataType), dataType)
);

export type LocaleAwareFormatter = ((value: Date) => string) & {
  withLocale?: (locale?: FormatLocale) => LocaleAwareFormatter;
};

const getLocaleAwareFormatter = (formatter: unknown): LocaleAwareFormatter | undefined => (
  isFunction((formatter as LocaleAwareFormatter | undefined)?.withLocale)
    ? formatter as LocaleAwareFormatter
    : undefined
);

export const withFormatLocale = (format: Format, locale?: FormatLocale): Format | undefined => {
  if (!locale || !isDefined(format)) {
    return format;
  }

  if (isFunction(format)) {
    return getLocaleAwareFormatter(format)?.withLocale?.(locale) ?? format;
  }

  if (isString(format)) return { type: format, locale };

  const formatter = getLocaleAwareFormatter((format as FormatObject).formatter);

  return {
    ...format,
    ...formatter && { formatter: formatter.withLocale?.(locale) },
    locale,
  } as FormatObject;
};

const getOwnFormatLocale = (format: Format | undefined): string | undefined => (
  isPlainObject(format) ? resolveFormatLocaleProperty(format as FormatObject) : undefined
);

const getFormatType = (format: Format | undefined): string | undefined => (
  isPlainObject(format) ? (format as FormatObject).type : undefined
);

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
): string => {
  const ownLocale = getOwnFormatLocale(format);

  if (ownLocale) {
    return ownLocale;
  }

  if (dataType) {
    const globalFormatLocale = getOwnFormatLocale(getGlobalFormatByDataType(dataType));

    if (globalFormatLocale) {
      return globalFormatLocale;
    }
  }

  return coreLocalization.locale();
};

export const getNumberFormatLocale = (format?: Format | null): string => (
  format
    ? getEffectiveFormatLocale(format)
    : getEffectiveFormatLocale(undefined, 'number')
);

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

const resolveFormatWhenOmitted = (sourceFormat: Format): Format => {
  const presetName = isString(sourceFormat) ? sourceFormat : getFormatType(sourceFormat);
  const presetOverride = presetName ? resolvePresetOverride(presetName) : undefined;

  return presetOverride !== undefined && !isFunction(presetOverride)
    ? presetOverride
    : sourceFormat;
};

export const getDateFormatLocale = (
  sourceFormat: Format,
  resolvedFormat?: Format,
): string => {
  const effectiveResolved = resolvedFormat ?? resolveFormatWhenOmitted(sourceFormat);

  return getOwnFormatLocale(sourceFormat)
    ?? getOwnFormatLocale(effectiveResolved)
    ?? coreLocalization.locale();
};

export default {
  getGlobalFormatByDataType,
  resolvePresetOverride,
  getEffectiveFormatLocale,
  getNumberFormatLocale,
  getDateFormatLocale,
  getFormatterOptions,
};
