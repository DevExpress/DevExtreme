import React from 'react';
import Diagram, { Nodes, AutoLayout, Edges, Toolbox, Group } from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.orgItemsDataSource = new ArrayStore({
      key: 'id',
      data: service.getOrgItems()
    });
    this.orgLinksDataSource = new ArrayStore({
      key: 'id',
      data: service.getOrgLinks()
    });
  }

  render() {
    return (
      <Diagram id="diagram">
        <Nodes dataSource={this.orgItemsDataSource} imageUrlExpr="picture">
          <AutoLayout orientation="horizontal" type="tree" />
        </Nodes>
        <Edges dataSource={this.orgLinksDataSource} />
        <Toolbox>
          <Group category="general" title="General" />
          <Group category="orgChart" title="Organizational Chart" expanded={true} />
        </Toolbox>
      </Diagram>
    );
  }
}

export default App;
