import { Properties } from 'devextreme/ui/autocomplete.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

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

const a11yCheckConfig = {
  rules: {
    // NOTE: color-contrast issues
    'color-contrast': { enabled: false },
  },
};

const deferredConfiguration: Configuration = {
  component: 'dxAutocomplete',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [true, false],
    deferRendering: [true],
  },
};

testAccessibility(deferredConfiguration);

const noDeferredConfiguration: Configuration = {
  component: 'dxAutocomplete',
  a11yCheckConfig,
  options: {
    ...options,
    opened: [false],
    deferRendering: [false],
  },
};

testAccessibility(noDeferredConfiguration);

const standardButtonsConfiguration: Configuration = {
  component: 'dxAutocomplete',
  a11yCheckConfig,
  options: {
    ...buttonsOptions,
    showClearButton: [true, false],
    showDropDownButton: [true, false],
  },
};

testAccessibility(standardButtonsConfiguration);

const customButtonsConfiguration: Configuration = {
  component: 'dxAutocomplete',
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
