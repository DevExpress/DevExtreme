import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import { ColumnResizeMode } from 'devextreme/common/grids';

import { orders } from './data.ts';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];
const resizingModes: ColumnResizeMode[] = ['nextColumn', 'widget'];
const columnResizingModeLabel = { 'aria-label': 'Column Resizing Mode' };

const App = () => {
  const [mode, setMode] = React.useState(resizingModes[0]);

  const changeResizingMode = React.useCallback((data: SelectBoxTypes.ValueChangedEvent) => {
    setMode(data.value);
  }, []);

  return (
    <div>
      <DataGrid
        id="orders"
        dataSource={orders}
        keyExpr="ID"
        showBorders={true}
        allowColumnResizing={true}
        columnResizingMode={mode}
        columnMinWidth={50}
        columnAutoWidth={true}
        defaultColumns={columns}
      >
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Column resizing mode:&nbsp;</span>
          <SelectBox
            items={resizingModes}
            value={mode}
            inputAttr={columnResizingModeLabel}
            width={250}
            onValueChanged={changeResizingMode} />
        </div>
      </div>
    </div>
  );
};

export default App;
