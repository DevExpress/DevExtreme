var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var template = require('gulp-template');
var lint = require('gulp-eslint');
var fs = require('fs');

var headerPipes = require('./header-pipes.js');
var compressionPipes = require('./compression-pipes.js');
var context = require('./context.js');

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


gulp.task('localization', ['localization-messages', 'localization-generated-sources']);

gulp.task('localization-messages', function() {
    return getLocales(DICTIONARY_SOURCE_FOLDER).map(locale => {
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
    });
});

gulp.task('localization-generated-sources', function() {
    return [
        {
            data: require('../../js/localization/messages/en.json'),
            filename: 'default_messages.js',
            destination: 'js/localization'
        },
        {
            data: require('../../node_modules/cldr-core/supplemental/parentLocales.json').supplemental.parentLocales.parentLocale,
            filename: 'parentLocales.js',
            destination: 'js/localization/cldr-data'
        }
    ].map(source => {
        gulp
            .src('build/gulp/cldr-data-template.jst')
            .pipe(template({
                json: serializeObject(source.data)
            }))
            .pipe(lint({ fix: true }))
            .pipe(lint.format())
            .pipe(rename(source.filename))
            .pipe(gulp.dest(source.destination));
    });
});
