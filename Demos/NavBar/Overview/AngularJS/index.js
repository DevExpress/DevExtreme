var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.navSelectedIndex = 0;
    $scope.navBarData = navData;
    $scope.listData = [{
        data: new DevExpress.data.DataSource({
            store: contacts,
            sort: "name"
        })
    },
        {
            data: new DevExpress.data.DataSource({
                store: contacts,
                sort: "name",
                filter: ["category", "=", "Missed"]
            })
        },
        {
            data: new DevExpress.data.DataSource({
                store: contacts,
                sort: "name",
                filter: ["category", "=", "Favorites"]
            })     }
    
    ];
    $scope.currentData = $scope.listData[0].data;
    $scope.$watch("navSelectedIndex", function(newValue) {
        $scope.currentData = $scope.listData[newValue].data;
    });
});