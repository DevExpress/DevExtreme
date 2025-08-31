import React from 'react';
import { Stepper, Item } from 'devextreme-react/stepper';
import { type Orientation } from 'devextreme-react/common';

import { steps } from './data.ts';

interface SteppersProps {
  orientation: Orientation;
  navigationMode: boolean;
  selectOnFocus: boolean;
  rtlMode: boolean;
}

const stepperConfigs = [
  {
    id: 'icons',
    labelId: 'iconsLabel',
    title: 'Icons and Labels',
    fields: ['label', 'icon', 'optional'] as const,
  },
  {
    id: 'numbers',
    labelId: 'numbersLabel',
    title: 'Numbers and Labels',
    fields: ['label', 'optional'] as const,
  },
  {
    id: 'customText',
    labelId: 'customTextLabel',
    title: 'Custom Text',
    fields: ['text'] as const,
  },
];

export default function Steppers({
  orientation,
  navigationMode,
  selectOnFocus,
  rtlMode,
}: SteppersProps) {
  return (
    <React.Fragment>
      {stepperConfigs.map(({ id, labelId, title, fields }) => (
        <div key={id} className="stepper-wrapper">
          <div id={labelId} className="stepper-label">{title}</div>
          <Stepper
            id={id}
            elementAttr={{ 'aria-labelledby': labelId }}
            defaultSelectedIndex={2}
            orientation={orientation}
            linear={navigationMode}
            selectOnFocus={selectOnFocus}
            rtlEnabled={rtlMode}
          >
            {steps.map((step, index) => {
              const itemProps = fields.reduce((acc, field) => {
                acc[field] = step[field];
                return acc;
              }, {} as Record<string, unknown>);

              return <Item key={index} {...itemProps} />;
            })}
          </Stepper>
        </div>
      ))}
    </React.Fragment>
  );
}
