/* eslint-disable */

const { compileCode } = require('devextreme-generator/component-compiler');
const generator = require('devextreme-generator/preact-generator').default;
const ts = require('typescript');
const path = require('path');
const fs = require('fs');

const THIS_FILE = fs.readFileSync(__filename);
const crypto = require('crypto');
const tsJest = require('ts-jest');

const jestTransformer = tsJest.createTransformer();

const TS_CONFIG_PATH = 'build/gulp/generator/ts-configs/preact.tsconfig.json';

function getTsConfig(filename) {
  const { config, errors } = ts.readConfigFile(filename, ts.sys.readFile);
  if (errors && errors.length) {
    return {};
  }
  let baseConfig = {};
  if (config.extends) {
    baseConfig = getTsConfig(path.resolve(path.dirname(filename), config.extends));
  }
  return {
    ...baseConfig,
    ...config,
    compilerOptions: {
      ...baseConfig.compilerOptions,
      ...config.compilerOptions,
      sourceMap: false,
    },
  };
}

const tsConfig = getTsConfig(TS_CONFIG_PATH);

generator.defaultOptionsModule = 'js/core/options/utils';
generator.jqueryComponentRegistratorModule = 'js/core/component_registrator';
generator.jqueryBaseComponentModule = 'js/renovation/preact-wrapper/component';

module.exports = {
  process(src, filename, config) {
    if (filename.indexOf('test_components') !== -1 && path.extname(filename) === '.tsx') {
      const result = compileCode(generator, src, {
        path: filename,
        dirname: path.dirname(filename),
      },
      true);

      if (result && result[1]) {
        const componentName = (result[1].code.match(/export default class (\w+) extends/) || [])[1];
        if (!componentName) {
          return '';
        }

        return jestTransformer.process(
          ts.transpileModule(
            `${result[0].code}
                ${result[1].code
    .replace('export default', 'export ')
    .replace(new RegExp(`\\b${componentName}\\b`, 'g'), `${componentName}Class`)
    .replace(new RegExp(`import ${componentName}Component from\\s+\\S+`), `const ${componentName}Component = ${componentName}`)}`,
            tsConfig,
          ).outputText, filename, config,
        );
      }
    }
    return jestTransformer.process(src, filename, config);
  },
  getCacheKey(fileData, filePath, configStr) {
    return crypto
      .createHash('md5')
      .update(THIS_FILE)
      .update('\0', 'utf8')
      .update(fileData)
      .update('\0', 'utf8')
      .update(filePath)
      .update('\0', 'utf8')
      .update(configStr)
      .digest('hex');
  },
};

/* eslint-enable */
