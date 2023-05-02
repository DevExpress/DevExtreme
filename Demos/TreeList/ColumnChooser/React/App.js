import React from 'react';
import {
  TreeList, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position,
} from 'devextreme-react/tree-list';
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

const expandedRowKeys = [1, 5];

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
        <TreeList
          id="employees"
          dataSource={employees}
          columnAutoWidth={true}
          showRowLines={true}
          showBorders={true}
          defaultExpandedRowKeys={expandedRowKeys}
          keyExpr="ID"
          parentIdExpr="Head_ID"
        >
          <Column dataField="Title" caption="Position" />
          <Column dataField="Full_Name" allowHiding={false} />
          <Column dataField="City" />
          <Column dataField="State" />
          <Column caption="Contacts">
            <Column dataField="Mobile_Phone" allowHiding={false} />
            <Column dataField="Email" />
            <Column visible={false} dataField="Skype" />
          </Column>
          <Column dataField="Hire_Date" dataType="date" />
          <ColumnChooser
            enabled={true}
            mode={mode}
          >
            <Position
              my="right top"
              at="right bottom"
              of=".dx-treelist-column-chooser-button"
            />

            <ColumnChooserSearch
              enabled={searchEnabled}
              editorOptions={searchEditorOptions} />

            <ColumnChooserSelection
              allowSelectAll={allowSelectAll}
              selectByClick={selectByClick}
              recursive={recursive} />
          </ColumnChooser>
        </TreeList>
        <div className="options">
          <div className="caption">Options</div>

          <div className="selectboxes-container">
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
          </div>

          <div className='checkboxes-container'>
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
