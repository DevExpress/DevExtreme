import React from 'react';
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection,
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';

const dropDownOptions = { width: 500 };
const ownerLabel = { 'aria-label': 'Owner' };

export default class EmployeeDropDownBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [props.data.value],
      isDropDownOpened: false,
    };
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.contentRender = this.contentRender.bind(this);
    this.boxOptionChanged = this.boxOptionChanged.bind(this);
  }

  boxOptionChanged(e) {
    if (e.name === 'opened') {
      this.setState({
        isDropDownOpened: e.value,
      });
    }
  }

  contentRender() {
    return (
      <DataGrid
        dataSource={this.props.data.column.lookup.dataSource}
        remoteOperations={true}
        height={250}
        selectedRowKeys={this.state.selectedRowKeys}
        hoverStateEnabled={true}
        onSelectionChanged={this.onSelectionChanged}
        focusedRowEnabled={true}
        defaultFocusedRowKey={this.state.selectedRowKeys[0]}
      >
        <Column dataField="FullName" />
        <Column dataField="Title" />
        <Column dataField="Department" />
        <Paging enabled={true} defaultPageSize={10} />
        <Scrolling mode="virtual" />
        <Selection mode="single" />
      </DataGrid>
    );
  }

  onSelectionChanged(selectionChangedArgs) {
    this.setState({
      selectedRowKeys: selectionChangedArgs.selectedRowKeys,
      isDropDownOpened: false,
    });
    this.props.data.setValue(this.state.selectedRowKeys[0]);
  }

  render() {
    return (
      <DropDownBox
        onOptionChanged={this.boxOptionChanged}
        opened={this.state.isDropDownOpened}
        dropDownOptions={dropDownOptions}
        dataSource={this.props.data.column.lookup.dataSource}
        value={this.state.selectedRowKeys[0]}
        displayExpr="FullName"
        valueExpr="ID"
        inputAttr={ownerLabel}
        contentRender={this.contentRender}>
      </DropDownBox>
    );
  }
}
