import url from '../../helpers/getPageUrl';
import { clearTestPage } from '../../helpers/clearPage';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import { Properties } from 'devextreme/ui/select_box.d';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'))
  .afterEach(async () => clearTestPage());

const items = [
  'HD Video Player',
  'SuperHD Video Player',
  'SuperPlasma 50',
];

const options: Options<Properties> = {
  dataSource: [[], items],
  value: [undefined, items[0]],
  disabled: [true, false],
  readOnly: [true, false],
  searchEnabled: [true, false],
  searchTimeout: [0],
  showClearButton: [true, false],
  opened: [true, false],
  deferRendering: [true, false],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
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
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const configuration: Configuration = {
  component: 'dxSelectBox',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
