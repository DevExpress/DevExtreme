import React from 'react';

export default function TitleOnly(data) {
  return (
    <div className="dx-step-label">
      <div className="dx-step-title">{data.title}</div>
    </div>
  );
}
