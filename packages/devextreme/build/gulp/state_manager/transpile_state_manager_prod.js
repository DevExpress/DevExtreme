'use strict';

const through2 = require('through2');
const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const transpileConfig = require('../transpile-config');
const { STATE_MANAGER_FOLDER_PATH } = require('./constants');

const ERROR_PREFIX = 'Error during transpiling the state manager for prod mode:';
const PRODUCTION_FILE_NAME = 'production.js';

function transpileStateManagerProd(isEsm) {
    return through2.obj(function(file, enc, callback) {
        if (file.path.includes(STATE_MANAGER_FOLDER_PATH)) {
            try {
                const productionFilePath = path.resolve(
                    path.dirname(file.path),
                    PRODUCTION_FILE_NAME
                );

                if (fs.existsSync(productionFilePath)) {
                    let productionContent = fs.readFileSync(productionFilePath, 'utf8');

                    if (!isEsm) {
                        const babelConfig = {
                            ...transpileConfig.tsCjs,
                            filename: productionFilePath
                        };

                        try {
                            const transformResult = babel.transformSync(productionContent, babelConfig);

                            productionContent = transformResult.code;
                        } catch (babelError) {
                            console.error(
                                ERROR_PREFIX,
                                'transforming ${PRODUCTION_FILE_NAME} to CJS is failed:',
                                babelError
                            );
                        }
                    }

                    file.contents = Buffer.from(productionContent);
                } else {
                    console.error(
                        ERROR_PREFIX,
                        `${PRODUCTION_FILE_NAME} file not found at ${productionFilePath}`);
                }
            } catch (error) {
                console.error(ERROR_PREFIX, error);
            }
        }

        callback(null, file);
    });
}

module.exports = transpileStateManagerProd;
