/* global __dirname */
const path = require('path');
const fs = require('fs');

const themes = require('./themes');
const getBundleName = require('./bundle-resolver');

const stylesDirectory = path.join(__dirname, '..', '..', 'scss');

const capitalize = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const executor = (str, regex, handler) => {
    let matches;
    while((matches = regex.exec(str)) !== null) {
        handler(matches);
    }
};

const parseComments = (comments) => {
    const metaItem = {};

    executor(comments, /\$(type|name|typeValues)\s(.+)/g, (matches) => {
        const key = capitalize(matches[1]);
        metaItem[key] = matches[2].trim();
    });

    return metaItem;
};

const getMetaItems = (scss) => {
    const metaItems = [];

    executor(scss, /\/\*\*[\n\r]([\s\S]*?)\*\/\s*[\n\r]*([-$a-z_0-9]+):/gim, (matches) => {
        const metaItem = {
            'Key': matches[2]
        };
        metaItems.push(Object.assign(metaItem, parseComments(matches[1])));
    });

    // TODO remove dups
    return metaItems;
};

module.exports = {
    getMetaItems,
    parseComments
};
