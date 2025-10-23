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
const DEFAULT_SOURCE_PACKAGE_JSON = './package.json';
const DEFAULT_DIST_DIR = './npm';
const PACKAGE_JSON_FILE = 'package.json';
const PUBLISH_CONFIG_FIELD = 'publishConfig';
const JSON_INDENT = 2;
const ERROR_PREPARE_PACKAGE_JSON = 'Failed to prepare package.json';
const runExecutor = async (options, context) => {
    const absoluteProjectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    const sourcePackageJson = path.join(absoluteProjectRoot, options.sourcePackageJson || DEFAULT_SOURCE_PACKAGE_JSON);
    const distDirectory = path.join(absoluteProjectRoot, options.distDirectory || DEFAULT_DIST_DIR);
    try {
        await (0, file_operations_1.ensureDir)(distDirectory);
        const pkg = await (0, file_operations_1.readJson)(sourcePackageJson);
        delete pkg[PUBLISH_CONFIG_FIELD];
        const distPackageJson = path.join(distDirectory, PACKAGE_JSON_FILE);
        await (0, file_operations_1.writeJson)(distPackageJson, pkg, JSON_INDENT);
        devkit_1.logger.info(`Created ${distPackageJson}`);
        return { success: true };
    }
    catch (error) {
        (0, error_handler_1.logError)(ERROR_PREPARE_PACKAGE_JSON, error);
        return { success: false };
    }
};
exports.default = runExecutor;
