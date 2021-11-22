'use strict';

const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');
const ctx = require('./context.js');
const { version } = require('../../package.json');
const replace = require('gulp-replace');
const through = require('through2');
const { parse, print } = require('recast');
const { visit, namedTypes, builders } = require('ast-types');
const path = require('path');
const tsparser = require("recast/parsers/typescript");
const jsparser = require("recast/parsers/babel")

function performRecastReplacements(rootFolderPath) {
    return through.obj((file, enc, callback) => {
        if (file.isNull())
            return callback(null, file);
        
        const fileExt = path.extname(file.path);
        const absoluteRootFolderPath = path.resolve(process.cwd(), rootFolderPath);

        const isJs = fileExt === '.js';
        const isTs = fileExt === '.ts';
        if (!isJs && !isTs)
            return callback(null, file);

        const ast = parse(file.contents.toString(), {
            parser: isJs ? jsparser : tsparser,
            sourceFileName: file.path
        });

        let needsPrint = false;
        const fileDir = path.dirname(file.path);
        const devextremeFolder = path.dirname(absoluteRootFolderPath);

        const processImport = (importFrom, performReplacement) => {
            if (importFrom.startsWith('.')) {
                //relative module path
                const absoluteModulePath = path.resolve(fileDir, importFrom);
                if (absoluteModulePath.startsWith(absoluteRootFolderPath)) {
                    return false;
                }
                const newPath = path.relative(devextremeFolder, absoluteModulePath).replace(/\\/g, '/');

                performReplacement(`devextreme/${newPath}`)

                needsPrint = true;
                return false;
            } else {
                //package module import
                return false;
            }
        }
        visit(ast, {
            visitImportDeclaration(nodePath) {
                return processImport(nodePath.node.source.value, (newImport) => {
                    const args = [
                        nodePath.node.specifiers,
                        builders.stringLiteral(newImport),
                        nodePath.node.importKind
                    ];
                    if (!args[2]) {
                        args.splice(2, 1);
                    }
                    nodePath.replace(builders.importDeclaration(...args));
                });
            },
            visitTSImportType(nodePath) {
                return processImport(nodePath.node.argument.value, (newImport) => {
                    const args = [
                        builders.stringLiteral(newImport),
                        nodePath.node.qualifier,
                        nodePath.node.typeParameters
                    ];
                    if (!args[2]) {
                        args.splice(2, 1);
                    }
                    nodePath.replace(builders.tsImportType(...args));
                })
            }
        })

        if (!needsPrint) {
            return callback(null, file);
        }
        const result = print(ast, { quote: 'single', lineTerminator: '\n' }).code;
        file.contents = Buffer.from(result, enc);
        return callback(null, file);
    });
}

function copyServiceFiles(dist) {
    return () => merge(
        gulp
            .src('package.json')
            .pipe(replace(version, ctx.version.package))
            .pipe(gulp.dest(dist)),
        gulp
            .src('README.md')
            .pipe(gulp.dest(dist))
    );
}
function cleanNpmFramework(destination) {
    return function cleanNpmFramework(done) {
        del.sync(destination);
        done();
    };
}
function copyFrameworkArtifacts(source, destination) {
    return () => merge(
        gulp.src(source + "/**/*")
            .pipe(performRecastReplacements(source))
            .pipe(gulp.dest(destination))
    );
}

function addCompilationTask(frameworkName) {
    const frameworkSrc = `artifacts/${frameworkName}/renovation`;
    const npmDestFolder = `artifacts/npm-${frameworkName}`;
    const generateSeries = [
        cleanNpmFramework(npmDestFolder),
        `generate-${frameworkName}`,
        copyFrameworkArtifacts(frameworkSrc, npmDestFolder),
        copyServiceFiles(npmDestFolder)
    ];
    gulp.task(`renovation-npm-${frameworkName}`, gulp.series(...generateSeries));
}

addCompilationTask('react');
addCompilationTask('angular');
