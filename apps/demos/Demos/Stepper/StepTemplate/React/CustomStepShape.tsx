import React from 'react';
import { type StepperTypes } from 'devextreme-react/stepper';

export default function CustomStepShape(data: StepperTypes.Item) {
  const { icon, label, optional } = data;

  return (
    <>
      <div className="dx-step-indicator">
        <i className={`dx-icon dx-icon-${icon}`}></i>
      </div>
      <div className="dx-step-caption">
        <div className="dx-step-label">{label}</div>
        {optional && <div className="dx-step-optional-mark">(Optional)</div>}
      </div>
    </>
  );
}
