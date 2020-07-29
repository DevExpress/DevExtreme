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

  meta: ThemesMetadata = metadata;

  userItems: ConfigMetaItem[] = [];

  indexFileContent: string;

  compile(
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
