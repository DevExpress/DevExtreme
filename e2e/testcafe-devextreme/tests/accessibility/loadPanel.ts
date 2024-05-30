import { Properties } from 'devextreme/ui/load_panel.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  visible: [true],
  showIndicator: [true, false],
  showPane: [true, false],
  message: [undefined, 'message'],
  hint: [undefined, 'hint'],
  delay: [undefined, 3000],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxLoadPanel',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
