import React from 'react';
import {
  DataGrid,
  Column,
  ColumnChooser,
  ColumnChooserSearch,
  ColumnChooserSelection,
  Position,
} from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react/select-box';
import { CheckBox } from 'devextreme-react/check-box';
import { employees } from './data.js';

const columnChooserModes = [
  {
    key: 'dragAndDrop',
    name: 'Drag and drop',
  },
  {
    key: 'select',
    name: 'Select',
  },
];
const searchEditorOptions = { placeholder: 'Search column' };
const columnChooserModeLabel = { 'aria-label': 'Column Chooser Mode' };
const App = () => {
  const [mode, setMode] = React.useState(columnChooserModes[1].key);
  const [searchEnabled, setSearchEnabled] = React.useState(true);
  const [allowSelectAll, setAllowSelectAll] = React.useState(true);
  const [selectByClick, setSelectByClick] = React.useState(true);
  const [recursive, setRecursive] = React.useState(true);
  const isDragMode = mode === columnChooserModes[0].key;
  const onModeValueChanged = React.useCallback((e) => {
    setMode(e.value);
  }, []);
  const onSearchEnabledValueChanged = React.useCallback((e) => {
    setSearchEnabled(e.value);
  }, []);
  const onAllowSelectAllValueChanged = React.useCallback((e) => {
    setAllowSelectAll(e.value);
  }, []);
  const onSelectByClickValueChanged = React.useCallback((e) => {
    setSelectByClick(e.value);
  }, []);
  const onRecursiveValueChanged = React.useCallback((e) => {
    setRecursive(e.value);
  }, []);
  return (
    <div>
      <DataGrid
        id="employees"
        dataSource={employees}
        keyExpr="ID"
        columnAutoWidth={true}
        showRowLines={true}
        width="100%"
        showBorders={true}
      >
        <Column
          dataField="FirstName"
          allowHiding={false}
        />
        <Column dataField="LastName" />
        <Column dataField="Position" />
        <Column dataField="City" />
        <Column dataField="State" />

        <Column caption="Contacts">
          <Column
            dataField="MobilePhone"
            allowHiding={false}
          />
          <Column dataField="Email" />
          <Column
            dataField="Skype"
            visible={false}
          />
        </Column>

        <Column
          dataField="HireDate"
          dataType="date"
        />

        <ColumnChooser
          enabled={true}
          mode={mode}
        >
          <Position
            my="right top"
            at="right bottom"
            of=".dx-datagrid-column-chooser-button"
          />

          <ColumnChooserSearch
            enabled={searchEnabled}
            editorOptions={searchEditorOptions}
          />

          <ColumnChooserSelection
            allowSelectAll={allowSelectAll}
            selectByClick={selectByClick}
            recursive={recursive}
          />
        </ColumnChooser>
      </DataGrid>
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
              inputAttr={columnChooserModeLabel}
              displayExpr="name"
              onValueChanged={onModeValueChanged}
            />
          </div>
        </div>

        <div className="checkboxes-container">
          <div className="option">
            <CheckBox
              id="searchEnabled"
              defaultValue={searchEnabled}
              text="Search enabled"
              onValueChanged={onSearchEnabledValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              id="allowSelectAll"
              defaultValue={allowSelectAll}
              text="Allow select all"
              onValueChanged={onAllowSelectAllValueChanged}
              disabled={isDragMode}
            />
          </div>
          <div className="option">
            <CheckBox
              id="selectByClick"
              defaultValue={selectByClick}
              text="Select by click"
              onValueChanged={onSelectByClickValueChanged}
              disabled={isDragMode}
            />
          </div>
          <div className="option">
            <CheckBox
              id="recursive"
              defaultValue={recursive}
              text="Recursive"
              onValueChanged={onRecursiveValueChanged}
              disabled={isDragMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
