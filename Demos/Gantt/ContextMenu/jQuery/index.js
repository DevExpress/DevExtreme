$(function() {
    var gantt = $("#gantt").dxGantt({
        contextMenu: getContextMenu(),
        onCustomCommand: onCustomCommandClick,
        onContextMenuPreparing: onContextMenuPreparing,
        tasks: {
            dataSource: tasks
        },
        dependencies: {
            dataSource: dependencies
        },
        resources: {
            dataSource: resources
        },
        resourceAssignments: {
            dataSource: resourceAssignments
        },
        editing: {
            enabled: true
        },
        columns: [{
            dataField: "title",
            caption: "Subject",
            width: 300
        }, {
            dataField: "start",
            caption: "Start Date"
        }, {
            dataField: "end",
            caption: "End Date"
        }],
        scaleType: "weeks",
        taskListWidth: 500
    }).dxGantt("instance");

    $("#preventContextMenuShowing").dxCheckBox({
        text: "Prevent Context Menu Showing",
        value: false,
    });

    function onContextMenuPreparing(e) {
        e.cancel = $("#preventContextMenuShowing").dxCheckBox('instance').option('value');
    }

    $("#customizeContextMenu").dxCheckBox({
        text: 'Customize Context Menu',
        value: true,
        onValueChanged: function(e) {
            var items = e.value ? getContextMenuItems() : undefined;
            gantt.option("contextMenu.items", items);
        }
    });

    function onCustomCommandClick(e) {
        if(e.name == 'ToggleDisplayOfResources') {
            var showResources = gantt.option("showResources");
            gantt.option("showResources", !showResources);
        }
    }

    function getContextMenu() {
        return {
            enabled: true,
            items: getContextMenuItems()
        }
    }

    function getContextMenuItems() {
        return [
            'addTask',
            'taskdetails',
            'deleteTask',
            { 
                name: 'ToggleDisplayOfResources',
                text: 'Toggle Display of Resources'
            }
        ]
    }
});
