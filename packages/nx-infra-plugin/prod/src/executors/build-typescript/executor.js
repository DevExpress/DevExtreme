"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const ts = __importStar(require("typescript"));
const path = __importStar(require("path"));
const glob_1 = require("glob");
const path_resolver_1 = require("../../utils/path-resolver");
const error_handler_1 = require("../../utils/error-handler");
const file_operations_1 = require("../../utils/file-operations");
const MODULE_TYPE_ESM = 'esm';
const MODULE_TYPE_CJS = 'cjs';
const DEFAULT_MODULE_TYPE = MODULE_TYPE_ESM;
const DEFAULT_TSCONFIG_CJS = './tsconfig.json';
const DEFAULT_TSCONFIG_ESM = './tsconfig.esm.json';
const DEFAULT_OUT_DIR_CJS = './npm/cjs';
const DEFAULT_OUT_DIR_ESM = './npm/esm';
const DEFAULT_SRC_PATTERN = './src/**/*.{ts,tsx}';
const ERROR_COMPILATION_FAILED = 'Compilation failed';
const NEWLINE_CHAR = '\n';
async function loadTsConfig(tsconfigPath) {
    if (!(await (0, file_operations_1.exists)(tsconfigPath))) {
        throw new Error(`TypeScript config file not found: ${tsconfigPath}`);
    }
    const tsconfigContentRaw = await (0, file_operations_1.readFileText)(tsconfigPath);
    const content = JSON.parse(tsconfigContentRaw);
    return {
        content,
        compilerOptions: content.compilerOptions || {},
    };
}
function formatDiagnostics(diagnostics) {
    return diagnostics.map((diagnostic) => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, NEWLINE_CHAR);
            return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
        }
        return ts.flattenDiagnosticMessageText(diagnostic.messageText, NEWLINE_CHAR);
    });
}
function compile(sourceFiles, compilerOptions) {
    return ts.createProgram(sourceFiles, compilerOptions);
}
const runExecutor = async (options, context) => {
    const absoluteProjectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    const module = options.module || DEFAULT_MODULE_TYPE;
    const defaultTsconfigPath = module === MODULE_TYPE_CJS ? DEFAULT_TSCONFIG_CJS : DEFAULT_TSCONFIG_ESM;
    const tsconfigPath = path.join(absoluteProjectRoot, options.tsconfig || defaultTsconfigPath);
    const defaultOutDir = module === MODULE_TYPE_CJS ? DEFAULT_OUT_DIR_CJS : DEFAULT_OUT_DIR_ESM;
    const outDir = path.join(absoluteProjectRoot, options.outDir || defaultOutDir);
    try {
        const { content: tsconfigContent, compilerOptions } = await loadTsConfig(tsconfigPath);
        compilerOptions.outDir = outDir;
        await (0, file_operations_1.ensureDir)(outDir);
        const srcPattern = options.srcPattern || DEFAULT_SRC_PATTERN;
        const globPattern = path.join(absoluteProjectRoot, srcPattern);
        const excludePattern = options.excludePattern
            ? path.join(absoluteProjectRoot, options.excludePattern)
            : undefined;
        const sourceFiles = await (0, glob_1.glob)(globPattern, {
            absolute: true,
            nodir: true,
            ignore: excludePattern ? [excludePattern] : [],
        });
        devkit_1.logger.info(`Building ${module.toUpperCase()} for ${sourceFiles.length} source files...`);
        if (sourceFiles.length === 0) {
            devkit_1.logger.warn(`No source files matched pattern: ${srcPattern}`);
        }
        const parsedConfig = ts.parseJsonConfigFileContent(tsconfigContent, ts.sys, path.dirname(tsconfigPath));
        const finalCompilerOptions = {
            ...parsedConfig.options,
            outDir: compilerOptions.outDir,
            paths: {},
        };
        const program = compile(sourceFiles, finalCompilerOptions);
        const result = program.emit();
        if (result.emitSkipped) {
            devkit_1.logger.error(ERROR_COMPILATION_FAILED);
            const diagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics);
            formatDiagnostics(diagnostics).forEach((msg) => devkit_1.logger.error(msg));
            return { success: false };
        }
        devkit_1.logger.info(`✓ ${module.toUpperCase()} build completed successfully`);
        return { success: true };
    }
    catch (error) {
        (0, error_handler_1.logError)(`Failed to build ${module.toUpperCase()}`, error);
        return { success: false };
    }
};
exports.default = runExecutor;
