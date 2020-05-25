import Compiler from './compiler';
import WidgetsHandler from './widgets-handler';
import PreCompiler from './pre-compiler';
import resolveBundle from './bundle-resolver';
import PostCompiler from './post-compiler';

export default class CompileManager {
  compiler = new Compiler();

  async compile(config: ConfigSettings): Promise<PackageResult> {
    const bundleOptions = resolveBundle(config.themeName, config.colorScheme);
    const { items, widgets } = config;

    const widgetsHandler = new WidgetsHandler(widgets, bundleOptions.file);
    const widgetsLists = await widgetsHandler.getIndexContent();
    this.compiler.indexFileContent = widgetsLists.indexContent;

    try {
      const data = await this.compiler.compile(items, bundleOptions);
      let css = data.result.css.toString();
      let swatchSelector: string = null;

      if (config.makeSwatch) {
        const swatchSass = PreCompiler.createSassForSwatch(config.outColorScheme, css);
        const swatchResult = await this.compiler.compile([], {
          data: swatchSass.sass,
          ...bundleOptions,
        });

        css = swatchResult.result.css.toString();
        swatchSelector = swatchSass.selector;
      }

      if (config.assetsBasePath) {
        css = PostCompiler.addBasePath(css, config.assetsBasePath);
      }

      return {
        compiledMetadata: data.changedVariables,
        css,
        widgets: widgetsLists.widgets,
        unusedWidgets: widgetsLists.unusedWidgets,
        swatchSelector,
      };
    } catch (e) {
      throw new Error(`Compilation failed. bundle: ${bundleOptions}, e: ${e}`);
    }
  }
}
