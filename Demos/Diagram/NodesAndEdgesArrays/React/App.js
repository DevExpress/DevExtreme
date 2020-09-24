import React from 'react';
import Diagram, { Nodes, Edges, AutoLayout, Toolbox, Group } from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.flowNodesDataSource = new ArrayStore({
      key: 'id',
      data: service.getFlowNodes()
    });
    this.flowEdgesDataSource = new ArrayStore({
      key: 'id',
      data: service.getFlowEdges()
    });
  }

  render() {
    return (
      <Diagram id="diagram">
        <Nodes dataSource={this.flowNodesDataSource} idExpr="id" typeExpr="type" textExpr="text">
          <AutoLayout type="layered" />
        </Nodes>
        <Edges dataSource={this.flowEdgesDataSource} idExpr="id" textExpr="text" fromExpr="fromId" toExpr="toId" />
        <Toolbox>
          <Group category="general" title="General" />
        </Toolbox>
      </Diagram>
    );
  }
}

export default App;
