"use strict";

const gulp = require("gulp");
const through2 = require("through2");
const path = require("path");
const babel = require("@babel/core");
const {
    STATE_MANAGER_FOLDER_PATH,
    STATE_MANAGER_INDEX_MODULE_PATH,
} = require("./constants");
const ctx = require("../context");

const ERROR_PREFIX = "Error during replacing the state manager modules:";

const ESM_REEXPORT = `export * from './prod/index';`;

function isCjsFile(filePath) {
    const normalizedPath = filePath.split(path.sep).join("/");
    return normalizedPath.includes("/cjs/");
}

function transpileToCjs(esmSource, filePath) {
    const result = babel.transformSync(esmSource, {
        filename: filePath,
        plugins: [["@babel/plugin-transform-modules-commonjs"]],
    });
    return result.code;
}

function replaceStateManagerModulesForProduction() {
    return through2.obj(function (file, enc, callback) {
        if (file.path.includes(STATE_MANAGER_INDEX_MODULE_PATH)) {
            try {
                const content = isCjsFile(file.path)
                    ? transpileToCjs(ESM_REEXPORT, file.path)
                    : ESM_REEXPORT;
                file.contents = Buffer.from(content);
            } catch (error) {
                callback(new Error(`${ERROR_PREFIX} ${error.message}`));
                return;
            }
        }

        callback(null, file);
    });
}

const prepareStateManager = (dist) =>
    gulp.series.apply(gulp, [
        () =>
            gulp
                .src(`${dist}/**/${STATE_MANAGER_FOLDER_PATH}/**`)
                .pipe(replaceStateManagerModulesForProduction())
                .pipe(gulp.dest(dist)),
    ]);

gulp.task(
    "state-manager-replace-production-modules-transpiled-prod-esm",
    prepareStateManager(ctx.TRANSPILED_PROD_ESM_PATH)
);

gulp.task(
    "state-manager-replace-production-modules-transpiled-prod-renovation",
    prepareStateManager(ctx.TRANSPILED_PROD_RENOVATION_PATH)
);

module.exports = replaceStateManagerModulesForProduction;
