import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Item, Properties } from 'devextreme/ui/tabs.d';
import { isMaterial, isMaterialBased } from '../../helpers/themeUtils';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items: Item[] = [
  { text: 'John Heart' },
  { text: 'Marina Thomas', disabled: true },
  { text: 'Robert Reagan' },
  { text: 'Greta Sims' },
  { text: 'Olivia Peyton' },
  { text: 'Ed Holmes' },
  { text: 'Wally Hobbs' },
  { text: 'Brad Jameson' },
];

const options: Options<Properties> = {
  dataSource: [items],
  rtlEnabled: [true, false],
  orientation: ['horizontal', 'vertical'],
  // @ts-expect-error private option
  selectOnFocus: [true, false],
  showNavButtons: [true, false],
  width: [450],
  height: [250],
  itemHoldTimeout: [5000],
  useInkRipple: [false],
};

const created = async (t: TestController): Promise<void> => {
  await t.pressKey('tab');
};

const a11yCheckConfig = isMaterialBased() ? {
  // NOTE: color-contrast issues in Material
  runOnly: isMaterial() ? '' : 'color-contrast',
  rules: { 'color-contrast': { enabled: !isMaterial() } },
} : {};

const configuration: Configuration = {
  component: 'dxTabs',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
