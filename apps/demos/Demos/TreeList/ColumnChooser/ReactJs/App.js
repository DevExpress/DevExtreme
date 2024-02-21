import React, { useState } from 'react';
import {
  TreeList,
  Column,
  ColumnChooser,
  ColumnChooserSearch,
  ColumnChooserSelection,
  Position,
} from 'devextreme-react/tree-list';
import { SelectBox } from 'devextreme-react/select-box';
import { CheckBox } from 'devextreme-react/check-box';
import { employees, columnChooserModeLabel } from './data.js';

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
const expandedRowKeys = [1, 5];
const searchEditorOptions = { placeholder: 'Search column' };
const App = () => {
  const [mode, setMode] = useState(columnChooserModes[1].key);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [selectByClick, setSelectByClick] = useState(true);
  const [recursive, setRecursive] = useState(true);
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
        <Column
          dataField="Title"
          caption="Position"
        />
        <Column
          dataField="Full_Name"
          allowHiding={false}
        />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column caption="Contacts">
          <Column
            dataField="Mobile_Phone"
            allowHiding={false}
          />
          <Column dataField="Email" />
          <Column
            visible={false}
            dataField="Skype"
          />
        </Column>
        <Column
          dataField="Hire_Date"
          dataType="date"
        />
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
            editorOptions={searchEditorOptions}
          />

          <ColumnChooserSelection
            allowSelectAll={allowSelectAll}
            selectByClick={selectByClick}
            recursive={recursive}
          />
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
              inputAttr={columnChooserModeLabel}
              onValueChange={setMode}
            />
          </div>
        </div>

        <div className="checkboxes-container">
          <div className="option">
            <CheckBox
              id="searchEnabled"
              defaultValue={searchEnabled}
              text="Search enabled"
              onValueChange={setSearchEnabled}
            />
          </div>
          <div className="option">
            <CheckBox
              id="allowSelectAll"
              defaultValue={allowSelectAll}
              text="Allow select all"
              onValueChange={setAllowSelectAll}
              disabled={isDragMode}
            />
          </div>
          <div className="option">
            <CheckBox
              id="selectByClick"
              defaultValue={selectByClick}
              text="Select by click"
              onValueChange={setSelectByClick}
              disabled={isDragMode}
            />
          </div>
          <div className="option">
            <CheckBox
              id="recursive"
              defaultValue={recursive}
              text="Recursive"
              onValueChange={setRecursive}
              disabled={isDragMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
