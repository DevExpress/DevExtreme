/* global __dirname */
const path = require("path");
const fs = require("fs");

const themes = require("./themes");
const getBundleName = require("./bundle-resolver");


const capitalize = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const parseComments = (comments) => {
    const commentRegex = /@(type|name|typeValues)\s(.+)/g;
    const metaItem = {};

    let matches;
    while((matches = commentRegex.exec(comments)) !== null) {
        const key = capitalize(matches[1]);
        metaItem[key] = matches[2].trim();
    }

    return metaItem;
};

const getMetaItems = (less) => {
    const commentBlockRegex = /\/\*\*[\n\r]([\s\S]*?)\*\/\s*[\n\r]*([-@a-z_0-9]+):/gim;
    const metaItems = [];

    let matches;
    while((matches = commentBlockRegex.exec(less)) !== null) {
        const metaItem = {
            "Key": matches[2]
        };
        metaItems.push(Object.assign(metaItem, parseComments(matches[1])));
    }

    return metaItems;
};

const generate = (version, lessCompiler) => {
    const promises = [];
    const metadata = {};
    const resultPath = path.join(__dirname, "..", "data", "metadata", "dx-theme-builder-metadata.js");

    themes.forEach((theme) => {
        const bundlePath = path.join(__dirname, "..", "..", "styles", getBundleName(theme.name, theme.colorScheme));
        const propertyName = [theme.name, theme.colorScheme.replace(/-/g, "_"), "metadata"].join("_");

        metadata[propertyName] = [];

        promises.push(lessCompiler.render(fs.readFileSync(bundlePath).toString(), {
            filename: bundlePath,
            plugins: [{
                install: (_, pluginManager) => {
                    pluginManager.addPreProcessor({
                        process: (less) => {
                            metadata[propertyName] = metadata[propertyName].concat(getMetaItems(less));
                            return less;
                        }
                    });
                }
            }]
        }));
    });

    return Promise.all(promises).then(() => {
        metadata["_metadata_version"] = version;
        const meta = "module.exports = " + JSON.stringify(metadata) + ";";
        fs.mkdirSync(path.dirname(resultPath), { recursive: true });
        fs.writeFileSync(resultPath, meta);
    });
};

module.exports = {
    generate,
    getMetaItems,
    parseComments
};
