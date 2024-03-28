import { ElementContext } from 'axe-core';
import { createWidget } from '../createWidget';
import type { WidgetName } from 'devextreme-testcafe-models/types';
import { isMaterialBased } from '../themeUtils';
import { a11yCheck, A11yCheckOptions } from './utils';
import { generateOptionMatrix, Options } from '../generateOptionMatrix';

export interface Configuration<TComponentOptions = unknown> {
  component: WidgetName;
  options?: Options<TComponentOptions>;
  a11yCheckConfig?: A11yCheckOptions;
  selector?: ElementContext;
  created?: (t: TestController, optionConfiguration?: TComponentOptions) => Promise<void>;
}

export const defaultSelector = '#container';
const defaultOptions = {};
const defaultCreated = async () => {};
const defaultA11yCheckConfig = isMaterialBased() ? {
  runOnly: 'color-contrast',
} : {};

const getOptionConfigurations = <TComponentOptions = unknown>(
  options: Options<TComponentOptions> | undefined,
): TComponentOptions[] => {
  if (!(options && Object.keys(options).length)) {
    return [defaultOptions as TComponentOptions];
  }

  return generateOptionMatrix(options);
};

export const testAccessibility = <TComponentOptions = unknown>(
  configuration: Configuration<TComponentOptions>,
): void => {
  const {
    component,
    options,
    selector = defaultSelector,
    a11yCheckConfig = defaultA11yCheckConfig,
    created = defaultCreated,
  } = configuration;

  const optionConfigurations = getOptionConfigurations(options);

  optionConfigurations.forEach((optionConfiguration, index) => {
    test(`${component}: test with axe #${index}`, async (t) => {
      await a11yCheck(t, a11yCheckConfig, selector, optionConfiguration);
    }).before(async (t) => {
      await createWidget(
        component,
        optionConfiguration,
      );

      await created(t, optionConfiguration);
    });
  });
};
