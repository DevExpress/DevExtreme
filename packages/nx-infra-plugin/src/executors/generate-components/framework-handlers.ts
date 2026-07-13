import { Framework, ComponentGeneratorTplConfig } from './schema';
import { generateAngularComponents } from './angular-generator';

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

function cleanVueMetadata(metaData: any): any {
  if (!metaData) return metaData;

  const cleanProp = (prop: any) => {
    if (prop && Array.isArray(prop.types)) {
      const isFunction =
        /^on[A-Z]/.test(prop.name)
        || prop.types.some(
          (t: any) => t && (t.type === 'Function' || t.acceptableValueType === 'Function'),
        );
      if (isFunction) {
        prop.types = prop.types.filter((t: any) => t && t.type !== 'Null');
      }
    }
    if (prop && Array.isArray(prop.props)) {
      prop.props.forEach(cleanProp);
    }
  };

  if (Array.isArray(metaData.widgets)) {
    metaData.widgets.forEach((widget: any) => {
      if (widget) {
        if (Array.isArray(widget.options)) {
          widget.options.forEach(cleanProp);
        }
        if (Array.isArray(widget.complexOptions)) {
          widget.complexOptions.forEach((co: any) => {
            if (co) {
              if (Array.isArray(co.options)) {
                co.options.forEach(cleanProp);
              }
              if (Array.isArray(co.props)) {
                co.props.forEach(cleanProp);
              }
            }
          });
        }
      }
    });
  }

  return metaData;
}

function createVueHandler(): FrameworkHandler {
  return {
    getDefaults: () => ({
      configName: 'vueConfig',
      generationFunctionName: 'generateVueComponents',
    }),

    executeGeneration: async (generateFunction, config, metaData) => {
      const componentGeneratorTplConfig = config.componentGeneratorTplConfig || {};
      const cleanedMetaData = cleanVueMetadata(JSON.parse(JSON.stringify(metaData)));

      await generateFunction(
        cleanedMetaData,
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

function createAngularHandler(): FrameworkHandler {
  return {
    getDefaults: () => ({
      configName: 'angularConfig',
      generationFunctionName: 'generateAngularComponents',
    }),

    executeGeneration: async (_generateFunction, config, metaData) => {
      return generateAngularComponents(config, metaData);
    },
  };
}

const FRAMEWORK_HANDLERS: Record<Framework, FrameworkHandler> = {
  react: createReactHandler(),
  vue: createVueHandler(),
  angular: createAngularHandler(),
};

export function getFrameworkHandler(framework: Framework): FrameworkHandler {
  const handler = FRAMEWORK_HANDLERS[framework];
  if (!handler) {
    throw new Error(`Unsupported framework: ${framework}`);
  }
  return handler;
}
