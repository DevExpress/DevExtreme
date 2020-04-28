const SWATCH_SELECTOR_PREFIX = '.dx-swatch-';

export class PreCompiler {
    createSassForSwatch(outColorScheme: string, sass: string) {
        const selector: string = SWATCH_SELECTOR_PREFIX + outColorScheme;
        return `${selector} { ${sass} };`;
    }
}

