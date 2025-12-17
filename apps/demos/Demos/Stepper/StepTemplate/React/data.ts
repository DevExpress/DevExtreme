import type { StepperTypes } from 'devextreme-react/stepper';

export const steps: StepperTypes.Item[] = [{
  text: 'A',
  label: 'Cart',
  icon: 'cart',
}, {
  text: 'B',
  label: 'Shipping Info',
  icon: 'clipboardtasklist',
}, {
  text: 'C',
  label: 'Promo Code',
  icon: 'gift',
  optional: true,
}, {
  text: 'D',
  label: 'Checkout',
  icon: 'packagebox',
}, {
  text: 'E',
  label: 'Ordered',
  icon: 'checkmarkcircle',
}];
