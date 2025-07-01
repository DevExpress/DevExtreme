$(() => {
  const dataGrid = $('#dataGrid').dxDataGrid({
    dataSource: orders,
    pager: {
      visible: false,
    },
    paging: {
      pageIndex: 0,
      pageSize: 10,
    },
    columns: [
      'ID',
      'OrderNumber',
      'OrderDate',
      'DeliveryDate',
      'SaleAmount',
      'Terms',
      'CustomerStoreCity',
      {
        dataField: 'Employee',
        groupIndex: 0,
      },
    ],
    groupPanel: {
      enabled: true,
    },
    searchPanel: {
      visible: true,
    },
    editing: {
      mode: 'batch',
      allowAdding: true,
    },
    toolbar: {
      visible: false,
    },
    onContentReady({ component }) {
      console.log('grid', component.option('paging.pageIndex'));
      
      pagination.option({
        itemCount: component.totalCount(),
        pageIndex: component.option('paging.pageIndex') + 1,
        pageSize: component.option('paging.pageSize'),
      });
    }
  }).dxDataGrid('instance');

  const pagination = $('#pagination').dxPagination({
    showInfo: true,
    showNavigationButtons: true,
    allowedPageSizes: [5, 10, 20],
    pageIndex: dataGrid.option('paging.pageIndex'),
    pageSize: dataGrid.option('paging.pageSize'),
    onOptionChanged: ({ component }) => {
      console.log('pagination', component.option('pageIndex'));

      dataGrid.option({
        paging: {
          pageIndex: component.option('pageIndex') - 1,
          pageSize: component.option('pageSize'),
        },
      });
    },
  }).dxPagination('instance');

  $('#checkbox').dxCheckBox({
    text: 'show toolbar',
    onValueChanged(e) {
      dataGrid.option('toolbar.visible', e.value);
    }
  }).dxPagination('instance');
});
