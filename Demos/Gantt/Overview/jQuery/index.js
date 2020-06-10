$(function() {
    $("#gantt").dxGantt({
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
        validation: {
            autoUpdateParentTasks: true
        },
        toolbar: {
            items: [
                "undo",
                "redo",
                "separator",
                "collapseAll",
                "expandAll",
                "separator",
                "addTask",
                "deleteTask",
                "separator",
                "zoomIn",
                "zoomOut"
            ]
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
    });
});
