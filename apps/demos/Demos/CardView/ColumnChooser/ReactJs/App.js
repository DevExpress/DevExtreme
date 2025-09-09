import React, { useState } from 'react';
import CardView, {
  Column,
  CardCover,
  SearchPanel,
  ColumnChooser,
  ColumnChooserSearch,
  ColumnChooserSelection,
} from 'devextreme-react/card-view';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.js';

function altExpr({ First_Name, Last_Name }) {
  return `Photo of ${First_Name} ${Last_Name}`;
}
function imageExpr({ First_Name, Last_Name }) {
  return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
}
function calculateFullName({ First_Name, Last_Name }) {
  return `${First_Name} ${Last_Name}`;
}
const columnChooserModeLabel = { 'aria-label': 'Column Chooser Mode' };
const columnChooserModes = ['dragAndDrop', 'select'];
const App = () => {
  const [columnChooserMode, setColumnChooserMode] = useState('select');
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [selectByClick, setSelectByClick] = useState(true);
  const [allowColumnReordering, setAllowColumnReordering] = useState(false);
  return (
    <React.Fragment>
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
          <div className="option">
            <CheckBox
              text="Allow Column Reordering"
              value={allowColumnReordering}
              onValueChange={setAllowColumnReordering}
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
        <SearchPanel visible={true} />
        <ColumnChooser
          enabled={true}
          mode={columnChooserMode}
          height="340px"
        >
          <ColumnChooserSearch enabled={searchEnabled} />
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
    </React.Fragment>
  );
};
export default App;
