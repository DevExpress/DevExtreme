import Compiler from './compiler';
import WidgetsHandler from './widgets-handler';
import PreCompiler from './pre-compiler';
import resolveBundle from './bundle-resolver';
import PostCompiler from './post-compiler';
import BootstrapExtractor from './bootstrap-extractor';
import { version } from '../data/metadata/dx-theme-builder-metadata';

export default class CompileManager {
  compiler = new Compiler();

  async compile(config: ConfigSettings): Promise<PackageResult> {
    const bundleOptions = resolveBundle(config.themeName, config.colorScheme);
    const {
      items, widgets, isBootstrap, bootstrapVersion, data,
    } = config;

    const widgetsHandler = new WidgetsHandler(widgets, bundleOptions.file);
    const widgetsLists = await widgetsHandler.getIndexContent();
    this.compiler.indexFileContent = widgetsLists.indexContent;

    let modifiedVariables = items;

    try {
      if (isBootstrap) {
        const bootstrapExtractor = new BootstrapExtractor(data, bootstrapVersion);
        modifiedVariables = await bootstrapExtractor.extract();
      }

      const compileData = await this.compiler.compile(modifiedVariables, bundleOptions);
      let css = compileData.result.css.toString();
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

      css = PostCompiler.addInfoHeader(css, version);

      return {
        compiledMetadata: compileData.changedVariables,
        css,
        widgets: widgetsLists.widgets,
        unusedWidgets: widgetsLists.unusedWidgets,
        swatchSelector,
        version,
      };
    } catch (e) {
      throw new Error(`Compilation failed. bundle: ${bundleOptions}, e: ${e}`);
    }
  }
}
