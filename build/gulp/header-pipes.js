var fs = require('fs');
var lazyPipe = require('lazypipe');
var header = require('gulp-header');
var path = require('path');

var context = require('./context.js');

var licenseTemplate = fs.readFileSync(path.join(__dirname, './license-header.txt'), 'utf8');

var useStrict = lazyPipe().pipe(function() {
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
