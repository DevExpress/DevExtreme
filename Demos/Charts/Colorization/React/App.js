import React from 'react';
import TreeMap, { Tooltip } from 'devextreme-react/tree-map';
import SelectBox from 'devextreme-react/select-box';
import { salesAmount, colorizationOptions, colorizationTypeLabel } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeOptions: colorizationOptions[2].options,
    };
    this.setType = this.setType.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <TreeMap
          id="treemap"
          dataSource={salesAmount}
          title="Sales Amount by Product"
          valueField="salesAmount"
          colorizer={this.state.typeOptions}
        >
          <Tooltip
            enabled={true}
            customizeTooltip={customizeTooltip}
            format="currency"
          />
        </TreeMap>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Colorization Type </span>
            <SelectBox
              dataSource={colorizationOptions}
              displayExpr="name"
              inputAttr={colorizationTypeLabel}
              valueExpr="options"
              width={200}
              value={this.state.typeOptions}
              onValueChanged={this.setType}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  setType(data) {
    this.setState({
      typeOptions: data.value,
    });
  }
}

function customizeTooltip(arg) {
  const { data } = arg.node;

  return {
    text: arg.node.isLeaf() ? `<span class='product'>${data.name}</span><br/>Sales Amount: ${arg.valueText}` : null,
  };
}

export default App;
