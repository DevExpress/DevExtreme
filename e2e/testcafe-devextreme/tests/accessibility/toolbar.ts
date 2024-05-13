import { Properties } from 'devextreme/ui/toolbar.d';
import Toolbar from 'devextreme-testcafe-models/toolbar/toolbar';
import url from '../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const generateItems = (count) => {
  const items: { text: string; locateInMenu: string }[] = [];

  for (let i = 0; i <= count; i += 1) {
    items.push({ text: `item${i}`, locateInMenu: 'always' });
  }

  return items;
};

const options: Options<Properties> = {
  items: [generateItems(10)],
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
