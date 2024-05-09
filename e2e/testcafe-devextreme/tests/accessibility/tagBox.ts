import { Properties } from 'devextreme/ui/tag_box.d';
import TagBox from 'devextreme-testcafe-models/tagBox';
import url from '../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

const TIME_TO_WAIT = 150;

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = [
  'HD Video Player',
  'SuperHD Video Player',
  'SuperPlasma 50',
];

const options: Options<Properties> = {
  dataSource: [[], items],
  value: [undefined, [items[0]]],
  disabled: [true, false],
  readOnly: [true, false],
  searchEnabled: [true, false],
  searchTimeout: [0],
  showClearButton: [true, false],
  showSelectionControls: [true, false],
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

  const tagBox = new TagBox(defaultSelector);

  await t
    .click(tagBox.element)
    .wait(TIME_TO_WAIT);
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxTagBox',
  a11yCheckConfig,
  options,
  created,
};

// testAccessibility(configuration);
