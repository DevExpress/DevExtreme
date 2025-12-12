import React from 'react';

interface LabelOnlyData {
  label: string;
}

export default function LabelOnly(data: LabelOnlyData) {
  return (
    <div className="dx-step-caption">
      <div className="dx-step-label">{data.label}</div>
    </div>
  );
}
