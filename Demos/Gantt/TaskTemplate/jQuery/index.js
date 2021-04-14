$(function() {
    var gantt = $("#gantt").dxGantt({
        taskTitlePosition: "outside",
        scaleType: "days",
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
            enabled: false
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
        taskContentTemplate: getTaskContentTemplate
    }).dxGantt("instance");

    function getImagePath(taskId) {
        var imgPath = "../../../../images/employees/";
        var img = taskId < 10 ? "0" + taskId : taskId;
        img =  imgPath + img + ".png";
        return img;
    }

    function getTaskContentTemplate(item, container) {
        var resource = item.taskResources[0];
        var img = getImagePath(item.taskData.id);
        var color = item.taskData.id % 6;
        var taskWidth = item.taskSize.width + "px;";
        var $customContainer = $(document.createElement("div"))
            .addClass("custom-task")
            .attr("style", "width:" + taskWidth)
            .addClass("custom-task-color-" + color);
        var $imgWrapper = $(document.createElement("div"))
            .addClass("custom-task-img-wrapper")
            .appendTo($customContainer);
        $(document.createElement("img"))
            .addClass("custom-task-img")
            .attr({
                "src": resource ? img : "unknown.png",
                "alt": "imageAlt"
            })
            .appendTo($imgWrapper);
        
        var $wrapper = $(document.createElement("div"))
        .addClass("custom-task-wrapper")
        .appendTo($customContainer);

        $(document.createElement("div"))
            .addClass("custom-task-title")
            .text(item.taskData.title)
            .appendTo($wrapper);
        $(document.createElement("div"))
            .addClass("custom-task-row")
            .text(resource ? resource.text : "")
            .appendTo($wrapper);
        
        $(document.createElement("div"))
            .addClass("custom-task-progress")
            .attr("style", "width:" + (parseFloat(item.taskData.progress)) + "%;")
            .appendTo($customContainer);

        return $customContainer;
    }

});
