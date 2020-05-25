const SWATCH_SELECTOR_PREFIX = '.dx-swatch-';

export default class PreCompiler {
  static createSassForSwatch(outColorScheme: string, sass: string | Buffer): SwatchSass {
    const selector: string = SWATCH_SELECTOR_PREFIX + outColorScheme;
    return {
      sass: `${selector} { ${sass} };`,
      selector,
    };
  }
}
