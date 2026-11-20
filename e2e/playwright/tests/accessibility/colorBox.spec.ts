import type { Properties } from 'devextreme/ui/color_box';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const options: Options<Properties> = {
  value: [undefined, '#f05b41'],
  disabled: [true, false],
  readOnly: [true, false],
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions: Options<Properties> = {
  value: ['#f05b41'],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const deferredConfiguration: Configuration<Properties> = {
  component: 'dxColorBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true, false],
    deferRendering: [true],
  },
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration<Properties> = {
  component: 'dxColorBox',
  name: 'not deferred',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [false],
    deferRendering: [false],
  },
};

testAccessibility(noDeferredConfiguration);

const alphaChanelConfiguration: Configuration<Properties> = {
  component: 'dxColorBox',
  name: 'alpha channel',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true],
    editAlphaChannel: [true],
    deferRendering: [true],
  },
};

testAccessibility(alphaChanelConfiguration);

const standardButtonsConfiguration: Configuration<Properties> = {
  component: 'dxColorBox',
  name: 'standard buttons',
  a11yCheckConfig,
  options: {
    ...buttonsOptions,
    showClearButton: [true, false],
    showDropDownButton: [true, false],
  },
};

testAccessibility(standardButtonsConfiguration);

const customButtonsConfiguration: Configuration<Properties> = {
  component: 'dxColorBox',
  name: 'custom buttons',
  a11yCheckConfig,
  options: {
    ...buttonsOptions,
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
