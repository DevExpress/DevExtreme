/* eslint no-console: 0 */

const path = require("path");
const commands = require("./commands");

const DEFAULT_OUT_COLOR_SCHEME = "custom-scheme";

const getBootstrapConfig = fileName => {
    const extension = path.extname(fileName);
    let bootstrap = false;
    let version = 0;

    if(extension === ".scss") {
        bootstrap = true;
        version = 4;
    } else if(extension === ".less") {
        bootstrap = true;
        version = 3;
    }

    return { isBootstrap: bootstrap, bootstrapVersion: version };
};

const getOutParameters = (command, themeName, config) => {
    let outputFile = config.outputFile || "";
    let outColorScheme = config.outputColorScheme || "";
    let fileFormat = config.outputFormat || path.extname(outputFile).substr(1);

    const makeSwatch = !!config.makeSwatch;
    const base = !!config.base;

    if(!/^[\w\-.]+$/.test(outColorScheme)) {
        console.log(`'--output-color-scheme' is not valid. '${DEFAULT_OUT_COLOR_SCHEME}' will be used.`);
        outColorScheme = DEFAULT_OUT_COLOR_SCHEME;
    }

    if(!fileFormat) {
        if(command === commands.BUILD_THEME) {
            fileFormat = "css";
        } else if(command === commands.BUILD_VARS) {
            fileFormat = "less";
        }
    }

    if(!outputFile) {
        outputFile = "dx." + themeName + "." + outColorScheme + "." + fileFormat;
    }

    return {
        outputFile: outputFile,
        fileFormat: fileFormat,
        outColorScheme: outColorScheme,
        makeSwatch: makeSwatch,
        base: base
    };
};

const parseConfig = config => {
    const command = config.command;
    const theme = config.baseTheme || "generic.light";
    const metadataFilePath = config.inputFile || "";

    const themeParts = theme.split(".");
    const themeName = themeParts[0];
    const colorScheme = themeParts[1] + (themeParts[2] ? "-" + themeParts[2] : "");
    const bootstrapConfig = getBootstrapConfig(metadataFilePath);
    const output = getOutParameters(command, themeName, config);

    delete config.baseTheme;
    delete config.outputColorScheme;
    delete config.outputFormat;
    delete config.outputFile;
    delete config.inputFile;

    Object.assign(config, {
        data: config.data !== undefined ? config.data : {},
        fileFormat: output.fileFormat,
        themeName: themeName,
        colorScheme: colorScheme,
        outColorScheme: output.outColorScheme,
        isBootstrap: bootstrapConfig.isBootstrap,
        bootstrapVersion: bootstrapConfig.bootstrapVersion,
        out: output.outputFile,
        makeSwatch: output.makeSwatch,
        base: output.base,
    });
};

module.exports = parseConfig;


