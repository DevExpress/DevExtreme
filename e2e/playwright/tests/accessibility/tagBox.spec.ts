import { expect, type Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/tag_box';
import { defaultSelector, testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

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
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions: Options<Properties> = {
  dataSource: [items],
  value: [[items[0]]],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const clickTagBox = async (page: Page): Promise<void> => {
  await page.locator(defaultSelector).click();
  await expect(page.locator('.dx-tagbox-popup-wrapper > .dx-overlay-content')).toBeVisible();
};

const created = async (page: Page, optionConfiguration: Properties): Promise<void> => {
  const { disabled, readOnly } = optionConfiguration;

  if (disabled || readOnly) {
    return;
  }

  await clickTagBox(page);
};

const buttonsCreated = async (page: Page): Promise<void> => {
  await clickTagBox(page);
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxTagBox',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);

const standardButtonsConfiguration: Configuration<Properties> = {
  component: 'dxTagBox',
  name: 'standard buttons',
  a11yCheckConfig,
  options: {
    ...buttonsOptions,
    showClearButton: [true, false],
    showDropDownButton: [true, false],
  },
  created: buttonsCreated,
};

testAccessibility(standardButtonsConfiguration);

const customButtonsConfiguration: Configuration<Properties> = {
  component: 'dxTagBox',
  name: 'custom buttons',
  a11yCheckConfig,
  options: {
    ...buttonsOptions,
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
  created: buttonsCreated,
};

testAccessibility(customButtonsConfiguration);

const popupConfiguration: Configuration<Properties> = {
  component: 'dxTagBox',
  name: 'popup',
  a11yCheckConfig,
  options: {
    ...buttonsOptions,
    opened: [true],
    showSelectionControls: [true, false],
  },
};

testAccessibility(popupConfiguration);
