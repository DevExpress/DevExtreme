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

    $("#customizeTaskTooltip").dxCheckBox({
        text: "Customize Task Tooltip",
        value: true,
        onValueChanged: function (e) {
            e.value ? gantt.option("taskTooltipContentTemplate", getTaskTooltipContentTemplate) 
                    : gantt.option("taskTooltipContentTemplate", undefined);
        }
    });

    function getTaskTooltipContentTemplate(model) {
        var timeEstimate = Math.abs(model.start - model.end) / 36e5;
        var timeLeft = Math.floor((100 - model.progress) / 100 * timeEstimate);

        return "<div style='font-size:14px'>" + model.title + "</div>"                
            + "<p style='font-size:10px'>" + "<span> Estimate: </span>" + timeEstimate + "<span> hours </span>" + "</p>"
            + "<p style='font-size:10px'>" + "<span> Left: </span>" + timeLeft + "<span> hours </span>" + "</p>";
    }
});
