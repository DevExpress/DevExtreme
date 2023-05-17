import React from 'react';
import DropDownBox from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import DataGrid, {
  Selection, Paging, FilterRow, Scrolling,
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';

const gridColumns = ['CompanyName', 'City', 'Phone'];
const ownerLabel = { 'aria-label': 'Owner' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.treeView = null;
    this.treeDataSource = this.makeAsyncDataSource('treeProducts.json');
    this.gridDataSource = this.makeAsyncDataSource('customers.json');
    this.state = {
      treeBoxValue: ['1_1'],
      gridBoxValue: [3],
    };
    this.treeViewItemSelectionChanged = this.treeViewItemSelectionChanged.bind(this);
    this.syncTreeViewSelection = this.syncTreeViewSelection.bind(this);
    this.syncDataGridSelection = this.syncDataGridSelection.bind(this);
    this.dataGridOnSelectionChanged = this.dataGridOnSelectionChanged.bind(this);
    this.treeViewRender = this.treeViewRender.bind(this);
    this.dataGridRender = this.dataGridRender.bind(this);
  }

  makeAsyncDataSource(jsonFile) {
    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load() {
        return fetch(`../../../../data/${jsonFile}`)
          .then((response) => response.json());
      },
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
              inputAttr={ownerLabel}
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
              inputAttr={ownerLabel}
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
        ref={(ref) => { this.treeView = ref; }}
        dataStructure="plain"
        keyExpr="ID"
        parentIdExpr="categoryId"
        selectionMode="multiple"
        showCheckBoxesMode="normal"
        selectNodesRecursive={false}
        displayExpr="name"
        selectByClick={true}
        onContentReady={this.syncTreeViewSelection}
        onItemSelectionChanged={this.treeViewItemSelectionChanged}
      />
    );
  }

  dataGridRender() {
    return (
      <DataGrid
        height={345}
        dataSource={this.gridDataSource}
        columns={gridColumns}
        hoverStateEnabled={true}
        selectedRowKeys={this.state.gridBoxValue}
        onSelectionChanged={this.dataGridOnSelectionChanged}>
        <Selection mode="multiple" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  }

  syncTreeViewSelection(e) {
    const treeView = (e.component.selectItem && e.component)
      || (this.treeView && this.treeView.instance);

    if (treeView) {
      if (e.value === null) {
        treeView.unselectAll();
      } else {
        const values = e.value || this.state.treeBoxValue;
        values && values.forEach((value) => {
          treeView.selectItem(value);
        });
      }
    }

    if (e.value !== undefined) {
      this.setState({
        treeBoxValue: e.value,
      });
    }
  }

  syncDataGridSelection(e) {
    this.setState({
      gridBoxValue: e.value || [],
    });
  }

  treeViewItemSelectionChanged(e) {
    this.setState({
      treeBoxValue: e.component.getSelectedNodeKeys(),
    });
  }

  dataGridOnSelectionChanged(e) {
    this.setState({
      gridBoxValue: (e.selectedRowKeys.length && e.selectedRowKeys) || [],
    });
  }
}

export default App;
