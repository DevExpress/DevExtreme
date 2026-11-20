import type { Item, Properties } from 'devextreme/ui/stepper';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const items: Item[] = [
  {
    icon: 'cart',
    label: 'Cart',
  },
  {
    icon: 'cart',
    label: 'Cart',
    isValid: true,
  },
  {
    icon: 'clipboardtasklist',
    label: 'Shipping Info',
    isValid: false,
  },
  {
    icon: 'gift',
    label: 'Promo Code',
    optional: true,
  },
  {
    icon: 'packagebox',
    label: 'Checkout ',
    disabled: true,
  },
  {
    icon: 'packagebox',
    label: 'Checkout ',
    disabled: true,
    isValid: true,
  },
  {
    icon: 'packagebox',
    label: 'Checkout ',
    disabled: true,
    isValid: false,
  },
  {
    icon: 'checkmarkcircle',
    label: 'Ordered',
  },
];

const options: Options<Properties> = {
  dataSource: [items],
  selectedIndex: [0, 7],
  orientation: ['horizontal', 'vertical'],
  width: [800],
  height: [600],
};

const configuration: Configuration<Properties> = {
  component: 'dxStepper',
  options,
};

testAccessibility(configuration);
