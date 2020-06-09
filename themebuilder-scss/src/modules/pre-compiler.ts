const SWATCH_SELECTOR_PREFIX = '.dx-swatch-';

export default class PreCompiler {
  static createSassForSwatch(outColorScheme: string, sass: string | Buffer): SwatchSass {
    const selector: string = SWATCH_SELECTOR_PREFIX + outColorScheme;
    const cleanSass: string = sass.toString().replace('@charset "UTF-8";', '');
    return {
      sass: `${selector} { ${cleanSass} };`,
      selector,
    };
  }
}
