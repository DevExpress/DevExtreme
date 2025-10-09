import { Properties } from 'devextreme/ui/tag_box.d';
import TagBox from 'devextreme-testcafe-models/tagBox';
import url from '../../../helpers/getPageUrl';
import { defaultSelector, testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';

const TIME_TO_WAIT = 150;

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../container.html'));

const items = [
  'HD Video Player',
  'SuperHD Video Player',
  'SuperPlasma 50',
];

const options: Options<Properties> = {
  dataSource: [items],
  value: [[items[0]]],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const created = async (t: TestController): Promise<void> => {
  const tagBox = new TagBox(defaultSelector);

  await t
    .click(tagBox.element)
    .wait(TIME_TO_WAIT);
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const standardButtonsConfiguration: Configuration = {
  component: 'dxTagBox',
  a11yCheckConfig,
  options: {
    ...options,
    showClearButton: [true, false],
    showDropDownButton: [true, false],
  },
  created,
};

testAccessibility(standardButtonsConfiguration);

const customButtonsConfiguration: Configuration = {
  component: 'dxTagBox',
  a11yCheckConfig,
  options: {
    ...options,
    buttons: [
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
  },
  created,
};

testAccessibility(customButtonsConfiguration);

const popupConfiguration: Configuration = {
  component: 'dxTagBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true],
    showSelectionControls: [true, false],
  },
};

testAccessibility(popupConfiguration);
