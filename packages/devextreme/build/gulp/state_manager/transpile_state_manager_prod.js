'use strict';

const through2 = require('through2');
const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const transpileConfig = require('../transpile-config');
const {
    STATE_MANAGER_FOLDER_PATH,
    STATE_MANAGER_SETUP_STATE_MANAGER_MODULE_PATH,
    STATE_MANAGER_PRODUCTION_MODULE_PATH
} = require('./constants');

const ERROR_PREFIX = 'Error during transpiling the state manager for prod mode:';

function transpileStateManagerProd(isEsm) {
    return through2.obj(function(file, enc, callback) {
        if (file.path.includes(STATE_MANAGER_SETUP_STATE_MANAGER_MODULE_PATH)) {
            try {
                const absolutePathToStateManagerFolder = path.dirname(file.path);
                const replacerFileName = path.basename(STATE_MANAGER_PRODUCTION_MODULE_PATH);

                const replacerFilePath = path.join(
                    absolutePathToStateManagerFolder,
                    replacerFileName,
                );

                const shouldReplaceWithProductionCode = fs.existsSync(replacerFilePath);

                if (shouldReplaceWithProductionCode) {
                    let productionContent = fs.readFileSync(replacerFilePath, 'utf8');

                    const isCJS = !isEsm;
                    if (isCJS) {
                        const babelConfig = {
                            plugins: [
                                ['@babel/plugin-transform-modules-commonjs']
                            ],
                            ignore: ['**/*.json'],
                            filename: replacerFilePath
                        };

                        try {
                            const transformResult = babel.transformSync(productionContent, babelConfig);

                            productionContent = transformResult.code;
                        } catch (babelError) {
                            console.error(
                                ERROR_PREFIX,
                                `transforming ${replacerFileName} to CJS is failed:`,
                                babelError
                            );
                        }
                    }

                    file.contents = Buffer.from(productionContent);
                } else {
                    console.error(
                        ERROR_PREFIX,
                        `${productionFileName} file not found at ${productionFilePath}`);
                }
            } catch (error) {
                console.error(ERROR_PREFIX, error);
            }
        }

        callback(null, file);
    });
}

module.exports = transpileStateManagerProd;
