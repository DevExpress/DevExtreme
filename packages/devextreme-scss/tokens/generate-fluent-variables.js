const { Transform } = require('stream');

module.exports = function generateCssVariables() {
    return new Transform({
        objectMode: true,
        transform(chunk, _, callback) {
            const fileName = `${chunk.basename.replace(chunk.extname, '').replace('_', '')}`;
            const selector = `#${fileName}#`;

            let cssRes = `@use "variables/${fileName}";\n\n`;

            cssRes += `.dxbl-${selector} {\n`;

            chunk.contents.toString().replace(/\$(.+):\s*ds\.\$(.+);/g, (_, variableName) => {
                cssRes += `    --dxbl-${selector}-${variableName}: #{${fileName}.$${variableName}};\n`;
            });

            cssRes += '}\n';

            chunk.contents = Buffer.from(cssRes);

            callback(null, chunk);
        }
    });
}