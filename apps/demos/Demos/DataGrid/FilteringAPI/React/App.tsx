import React, { useCallback, useRef, useState } from 'react';

import DataGrid, { Column, Pager } from 'devextreme-react/data-grid';
import type { DataGridRef } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import 'devextreme-react/common/data';

import { tasks, statuses } from './data.ts';

const statusLabel = { 'aria-label': 'Status' };

const App = () => {
  const [filterStatus, setFilterStatus] = useState(statuses[0]);
  const dataGridRef = useRef<DataGridRef>(null);

  const onValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    const dataGrid = dataGridRef.current.instance();

    if (e.value === 'All') {
      dataGrid.clearFilter();
    } else {
      dataGrid.filter(['Task_Status', '=', e.value]);
    }

    setFilterStatus(e.value);
  }, []);

  return (
    <div>
      <div className='left-side'>
        <div className='logo'>
          <img src='../../../../images/logo-devav.png' alt='DEVAV' />
          &nbsp;
          <img src='../../../../images/logo-tasks.png' alt='Tasks' />
        </div>
      </div>
      <div className='right-side'>
        <SelectBox
          items={statuses}
          inputAttr={statusLabel}
          value={filterStatus}
          onValueChanged={onValueChanged} />
      </div>

      <DataGrid
        id='gridContainer'
        ref={dataGridRef}
        dataSource={tasks}
        keyExpr='Task_ID'
        columnAutoWidth={true}
        showBorders={true}
      >
        <Pager visible={true} />
        <Column
          dataField='Task_ID'
          width={80} />
        <Column
          dataField='Task_Start_Date'
          caption='Start Date'
          dataType='date' />
        <Column
          allowSorting={false}
          dataField='Employee_Full_Name'
          cssClass='employee'
          caption='Assigned To' />
        <Column
          dataField='Task_Subject'
          caption='Subject'
          width={350} />
        <Column
          dataField='Task_Status'
          caption='Status' />
      </DataGrid>
    </div>
  );
};

export default App;
