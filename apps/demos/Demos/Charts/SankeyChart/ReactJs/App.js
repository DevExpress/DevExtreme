import React from 'react';
import Sankey, { Tooltip, Link, Node } from 'devextreme-react/sankey';
import { data } from './data.js';

const customizeLinkTooltip = (info) => ({
  html: `<b>From:</b> ${info.source}<br/><b>To:</b> ${info.target}<br/><b>Weight:</b> ${info.weight}`,
});
function App() {
  return (
    <Sankey
      id="sankey"
      dataSource={data}
      sourceField="source"
      targetField="target"
      weightField="weight"
      title="Commodity Turnover in 2017"
    >
      <Tooltip
        enabled={true}
        customizeLinkTooltip={customizeLinkTooltip}
      ></Tooltip>

      <Link colorMode="gradient"></Link>
      <Node
        width={8}
        padding={30}
      ></Node>
    </Sankey>
  );
}
export default App;
