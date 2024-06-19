import { Item, Properties } from 'devextreme/ui/menu.d';
import Menu from 'devextreme-testcafe-models/menu';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items: Item[] = [
  {
    text: 'remove',
    icon: 'remove',
    items: [
      {
        text: 'user',
        icon: 'user',
        disabled: true,
        items: [{
          text: 'user_1',
        }],
      },
      {
        text: 'save',
        icon: 'save',
        items: [
          { text: 'export', icon: 'export' },
          { text: 'edit', icon: 'edit' },
        ],
      },
    ],
  },
  { text: 'user', icon: 'user' },
  {
    text: 'coffee',
    icon: 'coffee',
    disabled: true,
  },
];

const options: Options<Properties> = {
  items: [items],
  disabled: [true, false],
  orientation: ['horizontal', 'vertical'],
};

const created = async (t: TestController, optionConfiguration): Promise<void> => {
  const { disabled } = optionConfiguration;

  if (disabled) {
    return;
  }

  const menu = new Menu();

  await t
    .click(menu.getItem(0))
    .pressKey('down')
    .pressKey('down')
    .pressKey('right');
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxMenu',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
