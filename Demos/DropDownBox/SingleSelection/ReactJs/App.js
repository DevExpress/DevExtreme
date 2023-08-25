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
const makeAsyncDataSource = (jsonFile) =>
  new CustomStore({
    loadMode: 'raw',
    key: 'ID',
    load() {
      return fetch(`../../../../data/${jsonFile}`).then((response) => response.json());
    },
  });
const treeDataSource = makeAsyncDataSource('treeProducts.json');
const gridDataSource = makeAsyncDataSource('customers.json');
const gridBoxDisplayExpr = (item) => item && `${item.CompanyName} <${item.Phone}>`;
function App() {
  const treeViewRef = React.useRef(null);
  const [treeBoxValue, setTreeBoxValue] = React.useState('1_1');
  const [gridBoxValue, setGridBoxValue] = React.useState([3]);
  const [isGridBoxOpened, setIsGridBoxOpened] = React.useState(false);
  const [isTreeBoxOpened, setIsTreeBoxOpened] = React.useState(false);
  const treeViewItemSelectionChanged = React.useCallback((e) => {
    setTreeBoxValue(e.component.getSelectedNodeKeys());
  }, []);
  const dataGridOnSelectionChanged = React.useCallback((e) => {
    setGridBoxValue(e.selectedRowKeys);
    setIsGridBoxOpened(false);
  }, []);
  const treeViewOnContentReady = React.useCallback(
    (e) => {
      e.component.selectItem(treeBoxValue);
    },
    [treeBoxValue],
  );
  const onTreeItemClick = React.useCallback(() => {
    setIsTreeBoxOpened(false);
  }, []);
  const treeViewRender = React.useCallback(
    () => (
      <TreeView
        dataSource={treeDataSource}
        ref={treeViewRef}
        dataStructure="plain"
        keyExpr="ID"
        parentIdExpr="categoryId"
        selectionMode="single"
        displayExpr="name"
        selectByClick={true}
        onContentReady={treeViewOnContentReady}
        onItemClick={onTreeItemClick}
        onItemSelectionChanged={treeViewItemSelectionChanged}
      />
    ),
    [treeViewRef, treeViewOnContentReady, onTreeItemClick, treeViewItemSelectionChanged],
  );
  const dataGridRender = React.useCallback(
    () => (
      <DataGrid
        dataSource={gridDataSource}
        columns={gridColumns}
        hoverStateEnabled={true}
        selectedRowKeys={gridBoxValue}
        onSelectionChanged={dataGridOnSelectionChanged}
        height="100%"
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging
          enabled={true}
          pageSize={10}
        />
        <FilterRow visible={true} />
      </DataGrid>
    ),
    [gridBoxValue, dataGridOnSelectionChanged],
  );
  const syncTreeViewSelection = React.useCallback((e) => {
    setTreeBoxValue(e.value);
    if (!treeViewRef.current) return;
    if (!e.value) {
      treeViewRef.current.instance.unselectAll();
    } else {
      treeViewRef.current.instance.selectItem(e.value);
    }
  }, []);
  const syncDataGridSelection = React.useCallback((e) => {
    setGridBoxValue(e.value);
  }, []);
  const onGridBoxOpened = React.useCallback((e) => {
    if (e.name === 'opened') {
      setIsGridBoxOpened(e.value);
    }
  }, []);
  const onTreeBoxOpened = React.useCallback((e) => {
    if (e.name === 'opened') {
      setIsTreeBoxOpened(e.value);
    }
  }, []);
  return (
    <div className="dx-fieldset">
      <div className="dx-field">
        <div className="dx-field-label">DropDownBox with embedded TreeView</div>
        <div className="dx-field-value">
          <DropDownBox
            value={treeBoxValue}
            opened={isTreeBoxOpened}
            valueExpr="ID"
            inputAttr={ownerLabel}
            displayExpr="name"
            placeholder="Select a value..."
            showClearButton={true}
            dataSource={treeDataSource}
            onValueChanged={syncTreeViewSelection}
            onOptionChanged={onTreeBoxOpened}
            contentRender={treeViewRender}
          />
        </div>
      </div>
      <div className="dx-field">
        <div className="dx-field-label">DropDownBox with embedded DataGrid</div>
        <div className="dx-field-value">
          <DropDownBox
            value={gridBoxValue}
            opened={isGridBoxOpened}
            valueExpr="ID"
            deferRendering={false}
            inputAttr={ownerLabel}
            displayExpr={gridBoxDisplayExpr}
            placeholder="Select a value..."
            showClearButton={true}
            dataSource={gridDataSource}
            onValueChanged={syncDataGridSelection}
            onOptionChanged={onGridBoxOpened}
            contentRender={dataGridRender}
          />
        </div>
      </div>
    </div>
  );
}
export default App;
