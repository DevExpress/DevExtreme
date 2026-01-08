import React, { useRef, useEffect } from 'react';

const dimensionOptions = new Set(['size', 'minSize', 'maxSize', 'collapsedSize']);

interface PaneContentProps {
  title: string;
  size?: string;
  resizable?: boolean;
  collapsible?: boolean;
  minSize?: string;
  maxSize?: string;
  collapsedSize?: string;
}

const getPaneState = (data: PaneContentProps): string => {
  if (data.resizable !== false && !data.collapsible) {
    return 'Resizable only';
  }
  const resizableText = data.resizable ? 'Resizable' : 'Non-resizable';
  const collapsibleText = data.collapsible ? 'collapsible' : 'non-collapsible';

  return `${resizableText} and ${collapsibleText}`;
};

const getFilteredDimensionOptions = (data: PaneContentProps) => Object.entries(data)
  .filter(([key, value]) => dimensionOptions.has(key) && value)
  .map(([key, value]) => ({ key, value }));

const PaneContent = (data: PaneContentProps) => {
  const paneContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = paneContentRef.current?.parentNode;
    if (element instanceof HTMLElement) {
      element.setAttribute('tabIndex', '0');
    }
  });

  return (
    <div ref={paneContentRef} className="pane-content">
      <div className="pane-title">{data.title}</div>
      <div className="pane-state">{getPaneState(data)}</div>
      {getFilteredDimensionOptions(data).map((item, index) => (
        <div className="pane-option" key={index}>
          {item.key}: {item.value}
        </div>
      ))}
    </div>
  );
};

export default PaneContent;
