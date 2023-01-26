/* eslint-disable import/no-commonjs */
const PARENT_LOCALE_SEPARATOR = '-';

export default (parentLocales, locale) => {
    const parentLocale = parentLocales[locale];

    if(parentLocale) {
        return parentLocale !== 'root' && parentLocale;
    }

    return locale.substr(0, locale.lastIndexOf(PARENT_LOCALE_SEPARATOR));
};
