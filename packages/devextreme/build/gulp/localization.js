'use strict';

const gulp = require('gulp');
const path = require('path');
const shell = require('gulp-shell');
const through = require('through2');
const fs = require('fs');

const DEFAULT_LOCALE = 'en';
const DICTIONARY_SOURCE_FOLDER = 'js/localization/messages';

gulp.task('localization', shell.task('pnpm nx build:localization devextreme'));

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
