const PARENT_LOCALE_SEPARATOR = '-';

export default (parentLocales: Record<string, string>, locale: string): string | false => {
  const parentLocale = parentLocales[locale];

  if (parentLocale) {
    return parentLocale !== 'root' && parentLocale;
  }

  return locale.substr(0, locale.lastIndexOf(PARENT_LOCALE_SEPARATOR));
};
