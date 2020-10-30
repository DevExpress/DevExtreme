/* eslint no-param-reassign: ["error", { "props": false }] */

import commands from './commands';
import themes from './themes';
import Logger from './logger';

const DEFAULT_OUT_COLOR_SCHEME = 'custom-scheme';

const extname = (filename: string): string => filename.substring(filename.lastIndexOf('.'));

const getBootstrapConfig = (fileName: string): ConfigSettings => {
  const extension = extname(fileName);
  let bootstrap = false;
  let version = 0;

  if (extension === '.scss') {
    bootstrap = true;
    version = 4;
  } else if (extension === '.less') {
    bootstrap = true;
    version = 3;
  }

  return { isBootstrap: bootstrap, bootstrapVersion: version };
};

const getOutParameters = (
  command: string,
  themeName: string,
  config: ConfigSettings,
): ConfigSettings => {
  let outputFile = config.outputFile || '';
  let outColorScheme = config.outputColorScheme || '';
  let fileFormat = config.outputFormat || extname(outputFile).substr(1);

  const makeSwatch = !!config.makeSwatch;
  const base = !!config.base;
  const isColorSchemeValid = outColorScheme && /^[\w\-.]+$/.test(outColorScheme);

  if (!isColorSchemeValid) {
    Logger.log(
      `'--output-color-scheme' is not valid. '${DEFAULT_OUT_COLOR_SCHEME}' will be used.`,
    );
  }

  if (!outColorScheme || !isColorSchemeValid) {
    outColorScheme = DEFAULT_OUT_COLOR_SCHEME;
  }

  if (!fileFormat) {
    switch (command) {
      case commands.BUILD_THEME:
        fileFormat = 'css';
        break;
      case commands.BUILD_VARS:
        fileFormat = 'less';
        break;
      case commands.BUILD_META:
        fileFormat = 'json';
        break;
      default:
        fileFormat = 'css';
        break;
    }
  }

  if (!outputFile) {
    outputFile = `dx.${themeName}.${outColorScheme}.${fileFormat}`;
  }

  return {
    outputFile,
    fileFormat,
    outColorScheme,
    makeSwatch,
    base,
  };
};

const getThemeAndColorScheme = (config: ConfigSettings): ConfigSettings => {
  let themeName = 'generic';
  let colorScheme = 'light';
  let foundTheme = null;

  if (config.baseTheme) {
    const dotIndex = config.baseTheme.indexOf('.');
    const passedThemeName = config.baseTheme.substr(0, dotIndex);
    const passedColorScheme = config.baseTheme.substr(dotIndex + 1).replace(/\./g, '-');

    foundTheme = themes.find((t) => t.name === passedThemeName
      && t.colorScheme === passedColorScheme);

    if (!foundTheme) {
      Logger.log(`The base theme with name ${config.baseTheme} does not exist.`);
    }
  } else if (config.themeId) {
    foundTheme = themes.find((t) => t.themeId === parseInt(config.themeId.toString(), 10));
    if (!foundTheme) {
      Logger.log(`The theme with ID ${config.themeId} does not exist.`);
    }
  }

  if (foundTheme) {
    themeName = foundTheme.name;
    colorScheme = foundTheme.colorScheme;
  }

  return {
    themeName,
    colorScheme,
  };
};

const processItemKeys = (
  config: ConfigSettings,
  processor: (item: string) => string,
): void => {
  if (config.items && config.items.length) {
    config.items.forEach((item) => {
      item.key = processor(item.key);
    });
  }
};

const normalizePath = (path: string): string => path + (!path.endsWith('/') ? '/' : '');

const parseConfig = (config: ConfigSettings): void => {
  const { command } = config;
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

  if (config.lessPath) {
    config.lessPath = normalizePath(config.lessPath);
  }

  if (config.scssPath) {
    config.scssPath = normalizePath(config.scssPath);
  }

  if (config.widgets) {
    config.widgets = config.widgets.map((w) => w.toLowerCase());
  }

  [
    (key: string): string => key.replace(/@treelist/, '@datagrid'),
    (key: string): string => key.replace(/@/, '$'),
    (key: string): string => key.toLowerCase().replace(/_/g, '-'),
  ].forEach((processor) => {
    processItemKeys(config, processor);
  });

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
    base: output.base,
  });
};

export default parseConfig;
