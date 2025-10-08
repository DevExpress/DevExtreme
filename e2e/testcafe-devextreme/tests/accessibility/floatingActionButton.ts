import { Properties } from 'devextreme/ui/speed_dial_action.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  label: ['', 'label'],
  hint: [undefined, 'hint'],
  icon: [undefined, 'save'],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxSpeedDialAction',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
