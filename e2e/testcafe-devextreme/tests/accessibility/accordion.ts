import { Properties } from 'devextreme/ui/accordion.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = [{
  ID: 1,
  CompanyName: 'Super Mart of the West',
  Address: '702 SW 8th Street',
  City: 'Bentonville',
}, {
  ID: 2,
  CompanyName: 'Electronics Depot',
  Address: '2455 Paces Ferry Road NW',
  City: 'Atlanta',
}, {
  ID: 3,
  CompanyName: 'K&S Music',
  Address: '1000 Nicllet Mall',
  City: 'Minneapolis',
}, {
  ID: 4,
  CompanyName: 'Tom\'s Club',
  Address: '999 Lake Drive',
  City: 'Issaquah',
}];

const options: Options<Properties> = {
  dataSource: [items],
  collapsible: [true, false],
  disabled: [true, false],
  deferRendering: [true, false],
  hint: [undefined, 'hint'],
  multiple: [true, false],
  focusStateEnabled: [true],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxAccordion',
  a11yCheckConfig,
  options,
};

// testAccessibility(configuration);
