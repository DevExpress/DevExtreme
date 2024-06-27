import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column, Paging, Scrolling, Selection,
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';

const dropDownOptions = { width: 500 };
const ownerLabel = { 'aria-label': 'Owner' };
const EmployeeDropDownBoxComponent = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState(() =>
    (props.data.value ? [props.data.value] : []));
  const [isDropDownOpened, setDropDownOpened] = useState(false);
  const boxOptionChanged = useCallback((e) => {
    if (e.name === 'opened') {
      setDropDownOpened(e.value);
    }
  }, []);
  const contentRender = useCallback(() => {
    const onSelectionChanged = (args) => {
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
