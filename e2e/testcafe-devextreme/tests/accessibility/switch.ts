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
