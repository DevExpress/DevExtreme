$(() => {
  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }
  const store = new DevExpress.data.CustomStore({
    key: 'OrderNumber',
    load(loadOptions) {
      const deferred = $.Deferred();

      const paramNames = [
        'skip', 'take', 'requireTotalCount', 'requireGroupCount',
        'sort', 'filter', 'totalSummary', 'group', 'groupSummary',
      ];

      const args = {};

      paramNames
        .filter((paramName) => isNotEmpty(loadOptions[paramName]))
        .forEach((paramName) => { args[paramName] = JSON.stringify(loadOptions[paramName]); });

      $.ajax({
        url: 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders',
        dataType: 'json',
        data: args,
        success(result) {
          deferred.resolve(result.data, {
            totalCount: result.totalCount,
            summary: result.summary,
            groupCount: result.groupCount,
          });
        },
        error() {
          deferred.reject('Data Loading Error');
        },
        timeout: 5000,
      });

      return deferred.promise();
    },
  });

  $('#gridContainer').dxDataGrid({
    dataSource: store,
    showBorders: true,
    remoteOperations: true,
    paging: {
      pageSize: 12,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [8, 12, 20],
    },
    columns: [{
      dataField: 'OrderNumber',
      dataType: 'number',
    }, {
      dataField: 'OrderDate',
      dataType: 'date',
    }, {
      dataField: 'StoreCity',
      dataType: 'string',
    }, {
      dataField: 'StoreState',
      dataType: 'string',
    }, {
      dataField: 'Employee',
      dataType: 'string',
    }, {
      dataField: 'SaleAmount',
      dataType: 'number',
      format: 'currency',
    }],
  }).dxDataGrid('instance');
});
