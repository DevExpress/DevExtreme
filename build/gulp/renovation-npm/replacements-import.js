'use strict';

const through = require('through2');
const { parse, print } = require('recast');
const { visit, builders } = require('ast-types');
const path = require('path');
const tsparser = require('recast/parsers/typescript');
const jsparser = require('recast/parsers/babel');

function performRecastReplacements(context) {
    context.rawPackageSet = new Set();
    context.moduleMap = {};
    const rootFolderPath = context.source;
    return through.obj((file, enc, callback) => {
        if (file.isNull())
            return callback(null, file);

        const absoluteRootFolderPath = path.resolve(process.cwd(), rootFolderPath);

        const isJs = file.extname === '.js';
        const isTs = file.extname === '.ts' || file.extname === '.tsx';

        if (!isJs && !isTs)
            return callback(null, file);

        const ast = parse(file.contents.toString(), {
            parser: isJs ? jsparser : tsparser,
            sourceFileName: file.path
        });

        let needsPrint = false;
        const fileDir = path.dirname(file.path);
        const devextremeFolder = path.dirname(absoluteRootFolderPath);

        const processModuleMap = (modulePath) => {
            const tsPath = file.extname === '.tsx' ? file.path.replace('.tsx', '.ts') : '';
            if (modulePath) {
                context.moduleMap[file.path].push(modulePath);
                tsPath && (context.moduleMap[tsPath].push(modulePath))
            } else {
                context.moduleMap[file.path] = [];
                tsPath && (context.moduleMap[tsPath] = [])
            }
        }

        const processImport = (importFrom, performReplacement) => {
            if (importFrom.startsWith('.')) {
                // NOTE: import that starts from the dot sign is a relative module path
                const absoluteModulePath = path.resolve(fileDir, importFrom);
                if (absoluteModulePath.startsWith(absoluteRootFolderPath)) {
                    // NOTE: current import refers to a code inside the renovation folder
                    context.extensions.forEach(ext => {
                        const fileVar = `${absoluteModulePath}${ext}`;
                        processModuleMap(fileVar);
                    });
                    return false;
                }
                let newPath = path.relative(devextremeFolder, absoluteModulePath).replace(/\\/g, '/');
                if (newPath.endsWith('/index')) {
                    newPath = newPath.slice(0, -'/index'.length);
                }
                performReplacement(`devextreme/${newPath}`)

                needsPrint = true;
                return false;
            } else {
                // NOTE: import that does not start from the dot sign is a package module import
                context.rawPackageSet.add(importFrom);
                return false;
            }
        }
        processModuleMap();
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

module.exports = performRecastReplacements;
