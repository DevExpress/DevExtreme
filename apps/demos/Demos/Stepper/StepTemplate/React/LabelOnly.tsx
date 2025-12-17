import React from 'react';

interface LabelOnlyProps {
  label: string;
}

export default function LabelOnly({ label }: LabelOnlyProps) {
  return (
    <div className="dx-step-caption">
      <div className="dx-step-label">{label}</div>
    </div>
  );
}
