import { Properties } from 'devextreme/ui/toast.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  visible: [true],
  message: [undefined, 'message'],
  hint: [undefined, 'hint'],
  displayTime: [undefined, 3000],
  type: ['custom', 'error', 'info', 'success', 'warning'],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxToast',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
