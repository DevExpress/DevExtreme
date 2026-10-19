import React, { useCallback, useState } from 'react';

import DataGrid, {
  Column,
  Paging,
  Scrolling,
} from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import DropDownBox, { type DropDownBoxTypes } from 'devextreme-react/drop-down-box';

const dropDownOptions = { width: 500 };
const ownerLabel = { 'aria-label': 'Owner' };
const clearContextMenu = (event: DataGridTypes.ContextMenuPreparingEvent) => {
  event.items = [];
};

const EmployeeDropDownBoxComponent = ({ data }: DataGridTypes.ColumnCellTemplateData) => {
  const { value: dataValue } = data;
  const [focusedRowKey, setFocusedRowKey] = useState(dataValue);
  const [isDropDownOpened, setDropDownOpened] = useState(false);

  const boxOptionChanged = useCallback((e: DropDownBoxTypes.OptionChangedEvent) => {
    if (e.name === 'opened') {
      setDropDownOpened(e.value);
    }
  }, []);

  const onFocusedRowChanged = useCallback((args: DataGridTypes.FocusedRowChangedEvent) => {
    const key = args.row?.key;
    if (key !== undefined && key !== focusedRowKey) {
      setFocusedRowKey(key);
      setDropDownOpened(false);

      data.setValue(key);
    }
  }, [data, focusedRowKey]);

  const contentRender = useCallback(() => (
    <DataGrid
      dataSource={data.column.lookup.dataSource}
      remoteOperations={true}
      height={250}
      hoverStateEnabled={true}
      onContextMenuPreparing={clearContextMenu}
      onFocusedRowChanged={onFocusedRowChanged}
      focusedRowEnabled={true}
      focusedRowKey={focusedRowKey}
    >
      <Column dataField="FullName" />
      <Column dataField="Title" />
      <Column dataField="Department" />
      <Paging
        enabled={true}
        defaultPageSize={10}
      />
      <Scrolling mode="virtual" />
    </DataGrid>
  ), [data, focusedRowKey, onFocusedRowChanged]);

  return (
    <DropDownBox
      onOptionChanged={boxOptionChanged}
      opened={isDropDownOpened}
      dropDownOptions={dropDownOptions}
      dataSource={data.column.lookup.dataSource}
      value={focusedRowKey}
      displayExpr="FullName"
      valueExpr="ID"
      inputAttr={ownerLabel}
      contentRender={contentRender}
    ></DropDownBox>
  );
};

export default EmployeeDropDownBoxComponent;
