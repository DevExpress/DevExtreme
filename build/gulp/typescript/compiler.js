'use strict';

const path = require('path');
const fs = require('fs');
const del = require('del');
const { glob } = require('glob');

const tsCompiler = require('typescript');
const tscAlias = require('tsc-alias');
const { logError, logInfo } = require('./logger');

const createTsCompiler = (compilerConfig) => {
    // --- private ---
    const absolutePaths = {
        tsConfigDir: path.dirname(compilerConfig.tsconfigAbsPath),
        tsConfigFile: compilerConfig.tsconfigAbsPath,
        tsBaseDir: path.dirname(compilerConfig.tsconfigAbsPath),
        aliasRoot: compilerConfig.aliasAbsPath,
    };

    const errorHandler = (errorPrefix) =>
        (error) => {
            if(error) {
                console.error(`${errorPrefix}: ${error}`);
            }
        };

    const getWriteFileOverride = (aliasTranspileFunc) => async(filePath, fileData) => {
        const normalizedFilePath = compilerConfig.normalizeTsAliasFilePath(filePath);
        const resolvedFileData = aliasTranspileFunc(normalizedFilePath, fileData);
        await writeFileAsync(filePath, resolvedFileData);
    };

    const writeFileAsync = async(filePath, fileData) => {
        await fs.promises.mkdir(
            path.dirname(filePath),
            { recursive: true },
            errorHandler(compilerConfig.messages.createDirErr)
        );
        await fs.promises.writeFile(
            filePath,
            fileData,
            errorHandler(compilerConfig.messages.createFileErr)
        );
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

    // --- public ---
    const compileTsAsync = async(fileNamePatterns) => {
        const fileNames = await glob(fileNamePatterns);
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

        const host = tsCompiler.createWatchCompilerHost(
            configFilePath,
            {},
            tsCompiler.sys,
            createProgram,
            reportDiagnostic,
            reportWatchStatusChanged
        );

        const aliasTranspileFunc = await createAliasTranspileAsync(absolutePaths.aliasRoot);
        host.writeFile = getWriteFileOverride(aliasTranspileFunc);

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
