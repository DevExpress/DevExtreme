import { Item, Properties } from 'devextreme/ui/stepper.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

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

const configuration: Configuration = {
  component: 'dxStepper',
  options,
};

testAccessibility(configuration);
