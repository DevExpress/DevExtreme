/* global DevExpress */

import errors from '@js/core/errors';
import { extend } from '@js/core/utils/extend';

type ConfigOptions = Record<string, unknown>;

const normalizeToJSONString = (optionsString: string): string => optionsString
  .replace(/'/g, '"') // replace all ' to "
  .replace(/,\s*([\]}])/g, '$1') // remove trailing commas
  .replace(/([{,])\s*([^":\s]+)\s*:/g, '$1"$2":'); // add quotes for unquoted keys

const config = {
  rtlEnabled: false,
  defaultCurrency: 'USD',
  defaultUseCurrencyAccountingStyle: true,
  oDataFilterToLower: true,
  serverDecimalSeparator: '.',
  decimalSeparator: '.',
  thousandsSeparator: ',',
  forceIsoDateParsing: true,
  wrapActionsBeforeExecute: true,
  useLegacyStoreResult: false,
  useJQuery: undefined,
  editorStylingMode: undefined,
  useLegacyVisibleIndex: false,
  versionAssertions: [],
  copyStylesToShadowDom: true,
  dateFormat: undefined,
  timeFormat: undefined,
  dateTimeFormat: undefined,
  numberFormat: undefined,
  dateTimeFormatPresets: undefined,
  licenseKey: '/* ___$$$$$___devextreme___lcp___placeholder____$$$$$ */',

  floatingActionButtonConfig: {
    icon: 'add',
    closeIcon: 'close',
    label: '',
    position: {
      at: 'right bottom',
      my: 'right bottom',
      offset: {
        x: -16,
        y: -16,
      },
    },
    maxSpeedDialActionCount: 5,
    shading: false,
    direction: 'auto',
  },

  optionsParser: (optionsString: string): unknown => {
    const normalizedString = !optionsString.trim().startsWith('{')
      ? `{${optionsString}}`
      : optionsString;

    try {
      return JSON.parse(normalizedString);
    } catch (ex) {
      try {
        return JSON.parse(normalizeToJSONString(normalizedString));
      } catch (exNormalize) {
        throw errors.Error('E3018', ex, normalizedString);
      }
    }
  },
};

const deprecatedFields = ['decimalSeparator', 'thousandsSeparator'];

const configMethod = (...args: ConfigOptions[]): typeof config | undefined => {
  if (!args.length) {
    return config;
  }

  const newConfig = args[0];

  deprecatedFields.forEach((deprecatedField) => {
    if (newConfig[deprecatedField]) {
      const message = `Now, the ${deprecatedField} is selected based on the specified locale.`;
      errors.log('W0003', 'config', deprecatedField, '19.2', message);
    }
  });

  extend(config, newConfig);

  return undefined;
};

// @ts-expect-error typescript cant see global
if (typeof DevExpress !== 'undefined' && DevExpress.config) {
// @ts-expect-error typescript cant see global
  configMethod(DevExpress.config);
}

export default configMethod;
