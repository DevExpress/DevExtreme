import { Properties } from 'devextreme/ui/select_box.d';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const items = [
  'HD Video Player',
  'SuperHD Video Player',
  'SuperPlasma 50',
];

const regularOptions: Options<Properties> = {
  dataSource: [items],
  value: [items[0]],
  label: [undefined, 'label'],
  showClearButton: [true, false],
  showDropDownButton: [true, false],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const customOptions: Options<Properties> = {
  dataSource: [items],
  value: [items[0]],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
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
  component: 'dxSelectBox',
  a11yCheckConfig,
  options: regularOptions,
};
const customConfiguration: Configuration = {
  component: 'dxSelectBox',
  a11yCheckConfig,
  options: customOptions,
};

testAccessibility(regularConfiguration);
testAccessibility(customConfiguration);
