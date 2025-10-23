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
const glob_1 = require("glob");
const path_resolver_1 = require("../../utils/path-resolver");
const error_handler_1 = require("../../utils/error-handler");
const file_operations_1 = require("../../utils/file-operations");
const DEFAULT_TARGET_DIR = './npm';
const DEFAULT_PACKAGE_JSON = './package.json';
const GLOB_PATTERN = '**/*.{ts,js}';
const LICENSE_MARKER = '/*!';
const COMMENT_END = ' */';
const COMMENT_PREFIX = ' *';
const NEWLINE = '\n';
const EMPTY_LINE = '';
const GITHUB_URL = 'https://github.com/DevExpress/devextreme-react';
const COPYRIGHT_START = ' * Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED';
const BANNER_PKG_NAME = COMMENT_PREFIX + ' ' + '<%= pkg.name %>';
const BANNER_VERSION = COMMENT_PREFIX + ' ' + 'Version: <%= pkg.version %>';
const BANNER_BUILD_DATE = COMMENT_PREFIX + ' ' + 'Build date: <%= date %>';
const BANNER_LICENSE_LINE1 = COMMENT_PREFIX + ' ' + 'This software may be modified and distributed under the terms';
const BANNER_LICENSE_LINE2 = COMMENT_PREFIX
    + ' '
    + 'of the MIT license. See the LICENSE file in the root of the project for details.';
const BANNER_GITHUB = COMMENT_PREFIX + ' ' + GITHUB_URL;
const TEMPLATE_REGEX = /<%=\s*(\w+(?:\.\w+)*)\s*%>/g;
const runExecutor = async (options, context) => {
    const absoluteProjectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    const targetDirectory = path.join(absoluteProjectRoot, options.targetDirectory || DEFAULT_TARGET_DIR);
    const packageJsonPath = path.join(absoluteProjectRoot, options.packageJsonPath || DEFAULT_PACKAGE_JSON);
    let pkg;
    try {
        pkg = await (0, file_operations_1.readJson)(packageJsonPath);
    }
    catch (error) {
        (0, error_handler_1.logError)('Failed to read package.json', error);
        return { success: false };
    }
    const now = new Date();
    const data = {
        pkg,
        date: now.toDateString(),
        year: now.getFullYear(),
    };
    const bannerTemplate = [
        LICENSE_MARKER,
        BANNER_PKG_NAME,
        BANNER_VERSION,
        BANNER_BUILD_DATE,
        COMMENT_PREFIX,
        COPYRIGHT_START,
        COMMENT_PREFIX,
        BANNER_LICENSE_LINE1,
        BANNER_LICENSE_LINE2,
        COMMENT_PREFIX,
        BANNER_GITHUB,
        COMMENT_END,
        EMPTY_LINE,
    ].join(NEWLINE);
    const banner = renderTemplate(bannerTemplate, data);
    try {
        const pattern = path.join(targetDirectory, GLOB_PATTERN);
        const files = await (0, glob_1.glob)(pattern);
        devkit_1.logger.info(`Adding license headers to ${files.length} files...`);
        await Promise.all(files.map(async (file) => {
            const content = await (0, file_operations_1.readFileText)(file);
            if (content.startsWith(LICENSE_MARKER)) {
                return;
            }
            await (0, file_operations_1.writeFileText)(file, banner + NEWLINE + content);
        }));
        devkit_1.logger.info('License headers added successfully');
        return { success: true };
    }
    catch (error) {
        (0, error_handler_1.logError)('Failed to add license headers', error);
        return { success: false };
    }
};
function renderTemplate(template, data) {
    return template.replace(TEMPLATE_REGEX, (_match, key) => {
        const keys = key.split('.');
        let value = data;
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            }
            else {
                return '';
            }
        }
        return String(value);
    });
}
exports.default = runExecutor;
