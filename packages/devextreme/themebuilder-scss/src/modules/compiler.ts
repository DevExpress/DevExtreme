import * as sass from 'sass-embedded';
// eslint-disable-next-line import/extensions
import { metadata } from '../data/metadata/dx-theme-builder-metadata';
import { parse } from './parse-value';
import { optimizeCss } from './post-compiler';

export enum ImportType {
  Index,
  Color,
  Unknown,
}

export default class Compiler {
  changedVariables: { [key: string]: string } = {};

  importerCache: Record<string, string> = {};

  meta: ThemesMetadata = metadata;

  userItems: ConfigMetaItem[] = [];

  indexFileContent: string;

  static getImportType = (url: string): ImportType => {
    if (url.endsWith('tb_index')) return ImportType.Index;
    if (url.startsWith('tb_')) return ImportType.Color;
    return ImportType.Unknown;
  };

  compile = async (
    file: string,
    items: ConfigMetaItem[],
    options: sass.Options<'async'>,
  ): Promise<CompilerResult> => this.sassCompile(file, items, options, sass.compileAsync);

  compileString = async (
    content: string,
    items: ConfigMetaItem[],
    options: sass.Options<'async'>,
  ): Promise<CompilerResult> => this.sassCompile(content, items, options, sass.compileStringAsync);

  sassCompile = async (
    source: string,
    items: ConfigMetaItem[],
    options: sass.Options<'async'>,
    compile: (source: string, options?: sass.Options<'async'>) => Promise<sass.CompileResult>,
  ): Promise<CompilerResult> => {
    this.changedVariables = {};
    this.userItems = items || [];

    let compilerOptions: sass.Options<'async'> = {
      importers: [{
        // eslint-disable-next-line spellcheck/spell-checker
        canonicalize: this.canonicalize,
        load: this.load,
      }],
      functions: {
        'collector($map)': this.collector,
      },
    };

    compilerOptions = { ...compilerOptions, ...options };

    return new Promise((resolve, reject) => {
      compile(source, compilerOptions)
        .then((data) => {
          resolve({
            result: {
              ...data,
              css: optimizeCss(data.css),
            },
            changedVariables: this.changedVariables,
          });
        })
        .catch((error) => reject(error));
    });
  };

  getMatchingUserItemsAsString(theme: string): string {
    const meta = theme === 'generic' ? this.meta.generic : this.meta.material;
    const themeKeys: string[] = meta.map((item) => item.Key);

    return this.userItems
      .filter((item) => themeKeys.includes(item.key))
      .map((item) => `${item.key}: ${item.value};`)
      .join('');
  }

  // eslint-disable-next-line spellcheck/spell-checker
  canonicalize = (url: string): URL => (url.includes('tb_') ? new URL(`db:${url}`) : null);

  load = (url: URL): sass.ImporterResult => {
    const { pathname: path } = url;
    const importType = Compiler.getImportType(path);

    let content = this.importerCache[path];
    if (!content) {
      content = importType === ImportType.Index
        ? this.indexFileContent
        : this.getMatchingUserItemsAsString(path.replace('tb_', ''));

      this.importerCache[path] = content;
    }

    return {
      contents: content,
      syntax: 'scss',
    } as sass.ImporterResult;
  };

  collector = (maps: sass.SassMap[]): sass.Value => {
    maps.forEach((map) => {
      map.asList.forEach((value) => {
        if (value.get(1) === sass.sassNull) {
          return;
        }

        const key = value.get(0);
        if (!(key instanceof sass.SassString)) {
          return;
        }

        const variableKey = key.text;
        const variableValue = parse(value.get(1));

        this.changedVariables[variableKey] = variableValue;
      });
    });

    return sass.sassNull;
  };
}
