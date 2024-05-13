import { Properties } from 'devextreme/ui/toolbar.d';
import Toolbar from 'devextreme-testcafe-models/toolbar/toolbar';
import url from '../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  items: [items],
  disabled: [true, false],
  width: [undefined, 50],
  hint: [undefined, 'hint'],
};

const created = async (t: TestController, optionConfiguration): Promise<void> => {
  const { disabled } = optionConfiguration;

  if (disabled) {
    return;
  }

  const toolbar = new Toolbar(defaultSelector);
  const overflowMenu = toolbar.getOverflowMenu();

  await t
    .click(overflowMenu.element);
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxToolbar',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
