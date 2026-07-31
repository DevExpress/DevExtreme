import { ElementContext } from 'axe-core';
import { Properties } from 'devextreme/ui/switch.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration, defaultSelector } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [true, false],
  disabled: [true, false],
  readOnly: [true, false],
  name: ['', 'name'],
};

const a11yCheckConfig = {};

// The ON/OFF captions are decorative in the fluent, dxdsfluent and material themes:
// they are hidden with `color: transparent`, and the caption of the inactive state is
// translated outside the switch, where axe flattens its transparent text against the
// page canvas instead of the page background and reports a bogus contrast violation.
// The switch state is conveyed by aria-checked, so captions are excluded from checks.
const selector: ElementContext = {
  include: [defaultSelector],
  exclude: ['.dx-switch-on', '.dx-switch-off'],
};

const configuration: Configuration = {
  component: 'dxSwitch',
  a11yCheckConfig,
  options,
  selector,
};

testAccessibility(configuration);
