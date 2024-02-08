import React from 'react';
import TreeMap, { Tooltip } from 'devextreme-react/tree-map';
import { citiesPopulation } from './data.js';

const customizeTooltip = (arg) => {
  const { data } = arg.node;
  return {
    text: arg.node.isLeaf()
      ? `<span class="city">${data.name}</span> (${data.country})<br/>Population: ${arg.valueText}`
      : null,
  };
};
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
export default App;
