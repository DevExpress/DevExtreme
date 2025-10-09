import { Item, Properties } from 'devextreme/ui/context_menu.d';
import ContextMenu from 'devextreme-testcafe-models/contextMenu';
import url from '../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items: Item[] = [
  { text: 'remove', icon: 'remove', items: [{ text: 'item_1' }, { text: 'item_2' }] },
  { text: 'user', icon: 'user' },
  { text: 'coffee', icon: 'coffee' },
];

const options: Options<Properties> = {
  target: [defaultSelector],
  position: [{ offset: '10 10' }],
  items: [items],
  disabled: [true, false],
  hint: [undefined, 'hint'],
  selectionMode: ['single', 'none'],
};

const created = async (t: TestController): Promise<void> => {
  const contextMenu = new ContextMenu(defaultSelector);

  await contextMenu.show();

  await t.click(contextMenu.items.nth(0));
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxContextMenu',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
