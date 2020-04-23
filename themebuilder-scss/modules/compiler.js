const sass = require('sass');
const Fiber = require('fibers');

class Compiler {
    constructor() {
        this.changedVariables = [];
        this.importerCache = {};
        this.meta = require('../data/metadata/dx-theme-builder-metadata')['metadata'];
    }

    compile(bundlePath, items, customOptions) {
        this.changedVariables = [];
        this.userItems = items || [];

        let compilerOptions = {
            file: bundlePath,
            fiber: Fiber,
            importer: this.setter.bind(this),
            functions: {
                'collector($map)': this.collector.bind(this)
            }
        };

        if(customOptions) {
            compilerOptions = { ...compilerOptions, ...customOptions };
        }

        return new Promise((resolve, reject) => {
            sass.render(compilerOptions, (error, result) => {
                this.importerCache = {};

                if(error) {
                    reject(error);
                } else {
                    resolve({
                        result,
                        changedVariables: this.changedVariables
                    });
                }
            });
        });
    }

    getMatchingUserItemsAsString(url) {
        const metaKeysForUrl = this.meta
            .filter(item => item.Path === url)
            .map(item => item.Key);

        return this.userItems
            .filter(item => metaKeysForUrl.indexOf(item.key) >= 0)
            .map(item => `${item.key}: ${item.value};`)
            .join('');
    }

    setter(url, _, done) {
        let content = this.importerCache[url];

        if(!content) {
            content = this.getMatchingUserItemsAsString(url);
            this.importerCache[url] = content;
        }

        done({ contents: content });
    }

    collector(map) {
        const path = map.getValue(0).getValue();

        for(let i = 1; i < map.getLength(); i++) {
            const value = map.getValue(i);
            let variableValue;

            if(value instanceof sass.types.Color) {
                variableValue = `rgba(${value.getR()},${value.getG()},${value.getB()},${value.getA()})`;
            } else if(value instanceof sass.types.String) {
                variableValue = value.getValue();
            } else if(value instanceof sass.types.Number) {
                variableValue = `${value.getValue()}${value.getUnit()}`;
            } else if(value instanceof sass.types.List) {
                const listValues = [];
                for(let i = 0; i < value.getLength(); i++) {
                    listValues.push(value.getValue(i));
                }

                variableValue = listValues.join(value.getSeparator() ? ',' : ' ');
            }

            this.changedVariables.push({
                Key: map.getKey(i).getValue(),
                Value: variableValue,
                Path: path
            });
        }
        return sass.types.Null.NULL;
    }
}

module.exports = Compiler;
