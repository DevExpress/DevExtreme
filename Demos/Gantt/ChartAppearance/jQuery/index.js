$(function() {
    var gantt = $("#gantt").dxGantt({
        taskTitlePosition: "outside",
        scaleType: "quarters",

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
        taskListWidth: 500
    }).dxGantt("instance");

    $("#scaleType").dxSelectBox({
        items: [
            "auto",
            "minutes",
            "hours",
            "days",
            "weeks",
            "months",
            "quarters",
            "years"
        ],
        value: "quarters",
        onValueChanged: function (e) {
            gantt.option("scaleType", e.value);
        }
    });

    $("#titlePosition").dxSelectBox({
        items: [
            "inside",
            "outside",
            "none"
        ],
        value: "outside",
        onValueChanged: function (e) {
            gantt.option("taskTitlePosition", e.value);
        }
    });

    $("#showResources").dxCheckBox({
        text: "Show Resources",
        value: true,
        onValueChanged: function (e) {
            gantt.option("showResources", e.value);
        }
    });
});
