import React from 'react';

import DataGrid, {
  Column,
  Selection,
  FilterRow,
  Paging
} from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react/select-box';
import { sales } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allMode: 'allPages',
      checkBoxesMode: 'onClick'
    };

    this.onCheckBoxesModeChanged = this.onCheckBoxesModeChanged.bind(this);
    this.onAllModeChanged = this.onAllModeChanged.bind(this);
  }

  render() {
    const { allMode, checkBoxesMode } = this.state;

    return (
      <div>
        <DataGrid
          dataSource={sales}
          showBorders={true}
          keyExpr="orderId"
        >
          <Selection
            mode="multiple"
            selectAllMode={allMode}
            showCheckBoxesMode={checkBoxesMode}
          />
          <FilterRow visible={true} />
          <Paging defaultPageSize={10} />

          <Column dataField="orderId" caption="Order ID" width={90} />
          <Column dataField="city" />
          <Column dataField="country" width={180} />
          <Column dataField="region" />
          <Column dataField="date" dataType="date" />
          <Column dataField="amount" format="currency" width={90} />
        </DataGrid>

        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Select All Mode </span>
            <SelectBox
              id="select-all-mode"
              dataSource={['allPages', 'page']}
              value={allMode}
              disabled={checkBoxesMode === 'none'}
              onValueChanged={this.onAllModeChanged}
            />
          </div>
          <div className="option checkboxes-mode">
            <span>Show Checkboxes Mode </span>
            <SelectBox
              id="show-checkboxes-mode"
              dataSource={['none', 'onClick', 'onLongTap', 'always']}
              value={checkBoxesMode}
              onValueChanged={this.onCheckBoxesModeChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  onCheckBoxesModeChanged({ value }) {
    this.setState({ checkBoxesMode: value });
  }

  onAllModeChanged({ value }) {
    this.setState({ allMode: value });
  }
}

export default App;
