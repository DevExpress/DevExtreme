import { Properties } from 'devextreme/ui/slider.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [45],
  disabled: [true, false],
  readOnly: [true, false],
  hint: [undefined, 'hint'],
  name: ['', 'name'],
  height: [undefined, 250],
  width: [undefined, '50%'],
  min: [undefined, 10],
  max: [undefined, 90],
  focusStateEnabled: [true],
  elementAttr: [{ 'aria-label': 'Slider' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxSlider',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
