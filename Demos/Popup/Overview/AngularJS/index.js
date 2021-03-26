var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.employees = employees;
    $scope.currentEmployee = {};
    $scope.visiblePopup = false;
    $scope.positionOf = "";
    
    $scope.popupOptions = {
        width: 300,
        height: 280,
        container: ".dx-viewport",
        contentTemplate: "info",
        showTitle: true,
        title: "Information",    
        dragEnabled: false,
        closeOnOutsideClick: true,
        showCloseButton: false,
        position: {
            at: "bottom",
            my: "center"
        },
        bindingOptions: {
            visible: "visiblePopup",
            'position.of': "positionOf"
        },
        toolbarItems: [{
            widget: "dxButton",
            toolbar: "bottom",
            location: "before",
            options: {
              icon: "email",
              text: "Send",
              onClick: function(e) {
                const message = `Email is sent to ${$scope.currentEmployee.FirstName} ${$scope.currentEmployee.LastName}`;
                DevExpress.ui.notify({
                  message: message,
                  position: {
                    my: "center top",
                    at: "center top"
                  }
                }, "success", 3000);
              },
            }
          }, {
            widget: "dxButton",
            toolbar: "bottom",
            location: "after",
            options: {
              text: "Close",
              onClick: function(e) {
                $scope.visiblePopup = false;
              }
            }
        }]
    };
    
    $scope.showInfo = function (data) {
        $scope.currentEmployee = data.model.employee;
        $scope.positionOf = `#image${data.model.employee.ID}`;
        $scope.visiblePopup = true;
    };     
});