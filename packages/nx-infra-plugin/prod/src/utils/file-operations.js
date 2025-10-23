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
exports.writeFileText = exports.readFileText = exports.copyFile = exports.exists = exports.processFiles = exports.writeJson = exports.readJson = exports.ensureDir = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const glob_1 = require("glob");
const ENCODING_UTF8 = 'utf-8';
const ERROR_CODE_EXIST = 'EEXIST';
async function ensureDir(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code === ERROR_CODE_EXIST) {
            return;
        }
        throw error;
    }
}
exports.ensureDir = ensureDir;
async function readJson(filePath) {
    const content = await fs.readFile(filePath, ENCODING_UTF8);
    return JSON.parse(content);
}
exports.readJson = readJson;
async function writeJson(filePath, data, spaces = 2) {
    const content = JSON.stringify(data, null, spaces);
    await fs.writeFile(filePath, content, ENCODING_UTF8);
}
exports.writeJson = writeJson;
async function processFiles(pattern, processor, options = {}) {
    const files = await (0, glob_1.glob)(pattern, {
        absolute: true,
        nodir: true,
        ignore: options.ignore,
    });
    await Promise.all(files.map(processor));
    return files.length;
}
exports.processFiles = processFiles;
async function exists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
exports.exists = exists;
async function copyFile(from, to) {
    await ensureDir(path.dirname(to));
    await fs.copyFile(from, to);
}
exports.copyFile = copyFile;
async function readFileText(filePath) {
    return fs.readFile(filePath, ENCODING_UTF8);
}
exports.readFileText = readFileText;
async function writeFileText(filePath, content) {
    await ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, ENCODING_UTF8);
}
exports.writeFileText = writeFileText;
