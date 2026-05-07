import coreLocalization from '@ts/core/localization/core';
import { defaultMessages } from '@ts/core/localization/default_messages';
import { injector as dependencyInjector } from '@ts/core/utils/m_dependency_injector';
import { extend } from '@ts/core/utils/m_extend';
import { humanize } from '@ts/core/utils/m_inflector';
import { format as stringFormat } from '@ts/core/utils/m_string';

export type MessageFormatter = () => string;
export type MessageDictionary = Record<string, Record<string, string>>;

const baseDictionary: MessageDictionary = extend(true, {}, defaultMessages);

const getDataByLocale = (
  localeData: MessageDictionary,
  locale: string,
): Record<string, string> => localeData[locale]
        || (locale?.toLowerCase && Object.entries(localeData).find(
          ([key]) => key.toLowerCase() === locale.toLowerCase(),
        )?.[1])
        || {};

const newMessages = {};

const messageLocalization = dependencyInjector({
  engine(): string {
    return 'base';
  },

  _dictionary: baseDictionary,

  load(messages: MessageDictionary): void {
    extend(true, this._dictionary, messages);
  },

  _localizablePrefix: '@',

  setup(localizablePrefix: string): void {
    this._localizablePrefix = localizablePrefix;
  },

  localizeString(text: string): string {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const regex = new RegExp(`(^|[^a-zA-Z_0-9${that._localizablePrefix}-]+)(${that._localizablePrefix}{1,2})([a-zA-Z_0-9-]+)`, 'g');
    const escapeString = that._localizablePrefix + that._localizablePrefix;

    return text.replace(regex, (_, prefix: string, escape: string, localizationKey: string) => {
      const defaultResult = that._localizablePrefix + localizationKey;
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let result: string | undefined;

      if (escape !== escapeString) {
        result = that.format(localizationKey);
      }

      if (!result) {
        newMessages[localizationKey] = humanize(localizationKey);
      }

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return prefix + (result || defaultResult);
    });
  },

  getMessagesByLocales(): MessageDictionary {
    return this._dictionary as MessageDictionary;
  },

  getDictionary(onlyNew: boolean): Record<string, string> {
    if (onlyNew) {
      return newMessages;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend({}, newMessages, this.getMessagesByLocales()[coreLocalization.locale()]);
  },

  getFormatter(key: string): MessageFormatter {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getFormatterBase(key) || this._getFormatterBase(key, 'en');
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getFormatterBase(key: string, _locale: string): MessageFormatter | undefined {
    const message: string | undefined = coreLocalization.getValueByClosestLocale(
      (locale: string): string | undefined => getDataByLocale(this._dictionary, locale)[key],
    );

    if (message) {
      // eslint-disable-next-line func-names
      return function (): string {
        // eslint-disable-next-line prefer-rest-params
        const args = arguments.length === 1 && Array.isArray(arguments[0])
          // eslint-disable-next-line prefer-rest-params
          ? arguments[0].slice(0)
          // eslint-disable-next-line prefer-rest-params
          : Array.prototype.slice.call(arguments, 0);
        args.unshift(message);

        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return stringFormat.apply(this, args);
      };
    }

    return undefined;
  },

  format(key: string): string {
    const formatter: MessageFormatter = this.getFormatter(key);
    // eslint-disable-next-line prefer-rest-params
    const values = Array.prototype.slice.call(arguments, 1);

    // @ts-expect-error
    return formatter?.apply(this, values) || '';
  },
});

export default messageLocalization;
