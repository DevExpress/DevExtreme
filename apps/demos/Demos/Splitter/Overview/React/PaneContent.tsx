import React, { useMemo } from 'react';
  
const dimensionOptions = new Set(['size', 'minSize', 'maxSize'])

export default function PaneContent({data}) {
  
    const getPaneState = (data)=>{
      if (data.resizable !== false && !data.collapsible) {
        return 'Resizable only';
      }
      const resizableText = data.resizable ? 'Resizable' : 'Non-resizable';
      const collapsibleText = data.collapsible ? 'collapsible' : 'non-collapsible';
      
      return `${resizableText} and ${collapsibleText}`;
    }

    const filterDimensionOptions = Object.entries(data)
      .filter(([key]) => dimensionOptions.has(key))
      .map(([key, value]) => ({key, value}));

    return (
      <div className="pane-content">
        <div className="pane-title">{data.paneName}</div>
        <div className="pane-state">{getPaneState(data)}</div>
        {filterDimensionOptions.map((item, index) => (
          <div className="pane-option" key={index}>
            {item.key}: {item.value}
          </div>
        ))}
      </div>
    );
  };
