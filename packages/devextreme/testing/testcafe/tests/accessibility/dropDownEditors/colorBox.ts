import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { clearTestPage } from '../../../helpers/clearPage';
import { defaultSelector, testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';
import { Properties } from '../../../../../js/ui/color_box.d';
import ColorBox from '../../../model/colorbox';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const options: Options<Properties> = {
  value: [undefined, '#f05b41'],
  disabled: [true, false],
  readOnly: [true, false],
  editAlphaChannel: [true, false],
  placeholder: [undefined, 'placeholder'],
  applyValueMode: ['instantly', 'useButtons'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
  buttons: [
    undefined,
    [
      {
        name: 'today',
        location: 'before',
        options: {
          text: 'Today',
          stylingMode: 'text',
          onClick: () => {},
        },
      },
    ],
  ],
};

const created = async (t: TestController, optionConfiguration): Promise<void> => {
  const { disabled, readOnly } = optionConfiguration;

  if (disabled || readOnly) {
    return;
  }

  const colorBox = new ColorBox(defaultSelector);

  await ClientFunction(() => {
    (colorBox.getInstance() as any).open();
  }, {
    dependencies: { colorBox },
  })();
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
