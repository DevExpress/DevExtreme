import React, { useCallback, useState } from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.js';

const App = () => {
  const [showColumnLines, setShowColumnLines] = useState(false);
  const [showRowLines, setShowRowLines] = useState(true);
  const [showBorders, setShowBorders] = useState(true);
  const [rowAlternationEnabled, setRowAlternationEnabled] = useState(true);
  const onShowColumnLinesValueChanged = useCallback((e) => {
    setShowColumnLines(e.value);
  }, []);
  const onShowRowLinesValueChanged = useCallback((e) => {
    setShowRowLines(e.value);
  }, []);
  const onShowBordersValueChanged = useCallback((e) => {
    setShowBorders(e.value);
  }, []);
  const onRowAlternationEnabledChanged = useCallback((e) => {
    setRowAlternationEnabled(e.value);
  }, []);
  return (
    <React.Fragment>
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        showColumnLines={showColumnLines}
        showRowLines={showRowLines}
        showBorders={showBorders}
        rowAlternationEnabled={rowAlternationEnabled}
      >
        <Column
          dataField="Prefix"
          width={80}
          caption="Title"
        />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column
          dataField="Position"
          width={130}
        />
        <Column
          dataField="BirthDate"
          width={100}
          dataType="date"
        />
        <Column
          dataField="HireDate"
          width={100}
          dataType="date"
        />
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text="Show Column Lines"
            value={showColumnLines}
            onValueChanged={onShowColumnLinesValueChanged}
          />
        </div>
        &nbsp;
        <div className="option">
          <CheckBox
            text="Show Row Lines"
            value={showRowLines}
            onValueChanged={onShowRowLinesValueChanged}
          />
        </div>
        &nbsp;
        <div className="option">
          <CheckBox
            text="Show Borders"
            value={showBorders}
            onValueChanged={onShowBordersValueChanged}
          />
        </div>
        &nbsp;
        <div className="option">
          <CheckBox
            text="Alternating Row Color"
            value={rowAlternationEnabled}
            onValueChanged={onRowAlternationEnabledChanged}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
export default App;
