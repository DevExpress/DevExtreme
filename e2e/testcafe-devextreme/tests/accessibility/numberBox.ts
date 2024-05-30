import { Properties } from 'devextreme/ui/number_box.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [undefined, 20.5],
  disabled: [true, false],
  readOnly: [true, false],
  showClearButton: [true, false],
  showSpinButtons: [true, false],
  mode: ['number', 'tel', 'text'],
  min: [undefined, 10],
  max: [undefined, 90],
  label: ['', 'label'],
  name: ['', 'name'],
  // NOTE: Doesn't matter if there are contrast issues
  // stylingMode: ['outlined', 'filled', 'underlined'],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxNumberBox',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
