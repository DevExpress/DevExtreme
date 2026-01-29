import { Properties } from 'devextreme/ui/progress_bar.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  value: [undefined, 45],
  min: [0],
  max: [100],
  disabled: [true, false],
  showStatus: [true, false],
  elementAttr: [{ 'aria-label': 'Progress Bar' }],
};

const configuration: Configuration = {
  component: 'dxProgressBar',
  options,
};

testAccessibility(configuration);
