import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column,
  DataGridTypes,
  Paging,
  Scrolling,
  Selection,
} from 'devextreme-react/data-grid';
import DropDownBox, { DropDownBoxTypes } from 'devextreme-react/drop-down-box';

const dropDownOptions = { width: 500 };
const ownerLabel = { 'aria-label': 'Owner' };

const EmployeeDropDownBoxComponent = (props) => {
  const { data: { value: dataValue } } = props;
  const initialSelectedRowKeys = dataValue !== null && dataValue !== undefined ? [dataValue] : [];
  const [selectedRowKeys, setSelectedRowKeys] = useState(initialSelectedRowKeys);
  const [isDropDownOpened, setDropDownOpened] = useState(false);

  const boxOptionChanged = useCallback((e: DropDownBoxTypes.OptionChangedEvent) => {
    if (e.name === 'opened') {
      setDropDownOpened(e.value);
    }
  }, []);

  const contentRender = useCallback(() => {
    const onContextMenuPreparing = (event: DataGridTypes.ContextMenuPreparingEvent) => {
      event.items = [];
    };
    const onSelectionChanged = (args: DataGridTypes.SelectionChangedEvent) => {
      setSelectedRowKeys(args.selectedRowKeys);
      setDropDownOpened(false);

      props.data.setValue(args.selectedRowKeys[0]);
    };

    return (
      <DataGrid
        dataSource={props.data.column.lookup.dataSource}
        remoteOperations={true}
        height={250}
        selectedRowKeys={selectedRowKeys}
        hoverStateEnabled={true}
        onContextMenuPreparing={onContextMenuPreparing}
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
    );
  }, [props.data, selectedRowKeys]);

  return (
    <DropDownBox
      onOptionChanged={boxOptionChanged}
      opened={isDropDownOpened}
      dropDownOptions={dropDownOptions}
      dataSource={props.data.column.lookup.dataSource}
      value={selectedRowKeys[0]}
      displayExpr="FullName"
      valueExpr="ID"
      inputAttr={ownerLabel}
      contentRender={contentRender}
    ></DropDownBox>
  );
};

export default EmployeeDropDownBoxComponent;
