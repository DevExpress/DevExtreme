import { Properties } from 'devextreme/ui/date_range_box.d';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const msInDay = 1000 * 60 * 60 * 24;
const now = new Date();
const initialValue = [
  new Date(now.getTime() - msInDay * 3),
  new Date(now.getTime() + msInDay * 3),
];

const regularOptions: Options<Properties> = {
  value: [initialValue],
  showClearButton: [true, false],
  showDropDownButton: [true, false],
  endDateInputAttr: [{ 'aria-label': 'aria-label' }],
  startDateInputAttr: [{ 'aria-label': 'aria-label' }],
};

const customOptions: Options<Properties> = {
  value: [initialValue],
  endDateInputAttr: [{ 'aria-label': 'aria-label' }],
  startDateInputAttr: [{ 'aria-label': 'aria-label' }],
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
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const regularConfiguration: Configuration = {
  component: 'dxDateRangeBox',
  a11yCheckConfig,
  options: regularOptions,
};
const customConfiguration: Configuration = {
  component: 'dxDateRangeBox',
  a11yCheckConfig,
  options: customOptions,
};

testAccessibility(regularConfiguration);
testAccessibility(customConfiguration);
