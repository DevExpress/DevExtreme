import { SwatchSass } from '../types/types';

const SWATCH_SELECTOR_PREFIX = '.dx-swatch-';

export default class PreCompiler {
  static createSassForSwatch(outColorScheme: string, sass: string | Buffer): SwatchSass {
    const unchangedParts: string[] = [];
    const importRegex = /@import .*?;\n/g;
    const fontFaceRegex = /@font-face\s*{.*?}\n/gs;
    const replaceHandler = (substring: string): string => {
      unchangedParts.push(substring);
      return '';
    };

    let source = sass.toString();

    source = source
      .replace(importRegex, replaceHandler)
      .replace(fontFaceRegex, replaceHandler);

    const selector: string = SWATCH_SELECTOR_PREFIX + outColorScheme;
    const cleanSass: string = source.replace('@charset "UTF-8";', '');
    return {
      sass: `${unchangedParts.join('')}${selector} { ${cleanSass} };`,
      selector,
    };
  }
}
