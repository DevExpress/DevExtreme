import { Properties } from 'devextreme/ui/drawer.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  disabled: [true, false],
  hint: [undefined, 'hint'],
  revealMode: ['slide', 'expand'],
  opened: [true, false],
  position: ['top', 'bottom', 'left', 'right'],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxDrawer',
  a11yCheckConfig,
  options,
};

// testAccessibility(configuration);
