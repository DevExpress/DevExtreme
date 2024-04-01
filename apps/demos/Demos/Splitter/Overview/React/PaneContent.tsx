import React, { useMemo } from 'react';

export default function PaneContent(paneName: string) {
  const dimensionOptions = new Set(['size', 'minSize', 'maxSize'])

  return function template(data) {
    const getPaneState = useMemo(() => {  
      if (data.resizable !== false && !data.collapsible) {
        return 'Resizable only';
      }
      const resizableText = data.resizable ? 'Resizable' : 'Non-resizable';
      const collapsibleText = data.collapsible ? 'collapsible' : 'non-collapsible';
      
      return `${resizableText} and ${collapsibleText}`;
    }, [data.resizable, data.collapsible]);

    const filterDimensionOptions = useMemo(() => Object.entries(data)
      .filter(([key]) => dimensionOptions.has(key))
      .map(([key, value]) => ({key, value})),
    [data]);

    return (
      <div className="pane-content">
        <div className="pane-title">{paneName}</div>
        <div className="pane-state">{getPaneState}</div>
        {filterDimensionOptions.map((item, index) => (
          <div className="pane-option" key={index}>
            {item.key}: {item.value}
          </div>
        ))}
      </div>
    );
  };
}
