/* eslint-disable spellcheck/spell-checker */
/* globals Intl */
import localizationCoreUtils from './core';
import persianDate from 'persian-date';

const persianUtils = {
    isPersianLocale: function() {
        const locale = localizationCoreUtils.locale();
        const intlLocale = new Intl.Locale(locale);
        if(intlLocale.calendar) {
            return intlLocale.calendar === 'persian';
        }
        return intlLocale.baseName === 'fa-IR';
    },

    firstYearInDecade: function(date) {
        const pDate = new persianDate(date);
        const pYear = pDate.year() - pDate.year() % 10;
        return pYear;
    },

    sameDecade: function(date1, date2) {
        const date1PYear = new persianDate(date1).year();
        const date2PYear = new persianDate(date2).year();
        const startDate1 = date1PYear - date1PYear % 10;
        const startDate2 = date2PYear - date2PYear % 10;
        return date1 && date2 && startDate1 === startDate2;
    },

    sameCentury: function(date1, date2) {
        const date1PYear = new persianDate(date1).year();
        const date2PYear = new persianDate(date2).year();
        const startCenturyDate1 = date1PYear - date1PYear % 100;
        const startCenturyDate2 = date2PYear - date2PYear % 100;
        return date1 && date2 && startCenturyDate1 === startCenturyDate2;
    },

    firstDecadeInCentury: function(date) {
        const pYear = new persianDate(date).year();
        return date && pYear - pYear % 100;
    }
};

export default persianUtils;
