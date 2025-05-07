import * as sass from 'sass-embedded';
import { promises as fs, existsSync } from 'fs';
import bootstrap5meta from '../data/bootstrap-metadata/bootstrap5-metadata';

export default class BootstrapExtractor {
  compiler: (input: string) => Promise<string>;

  sourceProcessor: () => Promise<string>;

  meta: { [key: string]: string };

  input: string;

  version: number;

  constructor(source: string, version: number) {
    this.input = source;
    this.version = version;
    this.meta = bootstrap5meta;
    this.compiler = BootstrapExtractor.sassRender;
    this.sourceProcessor = this.sassProcessor;
  }

  async getRootVariablesSass(): Promise<ConfigMetaItem[]> {
    const result: ConfigMetaItem[] = [];
    const path = require.resolve(`bootstrap/dist/css/bootstrap.css`);
    const content = await fs.readFile(path, 'utf8');
    const rootVariables = new RegExp(':root(,.+?])? {.+?}', 's').exec(content)[0];

    const ruleRegex = /(--.+): (.+);/gm;
    let match = ruleRegex.exec(rootVariables);
    while (match !== null) {
      const key = match[1];
      const value = match[2];

      result.push({ key, value });

      match = ruleRegex.exec(rootVariables);
    }

    return result;
  }

  static async sassRender(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sass.compileStringAsync(input)
        .then((data) => resolve(data.css.toString()))
        .catch((error: sass.Exception) => reject(error.message));
    });
  }

  static convertRemToPx(cssValue: string): string {
    const remValueRegex = /(\d*?\.?\d+?)rem([;\s])?/g;
    const replaceHandler = (_match: string, value: string, separator: string): string => {
      const pixelsInRem = 16;
      const pxValue = Math.round(parseFloat(value) * pixelsInRem);
      return `${pxValue}px${separator || ''}`;
    };
    return cssValue.replace(remValueRegex, replaceHandler);
  }

  async readSassFile(fileName: string): Promise<string> {
    const path = this.getFilePath(fileName);
    return fs.readFile(path, 'utf8');
  }

  async sassProcessor(): Promise<string> {
    const functions = await this.readSassFile('_functions.scss');
    const variables = await this.readSassFile('_variables.scss');

    const variablesDarkFile = '_variables-dark.scss';

    let variablesDark = '';

    if(existsSync(this.getFilePath(variablesDarkFile))) {
      variablesDark = await this.readSassFile(variablesDarkFile)
    }

    const result = `${functions}
${variables}
${variablesDark}
${this.input}
${this.getSetterServiceCode('!default')}
${this.getCollectorServiceCode()}`;

    return this.removeImports(result);
  }

  removeImports(content: string): string {
    return content.replace(/^@import "variables-dark";.*$/gm, '');
  }

  getFilePath(fileName: string): string {
    return require.resolve(`bootstrap/scss/${fileName}`);
  }

  getSetterServiceCode(postfix = ''): string {
    return Object.keys(this.meta)
      .map((key) => `${this.meta[key]}: dx-empty ${postfix};\n`)
      .join('');
  }

  getCollectorServiceCode(): string {
    const variables = Object.keys(this.meta)
      .map((key) => `${key}: ${this.meta[key]};`)
      .join('');

    return `dx-varibles-collector {${variables}}`;
  }

  async extract(): Promise<ConfigMetaItem[]> {
    const css = await this.compiler(await this.sourceProcessor());
    const serviceCodeRegex = /dx-varibles-collector\s{([\s\S]*)}/;
    const ruleRegex = /([\w-]*):\s(.*);/g;
    const serviceCode = serviceCodeRegex.exec(css)[1];
    const rootVariables = await this.getRootVariablesSass();
    const result: ConfigMetaItem[] = [];

    let match = ruleRegex.exec(serviceCode);
    while (match !== null) {
      const key = `$${match[1]}`;
      let valueMatch = match[2];

      if (valueMatch !== 'dx-empty') {
        if (valueMatch.startsWith('var')) {
          const cssVariableName = valueMatch.replace('var(', '').replace(')', '');
          valueMatch = rootVariables.find((item) => item.key === cssVariableName).value;
        }

        const value = BootstrapExtractor.convertRemToPx(valueMatch);
        result.push({ key, value });
      }

      match = ruleRegex.exec(serviceCode);
    }

    return result;
  }
}
