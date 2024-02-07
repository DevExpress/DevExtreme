const DemoApp = angular.module('DemoApp', ['dx']);
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

DemoApp.controller('DemoController', ($scope) => {
  $scope.gridOptions = {
    dataSource: {
      store: {
        type: 'odata',
        version: 2,
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
        key: 'Task_ID',
      },
      expand: 'ResponsibleEmployee',
      select: [
        'Task_ID',
        'Task_Subject',
        'Task_Start_Date',
        'Task_Due_Date',
        'Task_Status',
        'ResponsibleEmployee/Employee_Full_Name',
      ],
    },
    selection: {
      mode: 'multiple',
      deferred: true,
    },
    filterRow: {
      visible: true,
    },
    selectionFilter: ['Task_Status', '=', 'Completed'],
    showBorders: true,
    onInitialized(e) {
      $scope.dataGrid = e.component;
      $scope.calculateStatistics();
    },
    columns: [{
      caption: 'Subject',
      dataField: 'Task_Subject',
    }, {
      caption: 'Start Date',
      dataField: 'Task_Start_Date',
      width: 'auto',
      dataType: 'date',
    }, {
      caption: 'Due Date',
      dataField: 'Task_Due_Date',
      width: 'auto',
      dataType: 'date',
    }, {
      caption: 'Assigned To',
      dataField: 'ResponsibleEmployee.Employee_Full_Name',
      width: 'auto',
      allowSorting: false,
    }, {
      caption: 'Status',
      width: 'auto',
      dataField: 'Task_Status',
    },
    ],
  };

  $scope.calculateStatistics = function () {
    $scope.dataGrid.getSelectedRowsData().then((rowData) => {
      let commonDuration = 0;
      for (let i = 0; i < rowData.length; i += 1) {
        commonDuration += rowData[i].Task_Due_Date
                    - rowData[i].Task_Start_Date;
      }
      commonDuration /= MILLISECONDS_IN_DAY;

      $scope.$apply(() => {
        const { statistic } = $scope;
        statistic.count = rowData.length;
        statistic.peopleCount = DevExpress.data.query(rowData)
          .groupBy('ResponsibleEmployee.Employee_Full_Name')
          .toArray()
          .length;
        statistic.avgDuration = Math.round(commonDuration / rowData.length) || 0;
      });
    });
  };

  $scope.buttonOptions = {
    text: 'Get statistics on the selected tasks',
    type: 'default',
    onClick: $scope.calculateStatistics,
  };

  $scope.statistic = {
    count: 0,
    peopleCount: 0,
    avgDuration: 0,
  };
});
