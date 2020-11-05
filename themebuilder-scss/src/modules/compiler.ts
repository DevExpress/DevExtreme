import * as sass from 'sass';
import fiber from 'fibers';
// eslint-disable-next-line import/extensions
import { metadata } from '../data/metadata/dx-theme-builder-metadata';
import DartClient from './dart-client';

export enum ImportType {
  Index,
  Color,
  Unknown
}

export default class Compiler {
  changedVariables: { [key: string]: string } = {};

  importerCache: Record<string, string> = {};

  meta: ThemesMetadata = metadata;

  userItems: ConfigMetaItem[] = [];

  indexFileContent: string;

  dartClient = new DartClient();

  async compile(
    items: ConfigMetaItem[],
    options: sass.Options,
  ): Promise<CompilerResult> {
    this.changedVariables = {};
    this.userItems = items || [];

    let compilerOptions: sass.Options = {
      importer: this.setter.bind(this),
      functions: {
        'collector($map)': this.collector.bind(this),
      },
      fiber,
    };

    compilerOptions = { ...compilerOptions, ...options };

    await this.dartClient.check();

    return new Promise((resolve, reject) => {
      const compiler = this.dartClient.isServerAvailable
        ? this.dartCompiler
        : this.nodeCompiler;

      compiler.bind(this)(compilerOptions, resolve, reject);
    });
  }

  dartCompiler(
    options: sass.Options,
    resolve: (result: CompilerResult) => void,
    reject: (result?: sass.SassError) => void,
  ): void {
    this.dartClient.send({
      items: this.userItems,
      index: this.indexFileContent,
      file: options.file,
      data: options.data,
    }).then((reply) => {
      if (reply.error) {
        reject({
          message: reply.error,
          line: null,
          file: null,
          name: null,
          column: null,
          status: null,
        });
      } else {
        resolve({
          result: {
            css: Buffer.from(reply.css),
            map: null,
            stats: null,
          },
          changedVariables: reply.changedVariables,
        });
      }
    });
  }

  nodeCompiler(
    options: sass.Options,
    resolve: (result: CompilerResult) => void,
    reject: (result: sass.SassError) => void,
  ): void {
    sass.render(options, (error, result) => {
      this.importerCache = {};
      if (error) reject(error);
      else {
        resolve({
          result,
          changedVariables: this.changedVariables,
        });
      }
    });
  }

  static getImportType(url: string): ImportType {
    if (url.endsWith('tb_index')) return ImportType.Index;
    if (url.startsWith('tb_')) return ImportType.Color;
    return ImportType.Unknown;
  }

  getMatchingUserItemsAsString(theme: string): string {
    const meta = theme === 'generic' ? this.meta.generic : this.meta.material;
    const themeKeys: string[] = meta.map((item) => item.Key);

    return this.userItems
      .filter((item) => themeKeys.includes(item.key))
      .map((item) => `${item.key}: ${item.value};`)
      .join('');
  }

  setter(url: string): sass.ImporterReturnType {
    const importType = Compiler.getImportType(url);

    if (importType === ImportType.Unknown) {
      return null;
    }

    let content = this.importerCache[url];

    if (!content) {
      content = importType === ImportType.Index
        ? this.indexFileContent
        : this.getMatchingUserItemsAsString(url.replace('tb_', ''));

      this.importerCache[url] = content;
    }

    return { contents: content };
  }

  collector(map: sass.types.Map): sass.types.ReturnValue {
    for (let mapIndex = 0; mapIndex < map.getLength(); mapIndex += 1) {
      const variableKey = (map.getKey(mapIndex) as sass.types.String).getValue();
      const variableValue = map.getValue(mapIndex).toString();

      // eslint-disable-next-line no-continue
      if (variableValue === 'null') continue;

      this.changedVariables[variableKey] = variableValue;
    }
    return sass.types.Null.NULL;
  }
}
