import React from 'react';
import Diagram, {
  Nodes, Edges, AutoLayout, Toolbox, Group,
} from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

const flowNodesDataSource = new ArrayStore({
  key: 'id',
  data: service.getFlowNodes(),
});
const flowEdgesDataSource = new ArrayStore({
  key: 'id',
  data: service.getFlowEdges(),
});
export default function App() {
  return (
    <Diagram id="diagram">
      <Nodes
        dataSource={flowNodesDataSource}
        typeExpr="type"
        textExpr="text"
      >
        <AutoLayout type="layered" />
      </Nodes>
      <Edges
        dataSource={flowEdgesDataSource}
        textExpr="text"
        fromExpr="fromId"
        toExpr="toId"
      />
      <Toolbox>
        <Group
          category="general"
          title="General"
        />
      </Toolbox>
    </Diagram>
  );
}
