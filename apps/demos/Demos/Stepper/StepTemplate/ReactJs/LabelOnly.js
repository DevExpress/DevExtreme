import React from 'react';

export default function LabelOnly(data) {
  return (
    <div className="dx-step-caption">
      <div className="dx-step-label">{data.label}</div>
    </div>
  );
}
