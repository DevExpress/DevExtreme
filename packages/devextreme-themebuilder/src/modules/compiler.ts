import * as sass from 'sass-embedded';
// eslint-disable-next-line import/extensions
import { metadata } from '../data/metadata/dx-theme-builder-metadata';
import { parse, parseString } from './parse-value';
import { optimizeCss } from './post-compiler';

export default class Compiler {
  changedVariables: { [key: string]: string } = {};

  importerCache: Record<string, string> = {};

  meta: ThemesMetadata = metadata;

  userItems: { [key: string]: ConfigMetaItem } = {};

  indexFileContent: string;

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

    if (items) {
      this.userItems = items.reduce((acc: { [key: string]: ConfigMetaItem }, item) => {
        acc[item.key] = item;
        return acc;
      }, {});
    }

    let compilerOptions: sass.Options<'async'> = {
      importers: [{
        // eslint-disable-next-line spellcheck/spell-checker
        canonicalize: this.canonicalize,
        load: this.load,
      }],
      functions: {
        'collector($map)': this.collector,
        'getCustomVar($value)': this.getCustomVar,
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

  // eslint-disable-next-line spellcheck/spell-checker
  canonicalize = (url: string): URL => (url.includes('tb_index') ? new URL(`db:${url}`) : null);

  load = (): sass.ImporterResult => ({
    contents: this.indexFileContent,
    syntax: 'scss',
  } as sass.ImporterResult);

  getCustomVar = (values: sass.Value[]): sass.Value => {
    const customVariable = values[0].get(0);
    const nameVariable = customVariable.get(0) as sass.SassString;

    let result = sass.sassNull;

    const customerVariable = this.userItems[nameVariable.text];
    if (customerVariable) {
      result = parseString(customerVariable.value);
    }

    return result;
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
