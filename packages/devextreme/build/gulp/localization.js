'use strict';

const gulp = require('gulp');
const path = require('path');
const rename = require('gulp-rename');
const del = require('del');
const template = require('gulp-template');
const lint = require('gulp-eslint-new');
const through = require('through2');
const fs = require('fs');

const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');
const context = require('./context.js');

const Cldr = require('cldrjs');
const locales = require('cldr-core/availableLocales.json').availableLocales.full;
const weekData = require('cldr-core/supplemental/weekData.json');
const likelySubtags = require('cldr-core/supplemental/likelySubtags.json');
const parentLocales = require('cldr-core/supplemental/parentLocales.json').supplemental.parentLocales.parentLocale;

const globalizeEnCldr = require('devextreme-cldr-data/en.json');
const globalizeSupplementalCldr = require('devextreme-cldr-data/supplemental.json');

const PARENT_LOCALE_SEPARATOR = '-';
const DEFAULT_LOCALE = 'en';

const getParentLocale = (parentLocales, locale) => {
    const parentLocale = parentLocales[locale];

    if(parentLocale) {
        return parentLocale !== 'root' && parentLocale;
    }

    return locale.substr(0, locale.lastIndexOf(PARENT_LOCALE_SEPARATOR));
};

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
        const dataFilePath = `../../node_modules/cldr-numbers-full/main/${locale}/numbers.json`;

        if(fs.existsSync(path.join(__dirname, dataFilePath))) {
            const numbersData = require(dataFilePath);
            result[locale] = numbersData.main[locale].numbers['currencyFormats-numberSystem-latn'].accounting;
        }
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

gulp.task('clean-cldr-data', function() {
    return del('js/common/core/localization/cldr-data/**', { force: true });
});

gulp.task('generate-community-locales', () => {
    const defaultFile = fs.readFileSync(path.join(DICTIONARY_SOURCE_FOLDER, DEFAULT_LOCALE + '.json')).toString();
    const defaultDictionaryKeys = Object.keys(JSON.parse(defaultFile)[DEFAULT_LOCALE]);

    return gulp
        .src([
            'js/localization/messages/*.json',
            '!js/localization/messages/en.json'
        ])
        .pipe(through.obj(function(file, encoding, callback) {
            const parsedFile = JSON.parse(file.contents.toString(encoding));

            const [locale] = Object.keys(parsedFile);
            const dictionary = parsedFile[locale];

            let newFile = defaultFile.replace(`"${DEFAULT_LOCALE}"`, `"${locale}"`);

            defaultDictionaryKeys.forEach((key) => {
                let replaceValue = null;
                // eslint-disable-next-line no-prototype-builtins
                if(dictionary.hasOwnProperty(key)) {
                    const val = dictionary[key];
                    if(!val.includes('TODO')) {
                        replaceValue = val.replace(/"/g, '\\"');
                    }
                }

                if(replaceValue != null) {
                    newFile = newFile.replace(new RegExp(`"${key}":.*"(,)?`), `"${key}": "${replaceValue}"$1`);
                }
            });

            file.contents = Buffer.from(newFile, encoding);
            callback(null, file);
        }))
        .pipe(gulp.dest(DICTIONARY_SOURCE_FOLDER));
});

gulp.task('localization-messages', gulp.parallel(getLocales(DICTIONARY_SOURCE_FOLDER).map(locale => Object.assign(
    function() {
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
    },
    { displayName: 'dx.messages.' + locale }
))));

gulp.task('localization-generated-sources', gulp.parallel([
    {
        data: require('../../js/localization/messages/en.json'),
        filename: 'default_messages.js',
        exportName: 'defaultMessages',
        destination: 'js/common/core/localization'
    },
    {
        data: parentLocales,
        filename: 'parent_locales.js',
        destination: 'js/common/core/localization/cldr-data'
    },
    {
        data: firstDayOfWeekData(),
        filename: 'first_day_of_week_data.js',
        destination: 'js/common/core/localization/cldr-data'
    },
    {
        data: accountingFormats(),
        filename: 'accounting_formats.js',
        destination: 'js/common/core/localization/cldr-data'

    },
    {
        data: globalizeEnCldr,
        exportName: 'enCldr',
        filename: 'en.js',
        destination: 'js/common/core/localization/cldr-data'
    },
    {
        data: globalizeSupplementalCldr,
        exportName: 'supplementalCldr',
        filename: 'supplemental.js',
        destination: 'js/common/core/localization/cldr-data'
    }
].map((source) => Object.assign(
    function() {
        return gulp
            .src('build/gulp/generated_js.jst')
            .pipe(template({
                exportName: source.exportName,
                json: serializeObject(source.data)
            }))
            .pipe(lint({ fix: true }))
            .pipe(lint.format())
            .pipe(rename(source.filename))
            .pipe(gulp.dest(source.destination));
    },
    { displayName: source.filename }
))));

gulp.task('localization',
    gulp.series(
        'clean-cldr-data',
        'localization-messages',
        'localization-generated-sources'
    )
);
