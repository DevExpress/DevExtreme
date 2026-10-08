import React from 'react';
import { Stepper, Item } from 'devextreme-react/stepper';
import type { StepperTypes } from 'devextreme-react/stepper';
import type { Orientation } from 'devextreme-react/common';

import { steps } from './data.ts';
import type { StepperConfig } from './types.ts';

const stepperConfigs: StepperConfig[] = [
  {
    id: 'icons',
    labelId: 'iconsLabel',
    title: 'Icons and Labels',
    fields: ['label', 'icon', 'optional'] as const,
    elementAttr: { 'aria-labelledby': 'iconsLabel' },
  },
  {
    id: 'numbers',
    labelId: 'numbersLabel',
    title: 'Numbers and Labels',
    fields: ['label', 'optional'] as const,
    elementAttr: { 'aria-labelledby': 'numbersLabel' },
  },
  {
    id: 'customText',
    labelId: 'customTextLabel',
    title: 'Custom Text',
    fields: ['text'] as const,
    elementAttr: { 'aria-labelledby': 'customTextLabel' },
  },
];

interface SteppersProps {
  orientation: Orientation;
  navigationMode: boolean;
  selectOnFocus: boolean;
  rtlMode: boolean;
}

export default function Steppers({
  orientation,
  navigationMode,
  selectOnFocus,
  rtlMode,
}: SteppersProps) {
  return (
    <>
      {stepperConfigs.map(({ id, labelId, title, fields, elementAttr }: StepperConfig) => (
        <div key={id} className="stepper-wrapper">
          <div id={labelId} className="stepper-label">{title}</div>
          <Stepper
            id={id}
            elementAttr={elementAttr}
            defaultSelectedIndex={2}
            orientation={orientation}
            linear={navigationMode}
            selectOnFocus={selectOnFocus}
            rtlEnabled={rtlMode}
          >
            {steps.map((step: StepperTypes.Item, index: number) => {
              const itemProps = fields.reduce((acc: Record<string, unknown>, field: keyof StepperTypes.Item): Record<string, unknown> => {
                acc[field] = step[field];
                return acc;
              }, {});

              return <Item key={index} {...itemProps} />;
            })}
          </Stepper>
        </div>
      ))}
    </>
  );
}
