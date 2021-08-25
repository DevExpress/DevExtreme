'use strict';

const gulp = require('gulp');
const stagedFiles = require('staged-git-files');
const MAX_LENGTH = 150;
const fileStatuses = {
    Added: true,
    Copied: true,
    Deleted: false,
    Modified: true,
    Renamed: true,
    'Type-Change': false,
    Unmerged: false,
    Unknown: false
};

gulp.task('pre-commit', (error) => new Promise((resolve, reject) => {
    stagedFiles(function (err, results) {
        const longFiles = results
            .filter(x => fileStatuses[x.status] && (x.filename.length > MAX_LENGTH))
            .map(x => ({ name: x.filename, length: x.filename.length }));
        if (longFiles.length) {
            longFiles.forEach(x => {
                x.name = `\x1b[32m${x.name.slice(0, MAX_LENGTH)}\x1b[31m${x.name.slice(MAX_LENGTH)}\x1b[0m`;
            });
            const stringified = JSON.stringify(longFiles, null, 2).replace(/\\u001b/g, '\x1b');
            const line = `\x1b[31mThe following file names exceed ${MAX_LENGTH} symbols length:\x1b[0m \r\n${stringified}`;
            error(line);
        }
        resolve(0);
    });
}));
