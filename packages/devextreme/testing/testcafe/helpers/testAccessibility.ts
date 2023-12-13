import createWidget, { WidgetName } from './createWidget';
import { a11yCheck, A11yCheckOptions, ElementContext } from './accessibilityUtils';

export interface Options {
  [key: string]: any[];
}

interface Configuration {
  testName: string;
  component: WidgetName;
  options?: Options;
  a11yCheckConfig?: A11yCheckOptions;
  selector?: ElementContext;
  // before?: (optionConfiguration: Options) => Promise<void>;
  // after?: (optionConfiguration: Options) => Promise<void>;
}

const defaultOptions = {};
// const defaultBefore = async () => {};
// const defaultAfter = async () => {};

const generateConfigurations = (
  options: Options,
  index = 0,
  prevConfigurations: Options[] = [],
) => {
  const keys = Object.keys(options);

  if (index >= keys.length) {
    return [Object.assign({}, ...prevConfigurations)];
  }

  const key = keys[index];
  const values = options[key];

  let configurations: object[] = [];

  values.forEach((value) => {
    const currentConfigurations = [
      ...prevConfigurations,
      { [key]: value },
    ];

    const generatedConfigurations = generateConfigurations(
      options,
      index + 1,
      currentConfigurations,
    );

    configurations = configurations.concat(generatedConfigurations);
  });

  return configurations;
};

const getOptionConfigurations = (options: Options | undefined) => {
  if (!options) {
    return [defaultOptions];
  }

  const configurations: object[] = generateConfigurations(options);

  return configurations;
};

export const testAccessibility = (configuration: Configuration): void => {
  const {
    testName,
    component,
    options,
    a11yCheckConfig,
    selector,
    // before = defaultBefore,
    // after = defaultAfter,
  } = configuration;

  const optionConfigurations = getOptionConfigurations(options);

  optionConfigurations.forEach((optionConfiguration: Options) => {
    test(`${testName}: ${JSON.stringify(optionConfiguration)}`, async (t) => {
      await a11yCheck(t, a11yCheckConfig, selector);
    }).before(async () => {
      await createWidget(
        component,
        optionConfiguration,
      );

      // await before(optionConfiguration);
    });
    // .after(async () => { await after(optionConfiguration); });
  });
};
