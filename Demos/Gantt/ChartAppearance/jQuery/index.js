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
            const parentElement = document.getElementsByClassName('dx-gantt-task-edit-tooltip')[0];
            parentElement.className = 'dx-gantt-task-edit-tooltip';
            e.value ? gantt.option("taskTooltipContentTemplate", getTaskTooltipContentTemplate) 
                    : gantt.option("taskTooltipContentTemplate", undefined);
        }
    });

    function getTaskTooltipContentTemplate(task) {
        const parentElement = document.getElementsByClassName('dx-gantt-task-edit-tooltip')[0];
        parentElement.className = 'dx-gantt-task-edit-tooltip custom-task-edit-tooltip';
        const timeEstimate = Math.abs(task.start - task.end) / 36e5;
        const timeLeft = Math.floor((100 - task.progress) / 100 * timeEstimate);
        return "<div class='custom-tooltip-title'>" + task.title + "</div>"                
            + "<div class='custom-tooltip-row'>" + "<span> Estimate: </span>" + timeEstimate + "<span> hours </span>" + "</div>"
            + "<div class='custom-tooltip-row'>" + "<span> Left: </span>" + timeLeft + "<span> hours </span>" + "</div>";
    }

});
