/* global console */
/* eslint no-console: 0 */

const commands = require('./commands');
const themes = require('./themes');

const DEFAULT_OUT_COLOR_SCHEME = 'custom-scheme';

const extname = filename => filename.substring(filename.lastIndexOf('.'));

const getBootstrapConfig = fileName => {
    const extension = extname(fileName);
    let bootstrap = false;
    let version = 0;

    if(extension === '.scss') {
        bootstrap = true;
        version = 4;
    } else if(extension === '.less') {
        bootstrap = true;
        version = 3;
    }

    return { isBootstrap: bootstrap, bootstrapVersion: version };
};

const getOutParameters = (command, themeName, config) => {
    let outputFile = config.outputFile || '';
    let outColorScheme = config.outputColorScheme || '';
    let fileFormat = config.outputFormat || extname(outputFile).substr(1);

    const makeSwatch = !!config.makeSwatch;
    const base = !!config.base;

    if(!outColorScheme) {
        outColorScheme = DEFAULT_OUT_COLOR_SCHEME;
    } else if(!/^[\w\-.]+$/.test(outColorScheme)) {
        console.log(`'--output-color-scheme' is not valid. '${DEFAULT_OUT_COLOR_SCHEME}' will be used.`);
        outColorScheme = DEFAULT_OUT_COLOR_SCHEME;
    }

    if(!fileFormat) {
        switch(command) {
            case commands.BUILD_THEME:
                fileFormat = 'css';
                break;
            case commands.BUILD_VARS:
                fileFormat = 'less';
                break;
            case commands.BUILD_META:
                fileFormat = 'json';
                break;
        }
    }

    if(!outputFile) {
        outputFile = 'dx.' + themeName + '.' + outColorScheme + '.' + fileFormat;
    }

    return {
        outputFile: outputFile,
        fileFormat: fileFormat,
        outColorScheme: outColorScheme,
        makeSwatch: makeSwatch,
        base: base
    };
};

const getThemeAndColorScheme = config => {
    let themeName = 'generic';
    let colorScheme = 'light';
    let foundTheme = null;

    if(config.baseTheme) {
        const dotIndex = config.baseTheme.indexOf('.');
        const passedThemeName = config.baseTheme.substr(0, dotIndex);
        const passedColorScheme = config.baseTheme.substr(dotIndex + 1).replace(/\./g, '-');

        console.log(passedThemeName, passedColorScheme);

        foundTheme = themes.find(t => t.name === passedThemeName && t.colorScheme === passedColorScheme);
        if(!foundTheme) {
            console.log(`The base theme with name ${config.baseTheme} does not exist.`);
        }
    } else if(config.themeId) {
        foundTheme = themes.find(t => t.themeId === parseInt(config.themeId));
        if(!foundTheme) {
            console.log(`The theme with ID ${config.themeId} does not exist.`);
        }
    }

    if(foundTheme) {
        themeName = foundTheme.name;
        colorScheme = foundTheme.colorScheme;
    }

    return {
        themeName: themeName,
        colorScheme: colorScheme
    };
};

const normalizePath = path => path + (path[path.length - 1] !== '/' ? '/' : '');

const parseConfig = config => {
    const command = config.command;
    const metadataFilePath = config.inputFile || '';
    const themeInfo = getThemeAndColorScheme(config);
    const bootstrapConfig = getBootstrapConfig(metadataFilePath);
    const output = getOutParameters(command, themeInfo.themeName, config);

    delete config.baseTheme;
    delete config.outputColorScheme;
    delete config.outputFormat;
    delete config.outputFile;
    delete config.inputFile;
    delete config.themeId;

    if(config.lessPath) {
        config.lessPath = normalizePath(config.lessPath);
    }

    if(config.scssPath) {
        config.scssPath = normalizePath(config.scssPath);
    }

    Object.assign(config, {
        data: config.data !== undefined ? config.data : {},
        fileFormat: output.fileFormat,
        themeName: themeInfo.themeName,
        colorScheme: themeInfo.colorScheme,
        outColorScheme: output.outColorScheme,
        isBootstrap: bootstrapConfig.isBootstrap,
        bootstrapVersion: bootstrapConfig.bootstrapVersion,
        out: output.outputFile,
        makeSwatch: output.makeSwatch,
        base: output.base
    });
};

module.exports = parseConfig;


