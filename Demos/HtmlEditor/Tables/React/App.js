import React from 'react';

import HtmlEditor, {
  TableContextMenu,
  TableResizing,
  Toolbar,
  Item,
} from 'devextreme-react/html-editor';
import { CheckBox } from 'devextreme-react/check-box';
import { markup } from './data.js';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      allowResizing: true,
      contextMenuEnabled: true,
    };

    this.tableResizingChanged = this.tableResizingChanged.bind(this);
    this.tableContextMenuChanged = this.tableContextMenuChanged.bind(this);
  }

  render() {
    return (
      <div className="widget-container">
        <HtmlEditor
          height="750px"
          defaultValue={markup}
        >
          <TableContextMenu enabled={this.state.contextMenuEnabled} />
          <TableResizing enabled={this.state.allowResizing} />
          <Toolbar>
            <Item name="bold" />
            <Item name="color" />
            <Item name="separator" />
            <Item name="alignLeft" />
            <Item name="alignCenter" />
            <Item name="alignRight" />
            <Item name="separator" />
            <Item name="insertTable" />
            <Item name="insertHeaderRow" />
            <Item name="insertRowAbove" />
            <Item name="insertRowBelow" />
            <Item name="separator" />
            <Item name="insertColumnLeft" />
            <Item name="insertColumnRight" />
            <Item name="separator" />
            <Item name="deleteColumn" />
            <Item name="deleteRow" />
            <Item name="deleteTable" />
            <Item name="separator" />
            <Item name="cellProperties" />
            <Item name="tableProperties" />
          </Toolbar>
        </HtmlEditor>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              text="Allow Table Resizing"
              value={this.state.allowResizing}
              onValueChanged={this.tableResizingChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Enable Table Context Menu"
              value={this.state.contextMenuEnabled}
              onValueChanged={this.tableContextMenuChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  tableResizingChanged(e) {
    this.setState({
      allowResizing: e.value,
    });
  }

  tableContextMenuChanged(e) {
    this.setState({
      contextMenuEnabled: e.value,
    });
  }
}

export default App;
