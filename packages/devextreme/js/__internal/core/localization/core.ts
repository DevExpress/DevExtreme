import parentLocales from '@ts/core/localization/cldr-data/parent_locales';
import getParentLocale from '@ts/core/localization/parentLocale';
import { injector as dependencyInjector } from '@ts/core/utils/dependency_injector';

const DEFAULT_LOCALE = 'en';

interface LocaleAccessor {
  (): string;
  (locale: string): void;
}

export default dependencyInjector({
  locale: ((): LocaleAccessor => {
    let currentLocale = DEFAULT_LOCALE;

    function localeAccessor(): string;
    function localeAccessor(locale: string): void;
    // eslint-disable-next-line consistent-return
    function localeAccessor(locale?: string): string | void {
      if (!locale) {
        return currentLocale;
      }

      currentLocale = locale;
    }

    return localeAccessor;
  })(),

  getValueByClosestLocale<TValue>(
    getter: (locale: string) => TValue | undefined,
  ): TValue | undefined {
    let locale: string = this.locale();
    let value = getter(locale);
    let isRootLocale = false;

    while (!value && !isRootLocale) {
      // @ts-expect-error
      locale = getParentLocale(parentLocales, locale);

      if (locale) {
        value = getter(locale);
      } else {
        isRootLocale = true;
      }
    }

    if (value === undefined && locale !== DEFAULT_LOCALE) {
      return getter(DEFAULT_LOCALE);
    }

    return value;
  },
});
