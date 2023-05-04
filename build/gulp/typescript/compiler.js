'use strict';

const path = require('path');
const { Readable } = require('stream');
const { glob } = require('glob');

const Vinyl = require('vinyl');
const tsCompiler = require('typescript');
const tscAlias = require('tsc-alias');

const createFileChangeManager = require('./file-change-manager');
const { logError, logInfo } = require('./logger');


const createAliasTranspileFuncAsync = async(configFile, outDir) => {
    const transpileFunc = await tscAlias.prepareSingleFileReplaceTscAliasPaths({
        configFile,
        outDir,
    });

    return (filePath, fileContents) => transpileFunc({ fileContents, filePath });
};

const createReadableStream = () => {
    const stream = new Readable({ objectMode: true });
    stream._read = () => {};
    return stream;
};

const createWriteFileToStreamFunc = (
    stream,
    aliasTranspileFunc,
    { distPath, aliasPath, tsBaseDirName },
) => (filePath, fileData) => {
    if(!filePath.includes(tsBaseDirName)) {
        return;
    }

    const distPathRegExp = new RegExp(distPath);
    // Resolve ts alias
    const normalizedFilePath = filePath.replace(distPathRegExp, aliasPath);
    const resolvedFileData = aliasTranspileFunc(normalizedFilePath, fileData);

    const file = new Vinyl({
        path: filePath.replace(distPathRegExp, ''),
        contents: Buffer.from(resolvedFileData),
    });
    stream.push(file);
};

const getAbsolutePaths = (compilerConfig) => {
    const baseTsAbsDir = path.dirname(`${compilerConfig.baseAbsPath}/${compilerConfig.relativePath.tsconfig}`);

    return {
        tsConfigDir: baseTsAbsDir,
        tsConfigFile: `${compilerConfig.baseAbsPath}/${compilerConfig.relativePath.tsconfig}`,
        tsBaseDir: baseTsAbsDir,
        aliasRoot: `${compilerConfig.baseAbsPath}/${compilerConfig.relativePath.alias}`,
    };
};

const getTsConfigPath = (tsConfigDir) => {
    const configFilePath = tsCompiler.findConfigFile(
        tsConfigDir,
        tsCompiler.sys.fileExists,
    );

    if(!configFilePath) {
        const errorMsg = `tsconfig wasn't found by passed path:\n${tsConfigDir}/tsconfig.json`;
        console.error(logError(errorMsg));
        throw Error(errorMsg);
    }

    return configFilePath;
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

const createTsCompiler = async(compilerConfig) => {
    // --- private ---
    const absolutePaths = getAbsolutePaths(compilerConfig);
    const aliasTranspileFunc = await createAliasTranspileFuncAsync(
        absolutePaths.tsConfigFile,
        absolutePaths.aliasRoot,
    );

    // --- public ---
    const compileTs = (fileNamePattern) => {
        const fileNames = glob.sync(fileNamePattern);
        const configFilePath = getTsConfigPath(absolutePaths.tsConfigDir);
        const { config } = tsCompiler.readConfigFile(configFilePath, tsCompiler.sys.readFile);
        const { options } = tsCompiler.parseJsonConfigFileContent(config, tsCompiler.sys, absolutePaths.tsBaseDir);

        const program = tsCompiler.createProgram(fileNames, options);

        const stream = createReadableStream();

        const emitResult = program.emit(
            undefined,
            createWriteFileToStreamFunc(
                stream,
                aliasTranspileFunc,
                {
                    distPath: compilerConfig.relativePath.dist,
                    aliasPath: compilerConfig.relativePath.alias,
                    tsBaseDirName: compilerConfig.tsBaseDirName,
                }),
        );

        const allDiagnostics = tsCompiler
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);

        allDiagnostics.forEach(diagnostic => { reportDiagnostic(diagnostic); });

        if(allDiagnostics.length > 0) {
            console.error(logInfo(compilerConfig.messages.compilationFailed));
            throw Error(compilerConfig.messages.compilationFailed);
        }

        stream.push(null);
        return stream;
    };

    const watchTs = () => {
        const configFilePath = getTsConfigPath(absolutePaths.tsConfigDir);
        const createProgram = tsCompiler.createSemanticDiagnosticsBuilderProgram;
        const reportWatchStatusChanged = (diagnostic) => {
            console.info(logInfo(diagnostic.messageText));
        };
        const changeManager = createFileChangeManager();
        const stream = createReadableStream();

        const host = tsCompiler.createWatchCompilerHost(
            configFilePath,
            {},
            tsCompiler.sys,
            createProgram,
            reportDiagnostic,
            reportWatchStatusChanged
        );

        const writeFileToStream = createWriteFileToStreamFunc(
            stream,
            aliasTranspileFunc,
            {
                distPath: compilerConfig.relativePath.dist,
                aliasPath: compilerConfig.relativePath.alias,
                tsBaseDirName: compilerConfig.tsBaseDirName,
            });
        host.writeFile = async(filePath, fileData) => {
            const isChanged = changeManager.checkFileChanged(filePath, fileData);

            if(!isChanged) {
                return;
            }

            writeFileToStream(filePath, fileData);
        };

        const origPostProgramCreate = host.afterProgramCreate;
        host.afterProgramCreate = program => {
            changeManager.clearUntouchedFiles();
            origPostProgramCreate(program);
        };

        tsCompiler.createWatchProgram(host);

        return stream;
    };

    return {
        compileTs,
        watchTs,
    };
};

module.exports = createTsCompiler;
