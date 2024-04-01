import React from 'react';

const dimensionOptions = new Set(['size', 'minSize', 'maxSize'])

const getPaneState = (data) => {
  if (data.resizable !== false && !data.collapsible) {
    return 'Resizable only';
  }
  const resizableText = data.resizable ? 'Resizable' : 'Non-resizable';
  const collapsibleText = data.collapsible ? 'collapsible' : 'non-collapsible';
  
  return `${resizableText} and ${collapsibleText}`;
}

const getFilteredDimensionOptions = (data) => {
  return Object.entries(data)
    .filter(([key]) => dimensionOptions.has(key))
    .map(([key, value]) => ({key, value}));
}

const PaneContent = (data) => (
  <div className="pane-content">
    <div className="pane-title">{data.title}</div>
    <div className="pane-state">{getPaneState(data)}</div>
    {getFilteredDimensionOptions(data).map((item, index) => (
      <div className="pane-option" key={index}>
        {item.key}: {item.value}
      </div>
    ))}
  </div>
);

export default PaneContent;
  