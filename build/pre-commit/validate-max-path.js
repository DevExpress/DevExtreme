'use strict';

const MAX_LENGTH = 150;
const chalks = require('./chalks');

module.exports = (results) => {
    const longFiles = results
        .filter((x) => x.filename.length > MAX_LENGTH)
        .map((x) => ({ name: x.filename, length: x.filename.length }));
    if (longFiles.length) {
        longFiles.forEach((x) => {
            x.name = `${chalks.green}${x.name.slice(0, MAX_LENGTH)}${chalks.red}${x.name.slice(MAX_LENGTH)}${chalks.reset}`;
        });
        const stringified = JSON.stringify(longFiles, null, 2).replace(/\\u001b/g, '\x1b');
        const line = `${chalks.red}The following file names exceed ${MAX_LENGTH} symbols length:${chalks.reset} \r\n${stringified}`;
        console.error(line);
        return 1;
    }
    return 0;
}
