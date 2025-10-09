import { Properties } from 'devextreme/ui/date_range_box.d';
import url from '../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../container.html'));

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

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const standardButtonsConfiguration: Configuration = {
  component: 'dxDateRangeBox',
  a11yCheckConfig,
  options: {
    ...options,
    showClearButton: [true, false],
    showDropDownButton: [true, false],
  },
};

testAccessibility(standardButtonsConfiguration);

const customButtonsConfiguration: Configuration = {
  component: 'dxDateRangeBox',
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
