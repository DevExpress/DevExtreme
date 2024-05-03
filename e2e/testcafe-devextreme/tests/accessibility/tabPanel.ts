import { Item, Properties } from 'devextreme/ui/tab_panel.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { isMaterial, isMaterialBased } from '../../helpers/themeUtils';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items: Item[] = [
  { title: 'John Heart', text: 'John Heart' },
  { title: 'Marina Thomas', text: 'Marina Thomas', disabled: true },
  { title: 'Robert Reagan', text: 'Robert Reagan' },
  { title: 'Greta Sims', text: 'Greta Sims' },
  { title: 'Olivia Peyton', text: 'Olivia Peyton' },
  { title: 'Ed Holmes', text: 'Ed Holmes' },
  { title: 'Wally Hobbs', text: 'Wally Hobbs' },
  { title: 'Brad Jameson', text: 'Brad Jameson' },
];

const options: Options<Properties> = {
  dataSource: [[], items],
  showNavButtons: [true, false],
  disabled: [true, false],
  width: [450, 'auto'],
  height: [250, 550],
  // NOTE: Doesn't matter if there are contrast issues
  // stylingMode: ['primary', 'secondary'],
};

const a11yCheckConfig = isMaterialBased() ? {
  // NOTE: color-contrast issues in Material
  runOnly: isMaterial() ? '' : 'color-contrast',
  rules: { 'color-contrast': { enabled: !isMaterial() } },
} : {};

const configuration: Configuration = {
  component: 'dxTabPanel',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
