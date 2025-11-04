import { Properties } from 'devextreme/ui/html_editor.d';
import HtmlEditor from 'devextreme-testcafe-models/htmlEditor';
import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const markup = '<p>He<em>llo</em></p>';

const options: Options<Properties> = {
  value: [markup],
  readOnly: [true, false],
  name: ['', 'name'],
  height: [undefined, 300],
  width: [undefined, 300],
  placeholder: ['', 'placeholder'],
  focusStateEnabled: [true],
  toolbar: [
    {
      items: ['bold', 'color'],
    },
  ],
};

const created = async (t: TestController): Promise<void> => {
  await t.click(Selector(defaultSelector));
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxHtmlEditor',
  a11yCheckConfig,
  options,
  created,
  meta: { loadQuill: true },
};

testAccessibility(configuration);

const aiOptions: Options<Properties> = {
  value: [markup],
  focusStateEnabled: [true],
  toolbar: [{ items: ['ai'] }],
  aiIntegration: [
    ({} as any),
    { changeStyle() {} },
    { changeStyle(_, { onComplete }) { onComplete?.('Result'); } },
    { changeStyle(_, { onError }) { onError?.('Error' as any); } },
  ],
};

const aiCreated = async (t: TestController): Promise<void> => {
  const htmlEditor = new HtmlEditor('#container');

  await t.click(Selector(defaultSelector));

  await t
    .click(htmlEditor.toolbar.getItemByName('ai'))
    .click(Selector(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(4));

  await t
    .click(Selector(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(4)
      .find(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(0));
};

const aiConfiguration: Configuration = {
  component: 'dxHtmlEditor',
  a11yCheckConfig,
  options: aiOptions,
  created: aiCreated,
  meta: { loadQuill: true },
};

testAccessibility(aiConfiguration);
