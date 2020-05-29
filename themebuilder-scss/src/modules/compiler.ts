import * as sass from 'sass';
// eslint-disable-next-line
import { metadata } from '../data/metadata/dx-theme-builder-metadata';

export enum ImportType {
  Index,
  Color,
  Unknown
}

export default class Compiler {
  changedVariables: Array<MetaItem> = [];

  importerCache: Record<string, string> = {};

  meta: Array<MetaItem> = metadata;

  userItems: Array<ConfigMetaItem> = [];

  indexFileContent: string;

  compile(
    items: Array<ConfigMetaItem>,
    options: sass.SyncOptions,
  ): Promise<CompilerResult> {
    this.changedVariables = [];
    this.userItems = items || [];

    let compilerOptions: sass.SyncOptions = {
      importer: this.setter.bind(this),
      functions: {
        'collector($map)': this.collector.bind(this),
      },
    };

    compilerOptions = { ...compilerOptions, ...options };

    return new Promise((resolve, reject) => {
      try {
        const result = sass.renderSync(compilerOptions);
        this.importerCache = {};
        resolve({
          result,
          changedVariables: this.changedVariables,
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  static getImportType(url: string): ImportType {
    if (/^\.\.\/widgets\/(material|generic)\/tb_index$/.test(url)) return ImportType.Index;
    if (/^tb/.test(url)) return ImportType.Color;
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
    const path = (map.getValue(0) as sass.types.String).getValue();

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

      this.changedVariables.push({
        Key: (map.getKey(mapIndex) as sass.types.String).getValue(),
        Value: variableValue,
        Path: path,
      });
    }
    return sass.types.Null.NULL;
  }
}
