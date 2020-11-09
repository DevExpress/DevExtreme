$(function() {
    $("#scheduler").dxScheduler({
        timeZone: "America/Los_Angeles",
        dataSource: data,
        views: ["day", "month"],
        currentView: "month",
        currentDate: new Date(2021, 2, 25),
        firstDayOfWeek: 1,
        startDayHour: 9,
        groups: undefined,
        recurrenceEditMode: "series",
        onAppointmentContextMenu: function (e) {
            updateContextMenu(false, appointmentContextMenuItems, ".dx-scheduler-appointment", itemTemplate, onItemClick(e));
        },
        onCellContextMenu: function (e) {
            updateContextMenu(false, cellContextMenuItems, ".dx-scheduler-date-table-cell", 'item', onItemClick(e));
        },
        resources: [{
            fieldExpr: "roomId",
            dataSource: resourcesData,
            label: "Room"
        }],
        height: 600
    });

    var contextMenuInstance = $("#context-menu").dxContextMenu({
        width: 200,
        dataSource: [],
        disabled: true,
        onHiding: function() {
            updateContextMenu(true, []);
        }
    }).dxContextMenu("instance");

    var updateContextMenu = function (disable, dataSource, target, itemTemplate, onItemClick) {
        contextMenuInstance.option({
            dataSource: dataSource,
            target: target,
            itemTemplate: itemTemplate,
            onItemClick: onItemClick,
            disabled: disable,
        });
    }

    var itemTemplate = function(itemData) {
        return getAppointmentMenuTemplate(itemData);
    }

    var onItemClick = function(contextMenuEvent) {
        return function (e) {
            e.itemData.onItemClick(contextMenuEvent, e);
        }
    }
    
    var createAppointment = function (e) {
      e.component.showAppointmentPopup({
        startDate: e.cellData.startDate
      }, true);
    };

    var createRecurringAppointment = function (e) {
      e.component.showAppointmentPopup({
        startDate: e.cellData.startDate,
        recurrenceRule: "FREQ=DAILY"
      }, true);
    };

    var groupCell = function(e) {
        var scheduler = e.component;

        if(scheduler.option("groups")) {
            scheduler.option({ crossScrollingEnabled: false, groups: undefined });
        } else {
            scheduler.option({ crossScrollingEnabled: true, groups: ["roomId"] });
        }
    };

    var showCurrentDate = function (e) {
      e.component.option("currentDate", new Date());
    };

    var showAppointment = function (e) {
      e.component.showAppointmentPopup(e.appointmentData);
    };

    var deleteAppointment = function (e) {
      e.component.deleteAppointment(e.appointmentData);
    };

    var repeatAppointmentWeekly = function (e) {
      var itemData = e.appointmentData;

      e.component.updateAppointment(itemData, $.extend(itemData, {
        startDate: e.targetedAppointmentData.startDate,
        recurrenceRule: "FREQ=WEEKLY"
      }));
    };

    var setResource = function (e, clickEvent) {
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

    var getAppointmentMenuTemplate = function(itemData) {
        var template = $('<div></div>');

        if(itemData.color) {
            template.append("<div class='item-badge' style='background-color:" + itemData.color + ";'></div>");
        }
        template.append(itemData.text);
        return template;
    };
});