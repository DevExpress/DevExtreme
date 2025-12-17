import React, { useCallback, useState } from 'react';

import CardView, {
  Column, CardCover, SearchPanel, ColumnChooser, ColumnChooserSearch, ColumnChooserSelection,
} from 'devextreme-react/card-view';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';

import { employees } from './data.ts';
import type { Employee } from './data.ts';

function altExpr({ First_Name, Last_Name }: Employee): string {
  return `Photo of ${First_Name} ${Last_Name}`;
}

function imageExpr({ First_Name, Last_Name }: Employee): string {
  return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
}

function calculateFullName({ First_Name, Last_Name }: Employee): string {
  return `${First_Name} ${Last_Name}`;
}

const columnChooserModeLabel = { 'aria-label': 'Column Chooser Mode' };
const columnChooserModes = ['dragAndDrop', 'select'] as const;

type ColumnChooserMode = typeof columnChooserModes[number];

const App = () => {
  const [columnChooserMode, setColumnChooserMode] = useState<ColumnChooserMode>('select');
  const [searchEnabled, setSearchEnabled] = useState<boolean>(true);
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [selectByClick, setSelectByClick] = useState(true);
  const [allowColumnReordering, setAllowColumnReordering] = useState(false);

  const onSearchEnabledChange = useCallback((value: boolean | null | undefined) => {
    setSearchEnabled(!!value);
  }, []);

  const onAllowSelectAllChange = useCallback((value: boolean | null | undefined) => {
    setAllowSelectAll(!!value);
  }, []);

  const onSelectByClickChange = useCallback((value: boolean | null | undefined) => {
    setSelectByClick(!!value);
  }, []);

  const onAllowColumnReorderingChange = useCallback((value: boolean | null | undefined) => {
    setAllowColumnReordering(!!value);
  }, []);

  return <>
    <div className="options-panel">
      <div className="caption">Options</div>
      <div className="options-container">
        <div className="option">
          <span>Column Chooser Mode:</span>
          <SelectBox
            dataSource={columnChooserModes}
            inputAttr={columnChooserModeLabel}
            value={columnChooserMode}
            onValueChange={setColumnChooserMode}
          ></SelectBox>
        </div>
        <div className="option">
          <CheckBox
            text="Search Enabled"
            value={searchEnabled}
            onValueChange={onSearchEnabledChange}
          ></CheckBox>
        </div>
        <div className="option">
          <CheckBox
            text="Allow Select All"
            value={allowSelectAll}
            onValueChange={onAllowSelectAllChange}
            disabled={columnChooserMode !== 'select'}
          ></CheckBox>
        </div>
        <div className="option">
          <CheckBox
            text="Select By Click On Item"
            value={selectByClick}
            onValueChange={onSelectByClickChange}
            disabled={columnChooserMode !== 'select'}
          ></CheckBox>
        </div>
        <div className="option">
          <CheckBox
            text="Allow Column Reordering"
            value={allowColumnReordering}
            onValueChange={onAllowColumnReorderingChange}
          ></CheckBox>
        </div>
      </div>
    </div>
    <CardView
      dataSource={employees}
      keyExpr="ID"
      cardsPerRow="auto"
      cardMinWidth={300}
      allowColumnReordering={allowColumnReordering}
    >
      <SearchPanel
        visible={true}
      />
      <ColumnChooser
        enabled={true}
        mode={columnChooserMode}
        height="340px"
      >
        <ColumnChooserSearch
          enabled={searchEnabled}
        />
        <ColumnChooserSelection
          allowSelectAll={allowSelectAll}
          selectByClick={selectByClick}
        />
      </ColumnChooser>
      <CardCover
        altExpr={altExpr}
        imageExpr={imageExpr}
      />
      <Column
        dataField="FullName"
        calculateFieldValue={calculateFullName}
        allowHiding={false}
      />
      <Column
        dataField="Birth_Date"
        dataType="date"
      />
      <Column
        dataField="Hire_Date"
        dataType="date"
      />
      <Column dataField="Position" />
      <Column dataField="Department" />
      <Column dataField="State" />
      <Column dataField="City" />
      <Column
        dataField="Phone"
        allowHiding={false}
      />
      <Column
        dataField="Email"
        visible={false}
      />
    </CardView>
  </>;
};

export default App;
