import CleanCSS, { Options } from 'clean-css';
import AutoPrefix from 'autoprefixer';
import PostCss from 'postcss';
import commonOptions from './clean-css-options';
// eslint-disable-next-line import/extensions
import { browsersList } from '../data/metadata/dx-theme-builder-metadata';

export default class PostCompiler {
  static addBasePath(css: string | Buffer, basePath: string): string {
    const normalizedPath = `${basePath.replace(/[/\\]$/, '')}/`;
    return css.toString().replace(/(url\()("|')?(icons|fonts)/g, `$1$2${normalizedPath}$3`);
  }

  static addInfoHeader(css: string | Buffer, version: string): string {
    const generatedBy = '* Generated by the DevExpress ThemeBuilder';
    const versionString = `* Version: ${version}`;
    const link = '* http://js.devexpress.com/ThemeBuilder/';

    return `/*${generatedBy}\n${versionString}\n${link}\n*/\n\n${css}`;
  }

  static async cleanCss(css: string): Promise<string> {
    const promiseOptions: Options = { returnPromise: true };
    const options: Options = { ...commonOptions, ...promiseOptions };
    const cleaner = new CleanCSS(options);
    return (await cleaner.minify(css)).styles;
  }

  static async autoPrefix(css: string): Promise<string> {
    return (await PostCss(AutoPrefix({
      overrideBrowserslist: browsersList,
    })).process(css, {
      from: undefined,
    })).css;
  }
}
