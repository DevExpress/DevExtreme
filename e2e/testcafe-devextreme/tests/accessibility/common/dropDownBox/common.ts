import { Properties } from 'devextreme/ui/drop_down_box.d';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const items = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];

const commonOptions: Options<Properties> = {
  dataSource: [[], items],
  disabled: [true, false],
  readOnly: [true, false],
  inputAttr: [{ 'aria-label': 'DropDownBox' }],
};

const options: Options<Properties> = {
  ...commonOptions,
  opened: [true, false],
  deferRendering: [true],
};

const noDeferredOptions: Options<Properties> = {
  ...commonOptions,
  opened: [false],
  deferRendering: [false],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxDropDownBox',
  a11yCheckConfig,
  options,
};
const noDeferredConfiguration: Configuration = {
  component: 'dxDropDownBox',
  a11yCheckConfig,
  options: noDeferredOptions,
};

testAccessibility(configuration);
testAccessibility(noDeferredConfiguration);
