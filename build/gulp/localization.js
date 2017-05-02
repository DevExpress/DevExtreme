// jshint node:true

"use strict";

var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var header = require('gulp-header');
var footer = require('gulp-footer');
var template = require('gulp-template');
var fs = require('fs');

var headerPipes = require('./header-pipes.js');
var compressionPipes = require('./compression-pipes.js');

function getLocales(directory) {
    var locales = [];
    var files = fs.readdirSync(directory);

    files.forEach(file => {
        var locale = file.split('.')[0];
        locales.push(locale);
    });

    return locales;
}

function getMessages(directory, locale) {
    var json = require(path.join('../../', directory, locale + '.json'));

    return JSON.stringify(json, null, '    ');
}

gulp.task('localization', function() {
    var streams = [],
        directory = 'js/localization/messages';

    var locales = getLocales(directory);

    ['de', 'ja', 'ru'].forEach(locale => {
        var messages = getMessages(directory, locale);

        ['mobile', 'web', 'all'].forEach(distribution => {
            streams.push(
                gulp
                    .src('build/gulp/localization-template.jst')
                    .pipe(template({
                        json: messages,
                        isDeprecated: true,
                        distribution: distribution,
                        locale: locale
                    }))
                    .pipe(rename(['dx', distribution, locale, 'js'].join('.')))
                    .pipe(compressionPipes.beautify())
                    .pipe(headerPipes.useStrict())
                    .pipe(headerPipes.bangLicense())
                    .pipe(gulp.dest('artifacts/js/localization'))
            );
        });
    });

    locales.forEach(locale => {
        var messages = getMessages(directory, locale);

        streams.push(
            gulp
                .src('build/gulp/localization-template.jst')
                .pipe(template({
                    json: messages,
                    isDeprecated: false
                }))
                .pipe(rename(['dx', 'messages', locale, 'js'].join('.')))
                .pipe(compressionPipes.beautify())
                .pipe(headerPipes.useStrict())
                .pipe(headerPipes.bangLicense())
                .pipe(gulp.dest('artifacts/js/localization'))
        );
    });

    streams.push(
        gulp
            .src('js/localization/messages/en.json')
            .pipe(rename('default_messages.js'))
            .pipe(header('module.exports = '))
            .pipe(footer(';'))
            .pipe(compressionPipes.beautify())
            .pipe(headerPipes.useStrict())
            .pipe(header('// !!! AUTO-GENERATED FILE, DO NOT EDIT\n'))
            .pipe(gulp.dest('js/localization'))
    );

    return streams;
});
