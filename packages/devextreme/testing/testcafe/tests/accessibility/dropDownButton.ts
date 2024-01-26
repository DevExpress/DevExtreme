import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/drop_down_button.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];

const options: Options<Properties> = {
  dataSource: [[], items],
  stylingMode: ['contained', 'outlined', 'text'],
  type: ['normal', 'success', 'danger', 'default'],
  text: [undefined, 'Download Trial'],
  icon: [undefined, 'save'],
  splitButton: [true, false],
  disabled: [true, false],
  useSelectMode: [true, false],
  showArrowIcon: [true, false],
  opened: [true, false],
  deferRendering: [true, false],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxDropDownButton',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
