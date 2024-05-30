import { Properties } from 'devextreme/ui/drop_down_box.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const items = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];

const options: Options<Properties> = {
  dataSource: [[], items],
  disabled: [true, false],
  readOnly: [true, false],
  name: [undefined, 'name'],
  text: [undefined, 'Download Trial'],
  label: [undefined, 'label'],
  showClearButton: [true, false],
  showDropDownButton: [true, false],
  opened: [true, false],
  deferRendering: [true, false],
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
  inputAttr: [{ 'aria-label': 'DropDownBox' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxDropDownBox',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
