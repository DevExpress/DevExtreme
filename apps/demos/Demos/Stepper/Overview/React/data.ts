import type { StepperTypes } from 'devextreme-react/stepper';
import type { StepperOption } from './types.ts';

export const steps: StepperTypes.Item[] = [
  {
    text: 'A',
    label: 'Cart',
    icon: 'cart',
  },
  {
    text: 'B',
    label: 'Shipping Info',
    icon: 'clipboardtasklist',
  },
  {
    text: 'C',
    label: 'Promo Code',
    icon: 'gift',
    optional: true,
  },
  {
    text: 'D',
    label: 'Checkout',
    icon: 'packagebox',
  },
  {
    text: 'E',
    label: 'Ordered',
    icon: 'checkmarkcircle',
  },
];

export const orientations: StepperOption[] = [
  { text: 'Horizontal', value: 'horizontal' },
  { text: 'Vertical', value: 'vertical' },
];

export const navigationModes: StepperOption[] = [
  { text: 'Non-linear', value: false },
  { text: 'Linear', value: true },
];
