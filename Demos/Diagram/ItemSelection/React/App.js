import React from 'react';
import Diagram, { Nodes, AutoLayout, Toolbox, PropertiesPanel } from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.dataSource = new ArrayStore({
      key: 'ID',
      data: service.getEmployees()
    });

    this.state = {
      selectedItemNames: 'Nobody has been selected'
    };
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }
  onSelectionChanged({ items }) {
    var selectedItemNames = 'Nobody has been selected';
    items = items
      .filter(function(item) { return item.itemType === 'shape'; })
      .map(function(item) { return item.text; });
    if(items.length > 0) {
      selectedItemNames = items.join(', ');
    }
    this.setState({
      selectedItemNames
    });
  }

  render() {
    return (
      <div>
        <Diagram id="diagram" onSelectionChanged={this.onSelectionChanged}>
          <Nodes dataSource={this.dataSource} keyExpr="ID" textExpr="Full_Name" parentKeyExpr="Head_ID">
            <AutoLayout type="tree" />
          </Nodes>
          <Toolbox visibility="disabled" />
          <PropertiesPanel visibility="disabled" />
        </Diagram>
        <div className="selected-data">
          <span className="caption">Selected Items:</span>{' '}
          <span>
            { this.state.selectedItemNames }
          </span>
        </div>
      </div>
    );
  }
}

export default App;
