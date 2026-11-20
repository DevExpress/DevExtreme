import type { Properties } from 'devextreme/ui/autocomplete';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items = ['Item_1', 'Item_2', 'Item_3'];

const options: Options<Properties> = {
  dataSource: [[], items],
  placeholder: [undefined, 'placeholder'],
  value: [undefined, 'Item_1'],
  disabled: [true, false],
  readOnly: [true, false],
  searchTimeout: [0],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const buttonsOptions: Options<Properties> = {
  dataSource: [[], items],
  value: ['Item_1'],
  label: [undefined, 'label'],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const deferredConfiguration: Configuration<Properties> = {
  component: 'dxAutocomplete',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true, false],
    deferRendering: [true],
  },
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration<Properties> = {
  component: 'dxAutocomplete',
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
  component: 'dxAutocomplete',
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
  component: 'dxAutocomplete',
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
