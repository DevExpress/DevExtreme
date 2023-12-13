/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/prefer-for-of */
import createWidget, { WidgetName } from './createWidget';
import { a11yCheck } from './accessibilityUtils';

interface Options {
  [key: string]: any[] | string;
  // [key: string]: any[];
}

interface Configuration {
  component: WidgetName;
  options?: Options;
  before?: (optionConfiguration: any) => Promise<void>;
  after?: (optionConfiguration: any) => Promise<void>;
}

const defaultOptions = {};
const defaultBefore = async () => {};
const defaultAfter = async () => {};

const exampleOptions: Options = {
  height: [undefined, 320],
  items: [[], [{ title: 1 }, { title: 2 }]],
  searchEnabled: [true, false],
  showCheckBoxesMode: ['none', 'normal', 'selectAll'],
  noDataText: [null, 'no data text'],
  displayExpr: 'fullName',
};

const generateConfigurations = (
  options: Options,
  index = 0,
  prevConfigurations: any[] = [],
) => {
  const keys = Object.keys(options);

  if (index >= keys.length) {
    return [Object.assign({}, ...prevConfigurations)];
  }

  const key = keys[index];
  const values = options[key];

  let configurations: object[] = [];

  if (typeof values === 'string') {
    return [Object.assign({}, ...prevConfigurations, { [key]: values })];
  }

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

/**
 * Use this util like a hook to check accessibility with AXE.
 */

export const testAccessibility = (configuration: Configuration): void => {
  const {
    component,
    options,
    before = defaultBefore,
    after = defaultAfter,
  } = configuration;

  const optionConfigurations = getOptionConfigurations(options);

  optionConfigurations.forEach((optionConfiguration: Options) => {
    test('testAccessibility', async (t) => {
      await a11yCheck(t);
    }).before(async () => {
      await createWidget(
        component,
        optionConfiguration,
      );

      await before(optionConfiguration);
    }).after(async () => { await after(optionConfiguration); });
  });
};

testAccessibility({
  component: 'dxTreeView',
  options: exampleOptions,
});
