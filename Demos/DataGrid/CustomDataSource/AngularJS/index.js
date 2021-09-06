const DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', ($scope, $http, $q) => {
  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }
  const store = new DevExpress.data.CustomStore({
    key: 'OrderNumber',
    load(loadOptions) {
      const params = {};
      [
        'skip',
        'take',
        'requireTotalCount',
        'requireGroupCount',
        'sort',
        'filter',
        'totalSummary',
        'group',
        'groupSummary',
      ].forEach((i) => {
        if (i in loadOptions && isNotEmpty(loadOptions[i])) { params[i] = JSON.stringify(loadOptions[i]); }
      });
      return $http.get('https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders', { params })
        .then((response) => ({
          data: response.data.data,
          totalCount: response.data.totalCount,
          summary: response.data.summary,
          groupCount: response.data.groupCount,
        }), () => $q.reject('Data Loading Error'));
    },
  });

  $scope.dataGridOptions = {
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
  };
});
