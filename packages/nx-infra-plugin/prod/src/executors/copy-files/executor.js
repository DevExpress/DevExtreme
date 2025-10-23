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
const path = __importStar(require("path"));
const path_resolver_1 = require("../../utils/path-resolver");
const error_handler_1 = require("../../utils/error-handler");
const file_operations_1 = require("../../utils/file-operations");
const ERROR_FILES_MUST_BE_ARRAY = 'Files option must be an array';
const ERROR_FAILED_TO_COPY = 'Failed to copy files';
const runExecutor = async (options, context) => {
    const projectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    if (!options.files || !Array.isArray(options.files)) {
        devkit_1.logger.error(ERROR_FILES_MUST_BE_ARRAY);
        return { success: false };
    }
    try {
        for (const { from, to } of options.files) {
            const sourcePath = path.resolve(projectRoot, from);
            const destPath = path.resolve(projectRoot, to);
            if (!(await (0, file_operations_1.exists)(sourcePath))) {
                devkit_1.logger.error(`Source file not found: ${sourcePath}`);
                return { success: false };
            }
            await (0, file_operations_1.copyFile)(sourcePath, destPath);
            devkit_1.logger.info(`Copied ${sourcePath} -> ${destPath}`);
        }
        return { success: true };
    }
    catch (error) {
        (0, error_handler_1.logError)(ERROR_FAILED_TO_COPY, error);
        return { success: false };
    }
};
exports.default = runExecutor;
