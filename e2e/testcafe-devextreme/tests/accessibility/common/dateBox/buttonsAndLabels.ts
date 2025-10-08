import { Properties } from 'devextreme/ui/date_box.d';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const now = new Date();

const regularOptions: Options<Properties> = {
  value: [now],
  label: [undefined, 'label'],
  showClearButton: [true, false],
  showDropDownButton: [true, false],
  inputAttr: [{ 'aria-label': 'aria-label' }],
  opened: [true],
};

const customOptions: Options<Properties> = {
  value: [now],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
  opened: [true],
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
  component: 'dxDateBox',
  a11yCheckConfig,
  options: regularOptions,
};
const customConfiguration: Configuration = {
  component: 'dxDateBox',
  a11yCheckConfig,
  options: customOptions,
};

testAccessibility(regularConfiguration);
testAccessibility(customConfiguration);
