import { Options, Configuration } from '../../../helpers/testAccessibility';
import { Item } from '../../../../../js/ui/tabs.d';
import { isMaterial, isMaterialBased } from '../../../helpers/themeUtils';

const items = [
  { text: 'John Heart' },
  { text: 'Marina Thomas', disabled: true },
  { text: 'Robert Reagan' },
  { text: 'Greta Sims' },
  { text: 'Olivia Peyton' },
  { text: 'Ed Holmes' },
  { text: 'Wally Hobbs' },
  { text: 'Brad Jameson' },
] as Item[];

const options: Options = {
  dataSource: [items],
  rtlEnabled: [true, false],
  orientation: ['horizontal', 'vertical'],
  selectOnFocus: [true, false],
  showNavButtons: [true, false],
  width: [450],
  height: [250],
  itemHoldTimeout: [5000],
  useInkRipple: [false],
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const created = async (t: any): Promise<void> => {
  await t.pressKey('tab');
};

const a11yCheckConfig = isMaterialBased() ? {
  // NOTE: color-contrast issues in Material
  runOnly: isMaterial() ? '' : 'color-contrast',
  rules: {
    'color-contrast': {
      // NOTE: color-contrast issues in Material
      enabled: !isMaterial(),
    },
  },
} : {};

export const configuration: Configuration = {
  component: 'dxTabs',
  a11yCheckConfig,
  options,
  created,
};
