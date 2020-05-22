import * as sass from 'sass';
import { metadata } from '../data/metadata/dx-theme-builder-metadata';

export default class Compiler {
  changedVariables: Array<MetaItem> = [];

  importerCache: Record<string, string> = {};

  meta: Array<MetaItem> = metadata;

  userItems: Array<ConfigMetaItem> = [];

  compile(
    bundlePath: string,
    items: Array<ConfigMetaItem>,
    customOptions: sass.SyncOptions,
  ): Promise<CompilerResult> {
    this.changedVariables = [];
    this.userItems = items || [];

    let compilerOptions: sass.SyncOptions = {
      file: bundlePath,
      importer: this.setter.bind(this),
      functions: {
        'collector($map)': this.collector.bind(this),
      },
    };

    if (customOptions) {
      compilerOptions = { ...compilerOptions, ...customOptions };
    }

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

    if (!content) {
      content = this.getMatchingUserItemsAsString(url);
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
