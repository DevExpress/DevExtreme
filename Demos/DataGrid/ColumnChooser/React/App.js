import React from 'react';
import {
  DataGrid, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection,
} from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react/select-box';
import { CheckBox } from 'devextreme-react/check-box';
import { employees } from './data.js';

const columnChooserModes = [{
  key: 'dragAndDrop',
  name: 'Drag and drop',
}, {
  key: 'select',
  name: 'Select',
}];

const searchEditorOptions = { placeholder: 'Search column' };

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: columnChooserModes[1].key,
      searchEnabled: true,
      allowSelectAll: true,
      selectByClick: true,
      recursive: true,
    };

    this.onModeValueChanged = this.onModeValueChanged.bind(this);
    this.onSearchEnabledValueChanged = this.onSearchEnabledValueChanged.bind(this);
    this.onAllowSelectAllValueChanged = this.onAllowSelectAllValueChanged.bind(this);
    this.onSelectByClickValueChanged = this.onSelectByClickValueChanged.bind(this);
    this.onRecursiveValueChanged = this.onRecursiveValueChanged.bind(this);
  }

  render() {
    const {
      mode, searchEnabled, allowSelectAll, selectByClick, recursive,
    } = this.state;

    const isDragMode = mode === columnChooserModes[0].key;

    return (
      <div>
        <DataGrid
          id="employees"
          dataSource={employees}
          columnAutoWidth={true}
          showRowLines={true}
          showBorders={true}
          keyExpr="ID"
        >
          <Column dataField='FirstName' allowHiding={false} />
          <Column dataField='LastName' />
          <Column dataField='Position' />
          <Column dataField='City' />
          <Column dataField='State' />

          <Column caption="Contacts">
            <Column dataField="MobilePhone" allowHiding={false} />
            <Column dataField="Email" />
            <Column dataField="Skype" visible={false} />
          </Column>

          <Column dataField="HireDate" dataType="date" />

          <ColumnChooser enabled={true} mode={mode}>
            <ColumnChooserSearch
              enabled={searchEnabled}
              editorOptions={searchEditorOptions} />

            <ColumnChooserSelection
              allowSelectAll={allowSelectAll}
              selectByClick={selectByClick}
              recursive={recursive} />
          </ColumnChooser>
        </DataGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Column chooser mode</span>
            &nbsp;
            <SelectBox
              items={columnChooserModes}
              value={mode}
              valueExpr="key"
              displayExpr="name"
              onValueChanged={this.onModeValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              id="searchEnabled"
              defaultValue={searchEnabled}
              text="Search enabled"
              onValueChanged={this.onSearchEnabledValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              id="allowSelectAll"
              defaultValue={allowSelectAll}
              text="Allow select all"
              onValueChanged={this.onAllowSelectAllValueChanged}
              disabled={isDragMode}
            />
          </div>
          <div className="option">
            <CheckBox
              id="selectByClick"
              defaultValue={selectByClick}
              text="Select by click"
              onValueChanged={this.onSelectByClickValueChanged}
              disabled={isDragMode}
            />
          </div>
          <div className="option">
            <CheckBox
              id="recursive"
              defaultValue={recursive}
              text="Recursive"
              onValueChanged={this.onRecursiveValueChanged}
              disabled={isDragMode}
            />
          </div>
        </div>
      </div>
    );
  }

  onModeValueChanged(e) {
    this.setState({
      mode: e.value,
    });
  }

  onSearchEnabledValueChanged(e) {
    this.setState({
      searchEnabled: e.value,
    });
  }

  onAllowSelectAllValueChanged(e) {
    this.setState({
      allowSelectAll: e.value,
    });
  }

  onSelectByClickValueChanged(e) {
    this.setState({
      selectByClick: e.value,
    });
  }

  onRecursiveValueChanged(e) {
    this.setState({
      recursive: e.value,
    });
  }
}

export default App;
