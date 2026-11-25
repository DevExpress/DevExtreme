import type { Properties } from 'devextreme/ui/date_range_box';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const msInDay = 1000 * 60 * 60 * 24;
const now = new Date();
const initialValue = [
  new Date(now.getTime() - msInDay * 3),
  new Date(now.getTime() + msInDay * 3),
];

const options: Options<Properties> = {
  value: [initialValue],
  endDateInputAttr: [{ 'aria-label': 'aria-label' }],
  startDateInputAttr: [{ 'aria-label': 'aria-label' }],
};

const commonOptions: Options<Properties> = {
  ...options,
  disabled: [true, false],
  readOnly: [true, false],
  startDatePlaceholder: [undefined, 'startDatePlaceholder'],
};

const a11yCheckConfig = {};

const deferredConfiguration: Configuration<Properties> = {
  component: 'dxDateRangeBox',
  a11yCheckConfig,
  options: {
    ...commonOptions,
    opened: [true, false],
    deferRendering: [true],
  },
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration<Properties> = {
  component: 'dxDateRangeBox',
  name: 'not deferred',
  a11yCheckConfig,
  options: {
    ...commonOptions,
    opened: [false],
    deferRendering: [false],
  },
};

testAccessibility(noDeferredConfiguration);

const noMultiViewConfiguration: Configuration<Properties> = {
  component: 'dxDateRangeBox',
  name: 'no multi view',
  a11yCheckConfig,
  options: {
    ...commonOptions,
    opened: [true],
    multiView: [false],
    deferRendering: [true],
  },
};

testAccessibility(noMultiViewConfiguration);

const standardButtonsConfiguration: Configuration<Properties> = {
  component: 'dxDateRangeBox',
  name: 'standard buttons',
  a11yCheckConfig,
  options: {
    ...options,
    showClearButton: [true, false],
    showDropDownButton: [true, false],
  },
};

testAccessibility(standardButtonsConfiguration);

const customButtonsConfiguration: Configuration<Properties> = {
  component: 'dxDateRangeBox',
  name: 'custom buttons',
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
};

testAccessibility(customButtonsConfiguration);
