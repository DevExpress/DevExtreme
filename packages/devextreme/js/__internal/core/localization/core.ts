import parentLocales from '@ts/core/localization/cldr-data/parent_locales';
import getParentLocale from '@ts/core/localization/parentLocale';
import { injector as dependencyInjector } from '@ts/core/utils/m_dependency_injector';

const DEFAULT_LOCALE = 'en';

export default dependencyInjector({
  locale: (() => {
    let currentLocale = DEFAULT_LOCALE;

    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type,consistent-return
    return (locale?: string): string | void => {
      if (!locale) {
        return currentLocale;
      }

      currentLocale = locale;
    };
  })(),

  getValueByClosestLocale(
    getter: (locale: string) => string | number | undefined,
  ): string | number | undefined {
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
