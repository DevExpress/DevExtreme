"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.getErrorStack = exports.getErrorMessage = void 0;
const devkit_1 = require("@nx/devkit");
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
exports.getErrorMessage = getErrorMessage;
function getErrorStack(error) {
    return error instanceof Error ? error.stack : undefined;
}
exports.getErrorStack = getErrorStack;
function logError(message, error) {
    devkit_1.logger.error(`${message}: ${getErrorMessage(error)}`);
    const stack = getErrorStack(error);
    if (stack) {
        devkit_1.logger.error(stack);
    }
}
exports.logError = logError;
