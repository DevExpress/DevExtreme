import { Properties } from 'devextreme/ui/toast.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  visible: [true],
  message: [undefined, 'message'],
  type: ['custom', 'error', 'info', 'success', 'warning'],
};

const a11yCheckConfig = {};

const configuration: Configuration = {
  component: 'dxToast',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
