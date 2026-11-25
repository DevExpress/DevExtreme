import type { Properties } from 'devextreme/ui/select_box';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

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
  placeholder: [undefined, 'placeholder'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions: Options<Properties> = {
  dataSource: [items],
  value: [items[0]],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const deferredConfiguration: Configuration<Properties> = {
  component: 'dxSelectBox',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true, false],
    deferRendering: [true],
  },
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration<Properties> = {
  component: 'dxSelectBox',
  name: 'not deferred',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [false],
    deferRendering: [false],
  },
};

testAccessibility(noDeferredConfiguration);

const standardButtonsConfiguration: Configuration<Properties> = {
  component: 'dxSelectBox',
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
  component: 'dxSelectBox',
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
