import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/list.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  dataSource: [[], items],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxCheckBox',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
