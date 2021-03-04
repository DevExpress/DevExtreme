var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.groups = undefined;
    $scope.crossScrolling = false;
    $scope.currentDate = new Date(2020, 10, 25);

    $scope.dataSource = [];
    $scope.disabled = true;
    $scope.target = undefined;
    $scope.itemTemplate = undefined;
    $scope.onItemClick = undefined;

    $scope.contextMenuOptions = {
        width: 200,
        bindingOptions: {
            dataSource: "dataSource",
            disabled: "disabled",
            target: "target",
            itemTemplate: "itemTemplate",
            onItemClick: "onItemClick",
        },
        onHiding: function() {
            $scope.disabled = true;
            $scope.dataSource = [];
        },
    };

    $scope.schedulerOptions = {
        timeZone: "America/Los_Angeles",
        bindingOptions: {
            groups: "groups",
            crossScrollingEnabled: "crossScrolling",
            currentDate: "currentDate"
        },
        dataSource: data,
        views: ["day", "month"],
        currentView: "month",
        startDayHour: 9,
        recurrenceEditMode: "series",
        onAppointmentContextMenu: function(e) {
            $scope.target = ".dx-scheduler-appointment";
            $scope.disabled = false;
            $scope.dataSource = appointmentContextMenuItems;
            $scope.itemTemplate = "item-template";
            $scope.onItemClick = onItemClick(e);
        },
        onCellContextMenu: function(e) {
            $scope.target = ".dx-scheduler-date-table-cell";
            $scope.disabled = false;
            $scope.dataSource = cellContextMenuItems;
            $scope.itemTemplate = 'item';
            $scope.onItemClick = onItemClick(e);
        },
        resources: [{
            fieldExpr: "roomId",
            dataSource: resourcesData,
            label: "Room"
        }],
        height: 600
    };

    var onItemClick = function(contextMenuEvent) {
        return function(e) {
            e.itemData.onItemClick(contextMenuEvent, e);
        }
    }

    var createAppointment = function(e) {
      e.component.showAppointmentPopup({
        startDate: e.cellData.startDate
        }, true);
    }

    var createRecurringAppointment = function(e) {
      e.component.showAppointmentPopup({
        startDate: e.cellData.startDate,
            recurrenceRule: "FREQ=DAILY"
        }, true);
    };

    var groupCell = function(e) {
        if($scope.groups && $scope.groups.length) {
            $scope.crossScrolling = false;
            $scope.groups = undefined;
        } else {
            $scope.crossScrolling = true;
            $scope.groups = ["roomId"];
        }
    }

    var showCurrentDate = function(e) {
        $scope.currentDate = new Date();
    }

    var showAppointment = function(e) {
      e.component.showAppointmentPopup(e.appointmentData);
    };

    var deleteAppointment = function(e) {
      e.component.deleteAppointment(e.appointmentData);
    };

    var repeatAppointmentWeekly = function(e) {
      var itemData = e.appointmentData;

      e.component.updateAppointment(itemData, $.extend(itemData, {
            startDate: e.targetedAppointmentData.startDate,
            recurrenceRule: "FREQ=WEEKLY"
        }));
    };

    var setResource = function(e, clickEvent) {
        var itemData = e.appointmentData;

      e.component.updateAppointment(itemData, $.extend(itemData, {
            roomId: [clickEvent.itemData.id]
        }));
    };

    var cellContextMenuItems = [
        { text: 'New Appointment', onItemClick: createAppointment },
        { text: 'New Recurring Appointment', onItemClick: createRecurringAppointment },
        { text: 'Group by Room/Ungroup', beginGroup: true, onItemClick: groupCell },
        { text: 'Go to Today', onItemClick: showCurrentDate }
    ];

    var appointmentContextMenuItems = [
        { text: 'Open', onItemClick: showAppointment },
        { text: 'Delete', onItemClick: deleteAppointment },
        { text: 'Repeat Weekly', beginGroup: true, onItemClick: repeatAppointmentWeekly },
        { text: 'Set Room', beginGroup: true, disabled: true }
    ];

    $.each(resourcesData, function (i, item) {
        item.onItemClick = setResource;
    });

    appointmentContextMenuItems = $.merge(appointmentContextMenuItems, resourcesData);
});