const Vinyl = require('vinyl')
const { Readable } = require('stream');
const through = require('through2');

module.exports = function (name, contents) {
    return Readable.from('unused').pipe(through.obj((file, enc, cb) => {
        const result = new Vinyl({
            cwd: '/',
            base: 'unknown',
            path: `unknown/${name}`,
            contents: Buffer.from(contents)
        })
        cb(null, result);
    }));
}
