import Compiler from './compiler';
import PreCompiler from './pre-compiler';
import resolveBundle from './bundle-resolver';
import PostCompiler from './post-compiler';

export default class CompileManager {
  compiler = new Compiler();

  async compile(config: ConfigSettings): Promise<PackageResult> {
    const bundle = resolveBundle(config.themeName, config.colorScheme);
    const { items } = config;

    try {
      const data = await this.compiler.compile(bundle, items, null);
      let css = data.result.css.toString();

      if (config.makeSwatch) {
        const swatchSass = PreCompiler.createSassForSwatch(config.outColorScheme, css);
        const swatchResult = await this.compiler.compile(bundle, [], { data: swatchSass });
        css = swatchResult.result.css.toString();
      }

      if (config.assetsBasePath) {
        css = PostCompiler.addBasePath(css, config.assetsBasePath);
      }

      return {
        compiledMetadata: data.changedVariables,
        css: css.toString(),
      };
    } catch (e) {
      throw new Error(`Compilation failed. bundle: ${bundle}, e: ${e}`);
    }
  }
}
