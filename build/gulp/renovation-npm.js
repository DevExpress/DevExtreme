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
const jsparser = require("recast/parsers/babel");

const rawPackageSet = new Set();
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
                rawPackageSet.add(importFrom);
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
            },
            visitCallExpression(nodePath) {
                const callee = nodePath.node.callee;
                if (callee.type === 'Identifier' && callee.name === 'require') {
                    return processImport(nodePath.node.arguments[0].value, (newImport) => {
                        nodePath.replace(builders.callExpression(callee, [builders.stringLiteral(newImport)]));
                    });
                }
                this.traverse(nodePath);
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

function performPackageLockReplacements(frameworkName) {
    return through.obj((file, enc, callback) => {
        const pkg = JSON.parse(file.contents.toString());
        
        const result = {
            name: `@devextreme/${frameworkName}`
        };
        
        const knownFields = ['version', 'description', 'keywords', 'homepage', 'bugs', 'author', 'repository', 'license', 'browserslist'];
        knownFields.forEach(x => result[x] = pkg[x]);

        const depsList = new Array(...rawPackageSet).map(x => {
            const splitted = x.split('/');
            if (splitted.length != 1 && splitted[0].startsWith('@')) {
                return `${splitted[0]}/${splitted[1]}`;
            }
            return splitted[0];
        });
        const depsListDistinct = new Array(...new Set(depsList));

        result.dependencies = {};

        ['dependencies', 'peerDependencies', 'devDependencies'].forEach(field => {
            if (!pkg[field]) {
                return;
            }
            result[field] = {};
            depsListDistinct.forEach(x => {
                result[field][x] = pkg[field][x];
            });
        })

        result.dependencies.devextreme = ctx.version.package;

        file.contents = Buffer.from(JSON.stringify(result, null, 2), enc);
        callback(null, file);
    });
}

function copyServiceFiles(frameworkName, dist) {
    return () => merge(
        gulp
            .src('package.json')
            .pipe(replace(version, ctx.version.package))
            .pipe(performPackageLockReplacements(frameworkName))
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
        copyServiceFiles(frameworkName, npmDestFolder)
    ];
    gulp.task(`renovation-npm-${frameworkName}`, gulp.series(...generateSeries));
}

addCompilationTask('react');
addCompilationTask('angular');
