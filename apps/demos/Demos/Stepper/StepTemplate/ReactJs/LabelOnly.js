import React from 'react';

export default function LabelOnly({ label }) {
  return (
    <div className="dx-step-caption">
      <div className="dx-step-label">{label}</div>
    </div>
  );
}
