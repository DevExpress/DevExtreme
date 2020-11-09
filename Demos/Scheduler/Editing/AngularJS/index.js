var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    function showToast(event, value, type) {
        DevExpress.ui.notify(event + " \"" + value + "\"" + " task", type, 800);
    }

    $scope.editing = {
        allowAdding: true,
        allowDeleting: true,
        allowUpdating: true,
        allowResizing: true,
        allowDragging: true
    };
    $scope.disabledValue = false;
    
    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["day", "week"],
        currentView: "week",
        currentDate: new Date(2021, 4, 27),
        startDayHour: 9,
        endDayHour: 19,
        bindingOptions: {
            editing: "editing",
        },
        onAppointmentAdded: function (e) {
            showToast("Added", e.appointmentData.text, "success");
        },
        onAppointmentUpdated: function (e) {
            showToast("Updated", e.appointmentData.text, "info");
        },
        onAppointmentDeleted: function (e) {
            showToast("Deleted", e.appointmentData.text, "warning");
        },
        height: 600
    };
    $scope.allowAddingOptions = {
        text: "Allow adding",
        bindingOptions: {
            value: "editing.allowAdding"
        }
    };
    $scope.allowDeletingOptions = {
        text: "Allow deleting",
        bindingOptions: {
            value: "editing.allowDeleting"
        }
    };
    $scope.allowUpdatingOptions = {
        text: "Allow updating",
        onValueChanged: function (e) {
            $scope.disabledValue = !e.value;
        },
        bindingOptions: {
            value: "editing.allowUpdating"
        }
    };
    $scope.allowResizingOptions = {
        text: "Allow resizing",
        bindingOptions: {
            value: "editing.allowResizing",
            disabled: "disabledValue"
        }
    };
    $scope.allowDraggingOptions = {
        text: "Allow dragging",
        bindingOptions: {
            value: "editing.allowDragging",
            disabled: "disabledValue"
        }
    };
});