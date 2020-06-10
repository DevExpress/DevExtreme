import React from 'react';
import Diagram, { Nodes, Edges, AutoLayout, Toolbox, Group } from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.orgItemsDataSource = new ArrayStore({
      key: 'this',
      data: service.getOrgItems()
    });
    this.orgLinksDataSource = new ArrayStore({
      key: 'this',
      data: service.getOrgLinks()
    });
  }

  render() {
    return (
      <Diagram id="diagram">
        <Nodes dataSource={this.orgItemsDataSource}>
          <AutoLayout type="tree" />
        </Nodes>
        <Edges dataSource={this.orgLinksDataSource} />
        <Toolbox>
          <Group category="general" title="General" />
        </Toolbox>
      </Diagram>
    );
  }
}

export default App;
