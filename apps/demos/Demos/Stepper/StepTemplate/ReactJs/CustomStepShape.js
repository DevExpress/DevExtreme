import React from 'react';

export default function CustomStepShape(data) {
  return (
    <React.Fragment>
      <div className="dx-step-indicator">
        <i className={`dx-icon dx-icon-${data.icon}`}></i>
      </div>
      <div className="dx-step-caption">
        <div className="dx-step-label">{data.label}</div>
        {data.optional && <div className="dx-step-optional-mark">(Optional)</div>}
      </div>
    </React.Fragment>
  );
}
