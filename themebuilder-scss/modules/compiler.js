/* global __dirname, console */
/* eslint no-console: off */
const path = require('path');
const Fiber = require('fibers');
const resolveBundle = require('./bundle-resolver');
const basePath = path.join(__dirname, '..', 'data', 'scss');

class Compiler {
    constructor() {}

    compile(config) {
        const sass = config.sassCompiler;
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
                'collector($map)': (map) => {
                    for(let i = 0; i < map.getLength(); i++) {
                        const value = map.getValue(i);
                        let variableValue;

                        if(value instanceof sass.types.Color) {
                            variableValue = `rgba(${value.getR()},${value.getG()},${value.getB()},${value.getA()})`;
                        } else if(value instanceof sass.types.String) {
                            variableValue = value.getValue();
                        } else if(value instanceof sass.types.Number) {
                            variableValue = `${value.getValue()}${value.getUnit()}`;
                        }
                        console.log(
                            'var:',
                            map.getKey(i).getValue(),
                            'value:',
                            variableValue);
                    }
                    return sass.types.Null.NULL;
                }
            }
        }, (error, result) => {
            if(error) {
                console.log(error.formatted);
            } else {
                console.log(result.stats.duration);
            }
        });
    }
}

module.exports = Compiler;
