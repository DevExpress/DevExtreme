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

const commonOptions: Options<Properties> = {
  dataSource: [[], items],
  value: [undefined, items[0]],
  disabled: [true, false],
  readOnly: [true, false],
  searchEnabled: [true, false],
  searchTimeout: [0],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const options: Options<Properties> = {
  ...commonOptions,
  opened: [true, false],
  deferRendering: [true],
};

const noDeferredOptions: Options<Properties> = {
  ...commonOptions,
  opened: [false],
  deferRendering: [false],
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
const noDeferredConfiguration: Configuration = {
  component: 'dxSelectBox',
  a11yCheckConfig,
  options: noDeferredOptions,
};

testAccessibility(configuration);
testAccessibility(noDeferredConfiguration);
