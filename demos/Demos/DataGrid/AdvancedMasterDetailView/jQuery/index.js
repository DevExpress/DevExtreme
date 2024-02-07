const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

$(() => {
  $('#gridContainer').dxDataGrid({
    showBorders: true,
    dataSource: DevExpress.data.AspNet.createStore({
      key: 'SupplierID',
      loadUrl: `${url}/GetSuppliers`,
    }),
    paging: {
      pageSize: 15,
    },
    remoteOperations: true,
    columns: [
      'ContactName',
      'ContactTitle',
      'CompanyName',
      'City',
      'Country',
    ],
    masterDetail: {
      enabled: true,
      template: masterDetailTemplate,
    },
  });
});

function masterDetailTemplate(_, masterDetailOptions) {
  return $('<div>').dxTabPanel({
    items: [{
      title: 'Orders',
      template: createOrdersTabTemplate(masterDetailOptions.data),
    }, {
      title: 'Address',
      template: createAddressTabTemplate(masterDetailOptions.data),
    }],
  });
}

function createOrdersTabTemplate(masterDetailData) {
  return function () {
    let orderHistoryDataGrid;
    function onProductChanged(productID) {
      orderHistoryDataGrid.option('dataSource', createOrderHistoryStore(productID));
    }
    function onDataGridInitialized(e) {
      orderHistoryDataGrid = e.component;
    }
    return $('<div>').addClass('form-container').dxForm({
      labelLocation: 'top',
      items: [{
        label: { text: 'Product' },
        template: createProductSelectBoxTemplate(masterDetailData, onProductChanged),
      }, {
        label: { text: 'Order History' },
        template: createOrderHistoryTemplate(onDataGridInitialized),
      }],
    });
  };
}

function createProductSelectBoxTemplate(masterDetailData, onProductChanged) {
  return function () {
    return $('<div>').dxSelectBox({
      inputAttr: { 'aria-label': 'Product' },
      dataSource: DevExpress.data.AspNet.createStore({
        key: 'ProductID',
        loadParams: { SupplierID: masterDetailData.SupplierID },
        loadUrl: `${url}/GetProductsBySupplier`,
      }),
      valueExpr: 'ProductID',
      displayExpr: 'ProductName',
      deferRendering: false,
      onContentReady(e) {
        const firstItem = e.component.option('items[0]');
        if (firstItem) {
          e.component.option('value', firstItem.ProductID);
        }
      },
      onValueChanged(e) {
        onProductChanged(e.value);
      },
    });
  };
}

function createOrderHistoryTemplate(onDataGridInitialized) {
  return function () {
    return $('<div>').dxDataGrid({
      onInitialized: onDataGridInitialized,
      paging: {
        pageSize: 5,
      },
      showBorders: true,
      columns: [
        'OrderID',
        {
          dataField: 'OrderDate',
          dataType: 'date',
        },
        'ShipCountry',
        'ShipCity',
        {
          dataField: 'UnitPrice',
          format: 'currency',
        },
        'Quantity',
        {
          dataField: 'Discount',
          format: 'percent',
        },
      ],
      summary: {
        totalItems: [{
          column: 'UnitPrice',
          summaryType: 'sum',
          valueFormat: {
            format: 'currency',
            precision: 2,
          },
        }, {
          column: 'Quantity',
          summaryType: 'count',
        }],
      },
    });
  };
}

function createAddressTabTemplate(data) {
  return function () {
    return $('<div>').addClass('address-form form-container').dxForm({
      formData: data,
      colCount: 2,
      customizeItem(item) {
        item.template = formItemTemplate;
      },
      items: ['Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone'],
    });
  };
}

function formItemTemplate(item) {
  return $('<span>').text(item.editorOptions.value);
}

function createOrderHistoryStore(productID) {
  return DevExpress.data.AspNet.createStore({
    key: 'OrderID',
    loadParams: { ProductID: productID },
    loadUrl: `${url}/GetOrdersByProduct`,
  });
}
