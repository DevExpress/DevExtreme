'use strict';
const gulp = require('gulp');
const through = require('through2');

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
    const uniqueOffsets = offsets.filter((v, i, a) => a.indexOf(v) === i);
    return uniqueOffsets;
    // return offsets.join('|');
}

function prepareOffsetIndices(offsets, timezoneOffsets) {
    const offsetIndices = timezoneOffsets.map((offset) => offsets.indexOf(offset));
    return offsetIndices.join('');
}

function transformJson(input) {
    const result1 = { zones: {} };
    const result = [];

    Object.keys(input).forEach(topLevelKey => {
        const items = input[topLevelKey];
        items.forEach(timezone => {
            const timezoneOffsets = timezone.offsets;
            const offsets = prepareOffsets(timezoneOffsets);

            result.push({
                id: timezone.name,
                untils: prepareUntils(timezone.untils),
                offsets: offsets.join('|'),
                offsetIndices: prepareOffsetIndices(offsets, timezoneOffsets)
            });
        });
    });
    result1.zones = result;
    return result1;
}

gulp.task('create-timezones-data', function() {
    return gulp.src('timezonesRawData.js')
        .pipe(
            through.obj((file, enc, cb) => {
                const rawJSON = file.contents.toString();
                const parsed = JSON.parse(rawJSON);
                const transformed = transformJson(parsed);
                const stringify = JSON.stringify(transformed, null, 2);
                file.contents = Buffer.from(stringify);
                cb(null, file);
            })
        )
        .pipe(gulp.dest('js/ui/scheduler/timezones'));
});
