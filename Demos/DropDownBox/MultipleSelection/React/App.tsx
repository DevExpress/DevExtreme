import React from 'react';
import DropDownBox, { DropDownBoxTypes } from 'devextreme-react/drop-down-box';
import TreeView from 'devextreme-react/tree-view';
import DataGrid, {
  Selection,
  Paging,
  FilterRow,
  Scrolling,
  DataGridTypes,
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';

const gridColumns = ['CompanyName', 'City', 'Phone'];
const ownerLabel = { 'aria-label': 'Owner' };

const makeAsyncDataSource = (jsonFile: string) =>
  new CustomStore({
    loadMode: 'raw',
    key: 'ID',
    load() {
      return fetch(`../../../../data/${jsonFile}`).then((response) => response.json());
    },
  });

const treeDataSource = makeAsyncDataSource('treeProducts.json');
const gridDataSource = makeAsyncDataSource('customers.json');

function App() {
  const [treeBoxValue, setTreeBoxValue] = React.useState(['1_1']);
  const [gridBoxValue, setGridBoxValue] = React.useState([3]);
  const treeViewRef = React.useRef<TreeView<any>>();

  const treeViewRender = React.useCallback(
    () => (
      <TreeView
        dataSource={treeDataSource}
        ref={treeViewRef}
        dataStructure="plain"
        keyExpr="ID"
        parentIdExpr="categoryId"
        selectionMode="multiple"
        showCheckBoxesMode="normal"
        selectNodesRecursive={false}
        displayExpr="name"
        selectByClick={true}
        onContentReady={syncTreeViewSelection}
        onItemSelectionChanged={treeViewItemSelectionChanged}
      />
    ),
    [treeDataSource],
  );

  const dataGridRender = React.useCallback(
    () => (
      <DataGrid
        height={345}
        dataSource={gridDataSource}
        columns={gridColumns}
        hoverStateEnabled={true}
        selectedRowKeys={gridBoxValue}
        onSelectionChanged={dataGridOnSelectionChanged}
      >
        <Selection mode="multiple" />
        <Scrolling mode="virtual" />
        <Paging
          enabled={true}
          pageSize={10}
        />
        <FilterRow visible={true} />
      </DataGrid>
    ),
    [gridDataSource, gridBoxValue],
  );

  const syncTreeViewSelection = React.useCallback(
    (e: DropDownBoxTypes.ValueChangedEvent | any) => {
      const treeView = (e.component.selectItem && e.component)
        || (treeViewRef.current && treeViewRef.current.instance);

      if (treeView) {
        if (e.value === null) {
          treeView.unselectAll();
        } else {
          const values = e.value || treeBoxValue;
          values && values.forEach((value) => {
            treeView.selectItem(value);
          });
        }
      }

      if (e.value !== undefined) {
        setTreeBoxValue(e.value);
      }
    },
    [treeBoxValue],
  );

  const syncDataGridSelection = React.useCallback((e: DropDownBoxTypes.ValueChangedEvent) => {
    setGridBoxValue(e.value || []);
  }, []);

  const treeViewItemSelectionChanged = React.useCallback(
    (e: { component: { getSelectedNodeKeys: () => any } }) => {
      setTreeBoxValue(e.component.getSelectedNodeKeys());
    },
    [],
  );

  const dataGridOnSelectionChanged = React.useCallback((e: DataGridTypes.SelectionChangedEvent) => {
    setGridBoxValue((e.selectedRowKeys.length && e.selectedRowKeys) || []);
  }, []);

  return (
    <div className="dx-fieldset">
      <div className="dx-field">
        <div className="dx-field-label">DropDownBox with embedded TreeView</div>
        <div className="dx-field-value">
          <DropDownBox
            value={treeBoxValue}
            valueExpr="ID"
            inputAttr={ownerLabel}
            displayExpr="name"
            placeholder="Select a value..."
            showClearButton={true}
            dataSource={treeDataSource}
            onValueChanged={syncTreeViewSelection}
            contentRender={treeViewRender}
          />
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">DropDownBox with embedded DataGrid</div>
        <div className="dx-field-value">
          <DropDownBox
            value={gridBoxValue}
            valueExpr="ID"
            deferRendering={false}
            inputAttr={ownerLabel}
            displayExpr="CompanyName"
            placeholder="Select a value..."
            showClearButton={true}
            dataSource={gridDataSource}
            onValueChanged={syncDataGridSelection}
            contentRender={dataGridRender}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
