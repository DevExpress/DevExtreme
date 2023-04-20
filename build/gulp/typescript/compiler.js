'use strict';

const path = require('path');
const del = require('del');
const { glob } = require('glob');

const tsCompiler = require('typescript');
const tscAlias = require('tsc-alias');
const createFileChangeManager = require('./file-change-manager');
const { logError, logInfo } = require('./logger');
const { writeFileAsync } = require('../utils');

const createTsCompiler = (compilerConfig) => {
    // --- private ---
    const absolutePaths = {
        tsConfigDir: path.dirname(compilerConfig.tsconfigAbsPath),
        tsConfigFile: compilerConfig.tsconfigAbsPath,
        tsBaseDir: path.dirname(compilerConfig.tsconfigAbsPath),
        aliasRoot: compilerConfig.aliasAbsPath,
    };

    const createAliasTranspileAsync = async(outDir) => {
        const transpileFunc = await tscAlias.prepareSingleFileReplaceTscAliasPaths({
            configFile: absolutePaths.tsConfigFile,
            outDir,
        });

        return (filePath, fileContents) => transpileFunc({ fileContents, filePath });
    };

    const reportDiagnostic = (diagnostic) => {
        if(diagnostic.file) {
            const { line, character } = tsCompiler.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            const message = tsCompiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.error(logError(`${diagnostic.file.fileName} (${line + 1},${character + 1}):\n ${message} \n`));

            return;
        }

        console.error(logError(`${tsCompiler.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}\n`));
    };

    const getTsConfigPath = () => {
        const configFilePath = tsCompiler.findConfigFile(
            absolutePaths.tsConfigDir,
            tsCompiler.sys.fileExists,
            compilerConfig.tsConfigName,
        );
        if(!configFilePath) {
            const errorMsg = `tsconfig wasn't found by passed path:\n${absolutePaths.tsConfigFile}`;
            console.error(logError(errorMsg));
            throw Error(errorMsg);
        }

        return configFilePath;
    };

    const getWriteFileOverride = (aliasTranspileFunc) => async(filePath, fileData) => {
        const normalizedFilePath = compilerConfig.normalizeTsAliasFilePath(filePath);
        const resolvedFileData = aliasTranspileFunc(normalizedFilePath, fileData);
        await writeFileAsync(filePath, resolvedFileData);
    };

    // --- public ---
    const compileTsAsync = async(fileNamePattern) => {
        const fileNames = glob.sync(fileNamePattern);
        const configFilePath = getTsConfigPath();
        const { config } = tsCompiler.readConfigFile(configFilePath, tsCompiler.sys.readFile);
        const { options } = tsCompiler.parseJsonConfigFileContent(config, tsCompiler.sys, absolutePaths.tsBaseDir);

        const program = tsCompiler.createProgram(fileNames, options);
        const aliasTranspileFunc = await createAliasTranspileAsync(absolutePaths.aliasRoot);
        const emitResult = program.emit(
            undefined,
            getWriteFileOverride(aliasTranspileFunc),
        );

        const allDiagnostics = tsCompiler
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);

        allDiagnostics.forEach(diagnostic => { reportDiagnostic(diagnostic); });

        if(allDiagnostics.length > 0) {
            console.error(logInfo(compilerConfig.messages.compilationFailed));
            throw Error(compilerConfig.messages.compilationFailed);
        }
    };

    const watchTsAsync = async() => {
        const configFilePath = getTsConfigPath();
        const createProgram = tsCompiler.createSemanticDiagnosticsBuilderProgram;
        const reportWatchStatusChanged = (diagnostic) => {
            console.info(logInfo(diagnostic.messageText));
        };
        const changeManager = createFileChangeManager();

        const host = tsCompiler.createWatchCompilerHost(
            configFilePath,
            {},
            tsCompiler.sys,
            createProgram,
            reportDiagnostic,
            reportWatchStatusChanged
        );

        const origPostProgramCreate = host.afterProgramCreate;
        const aliasTranspileFunc = await createAliasTranspileAsync(absolutePaths.aliasRoot);
        const writeFile = getWriteFileOverride(aliasTranspileFunc);

        host.writeFile = async(filePath, fileData) => {
            const isChanged = changeManager.checkFileChanged(filePath, fileData);
            if(isChanged) {
                await writeFile(filePath, fileData);
            }
        };

        host.afterProgramCreate = program => {
            changeManager.clearUntouchedFiles();
            origPostProgramCreate(program);
        };

        tsCompiler.createWatchProgram(host);
    };

    const clearAfterTSCompileAsync = async() => {
        await del(compilerConfig.clearFilePattern, { force: true });
    };

    return {
        compileTsAsync,
        watchTsAsync,
        clearAfterTSCompileAsync,
    };
};

module.exports = createTsCompiler;
