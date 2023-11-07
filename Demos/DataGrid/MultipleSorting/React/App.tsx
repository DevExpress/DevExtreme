import React from 'react';
import DataGrid, { Column, Sorting } from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';
import { employees } from './data.ts';

const App = () => {
  const [positionDisableSorting, setPositionDisableSorting] = React.useState(false);
  const dataGridRef = React.useRef(null);

  const onPositionSortingChanged = React.useCallback(() => {
    setPositionDisableSorting((previousPositionDisableSorting) => !previousPositionDisableSorting);
    dataGridRef.current.instance.columnOption(5, 'sortOrder', undefined);
  }, []);

  return (
    <div>
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        showBorders={true}
        ref={dataGridRef}
      >
        <Sorting mode="multiple" />

        <Column dataField="Prefix" caption="Title" width={70} />
        <Column dataField="FirstName" defaultSortOrder="asc" />
        <Column dataField="LastName" defaultSortOrder="asc" />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column
          dataField="Position"
          allowSorting={!positionDisableSorting}
          width={130}
        />
        <Column dataField="HireDate" dataType="date" />
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text="Disable Sorting for the Position Column"
            value={positionDisableSorting}
            onValueChanged={onPositionSortingChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
