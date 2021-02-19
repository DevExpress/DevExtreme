import React from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import DataGrid, { Selection, Paging, FilterRow, Scrolling } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';

const gridColumns = ['CompanyName', 'City', 'Phone'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.treeView = null;
    this.treeDataSource = this.makeAsyncDataSource('treeProducts.json');
    this.gridDataSource = this.makeAsyncDataSource('customers.json');
    this.state = {
      treeBoxValue: ['1_1'],
      gridBoxValue: [3]
    };
    this.treeView_itemSelectionChanged = this.treeView_itemSelectionChanged.bind(this);
    this.syncTreeViewSelection = this.syncTreeViewSelection.bind(this);
    this.syncDataGridSelection = this.syncDataGridSelection.bind(this);
    this.dataGrid_onSelectionChanged = this.dataGrid_onSelectionChanged.bind(this);
    this.treeViewRender = this.treeViewRender.bind(this);
    this.dataGridRender = this.dataGridRender.bind(this);
  }
  makeAsyncDataSource(jsonFile) {
    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load: function() {
        return fetch(`../../../../data/${ jsonFile}`)
          .then(response => response.json());
      }
    });
  }

  render() {
    return (
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">DropDownBox with embedded TreeView</div>
          <div className="dx-field-value">
            <DropDownBox
              value={this.state.treeBoxValue}
              valueExpr="ID"
              displayExpr="name"
              placeholder="Select a value..."
              showClearButton={true}
              dataSource={this.treeDataSource}
              onValueChanged={this.syncTreeViewSelection}
              contentRender={this.treeViewRender}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">DropDownBox with embedded DataGrid</div>
          <div className="dx-field-value">
            <DropDownBox
              value={this.state.gridBoxValue}
              valueExpr="ID"
              deferRendering={false}
              displayExpr="CompanyName"
              placeholder="Select a value..."
              showClearButton={true}
              dataSource={this.gridDataSource}
              onValueChanged={this.syncDataGridSelection}
              contentRender={this.dataGridRender}
            />
          </div>
        </div>
      </div>
    );
  }

  treeViewRender() {
    return (
      <TreeView dataSource={this.treeDataSource}
        ref={(ref) => this.treeView = ref}
        dataStructure="plain"
        keyExpr="ID"
        parentIdExpr="categoryId"
        selectionMode="multiple"
        showCheckBoxesMode="normal"
        selectNodesRecursive={false}
        displayExpr="name"
        selectByClick={true}
        onContentReady={this.syncTreeViewSelection}
        onItemSelectionChanged={this.treeView_itemSelectionChanged}
      />
    );
  }

  dataGridRender() {
    return (
      <DataGrid
        dataSource={this.gridDataSource}
        columns={gridColumns}
        hoverStateEnabled={true}
        selectedRowKeys={this.state.gridBoxValue}
        onSelectionChanged={this.dataGrid_onSelectionChanged}>
        <Selection mode="multiple" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  }

  syncTreeViewSelection(e) {
    let treeView = (e.component.selectItem && e.component) || (this.treeView && this.treeView.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
      } else {
        let values = e.value || this.state.treeBoxValue;
        values && values.forEach(function(value) {
          treeView.selectItem(value);
        });
      }
    }

    if (e.value !== undefined) {
      this.setState({
        treeBoxValue: e.value
      });
    }
  }

  syncDataGridSelection(e) {
    this.setState({
      gridBoxValue: e.value || []
    });
  }

  treeView_itemSelectionChanged(e) {
    this.setState({
      treeBoxValue: e.component.getSelectedNodeKeys()
    });
  }

  dataGrid_onSelectionChanged(e) {
    this.setState({
      gridBoxValue: e.selectedRowKeys.length && e.selectedRowKeys || []
    });
  }
}

export default App;
