/* eslint no-console: 0 */

const path = require("path");
const readFile = require("./adapters/node-file-reader");
const createRecursive = require("./helpers/recursive-path-creator");
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
    let outputFile = config["output-file"] || "";
    let outColorScheme = config["output-color-scheme"] || "";
    let fileFormat = config["output-format"] || path.extname(outputFile).substr(1);

    const makeSwatch = !!config["make-swatch"];
    const base = !!config["base"];

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
        outputFile = themeName + "." + outColorScheme + "." + fileFormat;
    }

    return {
        outputFile: outputFile,
        fileFormat: fileFormat,
        outColorScheme: outColorScheme,
        makeSwatch: makeSwatch,
        base: base
    };
};

const getCommand = command => {
    if(command !== commands.BUILD_VARS && command !== commands.BUILD_THEME) {
        console.log(`Unknown command '${command}'. '${commands.BUILD_THEME}' will be used.`);
        return commands.BUILD_THEME;
    }
    return command;
};

const readCommandLineArguments = argv => {
    const command = getCommand(argv[2]);
    const config = require('minimist')(argv.slice(3));
    const theme = config["base-theme"] || "generic.light";
    const metadataFilePath = config["input-file"] || "";

    const themeParts = theme.split(".");
    const themeName = themeParts[0];
    const colorScheme = themeParts[1] + (themeParts[2] ? "-" + themeParts[2] : "");

    const metadataPromise = metadataFilePath
        ? readFile(metadataFilePath)
        : new Promise(resolve => resolve("{}"));

    const bootstrapConfig = getBootstrapConfig(metadataFilePath);
    const output = getOutParameters(command, themeName, config);

    if(output.outputFile) createRecursive(output.outputFile);

    return {
        command: command,
        metadataPromise: metadataPromise,
        fileFormat: output.fileFormat,
        themeName: themeName,
        colorScheme: colorScheme,
        outColorScheme: output.outColorScheme,
        isBootstrap: bootstrapConfig.isBootstrap,
        bootstrapVersion: bootstrapConfig.bootstrapVersion,
        out: output.outputFile,
        makeSwatch: output.makeSwatch,
        base: output.base,

        reader: readFile,
        lessCompiler: require("less/lib/less-node")
    };
};

module.exports = readCommandLineArguments;

