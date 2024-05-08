import { Selector } from 'testcafe';
import { Properties } from 'devextreme/ui/html_editor.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../containerQuill.html'));

const markup = '<p>He<em>llo</em></p>';

const options: Options<Properties> = {
  value: [undefined, markup],
  disabled: [true, false],
  readOnly: [true, false],
  hint: [undefined, 'hint'],
  name: ['', 'name'],
  height: [undefined, 300],
  width: [undefined, 300],
  placeholder: ['', 'placeholder'],
  focusStateEnabled: [true],
  imageUpload: [
    undefined,
    {
      tabs: ['file', 'url'],
      fileUploadMode: 'base64',
    },
  ],
  toolbar: [
    undefined,
    {
      items: ['bold', 'color'],
    },
  ],
};

const created = async (t: TestController): Promise<void> => {
  await t.click(Selector('#container'));
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
