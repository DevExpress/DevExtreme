'use strict';

const replaceAsync = require('gulp-replace-async');
const path = require('path');
const lessCompiler = require('less');

// TODO rewrite data-uri processing through less compiler after migration to the sass
module.exports = () => replaceAsync(/data-uri\([^)]+\)/g, (match, callback) => {
    const validLessString = `selector{property:${match[0]};}`;
    lessCompiler.render(validLessString, { paths: [ path.join(process.cwd(), 'images') ] })
        .then(
            (output) => callback(null, /url\(.*\)/.exec(output.css)[0]),
            (error) => console.log(error)
        );
});
