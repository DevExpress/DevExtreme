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
    return functions + this.input + variables;
  }

  lessProcessor(): Promise<string> {
    return Promise.resolve(this.input);
  }

  getServiceCode(): string {
    const variables = Object.keys(this.meta)
      .map((key) => `${key}: ${this.meta[key]};`)
      .join('');

    return `dx-empty {${variables}}`;
  }

  async compile(): Promise<string> {
    const source = await this.sourceProcessor() + this.getServiceCode();
    return this.compiler(source);
  }

  async extract(): Promise<Array<ConfigMetaItem>> {
    const css = await this.compile();
    const ruleRegex = /([\w-]*):\s(.*);/g;
    const result: Array<ConfigMetaItem> = [];

    let match = ruleRegex.exec(css);
    while (match !== null) {
      result.push({ key: `$${match[1]}`, value: match[2] });
      match = ruleRegex.exec(css);
    }

    return result;
  }
}
