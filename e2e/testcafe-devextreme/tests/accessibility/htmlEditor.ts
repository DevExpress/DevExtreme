import { Properties } from 'devextreme/ui/html_editor.d';
import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const markup = '<p>He<em>llo</em></p>';

const options: Options<Properties> = {
  value: [markup],
  readOnly: [true, false],
  hint: [undefined, 'hint'],
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
};

testAccessibility(configuration);
