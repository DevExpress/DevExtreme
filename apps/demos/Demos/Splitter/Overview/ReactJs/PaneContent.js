import React, { useRef, useEffect } from 'react';

const dimensionOptions = new Set(['size', 'minSize', 'maxSize', 'collapsedSize']);
const getPaneState = (data) => {
  if (data.resizable !== false && !data.collapsible) {
    return 'Resizable only';
  }
  const resizableText = data.resizable ? 'Resizable' : 'Non-resizable';
  const collapsibleText = data.collapsible ? 'collapsible' : 'non-collapsible';
  return `${resizableText} and ${collapsibleText}`;
};
const getFilteredDimensionOptions = (data) =>
  Object.entries(data)
    .filter(([key, value]) => dimensionOptions.has(key) && value)
    .map(([key, value]) => ({ key, value }));
const PaneContent = (data) => {
  const paneContentRef = useRef(null);
  useEffect(() => {
    const element = paneContentRef.current.parentNode;
    element.setAttribute('tabIndex', '0');
  });
  return (
    <div
      ref={paneContentRef}
      className="pane-content"
    >
      <div className="pane-title">{data.title}</div>
      <div className="pane-state">{getPaneState(data)}</div>
      {getFilteredDimensionOptions(data).map((item, index) => (
        <div
          className="pane-option"
          key={index}
        >
          {item.key}: {item.value}
        </div>
      ))}
    </div>
  );
};
export default PaneContent;
