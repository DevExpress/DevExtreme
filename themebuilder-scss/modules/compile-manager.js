const Compiler = require('./compiler');
const PreCompiler = require('./pre-compiler');
const resolveBundle = require('./bundle-resolver');

class CompileManager {
    constructor() {
        this.compiler = new Compiler();
    }

    async compile(config) {
        const bundle = resolveBundle(config.themeName, config.colorScheme);
        const items = config.items;

        try {
            const data = await this.compiler.compile(bundle, items);
            let css = data.result.css;

            if(config.makeSwatch) {
                const preCompiler = new PreCompiler();
                const swatchSass = preCompiler.createSassForSwatch(config.outColorScheme, css);
                const swatchResult = await this.compiler.compile(bundle, [], { data: swatchSass });
                css = swatchResult.result.css;
            }

            return {
                compiledMetadata: data.changedVariables,
                css: css.toString()
            };
        } catch(e) {
            throw new Error(`Compilation failed. bundle: ${bundle}, e: ${e}`);
        }
    }
}

module.exports = CompileManager;
