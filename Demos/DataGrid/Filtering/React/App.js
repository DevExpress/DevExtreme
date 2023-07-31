import React from 'react';
import DataGrid, {
  Column, FilterRow, HeaderFilter, Search, SearchPanel,
} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';

import service from './data.js';

const saleAmountEditorOptions = { format: 'currency', showClearButton: true };
const filterLabel = { 'aria-label': 'Filter' };
const applyFilterTypes = [{
  key: 'auto',
  name: 'Immediately',
}, {
  key: 'onClick',
  name: 'On Button Click',
}];

const saleAmountHeaderFilter = [{
  text: 'Less than $3000',
  value: ['SaleAmount', '<', 3000],
}, {
  text: '$3000 - $5000',
  value: [
    ['SaleAmount', '>=', 3000],
    ['SaleAmount', '<', 5000],
  ],
}, {
  text: '$5000 - $10000',
  value: [
    ['SaleAmount', '>=', 5000],
    ['SaleAmount', '<', 10000],
  ],
}, {
  text: '$10000 - $20000',
  value: [
    ['SaleAmount', '>=', 10000],
    ['SaleAmount', '<', 20000],
  ],
}, {
  text: 'Greater than $20000',
  value: ['SaleAmount', '>=', 20000],
}];
const orders = service.getOrders();

const getOrderDay = (rowData) => (new Date(rowData.OrderDate)).getDay();
const calculateFilterExpression = (value, selectedFilterOperations, target) => {
  const column = this;
  if (target === 'headerFilter' && value === 'weekends') {
    return [[getOrderDay, '=', 0], 'or', [getOrderDay, '=', 6]];
  }
  return column.defaultCalculateFilterExpression(value, selectedFilterOperations, target);
};
const orderHeaderFilter = (data) => {
  data.dataSource.postProcess = (results) => {
    results.push({
      text: 'Weekends',
      value: 'weekends',
    });
    return results;
  };
};

const App = () => {
  const [showFilterRow, setShowFilterRow] = React.useState(true);
  const [showHeaderFilter, setShowHeaderFilter] = React.useState(true);
  const [currentFilter, setCurrentFilter] = React.useState(applyFilterTypes[0].key);
  const dataGridRef = React.useRef(null);

  const onShowFilterRowChanged = React.useCallback((e) => {
    setShowFilterRow(e.value);
    clearFilter();
  }, [clearFilter]);

  const onShowHeaderFilterChanged = React.useCallback((e) => {
    setShowHeaderFilter(e.value);
    clearFilter();
  }, [clearFilter]);

  const onCurrentFilterChanged = React.useCallback((e) => {
    setCurrentFilter(e.value);
  }, []);

  const clearFilter = React.useCallback(() => {
    dataGridRef.current.instance.clearFilter();
  }, []);

  return (
    <div>
      <DataGrid
        id="gridContainer"
        ref={dataGridRef}
        dataSource={orders}
        keyExpr="ID"
        showBorders={true}>
        <FilterRow
          visible={showFilterRow}
          applyFilter={currentFilter} />
        <HeaderFilter visible={showHeaderFilter} />
        <SearchPanel
          visible={true}
          width={240}
          placeholder="Search..." />
        <Column
          dataField="OrderNumber"
          width={140}
          caption="Invoice Number">
          <HeaderFilter groupInterval={10000} />
        </Column>
        <Column
          dataField="OrderDate"
          alignment="right"
          dataType="date"
          width={120}
          calculateFilterExpression={calculateFilterExpression}>
          <HeaderFilter dataSource={orderHeaderFilter} />
        </Column>
        <Column
          dataField="DeliveryDate"
          alignment="right"
          dataType="datetime"
          format="M/d/yyyy, HH:mm"
          width={180} />
        <Column
          dataField="SaleAmount"
          alignment="right"
          dataType="number"
          format="currency"
          editorOptions={saleAmountEditorOptions}>
          <HeaderFilter dataSource={saleAmountHeaderFilter} />
        </Column>
        <Column dataField="Employee" />
        <Column
          dataField="CustomerStoreCity"
          caption="City">
          <HeaderFilter>
            <Search enabled={true} />
          </HeaderFilter>
        </Column>
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Apply Filter </span>
          <SelectBox
            items={applyFilterTypes}
            value={currentFilter}
            onValueChanged={onCurrentFilterChanged}
            valueExpr="key"
            inputAttr={filterLabel}
            displayExpr="name"
            disabled={!showFilterRow} />
        </div>
        <div className="option">
          <CheckBox
            text="Filter Row"
            value={showFilterRow}
            onValueChanged={onShowFilterRowChanged} />
        </div>
        <div className="option">
          <CheckBox
            text="Header Filter"
            value={showHeaderFilter}
            onValueChanged={onShowHeaderFilterChanged} />
        </div>
      </div>
    </div>
  );
};

export default App;
