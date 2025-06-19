const { Transform } = require('stream');
const stylelint = require('stylelint');

module.exports = function lintFluent() {
    return new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
            stylelint.lint({
                code: chunk.contents.toString(),
                config: { rules: { "no-unknown-custom-properties": true } },
                formatter: "verbose"
            })
                .then(res => {
                    if (res.errored)
                        throw new Error(res.report);

                    callback(null, chunk);
                })
        }
    }
    );
}
