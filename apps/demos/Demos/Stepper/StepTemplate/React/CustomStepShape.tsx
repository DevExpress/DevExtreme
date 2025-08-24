import React from 'react';
import { type StepperTypes } from 'devextreme-react/stepper';

export default function CustomStepShape(data: StepperTypes.Item) {
  return (
    <>
      <div className="dx-step-indicator">
        <i className={`dx-icon dx-icon-${data.icon}`}></i>
      </div>
      <div className="dx-step-caption">
        <div className="dx-step-label">{data.label}</div>
        {data.optional && <div className="dx-step-optional-mark">(Optional)</div>}
      </div>
    </>
  );
}
