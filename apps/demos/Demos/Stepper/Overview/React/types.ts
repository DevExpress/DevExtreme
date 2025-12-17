import type { Orientation } from 'devextreme-react/common';
import type { StepperTypes } from 'devextreme-react/stepper';

export type StepperOption = {
  text: string;
  value: Orientation | boolean;
};

export type StepperConfig = {
  id: string;
  labelId: string;
  title: string;
  fields: (keyof StepperTypes.Item)[];
};
