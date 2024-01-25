import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from '../../../../js/ui/select_box.d';
import SelectBox from '../../model/selectBox';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items = [
  'HD Video Player',
  'SuperHD Video Player',
  'SuperPlasma 50',
];

const options: Options<Properties> = {
  dataSource: [[], items],
  value: [undefined, items[0]],
  disabled: [true, false],
  readOnly: [true, false],
  searchEnabled: [true, false],
  searchTimeout: [0],
  showClearButton: [true, false],
  placeholder: [undefined, 'placeholder'],
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

  const selectBox = new SelectBox(defaultSelector);
  const { input } = selectBox;

  await t.typeText(input, 'hd');
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxSelectBox',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
