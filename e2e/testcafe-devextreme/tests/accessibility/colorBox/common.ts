import { Properties } from 'devextreme/ui/color_box.d';
import url from '../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../container.html'));

const options: Options<Properties> = {
  value: [undefined, '#f05b41'],
  disabled: [true, false],
  readOnly: [true, false],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const deferredConfiguration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true, false],
    deferRendering: [true],
  },
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [false],
    deferRendering: [false],
  },
};

testAccessibility(noDeferredConfiguration);

const alphaChanelConfiguration: Configuration = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true],
    editAlphaChannel: [true],
    deferRendering: [true],
  },
};

testAccessibility(alphaChanelConfiguration);
