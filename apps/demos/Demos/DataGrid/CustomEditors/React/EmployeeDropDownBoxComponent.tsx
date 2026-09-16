import React, { useCallback, useState } from 'react';

import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
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
  const initialSelectedRowKeys = dataValue !== null && dataValue !== undefined ? [dataValue] : [];
  const [selectedRowKeys, setSelectedRowKeys] = useState(initialSelectedRowKeys);
  const [isDropDownOpened, setDropDownOpened] = useState(false);

  const boxOptionChanged = useCallback((e: DropDownBoxTypes.OptionChangedEvent) => {
    if (e.name === 'opened') {
      setDropDownOpened(e.value);
    }
  }, []);

  const onSelectionChanged = useCallback((args: DataGridTypes.SelectionChangedEvent) => {
    setSelectedRowKeys(args.selectedRowKeys);
    setDropDownOpened(false);

    data.setValue(args.selectedRowKeys[0]);
  }, [data]);

  const contentRender = useCallback(() => (
    <DataGrid
      dataSource={data.column.lookup.dataSource}
      remoteOperations={true}
      height={250}
      selectedRowKeys={selectedRowKeys}
      hoverStateEnabled={true}
      onContextMenuPreparing={clearContextMenu}
      onSelectionChanged={onSelectionChanged}
      focusedRowEnabled={true}
      defaultFocusedRowKey={selectedRowKeys[0]}
    >
      <Column dataField="FullName" />
      <Column dataField="Title" />
      <Column dataField="Department" />
      <Paging
        enabled={true}
        defaultPageSize={10}
      />
      <Scrolling mode="virtual" />
      <Selection mode="single" />
    </DataGrid>
  ), [data, onSelectionChanged, selectedRowKeys]);

  return (
    <DropDownBox
      onOptionChanged={boxOptionChanged}
      opened={isDropDownOpened}
      dropDownOptions={dropDownOptions}
      dataSource={data.column.lookup.dataSource}
      value={selectedRowKeys[0]}
      displayExpr="FullName"
      valueExpr="ID"
      inputAttr={ownerLabel}
      contentRender={contentRender}
    ></DropDownBox>
  );
};

export default EmployeeDropDownBoxComponent;
