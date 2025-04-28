import React from 'react';
import { Stepper, Item } from 'devextreme-react/stepper';
import { steps } from './data.js';

const stepperConfigs = [
  {
    id: 'icons',
    labelId: 'iconsLabel',
    title: 'Icons and Labels',
    fields: ['label', 'icon', 'optional'],
  },
  {
    id: 'numbers',
    labelId: 'numbersLabel',
    title: 'Numbers and Labels',
    fields: ['label', 'optional'],
  },
  {
    id: 'customText',
    labelId: 'customTextLabel',
    title: 'Custom Text',
    fields: ['text'],
  },
];

export default function Steppers({
  orientation, navigationMode, selectOnFocus, rtlMode,
}) {
  return (
    <>
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
              }, {});
              return <Item key={index} {...itemProps} />;
            })}
          </Stepper>
        </div>
      ))}
    </>
  );
}
