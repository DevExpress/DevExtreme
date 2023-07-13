'use strict';
const gulp = require('gulp');
const through = require('through2');
const remoteSrc = require('gulp-remote-src');
const rename = require('gulp-rename');
const lint = require('gulp-eslint-new');

gulp.task('create-timezones-data', () => {
    const momentTimezonesRawUrl = 'https://raw.githubusercontent.com/moment/moment-timezone/develop/data/unpacked/';

    return remoteSrc(['latest.json'], {
        base: momentTimezonesRawUrl
    }).pipe(
        through.obj((file, enc, callBack) => {
            const rawJSON = file.contents.toString();
            const parsed = JSON.parse(rawJSON);
            const transformed = transformTimezoneData(parsed);
            const stringify = JSON.stringify(transformed, null, 2);
            file.contents = Buffer.from('export default ' + stringify);
            callBack(null, file);
        }))
        .pipe(rename('timezones_data.js'))
        .pipe(lint({fix: true}))
        .pipe(lint.format())
        .pipe(gulp.dest('js/ui/scheduler/timezones'));
});

function prepareUntils(untils) {
    const result = [];

    untils.forEach((until, index) => {
        if(until === null) {
            result.push('Infinity');
        } else {
            if(until != null && index !== 0) {
                const currentOffset = until - untils[index - 1];
                result.push((currentOffset / 1000).toString(36));
            }

            if(index === 0) {
                result.push((until / 1000).toString(36));
            }
        }
    });
    return result.join('|');
}

function prepareOffsets(offsets) {
    return offsets.filter((v, i, a) => a.indexOf(v) === i);
}

function prepareOffsetIndices(offsets, timezoneOffsets) {
    const offsetIndices = timezoneOffsets.map((offset) => offsets.indexOf(offset));
    return offsetIndices.join('');
}

function transformTimezoneData(input) {
    const result = [];

    Object.keys(input).forEach(key => {
        if(key === 'zones') {
            const items = input[key];
            items.forEach(timezone => {
                const timezoneOffsets = timezone.offsets;
                const offsets = prepareOffsets(timezoneOffsets);
                const untils = prepareUntils(timezone.untils);
                const offsetIndices = prepareOffsetIndices(offsets, timezoneOffsets);

                result.push({
                    id: timezone.name,
                    untils: untils,
                    offsets: offsets.join('|'),
                    offsetIndices: offsetIndices
                });
            });
        }
    });

    return {
        zones: result
    };
}
