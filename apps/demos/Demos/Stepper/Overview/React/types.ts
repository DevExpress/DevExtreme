import type { Orientation } from 'devextreme-react/common';
import type { StepperTypes } from 'devextreme-react/stepper';

export type StepperOrientation = {
  text: string;
  value: Orientation;
};

export type StepperNavigationMode = {
  text: string;
  value: boolean;
};

export type StepperConfig = {
  id: string;
  labelId: string;
  title: string;
  fields: (keyof StepperTypes.Item)[];
};
