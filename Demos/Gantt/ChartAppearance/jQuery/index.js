$(function() {
    var gantt = $("#gantt").dxGantt({
        taskTitlePosition: "outside",
        scaleType: "months",
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
        taskListWidth: 500,
        taskTooltipContentTemplate: getTaskTooltipContentTemplate
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
        value: "months",
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

    $("#customizeTaskTooltip").dxCheckBox({
        text: "Customize Task Tooltip",
        value: true,
        onValueChanged: function (e) {
            e.value ? gantt.option("taskTooltipContentTemplate", getTaskTooltipContentTemplate) 
                    : gantt.option("taskTooltipContentTemplate", undefined);
        }
    });

    function getTaskTooltipContentTemplate(task, container) {
        var timeEstimate = Math.abs(task.start - task.end) / 36e5;
        var timeLeft = Math.floor((100 - task.progress) / 100 * timeEstimate);

        var $customTooltip = $(document.createElement("div"))
            .addClass("custom-task-edit-tooltip");

        $(document.createElement("div"))
            .addClass("custom-tooltip-title")
            .text(task.title)
            .appendTo($customTooltip);
        $(document.createElement("div"))
            .addClass("custom-tooltip-row")
            .text("Estimate: " + timeEstimate + " hours")
            .appendTo($customTooltip);
        $(document.createElement("div"))
            .addClass("custom-tooltip-row")
            .text("Left: " + timeLeft + "hours")
            .appendTo($customTooltip);

        return $customTooltip;
    }

});
