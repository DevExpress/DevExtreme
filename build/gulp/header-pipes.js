const fs = require('fs');
const lazyPipe = require('lazypipe');
const header = require('gulp-header');
const path = require('path');

const context = require('./context.js');

const licenseTemplate = fs.readFileSync(path.join(__dirname, './license-header.txt'), 'utf8');

const useStrict = lazyPipe().pipe(function() {
    return header('"use strict";\n\n');
});

function makeLicensePipe(commentType) {
    return lazyPipe().pipe(function() {
        return header(licenseTemplate, {
            commentType: commentType,
            version: context.version.product,
            eula: context.EULA_URL
        });
    });
}

module.exports = {
    useStrict: useStrict,
    bangLicense: makeLicensePipe('!'),
    starLicense: makeLicensePipe('*')
};
