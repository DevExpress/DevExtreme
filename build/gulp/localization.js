const gulp = require('gulp');
const path = require('path');
const rename = require('gulp-rename');
const template = require('gulp-template');
const lint = require('gulp-eslint');
const fs = require('fs');

const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');
const context = require('./context.js');

const Cldr = require('cldrjs');
const locales = require('cldr-core/availableLocales.json').availableLocales.full;
const weekData = require('cldr-core/supplemental/weekData.json');
const likelySubtags = require('cldr-core/supplemental/likelySubtags.json');
const parentLocales = require('../../node_modules/cldr-core/supplemental/parentLocales.json').supplemental.parentLocales.parentLocale;

const getParentLocale = require('../../js/localization/parentLocale.js');

const firstDayOfWeekData = function() {
    const DAY_INDEXES = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    const DEFAULT_DAY_OF_WEEK_INDEX = 0;

    const result = {};

    Cldr.load(weekData, likelySubtags);

    const getFirstIndex = (locale) => {
        const firstDay = new Cldr(locale).supplemental.weekData.firstDay();
        return DAY_INDEXES[firstDay];
    };

    locales.forEach(function(locale) {
        const firstDayIndex = getFirstIndex(locale);

        const parentLocale = getParentLocale(parentLocales, locale);
        if(firstDayIndex !== DEFAULT_DAY_OF_WEEK_INDEX && (!parentLocale || firstDayIndex !== getFirstIndex(parentLocale))) {
            result[locale] = firstDayIndex;
        }
    });

    return result;
};

const accountingFormats = function() {
    const result = {};

    locales.forEach(function(locale) {
        const numbersData = require(path.join(`../../node_modules/cldr-numbers-full/main/${locale}/numbers.json`));
        result[locale] = numbersData.main[locale].numbers['currencyFormats-numberSystem-latn'].accounting;
    });

    return result;
};

const RESULT_PATH = path.join(context.RESULT_JS_PATH, 'localization');
const DICTIONARY_SOURCE_FOLDER = 'js/localization/messages';

const getLocales = function(directory) {
    return fs.readdirSync(directory).map(file => {
        return file.split('.')[0];
    });
};

const serializeObject = function(obj, shift) {
    const tab = '    ';
    let result = JSON.stringify(obj, null, tab);

    if(shift) {
        result = result.replace(/(\n)/g, '$1' + tab);
    }

    return result;
};

const getMessages = function(directory, locale) {
    const json = require(path.join('../../', directory, locale + '.json'));

    return serializeObject(json, true);
};

gulp.task('localization-messages', gulp.parallel(getLocales(DICTIONARY_SOURCE_FOLDER).map(locale => {
    return function() {
        return gulp
            .src('build/gulp/localization-template.jst')
            .pipe(template({
                json: getMessages(DICTIONARY_SOURCE_FOLDER, locale)
            }))
            .pipe(rename(['dx', 'messages', locale, 'js'].join('.')))
            .pipe(compressionPipes.beautify())
            .pipe(headerPipes.useStrict())
            .pipe(headerPipes.bangLicense())
            .pipe(gulp.dest(RESULT_PATH));
    };
})));

gulp.task('localization-generated-sources', gulp.parallel([
    {
        data: require('../../js/localization/messages/en.json'),
        filename: 'default_messages.js',
        destination: 'js/localization'
    },
    {
        data: parentLocales,
        filename: 'parent_locales.js',
        destination: 'js/localization/cldr-data'
    },
    {
        data: firstDayOfWeekData(),
        filename: 'first_day_of_week_data.js',
        destination: 'js/localization/cldr-data'
    },
    {
        data: accountingFormats(),
        filename: 'accounting_formats.js',
        destination: 'js/localization/cldr-data'

    }
].map((source) => {
    return function() {
        return gulp
            .src('build/gulp/generated_js.jst')
            .pipe(template({
                json: serializeObject(source.data)
            }))
            .pipe(lint({ fix: true }))
            .pipe(lint.format())
            .pipe(rename(source.filename))
            .pipe(gulp.dest(source.destination));
    };
})));

gulp.task('localization', gulp.series('localization-messages', 'localization-generated-sources'));
