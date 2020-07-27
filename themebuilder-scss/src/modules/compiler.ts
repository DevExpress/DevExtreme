import * as sass from 'sass';
import fiber from 'fibers';
// eslint-disable-next-line import/extensions
import { metadata } from '../data/metadata/dx-theme-builder-metadata';

export enum ImportType {
  Index,
  Color,
  Unknown
}

export default class Compiler {
  changedVariables: { [key: string]: string } = {};

  importerCache: Record<string, string> = {};

  meta: Array<MetaItem> = metadata;

  userItems: Array<ConfigMetaItem> = [];

  indexFileContent: string;

  compile(
    items: Array<ConfigMetaItem>,
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

    return new Promise((resolve, reject) => {
      sass.render(compilerOptions, (error, result) => {
        this.importerCache = {};
        if (error) reject(error);
        else {
          resolve({
            result,
            changedVariables: this.changedVariables,
          });
        }
      });
    });
  }

  static getImportType(url: string): ImportType {
    if (url.endsWith('tb_index')) return ImportType.Index;
    if (url.startsWith('tb')) return ImportType.Color;
    return ImportType.Unknown;
  }

  getMatchingUserItemsAsString(url: string): string {
    const metaKeysForUrl: Array<string> = this.meta
      .filter((item) => item.Path === url)
      .map((item) => item.Key);

    return this.userItems
      .filter((item) => metaKeysForUrl.indexOf(item.key) >= 0)
      .map((item) => `${item.key}: ${item.value};`)
      .join('');
  }

  setter(url: string): sass.ImporterReturnType {
    let content = this.importerCache[url];
    const importType = Compiler.getImportType(url);

    if (importType === ImportType.Unknown) {
      return null;
    }

    if (!content) {
      content = importType === ImportType.Index
        ? this.indexFileContent
        : this.getMatchingUserItemsAsString(url);

      this.importerCache[url] = content;
    }

    return { contents: content };
  }

  collector(map: sass.types.Map): sass.types.ReturnValue {
    for (let mapIndex = 1; mapIndex < map.getLength(); mapIndex += 1) {
      const value = map.getValue(mapIndex);
      let variableValue;

      if (value instanceof sass.types.Color) {
        variableValue = `rgba(${value.getR()},${value.getG()},${value.getB()},${value.getA()})`;
      } else if (value instanceof sass.types.String) {
        variableValue = value.getValue();
      } else if (value instanceof sass.types.Number) {
        variableValue = `${value.getValue()}${value.getUnit()}`;
      } else if (value instanceof sass.types.List) {
        const listValues = [];
        for (let listIndex = 0; listIndex < value.getLength(); listIndex += 1) {
          listValues.push(value.getValue(listIndex));
        }
        variableValue = listValues.join(value.getSeparator() ? ',' : ' ');
      } else {
        return sass.types.Null.NULL;
      }

      const variableKey = (map.getKey(mapIndex) as sass.types.String).getValue();
      this.changedVariables[variableKey] = variableValue;
    }
    return sass.types.Null.NULL;
  }
}
