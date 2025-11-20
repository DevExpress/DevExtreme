import '@ts/core/localization/globalize/core';
import 'globalize/message';

import coreLocalization from '@ts/core/localization/core';
import type { MessageDictionary, MessageFormatter } from '@ts/core/localization/message';
import messageLocalization from '@ts/core/localization/message';
// eslint-disable-next-line import/no-extraneous-dependencies
import Globalize from 'globalize';

if (Globalize?.formatMessage) {
  const DEFAULT_LOCALE = 'en';

  const originalLoadMessages = Globalize.loadMessages;

  Globalize.loadMessages = (messages: MessageDictionary): void => {
    messageLocalization.load(messages);
  };

  const globalizeMessageLocalization = {
    engine(): string {
      return 'globalize';
    },

    ctor(): void {
      this.load(this._dictionary);
    },

    load(messages: MessageDictionary): void {
      this.callBase(messages);
      originalLoadMessages(messages);
    },

    getMessagesByLocales(): MessageDictionary {
      return Globalize.cldr.get('globalize-messages') as MessageDictionary;
    },

    getFormatter(key: string, locale?: string): MessageFormatter {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const currentLocale = locale || coreLocalization.locale();
      let formatter: MessageFormatter = this._getFormatterBase(key, locale);

      if (!formatter) {
        formatter = this._formatterByGlobalize(key, locale);
      }

      if (!formatter && currentLocale !== DEFAULT_LOCALE) {
        formatter = this.getFormatter(key, DEFAULT_LOCALE);
      }

      return formatter;
    },

    _formatterByGlobalize(key: string, locale?: string): MessageFormatter | undefined {
      const currentGlobalize = !locale || locale === coreLocalization.locale()
        ? Globalize
        : new Globalize(locale);
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let result: MessageFormatter | undefined;

      if (this._messageLoaded(key, locale)) {
        result = currentGlobalize.messageFormatter(key);
      }

      return result;
    },

    _messageLoaded(key: string, locale: string | undefined): boolean {
      const currentCldr = locale ? new Globalize(locale).cldr : Globalize.locale();
      const value = currentCldr.get(['globalize-messages/{bundle}', key]);

      return !!value;
    },

    _loadSingle(key: string, value: string, locale: string): void {
      const data = {};

      data[locale] = {};
      data[locale][key] = value;

      this.load(data);
    },
  };

  messageLocalization.inject(globalizeMessageLocalization);
}
