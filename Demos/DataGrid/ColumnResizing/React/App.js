import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';

import orders from './data.js';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
const resizingModes = ['nextColumn', 'widget'];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: resizingModes[0]
    };
    this.changeResizingMode = this.changeResizingMode.bind(this);
  }

  changeResizingMode(data) {
    this.setState({ mode: data.value });
  }

  render() {
    return (
      <div>
        <DataGrid id="orders"
          dataSource={orders}
          keyExpr="ID"
          showBorders={true}
          allowColumnResizing={true}
          columnResizingMode={this.state.mode}
          columnMinWidth={50}
          columnAutoWidth={true}
          defaultColumns={columns}
        >
        </DataGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Column resizing mode:&nbsp;</span>
            <SelectBox items={resizingModes}
              value={this.state.mode}
              width={250}
              onValueChanged={this.changeResizingMode} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
