import createWidget, { WidgetName } from './createWidget';
import { a11yCheck, A11yCheckOptions, ElementContext } from './accessibilityUtils';
import { isMaterialBased } from './themeUtils';

export interface Options {
  [key: string]: any[];
}

export interface Configuration {
  component: WidgetName;
  options?: Options;
  a11yCheckConfig?: A11yCheckOptions;
  selector?: ElementContext;
  created?: (t?: any, optionConfiguration?: Options) => Promise<void>;
  after?: (t?: any, optionConfiguration?: Options) => Promise<void>;
}

const defaultSelector = '#container';
const defaultOptions = {};
const defaultCreated = async () => {};
const defaultAfter = async () => {};
const defaultA11yCheckConfig = isMaterialBased() ? {
  runOnly: 'color-contrast',
} : {};

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
  if (!(options && Object.keys(options).length)) {
    return [defaultOptions];
  }

  const configurations: Options[] = generateConfigurations(options);

  return configurations;
};

export const testAccessibility = (configuration: Configuration): void => {
  const {
    component,
    options,
    selector = defaultSelector,
    a11yCheckConfig = defaultA11yCheckConfig,
    created = defaultCreated,
    after = defaultAfter,
  } = configuration;

  const optionConfigurations: Options[] = getOptionConfigurations(options);

  optionConfigurations.forEach((optionConfiguration, index) => {
    test(`${component}: test with axe #${index}`, async (t) => {
      await a11yCheck(t, a11yCheckConfig, selector);
    }).before(async (t) => {
      await createWidget(
        component,
        optionConfiguration,
      );

      await created(t, optionConfiguration);
    }).after(async (t) => { await after(t, optionConfiguration); });
  });
};
