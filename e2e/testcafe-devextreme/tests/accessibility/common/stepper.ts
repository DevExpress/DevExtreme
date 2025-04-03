import { Item, Properties } from 'devextreme/ui/stepper.d';
import url from '../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../helpers/accessibility/test';
import { Options } from '../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../container.html'));

const items: Item[] = [
  {
    icon: 'cart',
    title: 'Cart',
  },
  {
    icon: 'cart',
    title: 'Cart',
    isValid: true,
  },
  {
    icon: 'clipboardtasklist',
    title: 'Shipping Info',
    isValid: false,
  },
  {
    icon: 'gift',
    title: 'Promo Code',
    optional: true,
  },
  {
    icon: 'packagebox',
    title: 'Checkout ',
    disabled: true,
  },
  {
    icon: 'packagebox',
    title: 'Checkout ',
    disabled: true,
    isValid: true,
  },
  {
    icon: 'packagebox',
    title: 'Checkout ',
    disabled: true,
    isValid: false,
  },
  {
    icon: 'checkmarkcircle',
    title: 'Ordered',
  },
];

const options: Options<Properties> = {
  dataSource: [items],
  selectOnFocus: [true, false],
  selectedIndex: [0, 7],
  linear: [true, false],
  orientation: ['horizontal', 'vertical'],
  width: [800],
  height: [600],
};

const created = async (t: TestController): Promise<void> => {
  await t.pressKey('tab');
};

const a11yCheckConfig = {
  rules: { 'aria-allowed-attr': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxStepper',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
