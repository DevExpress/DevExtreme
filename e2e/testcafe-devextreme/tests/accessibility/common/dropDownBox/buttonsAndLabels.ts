import { Properties } from 'devextreme/ui/drop_down_box.d';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const items = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];

const regularOptions: Options<Properties> = {
  dataSource: [items],
  value: [items[0]],
  label: [undefined, 'label'],
  showClearButton: [true, false],
  showDropDownButton: [true, false],
  inputAttr: [{ 'aria-label': 'DropDownBox' }],
};

const customOptions: Options<Properties> = {
  dataSource: [items],
  value: [items[0]],
  label: [undefined, 'label'],
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
  inputAttr: [{ 'aria-label': 'DropDownBox' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const regularConfiguration: Configuration = {
  component: 'dxDropDownBox',
  a11yCheckConfig,
  options: regularOptions,
};
const customConfiguration: Configuration = {
  component: 'dxDropDownBox',
  a11yCheckConfig,
  options: customOptions,
};

testAccessibility(regularConfiguration);
testAccessibility(customConfiguration);
