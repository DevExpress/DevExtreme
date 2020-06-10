import React from 'react';
import { citiesPopulation } from './data.js';

import TreeMap, { Tooltip } from 'devextreme-react/tree-map';

function App() {
  return (
    <TreeMap
      id="treemap"
      dataSource={citiesPopulation}
      title="The Most Populated Cities by Continents"
      idField="id"
      parentField="parentId"
    >
      <Tooltip
        enabled={true}
        format="thousands"
        customizeTooltip={customizeTooltip}
      />
    </TreeMap>
  );
}

function customizeTooltip(arg) {
  const data = arg.node.data;

  return {
    text: arg.node.isLeaf() ?
      `<span class="city">${data.name}</span> (${data.country})<br/>Population: ${arg.valueText}` :
      null
  };
}

export default App;
