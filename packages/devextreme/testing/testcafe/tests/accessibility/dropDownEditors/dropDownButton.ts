import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { clearTestPage } from '../../../helpers/clearPage';
import { defaultSelector, testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';
import { Properties } from '../../../../../js/ui/drop_down_button.d';
import DropDownButton from '../../../model/dropDownButton';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];

const options: Options<Properties> = {
  dataSource: [[], items],
  // NOTE: Doesn't matter if there are contrast issues
  // stylingMode: ['contained', 'outlined', 'text'],
  // type: ['normal', 'success', 'danger', 'default'],
  text: [undefined, 'Download Trial'],
  icon: [undefined, 'save'],
  splitButton: [true, false],
  disabled: [true, false],
  useSelectMode: [true, false],
  showArrowIcon: [true, false],
};

const created = async (t: TestController, optionConfiguration): Promise<void> => {
  const { disabled } = optionConfiguration;

  if (disabled) {
    return;
  }

  const dropDownButton = new DropDownButton(defaultSelector);

  await ClientFunction(() => {
    (dropDownButton.getInstance() as any).open();
  }, {
    dependencies: { dropDownButton },
  })();
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxDropDownButton',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
