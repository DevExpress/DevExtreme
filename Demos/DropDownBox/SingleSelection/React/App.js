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
      treeBoxValue: '1_1',
      gridBoxValue: [3],
      isGridBoxOpened: false,
      isTreeBoxOpened: false
    };
    this.treeView_itemSelectionChanged = this.treeView_itemSelectionChanged.bind(this);
    this.syncTreeViewSelection = this.syncTreeViewSelection.bind(this);
    this.syncDataGridSelection = this.syncDataGridSelection.bind(this);
    this.dataGrid_onSelectionChanged = this.dataGrid_onSelectionChanged.bind(this);
    this.treeViewRender = this.treeViewRender.bind(this);
    this.treeView_onContentReady = this.treeView_onContentReady.bind(this);
    this.dataGridRender = this.dataGridRender.bind(this);
    this.onGridBoxOpened = this.onGridBoxOpened.bind(this);
    this.onTreeBoxOpened = this.onTreeBoxOpened.bind(this);
    this.onTreeItemClick = this.onTreeItemClick.bind(this);
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
              opened={this.state.isTreeBoxOpened}
              valueExpr="ID"
              displayExpr="name"
              placeholder="Select a value..."
              showClearButton={true}
              dataSource={this.treeDataSource}
              onValueChanged={this.syncTreeViewSelection}
              onOptionChanged={this.onTreeBoxOpened}
              contentRender={this.treeViewRender}
            />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">DropDownBox with embedded DataGrid</div>
          <div className="dx-field-value">
            <DropDownBox
              value={this.state.gridBoxValue}
              opened={this.state.isGridBoxOpened}
              valueExpr="ID"
              deferRendering={false}
              displayExpr={this.gridBox_displayExpr}
              placeholder="Select a value..."
              showClearButton={true}
              dataSource={this.gridDataSource}
              onValueChanged={this.syncDataGridSelection}
              onOptionChanged={this.onGridBoxOpened}
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
        selectionMode="single"
        displayExpr="name"
        selectByClick={true}
        onContentReady={this.treeView_onContentReady}
        onItemClick={this.onTreeItemClick}
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
        onSelectionChanged={this.dataGrid_onSelectionChanged}
        height="100%">
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  }

  syncTreeViewSelection(e) {
    this.setState({
      treeBoxValue: e.value
    });
    if (!this.treeView) return;

    if (!e.value) {
      this.treeView.instance.unselectAll();
    } else {
      this.treeView.instance.selectItem(e.value);
    }
  }

  syncDataGridSelection(e) {
    this.setState({
      gridBoxValue: e.value
    });
  }

  treeView_itemSelectionChanged(e) {
    this.setState({
      treeBoxValue: e.component.getSelectedNodeKeys()
    });
  }

  dataGrid_onSelectionChanged(e) {
    this.setState({
      gridBoxValue: e.selectedRowKeys,
      isGridBoxOpened: false
    });
  }

  gridBox_displayExpr(item) {
    return item && `${item.CompanyName } <${ item.Phone }>`;
  }

  treeView_onContentReady(e) {
    e.component.selectItem(this.state.treeBoxValue);
  }

  onTreeItemClick() {
    this.setState({
      isTreeBoxOpened: false
    });
  }

  onGridBoxOpened(e) {
    if(e.name === 'opened') {
      this.setState({
        isGridBoxOpened: e.value
      });
    }
  }

  onTreeBoxOpened(e) {
    if(e.name === 'opened') {
      this.setState({
        isTreeBoxOpened: e.value
      });
    }
  }

}

export default App;
