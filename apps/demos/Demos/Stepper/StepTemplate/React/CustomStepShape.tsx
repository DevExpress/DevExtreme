import React from 'react';

export default function CustomStepShape(data) {
  return (
    <>
      <div className="dx-step-indicator">
        <i className={`dx-icon dx-icon-${data.icon}`}></i>
      </div>
      <div className="dx-step-label">
        <div className="dx-step-title">{data.title}</div>
        {data.optional && <div className="dx-step-optional-mark">(optional)</div>}
      </div>
    </>
  );
}
