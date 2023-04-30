'use strict';

const baseLog = (msg) => `\x1b[36m>TS\x1b[0m ${msg}`;

const underscore = (msg) => `\x1b[4m${msg}\x1b[0m`;

const logError = (msg) => baseLog(`\x1b[31mError\x1b[0m ${msg}`);

const logInfo = (msg) => baseLog(underscore(msg));

module.exports = {
    logError,
    logInfo,
};
