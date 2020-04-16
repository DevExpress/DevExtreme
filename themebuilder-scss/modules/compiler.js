/* global __dirname, console */
/* eslint no-console: off */
// TODO it seems this compiler is node-only (it contains many things that can be run on node only)
const path = require('path');
const sass = require('sass');
const Fiber = require('fibers');
const resolveBundle = require('./bundle-resolver');
const basePath = path.join(__dirname, '..', 'data', 'scss');

class Compiler {
    constructor() {
        this.changedVariables = [];
    }

    compile(config) {
        this.changedVariables = [];
        const bundle = resolveBundle(config.themeName, config.colorScheme);

        sass.render({
            file: path.join(basePath, bundle),
            fiber: Fiber,
            importer: (url, prev, done) => {
                // compare url and add constants if need (config.items)
                // done({ contents: '$accordion-color: red;' });
                done({ contents: '' });
            },
            functions: {
                'collector($map)': this.collector.bind(this)
            }
        }, (error, result) => {
            if(error) {
                console.log(error.formatted);
            } else {
                console.log(result.stats.duration);
            }
        });
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
