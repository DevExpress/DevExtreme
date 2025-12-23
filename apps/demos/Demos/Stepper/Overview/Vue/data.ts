import { type Orientation } from "devextreme-vue/common";

export interface Step {
  text: string,
  label: string,
  icon: string,
  optional?: boolean,
}

export const steps: Step[] = [
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

export const orientations: Array<{ text: string; value: Orientation }> = [
  { text: 'Horizontal', value: 'horizontal' },
  { text: 'Vertical', value: 'vertical' },
];

export const navigationModes = [
  { text: 'Non-linear', value: false },
  { text: 'Linear', value: true },
];
