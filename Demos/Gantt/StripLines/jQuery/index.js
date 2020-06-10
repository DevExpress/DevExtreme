$(function() {
    $("#gantt").dxGantt({
        stripLines: [{
            title: "Start",
            start: tasks[0].start
        }, {
            title: "Final Phase",
            start: tasks[tasks.length - 3].start,
            end: tasks[tasks.length - 1].end,
        }, {
            title: "Current Time",
            start: currentDate,
            cssClass: "current-time"
        }],

        tasks: {
            dataSource: tasks
        },
        editing: {
            enabled: false
        },
        validation: {
            autoUpdateParentTasks: true
        },
        columns: [{
            dataField: "title",
            caption: "Subject",
            width: 300
        }],
        taskListWidth: 300
    });
});
