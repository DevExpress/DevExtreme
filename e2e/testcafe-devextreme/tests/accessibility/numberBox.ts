import { Properties } from 'devextreme/ui/number_box.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [20.5],
  placeholder: [undefined, 'placeholder'],
  disabled: [true, false],
  readOnly: [true, false],
  showClearButton: [true, false],
  showSpinButtons: [true, false],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const configuration: Configuration = {
  component: 'dxNumberBox',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
