const SWATCH_SELECTOR_PREFIX = '.dx-swatch-';

class PreCompiler {
    constructor() {}

    createSassForSwatch(outColorScheme, sass) {
        const selector = SWATCH_SELECTOR_PREFIX + outColorScheme;
        return `${selector} { ${sass} };`;
    }
}

module.exports = PreCompiler;
