import { Properties } from 'devextreme/ui/check_box.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [true, false, null],
  enableThreeStateBehavior: [true],
  disabled: [true, false],
  readOnly: [true, false],
  name: ['', 'name'],
  text: ['', 'text'],
  elementAttr: [{ 'aria-label': 'Checked' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxCheckBox',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
