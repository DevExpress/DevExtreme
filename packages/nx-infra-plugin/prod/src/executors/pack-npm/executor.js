"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const path_resolver_1 = require("../../utils/path-resolver");
const error_handler_1 = require("../../utils/error-handler");
const DEFAULT_DIST_DIR = './npm';
const MSG_PACK_SUCCESS = 'pnpm pack completed successfully';
const MSG_PACK_FAILED = 'Failed to run pnpm pack';
const runExecutor = async (options, context) => {
    const absoluteProjectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    const distDirectory = options.workingDirectory || DEFAULT_DIST_DIR;
    const workspaceRoot = context.root;
    if (!context.projectName) {
        (0, error_handler_1.logError)(MSG_PACK_FAILED, 'Project name is not defined in context');
        return { success: false };
    }
    try {
        devkit_1.logger.info(`Running pnpm pack from ${absoluteProjectRoot} (packaging ${distDirectory})...`);
        const projectPath = path_1.default.join(workspaceRoot, 'packages', context.projectName);
        (0, child_process_1.execSync)(`pnpm pack`, {
            cwd: projectPath,
            stdio: 'inherit',
        });
        devkit_1.logger.info(MSG_PACK_SUCCESS);
        return { success: true };
    }
    catch (error) {
        (0, error_handler_1.logError)(MSG_PACK_FAILED, error);
        return { success: false };
    }
};
exports.default = runExecutor;
