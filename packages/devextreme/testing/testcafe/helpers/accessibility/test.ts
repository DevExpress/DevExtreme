import { ElementContext } from 'axe-core';
import createWidget, { WidgetName } from '../createWidget';
import { isMaterialBased } from '../themeUtils';
import { a11yCheck, A11yCheckOptions } from './utils';
import { generateOptionMatrix, Options } from '../generateOptionMatrix';

export interface Configuration<TComponentOptions=unknown> {
  component: WidgetName;
  options?: Options<TComponentOptions>;
  a11yCheckConfig?: A11yCheckOptions;
  selector?: ElementContext;
  created?: (t: TestController, optionConfiguration?: Options) => Promise<void>;
}

const defaultSelector = '#container';
const defaultOptions = {};
const defaultCreated = async () => {};
const defaultA11yCheckConfig = isMaterialBased() ? {
  runOnly: 'color-contrast',
} : {};

const getOptionConfigurations = (options: Options | undefined) => {
  if (!(options && Object.keys(options).length)) {
    return [defaultOptions];
  }

  const configurations: Options[] = generateOptionMatrix(options);

  return configurations;
};

export const testAccessibility = <TComponentOptions=unknown>(
  configuration: Configuration<TComponentOptions>,
): void => {
  const {
    component,
    options,
    selector = defaultSelector,
    a11yCheckConfig = defaultA11yCheckConfig,
    created = defaultCreated,
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
    });
  });
};
