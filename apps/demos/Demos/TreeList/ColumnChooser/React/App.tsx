import React, { useCallback, useState } from 'react';
import {
  TreeList, Column, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection, Position, type TreeListTypes,
} from 'devextreme-react/tree-list';
import { SelectBox } from 'devextreme-react/select-box';
import { CheckBox } from 'devextreme-react/check-box';
import { employees, columnChooserModeLabel } from './data.ts';

const columnChooserModes = [{
  key: 'dragAndDrop' as const,
  name: 'Drag and drop',
}, {
  key: 'select' as const,
  name: 'Select',
}];

const expandedRowKeys = [1, 5];

const searchEditorOptions = { placeholder: 'Search column' };

const App = () => {
  const [mode, setMode] = useState<TreeListTypes.ColumnChooserMode>(columnChooserModes[1].key);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [selectByClick, setSelectByClick] = useState(true);
  const [recursive, setRecursive] = useState(true);

  const isDragMode = mode === columnChooserModes[0].key;

  const onSearchEnabledChange = useCallback((value: boolean | null | undefined) => {
    setSearchEnabled(!!value);
  }, []);

  const onAllowSelectAllChange = useCallback((value: boolean | null | undefined) => {
    setAllowSelectAll(!!value);
  }, []);

  const onSelectByClickChange = useCallback((value: boolean | null | undefined) => {
    setSelectByClick(!!value);
  }, []);

  const onRecursiveChange = useCallback((value: boolean | null | undefined) => {
    setRecursive(!!value);
  }, []);

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
              inputAttr={columnChooserModeLabel}
              onValueChange={setMode}
            />
          </div>
        </div>

        <div className='checkboxes-container'>
          <div className="option">
            <CheckBox
              id="searchEnabled"
              defaultValue={searchEnabled}
              text="Search enabled"
              onValueChange={onSearchEnabledChange}
            />
          </div>
          <div className="option">
            <CheckBox
              id="allowSelectAll"
              defaultValue={allowSelectAll}
              text="Allow select all"
              onValueChange={onAllowSelectAllChange}
              disabled={isDragMode}
            />
          </div>
          <div className="option">
            <CheckBox
              id="selectByClick"
              defaultValue={selectByClick}
              text="Select by click"
              onValueChange={onSelectByClickChange}
              disabled={isDragMode}
            />
          </div>
          <div className="option">
            <CheckBox
              id="recursive"
              defaultValue={recursive}
              text="Recursive"
              onValueChange={onRecursiveChange}
              disabled={isDragMode}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
