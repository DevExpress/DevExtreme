import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/check_box.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const options: Options<Properties> = {
  value: [true, false, null],
  enableThreeStateBehavior: [true, false],
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
