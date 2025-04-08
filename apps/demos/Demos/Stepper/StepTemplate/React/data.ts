import { StepperTypes } from 'devextreme-react/stepper';

export const steps: StepperTypes.Item = [{
  text: 'A',
  title: 'Cart',
  icon: 'cart',
}, {
  text: 'B',
  title: 'Shipping Info',
  icon: 'clipboardtasklist',
}, {
  text: 'C',
  title: 'Promo Code',
  icon: 'gift',
  optional: true,
}, {
  text: 'D',
  title: 'Checkout',
  icon: 'packagebox',
}, {
  text: 'E',
  title: 'Ordered',
  icon: 'checkmarkcircle',
}];
