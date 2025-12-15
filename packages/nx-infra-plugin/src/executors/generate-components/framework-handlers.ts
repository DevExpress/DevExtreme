import { Framework, ComponentGeneratorTplConfig } from './schema';

export interface GenerationConfig {
  metaData: any;
  components: {
    baseComponent: string;
    extensionComponent: string;
    configComponent: string;
  };
  out: {
    componentsDir: string;
    indexFileName: string;
  };
  widgetsPackage: string;
  typeGenerationOptions: {
    generateReexports: boolean;
    generateCustomTypes: boolean;
  };
  templatingOptions: {
    quotes: string;
    excplicitIndexInImports: boolean;
  };
  unifiedConfig: any;
  componentGeneratorTplConfig?: ComponentGeneratorTplConfig;
}

export interface FrameworkDefaults {
  configName: string;
  generationFunctionName: string;
}

export interface FrameworkHandler {
  getDefaults(): FrameworkDefaults;

  executeGeneration(generateFunction: any, config: GenerationConfig, metaData: any): Promise<void>;
}

function createReactHandler(): FrameworkHandler {
  return {
    getDefaults: () => ({
      configName: 'reactConfig',
      generationFunctionName: 'generateReactComponents',
    }),

    executeGeneration: async (generateFunction, config, metaData) => {
      config.metaData = metaData;
      await generateFunction(config);
    },
  };
}

function createVueHandler(): FrameworkHandler {
  return {
    getDefaults: () => ({
      configName: 'vueConfig',
      generationFunctionName: 'generateVueComponents',
    }),

    executeGeneration: async (generateFunction, config, metaData) => {
      const componentGeneratorTplConfig = config.componentGeneratorTplConfig || {};

      await generateFunction(
        metaData,
        componentGeneratorTplConfig,
        config.out,
        config.widgetsPackage,
        3,
        config.typeGenerationOptions.generateReexports,
        config.templatingOptions,
        config.unifiedConfig,
      );
    },
  };
}

const FRAMEWORK_HANDLERS: Record<Framework, FrameworkHandler> = {
  react: createReactHandler(),
  vue: createVueHandler(),
};

export function getFrameworkHandler(framework: Framework): FrameworkHandler {
  const handler = FRAMEWORK_HANDLERS[framework];
  if (!handler) {
    throw new Error(`Unsupported framework: ${framework}`);
  }
  return handler;
}
