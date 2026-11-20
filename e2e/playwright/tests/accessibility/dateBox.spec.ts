import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/date_box';
import DateBox from '../../models/dateBox';
import { defaultSelector, testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const now = new Date();

const options: Options<Properties> = {
  value: [undefined, now],
  disabled: [true, false],
  readOnly: [true, false],
  type: ['date', 'time', 'datetime'],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions: Options<Properties> = {
  value: [now],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
  opened: [true],
};

const created = async (page: Page, optionConfiguration: Properties): Promise<void> => {
  const {
    disabled, readOnly, type, value,
  } = optionConfiguration;

  if (
    disabled
    || readOnly
    || (type === 'datetime' && !value)
  ) {
    return;
  }

  const dateBox = new DateBox(page, defaultSelector);

  await dateBox.invoke('open');
};

const a11yCheckConfig = {};

const deferredConfiguration: Configuration<Properties> = {
  component: 'dxDateBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true, false],
    deferRendering: [true],
  },
  created,
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration<Properties> = {
  component: 'dxDateBox',
  name: 'not deferred',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [false],
    deferRendering: [false],
  },
  created,
};

testAccessibility(noDeferredConfiguration);

const standardButtonsConfiguration: Configuration<Properties> = {
  component: 'dxDateBox',
  name: 'standard buttons',
  a11yCheckConfig,
  options: {
    ...buttonsOptions,
    showClearButton: [true, false],
    showDropDownButton: [true, false],
  },
};

testAccessibility(standardButtonsConfiguration);

const customButtonsConfiguration: Configuration<Properties> = {
  component: 'dxDateBox',
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
};

testAccessibility(customButtonsConfiguration);
