import React from 'react';
import DataGrid, {
  Column, Editing, Paging, Lookup,
} from 'devextreme-react/data-grid';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';
import { employees, states } from './data.js';

const startEditActions = ['click', 'dblClick'];
const actionLabel = { 'aria-label': 'Action' };
const App = () => {
  const [selectTextOnEditStart, setSelectTextOnEditStart] = React.useState(true);
  const [startEditAction, setStartEditAction] = React.useState('click');
  const onSelectTextOnEditStartChanged = React.useCallback((args) => {
    setSelectTextOnEditStart(args.value);
  }, []);
  const onStartEditActionChanged = React.useCallback((args) => {
    setStartEditAction(args.value);
  }, []);
  return (
    <div id="data-grid-demo">
      <DataGrid
        dataSource={employees}
        keyExpr="ID"
        showBorders={true}
      >
        <Paging enabled={false} />
        <Editing
          mode="batch"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
          selectTextOnEditStart={selectTextOnEditStart}
          startEditAction={startEditAction}
        />
        <Column
          dataField="Prefix"
          caption="Title"
          width={70}
        />
        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column
          dataField="Position"
          width={170}
        />
        <Column
          dataField="StateID"
          caption="State"
          width={125}
        >
          <Lookup
            dataSource={states}
            valueExpr="ID"
            displayExpr="Name"
          />
        </Column>
        <Column
          dataField="BirthDate"
          dataType="date"
        />
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            value={selectTextOnEditStart}
            text="Select Text on Edit Start"
            onValueChanged={onSelectTextOnEditStartChanged}
          />
        </div>
        <div className="option">
          <span>Start Edit Action</span>
          <SelectBox
            items={startEditActions}
            inputAttr={actionLabel}
            value={startEditAction}
            onValueChanged={onStartEditActionChanged}
          ></SelectBox>
        </div>
      </div>
    </div>
  );
};
export default App;
