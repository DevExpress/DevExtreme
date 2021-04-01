import * as sass from 'sass';
import less from 'less';
import { promises as fs } from 'fs';
import bootstrap3meta from '../data/bootstrap-metadata/bootstrap-metadata';
import bootstrap4meta from '../data/bootstrap-metadata/bootstrap4-metadata';

export default class BootstrapExtractor {
  compiler: (input: string) => Promise<string>;

  sourceProcessor: () => Promise<string>;

  meta: { [key: string]: string };

  input: string;

  constructor(source: string, version: number) {
    this.input = source;
    if (version === 3) {
      this.compiler = BootstrapExtractor.lessRender;
      this.sourceProcessor = this.lessProcessor;
      this.meta = bootstrap3meta;
    } else {
      this.compiler = BootstrapExtractor.sassRender;
      this.sourceProcessor = this.sassProcessor;
      this.meta = bootstrap4meta;
    }
  }

  static readSassFile(fileName: string): Promise<string> {
    const path = require.resolve(`bootstrap/scss/${fileName}`);
    return fs.readFile(path, 'utf8');
  }

  static sassRender(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      sass.render(
        { data: input },
        (error, result) => (error ? reject(error.message) : resolve(result.css.toString())),
      );
    });
  }

  static lessRender(input: string): Promise<string> {
    return new Promise((resolve, reject) => {
      less.render(
        input,
        (error, result) => (error ? reject(error.message) : resolve(result.css)),
      );
    });
  }

  async sassProcessor(): Promise<string> {
    const functions = await BootstrapExtractor.readSassFile('_functions.scss');
    const variables = await BootstrapExtractor.readSassFile('_variables.scss');
    return functions
      + this.input
      + variables
      + this.getSetterServiceCode('!default')
      + this.getCollectorServiceCode();
  }

  lessProcessor(): Promise<string> {
    return Promise.resolve(
      this.getSetterServiceCode()
      + this.input
      + this.getCollectorServiceCode(),
    );
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

  static convertRemToPx(cssValue: string): string {
    const remValueRegex = /(\d*?\.?\d+?)rem([;\s])?/g;
    const replaceHandler = (match: string, value: string, separator: string): string => {
      const pixelsInRem = 16;
      const pxValue = Math.round(parseFloat(value) * pixelsInRem);
      return `${pxValue}px${separator || ''}`;
    };
    return cssValue.replace(remValueRegex, replaceHandler);
  }

  async extract(): Promise<ConfigMetaItem[]> {
    const css = await this.compiler(await this.sourceProcessor());
    const serviceCodeRegex = /dx-varibles-collector\s{([\s\S]*)}/;
    const ruleRegex = /([\w-]*):\s(.*);/g;
    const serviceCode = serviceCodeRegex.exec(css)[1];
    const result: ConfigMetaItem[] = [];

    let match = ruleRegex.exec(serviceCode);
    while (match !== null) {
      const key = `$${match[1]}`;
      const valueMatch = match[2];
      if (valueMatch !== 'dx-empty') {
        const value = BootstrapExtractor.convertRemToPx(valueMatch);
        result.push({ key, value });
      }
      match = ruleRegex.exec(serviceCode);
    }

    return result;
  }
}
