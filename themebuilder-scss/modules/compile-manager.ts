import { Compiler } from './compiler';
import { PreCompiler } from './pre-compiler';
import { resolveBundle } from './bundle-resolver';

export class CompileManager {
    compiler = new Compiler();

    async compile(config: ConfigSettings): Promise<any> {
        const bundle = resolveBundle(config.themeName, config.colorScheme);
        const items = config.items;

        try {
            const data = await this.compiler.compile(bundle, items, null);
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
