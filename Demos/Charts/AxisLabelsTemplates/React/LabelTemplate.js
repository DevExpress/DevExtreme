import React from 'react';

export function LabelTemplate(data) {
  return (<svg overflow="visible"><image filter="url(#DevExpress_shadow_filter)" y="0" width="60" height="40"
    href={getFilePath(data.valueText)}></image>
  <text className="template-text" x="30" y="59" textAnchor="middle">{data.valueText}</text></svg>);
}

function getFilePath(text) {
  return `../../../../images/flags/3x2/${text.toLowerCase().replace(' ', '')}.svg`;
}
