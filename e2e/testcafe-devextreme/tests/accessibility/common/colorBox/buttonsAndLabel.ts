import { Properties } from 'devextreme/ui/color_box.d';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

const regularOptions: Options<Properties> = {
  value: ['#f05b41'],
  label: [undefined, 'label'],
  showDropDownButton: [true, false],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const customOptions: Options<Properties> = {
  value: ['#f05b41'],
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

const insidePopupOptions: Options<Properties> = {
  value: ['#f05b41'],
  opened: [true],
  editAlphaChannel: [true, false],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const regularConfiguration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options: regularOptions,
};
const customConfiguration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options: customOptions,
};
const insidePopupConfiguration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options: insidePopupOptions,
};

testAccessibility(regularConfiguration);
testAccessibility(customConfiguration);
testAccessibility(insidePopupConfiguration);
