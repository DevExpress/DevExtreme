import React from 'react';
import DataGrid, {
  Column,
  Paging,
  Scrolling,
  Selection
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';

const dropDownOptions = { width: 500 };

export default class EmployeeDropDownBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: props.data.value
    };
    this.dropDownBoxRef = React.createRef();
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.contentRender = this.contentRender.bind(this);
  }

  contentRender() {
    return (
      <DataGrid
        dataSource={this.props.data.column.lookup.dataSource}
        remoteOperations={true}
        keyExpr="ID"
        height={250}
        selectedRowKeys={[this.state.currentValue]}
        hoverStateEnabled={true}
        onSelectionChanged={this.onSelectionChanged}
        focusedRowEnabled={true}
        defaultFocusedRowKey={this.state.currentValue}
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
    this.setState({ currentValue: selectionChangedArgs.selectedRowKeys[0] });
    this.props.data.setValue(this.state.currentValue);
    if(selectionChangedArgs.selectedRowKeys.length > 0) {
      this.dropDownBoxRef.current.instance.close();
    }
  }

  render() {
    return (
      <DropDownBox
        ref={this.dropDownBoxRef}
        dropDownOptions={dropDownOptions}
        dataSource={this.props.data.column.lookup.dataSource}
        value={this.state.currentValue}
        displayExpr="FullName"
        valueExpr="ID"
        contentRender={this.contentRender}>
      </DropDownBox>
    );
  }
}
