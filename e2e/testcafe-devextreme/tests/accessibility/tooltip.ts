import { Properties } from 'devextreme/ui/tooltip.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  visible: [true],
  target: ['#container'],
  width: [50],
  height: [25],
  disabled: [true, false],
};

const a11yCheckConfig = {};

const configuration: Configuration = {
  component: 'dxTooltip',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
