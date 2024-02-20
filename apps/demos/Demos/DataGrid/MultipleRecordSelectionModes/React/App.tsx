import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column,
  Selection,
  FilterRow,
  Paging,
  DataGridTypes,
} from 'devextreme-react/data-grid';
import { SelectBox } from 'devextreme-react/select-box';
import themes from 'devextreme/ui/themes';
import { sales } from './data.ts';

const selectAllFieldLabel = { 'aria-label': 'Select All Mode' };
const showCheckboxesFieldLabel = { 'aria-label': 'Show Checkboxes Mode' };

const showCheckBoxesModes = ['none', 'onClick', 'onLongTap', 'always'];
const selectAllModes = ['allPages', 'page'];

const App = () => {
  const [allMode, setAllMode] = useState<DataGridTypes.SelectAllMode>('allPages');
  const [checkBoxesMode, setCheckBoxesMode] = useState<DataGridTypes.SelectionColumnDisplayMode>(
    themes.current().startsWith('material') ? 'always' : 'onClick',
  );

  const onCheckBoxesModeChanged = useCallback(({ value }) => {
    setCheckBoxesMode(value);
  }, []);

  const onAllModeChanged = useCallback(({ value }) => {
    setAllMode(value);
  }, []);

  return (
    <div>
      <DataGrid dataSource={sales} showBorders={true} keyExpr="orderId">
        <Selection
          mode="multiple"
          selectAllMode={allMode}
          showCheckBoxesMode={checkBoxesMode}
        />
        <FilterRow visible={true} />
        <Paging defaultPageSize={10} />

        <Column dataField="orderId" caption="Order ID" width={90} />
        <Column dataField="city" />
        <Column dataField="country" width={180} />
        <Column dataField="region" />
        <Column dataField="date" dataType="date" />
        <Column dataField="amount" format="currency" width={90} />
      </DataGrid>

      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Select All Mode </span>
          <SelectBox
            id="select-all-mode"
            inputAttr={selectAllFieldLabel}
            dataSource={selectAllModes}
            value={allMode}
            disabled={checkBoxesMode === 'none'}
            onValueChanged={onAllModeChanged}
          />
        </div>
        <div className="option checkboxes-mode">
          <span>Show Checkboxes Mode </span>
          <SelectBox
            id="show-checkboxes-mode"
            inputAttr={showCheckboxesFieldLabel}
            dataSource={showCheckBoxesModes}
            value={checkBoxesMode}
            onValueChanged={onCheckBoxesModeChanged}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
