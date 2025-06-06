import React, { useState, useRef, useCallback } from 'react';
import CardView, { Column, CardCover, Selection } from 'devextreme-react/card-view';
import SelectBox  from 'devextreme-react/select-box';
import CheckBox  from 'devextreme-react/check-box';
import { employees, Employee } from './data.ts';

function altExpr({ First_Name, Last_Name }: Employee): string {
  return `Photo of ${First_Name} ${Last_Name}`;
}

function imageExpr({ First_Name, Last_Name }: Employee): string {
  return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
}

function calculateFullName({ First_Name, Last_Name }: Employee): string {
  return `${First_Name} ${Last_Name}`
}

const columnChooserModeLabel = { 'aria-label': 'Column Chooser Mode' };

const App = () => {
  const [columnChooserMode, setColumnChooserMode] = useState<'select' | 'dragAndDrop'>('select');
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [selectByClick, setSelectByClick] = useState(true);

  return <>
    <div className="options-panel">
      <div className="caption">Options</div>
      <div className="options-container">
        <div className="option">
          <span>Column Chooser Mode:</span>
          <SelectBox
            dataSource={['dragAndDrop', 'select']}
            inputAttr={columnChooserModeLabel}
            value={columnChooserMode}
            onValueChange={setColumnChooserMode}
          ></SelectBox>
        </div>
        <div className="option">
          <CheckBox
            text="Search Enabled"
            value={searchEnabled}
            onValueChange={setSearchEnabled}
          ></CheckBox>
        </div>
        <div className="option">
          <CheckBox
            text="Allow Select All"
            value={allowSelectAll}
            onValueChange={setAllowSelectAll}
            disabled={columnChooserMode !== 'select'}
          ></CheckBox>
        </div>
        <div className="option">
          <CheckBox
            text="Select By Click On Item"
            value={selectByClick}
            onValueChange={setSelectByClick}
            disabled={columnChooserMode !== 'select'}
          ></CheckBox>
        </div>
      </div>
    </div>
    <CardView
      dataSource={employees}
      keyExpr="ID"
      cardMinWidth={100}
      wordWrapEnabled={true}
      // todo: move to nested
      columnChooser={{
        enabled: true,
        mode: columnChooserMode,
        search: {
          enabled: searchEnabled,
        },
        selection: {
          allowSelectAll,
          selectByClick,
        },
      }}
      // todo: move to nested
      searchPanel={{
        visible: true,
      }}
    >
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
      <Column dataField="Position"/>
      <Column dataField="Department"/>
      <Column dataField="State"/>
      <Column dataField="City"/>
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
