import React from 'react';
import { citiesPopulation } from './data.js';

import TreeMap, { Size, Title, Colorizer } from 'devextreme-react/tree-map';
import TreeMapBreadcrumbs from './TreeMapBreadcrumbs.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drillInfo: []
    };
    this.nodeClick = this.nodeClick.bind(this);
    this.drill = this.drill.bind(this);
    this.drillInfoClick = this.drillInfoClick.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <TreeMap
          dataSource={citiesPopulation}
          interactWithGroup={true}
          maxDepth={2}
          onClick={this.nodeClick}
          onDrill={this.drill}
        >
          <Size height={440} />
          <Colorizer palette="Soft" />
          <Title
            text="The Most Populated Cities by Continents"
            placeholderSize={80}
          />
        </TreeMap>
        <TreeMapBreadcrumbs
          className="drill-down-title"
          onItemClick={this.drillInfoClick}
          treeInfo={this.state.drillInfo}
        />
      </React.Fragment>
    );
  }

  nodeClick(e) {
    e.node.drillDown();
  }

  drill(e) {
    let drillInfo = [];
    for(let node = e.node.getParent(); node; node = node.getParent()) {
      drillInfo.unshift({
        text: node.label() || 'All Continents',
        node: node
      });
    }
    if(drillInfo.length) {
      drillInfo.push({
        text: e.node.label()
      });
    }

    this.setState({ drillInfo });
  }

  drillInfoClick(node) {
    if(node) {
      node.drillDown();
    }
  }
}

export default App;
