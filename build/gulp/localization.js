var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var template = require('gulp-template');
var fs = require('fs');

var headerPipes = require('./header-pipes.js');
var compressionPipes = require('./compression-pipes.js');
var context = require('./context.js');

var Cldr = require('cldrjs');
var locales = require('cldr-core/availableLocales.json').availableLocales.full;
var weekData = require('cldr-core/supplemental/weekData.json');
var likelySubtags = require('cldr-core/supplemental/likelySubtags.json');
var parentLocales = require('../../node_modules/cldr-core/supplemental/parentLocales.json').supplemental.parentLocales.parentLocale;

var getParentLocale = require('../../js/localization/parentLocale.js');

var firstDayOfWeekData = function() {
    var DAY_INDEXES = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    var DEFAULT_DAY_OF_WEEK_INDEX = 0;

    var result = {};

    Cldr.load(weekData, likelySubtags);

    var getFirstIndex = (locale) => {
        var firstDay = new Cldr(locale).supplemental.weekData.firstDay();
        return DAY_INDEXES[firstDay];
    };

    locales.forEach(function(locale) {
        var firstDayIndex = getFirstIndex(locale);

        var parentLocale = getParentLocale(parentLocales, locale);
        if(firstDayIndex !== DEFAULT_DAY_OF_WEEK_INDEX && (!parentLocale || firstDayIndex !== getFirstIndex(parentLocale))) {
            result[locale] = firstDayIndex;
        }
    });

    return result;
};

var accountingFormats = function() {
    var result = {};

    locales.forEach(function(locale) {
        var numbersData = require(path.join(`../../node_modules/cldr-numbers-full/main/${locale}/numbers.json`));
        result[locale] = numbersData.main[locale].numbers['currencyFormats-numberSystem-latn'].accounting;
    });

    return result;
};

var RESULT_PATH = path.join(context.RESULT_JS_PATH, 'localization');
var DICTIONARY_SOURCE_FOLDER = 'js/localization/messages';

var getLocales = function(directory) {
    return fs.readdirSync(directory).map(file => {
        return file.split('.')[0];
    });
};

var serializeObject = function(obj, shift) {
    var tab = '    ';
    var result = JSON.stringify(obj, null, tab);

    if(shift) {
        result = result.replace(/(\n)/g, '$1' + tab);
    }

    return result;
};

var getMessages = function(directory, locale) {
    var json = require(path.join('../../', directory, locale + '.json'));

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
            .pipe(rename(source.filename))
            .pipe(gulp.dest(source.destination));
    };
})));

gulp.task('localization', gulp.series('localization-messages', 'localization-generated-sources'));
