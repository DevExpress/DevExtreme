'use strict';
const gulp = require('gulp');
const through = require('through2');
const remoteSrc = require('gulp-remote-src');
let tzData = [];
const momentTimezonesRawUrl = 'https://raw.githubusercontent.com/moment/moment-timezone/develop/data/unpacked/';
const tzDataUrl = '../../artifacts/transpiled/ui/scheduler/timezones/timezones_data';

try {
    tzData = require(tzDataUrl).zones; // eslint-disable-line node/no-missing-require
} catch(e) {
    if(e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
        console.log('Can not load ui.scheduler.timezones_data');
    } else {
        throw e;
    }
}

gulp.task('test-timezones-data', () => {
    return remoteSrc(['latest.json'], {
        base: momentTimezonesRawUrl
    }).pipe(
        through.obj((file, enc, callBack) => {
            const rawJSON = file.contents.toString();
            const parsed = JSON.parse(rawJSON);
            checkTimeZonesParsing(parsed);
            callBack();
        }));
});

function checkTimeZonesParsing(input) {
    Object.keys(input).forEach(key => {
        if(key === 'zones') {
            const items = input[key];
            items.forEach((timeZone, index) => {
                checkTimeZoneParsing(tzData[index], timeZone);
            });
        }
    });
}

function checkTimeZoneParsing(parsedTimeZone, rawTimeZone) {
    if(rawTimeZone.name !== parsedTimeZone.id ||
        !isUntilsCorrect(rawTimeZone.untils, parsedTimeZone.untils) ||
        !isOffsetsCorrect(rawTimeZone.offsets, parsedTimeZone.offsets, parsedTimeZone.offsetIndices)) {
        console.log(`Error while parsing timezone ${rawTimeZone.name}`);
    }
}


function isUntilsCorrect(rawUntils, parsedUntils) {
    const revertedUntils = revertUntils(parsedUntils);
    return isArraysMatch(revertedUntils, rawUntils);
}

function isOffsetsCorrect(rawOffsets, parsedOffsets, parsedOffsetIndices) {
    const revertedOffsets = revertOffsets(parsedOffsets, parsedOffsetIndices);
    return isArraysMatch(revertedOffsets, rawOffsets);
}

function revertUntils(untilsString) {
    const untils = untilsString.split('|');
    const result = [];
    let prevUntil = 0;

    untils.forEach((until, index) => {
        if(until === 'Infinity') {
            result.push(null);
        } else {
            if(index === 0) {
                prevUntil = parseInt(until, 36) * 1000;
                result.push(prevUntil);
            }
            if(until !== 'Infinity' && index !== 0) {
                prevUntil = parseInt(until, 36) * 1000 + prevUntil;
                result.push(prevUntil);
            }
        }
    });
    return result;
}

function revertOffsets(offsets, offsetIndices) {
    const result = [];
    offsets = offsets.split('|');
    offsetIndices = offsetIndices.split('');
    offsetIndices.forEach((offsetIndex) => {
        result.push(parseFloat(offsets[offsetIndex]));
    });
    return result;
}

function isArraysMatch(first, second) {
    let result = first.length === second.length;

    result && first.forEach((el, index) => {
        if(el !== second[index]) {
            result = false;
        }
    });

    return result;
}
